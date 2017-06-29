import * as LibFs from "mz/fs";
import * as program from "commander";
import * as LibPath from "path";
import {
    lcfirst,
    mkdir,
    parseServicesFromProto,
    Proto,
    ProtoFile,
    readProtoList,
    RpcMethodInfo,
    RpcProtoServicesInfo
} from "./lib/lib";
import {TplEngine} from "./lib/template";
import {Method, Service} from "protobufjs";

const pkg = require('../../package.json');
const debug = require('debug')('SASDN:CLI:RpcServices');

program.version(pkg.version)
    .option('-p, --proto <dir>', 'directory of proto files')
    .option('-o, --output <dir>', 'directory to output service codes')
    .parse(process.argv);

const PROTO_DIR = (program as any).proto === undefined ? undefined : LibPath.normalize((program as any).proto);
const OUTPUT_DIR = (program as any).output === undefined ? undefined : LibPath.normalize((program as any).output);

class ServiceCLI {

    private _protoFiles: Array<ProtoFile> = [];

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
        if (this._protoFiles.length === 0) {
            throw new Error('no proto files found');
        }
    }

    private async _genProtoServices() {
        debug('ServiceCLI generate services.');

        let protoServicesInfos = [] as Array<RpcProtoServicesInfo>;

        for (let i = 0; i < this._protoFiles.length; i++) {
            let protoFile = this._protoFiles[i];
            if (!protoFile) {
                continue;
            }
            let services = await parseServicesFromProto(protoFile);
            if (services.length === 0) {
                continue;
            }

            await mkdir(LibPath.join(OUTPUT_DIR, 'services'));

            let protoServicesInfo = {
                protoFile: protoFile,
                protoServiceImportPath: Proto.genProtoServiceImportPath(protoFile),
                services: {} as { [serviceName: string]: Array<RpcMethodInfo> },
            } as RpcProtoServicesInfo;
            for (let i = 0; i < services.length; i++) {
                protoServicesInfo.services[services[i].name] = await this._genService(protoFile, services[i]);
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

    private async _genService(protoFile: ProtoFile, service: Service): Promise<Array<RpcMethodInfo>> {
        debug('ServiceCLI generate service: %s', service.name);

        let methodKeys = Object.keys(service.methods);
        if (methodKeys.length === 0) {
            return;
        }

        let methodInfos = [];
        for (let i = 0; i < methodKeys.length; i++) {
            let methodKey = methodKeys[i];
            let method = service.methods[methodKey];
            methodInfos.push(await this._genServiceMethod(protoFile, service, method));
        }

        return Promise.resolve(methodInfos);
    }

    private async _genServiceMethod(protoFile: ProtoFile, service: Service, method: Method): Promise<RpcMethodInfo> {
        debug('ServiceCLI generate service method: %s.%s', service.name, method.name);

        let outputPath = Proto.genFullOutputServicePath(protoFile, service, method);
        await mkdir(LibPath.dirname(outputPath));

        let methodInfo = {
            callTypeStr: '',
            requestTypeStr: method.requestType,
            responseTypeStr: method.responseType,
            hasCallback: false,
            hasRequest: false,
            methodName: lcfirst(method.name),
            protoMsgImportPath: Proto.genProtoMsgImportPath(protoFile, outputPath),
        } as RpcMethodInfo;

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

        return Promise.resolve(methodInfo);
    }

}

ServiceCLI.instance().run().catch((err: Error) => {
    debug('err: %O', err.message);
});