"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const LibFs = require("mz/fs");
const program = require("commander");
const LibPath = require("path");
const lib_1 = require("./lib/lib");
const template_1 = require("./lib/template");
const pkg = require('../../package.json');
const debug = require('debug')('SASDN:CLI:RpcServices');
program.version(pkg.version)
    .option('-p, --proto <dir>', 'directory of proto files')
    .option('-o, --output <dir>', 'directory to output service codes')
    .parse(process.argv);
const PROTO_DIR = program.proto === undefined ? undefined : LibPath.normalize(program.proto);
const OUTPUT_DIR = program.output === undefined ? undefined : LibPath.normalize(program.output);
class ServiceCLI {
    constructor() {
        this._protoFiles = [];
        this._protoMsgImportInfos = {};
    }
    static instance() {
        return new ServiceCLI();
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('ServiceCLI start.');
            yield this._validate();
            yield this._loadProtos();
            yield this._genProtoServices();
        });
    }
    _validate() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('ServiceCLI validate.');
            if (!PROTO_DIR) {
                throw new Error('--proto is required');
            }
            if (!OUTPUT_DIR) {
                throw new Error('--output is required');
            }
            let protoStat = yield LibFs.stat(PROTO_DIR);
            if (!protoStat.isDirectory()) {
                throw new Error('--proto is not a directory');
            }
            let outputStat = yield LibFs.stat(OUTPUT_DIR);
            if (!outputStat.isDirectory()) {
                throw new Error('--output is not a directory');
            }
        });
    }
    _loadProtos() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('ServiceCLI load proto files.');
            this._protoFiles = yield lib_1.readProtoList(PROTO_DIR, OUTPUT_DIR);
            if (this._protoFiles.length === 0) {
                throw new Error('no proto files found');
            }
        });
    }
    _genProtoServices() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('ServiceCLI generate services.');
            let protoServicesInfos = [];
            let protoInfos = [];
            for (let i = 0; i < this._protoFiles.length; i++) {
                let protoFile = this._protoFiles[i];
                if (!protoFile) {
                    continue;
                }
                let protoInfo = {};
                protoInfo.proto = yield lib_1.parseProto(protoFile);
                protoInfo.protoFile = protoFile;
                protoInfos.push(protoInfo);
                let msgImportInfos = yield lib_1.parseMsgNamesFromProto(protoInfo.proto, protoFile);
                for (let msgTypeStr in msgImportInfos) {
                    this._protoMsgImportInfos[msgTypeStr] = msgImportInfos[msgTypeStr];
                }
            }
            for (let i = 0; i < protoInfos.length; i++) {
                let protoInfo = protoInfos[i];
                let services = yield lib_1.parseServicesFromProto(protoInfo.proto);
                if (services.length === 0) {
                    continue;
                }
                yield lib_1.mkdir(LibPath.join(OUTPUT_DIR, 'services'));
                let protoServicesInfo = {
                    protoFile: protoInfo.protoFile,
                    protoServiceImportPath: lib_1.Proto.genProtoServiceImportPath(protoInfo.protoFile),
                    services: {},
                };
                for (let i = 0; i < services.length; i++) {
                    protoServicesInfo.services[services[i].name] = yield this._genService(protoInfo.protoFile, services[i]);
                }
                protoServicesInfos.push(protoServicesInfo);
            }
            if (protoServicesInfos.length === 0) {
                return;
            }
            let outputPath = LibPath.join(OUTPUT_DIR, 'services', 'register.ts');
            template_1.TplEngine.registerHelper('lcfirst', lib_1.lcfirst);
            let content = template_1.TplEngine.render('rpcs/register', {
                infos: protoServicesInfos,
            });
            yield LibFs.writeFile(outputPath, content);
        });
    }
    _genService(protoFile, service) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('ServiceCLI generate service: %s', service.name);
            let methodKeys = Object.keys(service.methods);
            if (methodKeys.length === 0) {
                return;
            }
            let methodInfos = [];
            for (let i = 0; i < methodKeys.length; i++) {
                let methodKey = methodKeys[i];
                let method = service.methods[methodKey];
                methodInfos.push(yield this._genServiceMethod(protoFile, service, method));
            }
            return Promise.resolve(methodInfos);
        });
    }
    _genServiceMethod(protoFile, service, method) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('ServiceCLI generate service method: %s.%s', service.name, method.name);
            let outputPath = lib_1.Proto.genFullOutputServicePath(protoFile, service, method);
            yield lib_1.mkdir(LibPath.dirname(outputPath));
            let methodInfo = lib_1.genRpcMethodInfo(protoFile, method, outputPath, this._protoMsgImportInfos);
            if (!method.requestStream && !method.responseStream) {
                methodInfo.callTypeStr = 'ServerUnaryCall';
                methodInfo.hasCallback = true;
                methodInfo.hasRequest = true;
            }
            else if (!method.requestStream && method.responseStream) {
                methodInfo.callTypeStr = 'ServerWritableStream';
                methodInfo.hasRequest = true;
            }
            else if (method.requestStream && !method.responseStream) {
                methodInfo.callTypeStr = 'ServerReadableStream';
                methodInfo.hasCallback = true;
            }
            else if (method.requestStream && method.responseStream) {
                methodInfo.callTypeStr = 'ServerDuplexStream';
            }
            let content = template_1.TplEngine.render('rpcs/service', {
                callTypeStr: methodInfo.callTypeStr,
                requestTypeStr: methodInfo.requestTypeStr,
                responseTypeStr: methodInfo.responseTypeStr,
                hasCallback: methodInfo.hasCallback,
                hasRequest: methodInfo.hasRequest,
                methodName: methodInfo.methodName,
                protoMsgImportPath: methodInfo.protoMsgImportPath,
            });
            yield LibFs.writeFile(outputPath, content);
            return Promise.resolve(methodInfo);
        });
    }
}
ServiceCLI.instance().run().catch((err) => {
    debug('err: %O', err.message);
});
//# sourceMappingURL=sasdn-rpcs.js.map