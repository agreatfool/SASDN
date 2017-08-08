import * as LibFs from "mz/fs";
import * as program from "commander";
import * as LibPath from "path";
import {
    lcfirst,
    mkdir,
    parseProto,
    parseServicesFromProto,
    Proto,
    ProtoFile,
    readProtoList,
    RpcMethodInfo,
    RpcProtoServicesInfo,
    ProtoInfo, parseMsgNamesFromProto, ProtoMsgImportInfos, genRpcMethodInfo
} from "./lib/lib";
import {TplEngine} from "./lib/template";
import {Method, Service} from "protobufjs";

const pkg = require('../../package.json');
const debug = require('debug')('SASDN:CLI:RpcServices');

program.version(pkg.version)
    .option('-p, --proto <dir>', 'directory of proto files')
    .option('-o, --output <dir>', 'directory to output service codes')
    .option('-i, --import <items>', 'third party proto import path: e.g path1,path2,path3', function list(val) {
        return val.split(',');
    })
    .option('-e, --exclude <items>', 'files or paths in -p shall be excluded: e.g file1,path1,path2,file2', function list(val) {
        return val.split(',');
    })
    .parse(process.argv);

const PROTO_DIR = (program as any).proto === undefined ? undefined : LibPath.normalize((program as any).proto);
const OUTPUT_DIR = (program as any).output === undefined ? undefined : LibPath.normalize((program as any).output);
const IMPORTS = (program as any).import === undefined ? [] : (program as any).import;
const EXCLUDES = (program as any).exclude === undefined ? [] : (program as any).exclude;

class ServiceCLI {

    private _protoFiles: Array<ProtoFile> = [];
    private _protoMsgImportInfos: ProtoMsgImportInfos = {};

    static instance() {
        return new ServiceCLI();
    }

    public async run() {
        debug('ServiceCLI start.');
        await this._validate();
        await this._loadProtos();
        await this._genProtoServices();
    }

    private async _validate() {
        debug('ServiceCLI validate.');

        if (!PROTO_DIR) {
            throw new Error('--proto is required');
        }
        if (!OUTPUT_DIR) {
            throw new Error('--output is required');
        }

        let protoStat = await LibFs.stat(PROTO_DIR);
        if (!protoStat.isDirectory()) {
            throw new Error('--proto is not a directory');
        }
        let outputStat = await LibFs.stat(OUTPUT_DIR);
        if (!outputStat.isDirectory()) {
            throw new Error('--output is not a directory');
        }
    }

    private async _loadProtos() {
        debug('ServiceCLI load proto files.');

        this._protoFiles = await readProtoList(PROTO_DIR, OUTPUT_DIR);
        if (IMPORTS.length > 0) {
            for (let i = 0; i < IMPORTS.length; i++) {
                this._protoFiles = this._protoFiles.concat(await readProtoList(LibPath.normalize(IMPORTS[i]), OUTPUT_DIR));
            }
        }
        if (this._protoFiles.length === 0) {
            throw new Error('no proto files found');
        }
    }

    private async _genProtoServices() {
        debug('ServiceCLI generate services.');

        let protoServicesInfos = [] as Array<RpcProtoServicesInfo>;

        let protoInfos = [] as Array<ProtoInfo>;
        for (let i = 0; i < this._protoFiles.length; i++) {
            let protoFile = this._protoFiles[i];
            if (!protoFile) {
                continue;
            }
            let protoInfo = {} as ProtoInfo;
            protoInfo.proto = await parseProto(protoFile);
            protoInfo.protoFile = protoFile;
            protoInfos.push(protoInfo);

            let msgImportInfos = await parseMsgNamesFromProto(protoInfo.proto, protoFile);
            for (let msgTypeStr in msgImportInfos) {
                this._protoMsgImportInfos[msgTypeStr] = msgImportInfos[msgTypeStr];
            }
        }

        await mkdir(LibPath.join(OUTPUT_DIR, 'services'));

        for (let i = 0; i < protoInfos.length; i++) {
            let protoInfo = protoInfos[i] as ProtoInfo;

            let services = await parseServicesFromProto(protoInfo.proto);
            if (services.length === 0) {
                continue;
            }

            // handle excludes
            let protoFilePath = LibPath.join(protoInfo.protoFile.protoPath, protoInfo.protoFile.relativePath, protoInfo.protoFile.fileName);
            let shallIgnore = false;
            if (EXCLUDES.length > 0) {
                EXCLUDES.forEach((exclude: string) => {
                    if (protoFilePath.indexOf(LibPath.normalize(exclude)) !== -1) {
                        shallIgnore = true;
                    }
                });
            }

            let protoServicesInfo = {
                protoFile: protoInfo.protoFile,
                protoServiceImportPath: Proto.genProtoServiceImportPath(protoInfo.protoFile),
                services: {} as { [serviceName: string]: Array<RpcMethodInfo> },
            } as RpcProtoServicesInfo;
            for (let i = 0; i < services.length; i++) {
                let methodInfos = await this._genService(protoInfo.protoFile, services[i], shallIgnore);
                if (!shallIgnore) {
                    protoServicesInfo.services[services[i].name] = methodInfos;
                }
            }
            protoServicesInfos.push(protoServicesInfo);
        }
        if (protoServicesInfos.length === 0) {
            return;
        }
        let outputPath = LibPath.join(OUTPUT_DIR, 'services', 'register.ts');
        TplEngine.registerHelper('lcfirst', lcfirst);
        let content = TplEngine.render('rpcs/register', {
            infos: protoServicesInfos,
        });

        await LibFs.writeFile(outputPath, content);
    }

    private async _genService(protoFile: ProtoFile, service: Service, shallIgnore: boolean = false): Promise<Array<RpcMethodInfo>> {
        debug('ServiceCLI generate service: %s', service.name);

        let methodKeys = Object.keys(service.methods);
        if (methodKeys.length === 0) {
            return;
        }

        let methodInfos = [];
        for (let i = 0; i < methodKeys.length; i++) {
            let methodKey = methodKeys[i];
            let method = service.methods[methodKey];
            methodInfos.push(await this._genServiceMethod(protoFile, service, method, shallIgnore));
        }

        return Promise.resolve(methodInfos);
    }

    private async _genServiceMethod(protoFile: ProtoFile, service: Service, method: Method, shallIgnore: boolean = false): Promise<RpcMethodInfo> {
        debug('ServiceCLI generate service method: %s.%s', service.name, method.name);

        let outputPath = Proto.genFullOutputServicePath(protoFile, service, method);
        let methodInfo = genRpcMethodInfo(protoFile, method, outputPath, this._protoMsgImportInfos);

        if (!method.requestStream && !method.responseStream) {
            methodInfo.callTypeStr = 'ServerUnaryCall';
            methodInfo.hasCallback = true;
            methodInfo.hasRequest = true;
        } else if (!method.requestStream && method.responseStream) {
            methodInfo.callTypeStr = 'ServerWritableStream';
            methodInfo.hasRequest = true;
        } else if (method.requestStream && !method.responseStream) {
            methodInfo.callTypeStr = 'ServerReadableStream';
            methodInfo.hasCallback = true;
        } else if (method.requestStream && method.responseStream) {
            methodInfo.callTypeStr = 'ServerDuplexStream';
        }

        // write files
        if (!shallIgnore) {
            await mkdir(LibPath.dirname(outputPath));
            let content = TplEngine.render('rpcs/service', {
                callTypeStr: methodInfo.callTypeStr,
                requestTypeStr: methodInfo.requestTypeStr,
                responseTypeStr: methodInfo.responseTypeStr,
                hasCallback: methodInfo.hasCallback,
                hasRequest: methodInfo.hasRequest,
                methodName: methodInfo.methodName,
                protoMsgImportPath: methodInfo.protoMsgImportPath,
            });

            await LibFs.writeFile(outputPath, content);
        }

        return Promise.resolve(methodInfo);
    }

}

ServiceCLI.instance().run().catch((err: Error) => {
    debug('err: %O', err.message);
});