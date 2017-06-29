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
const pkg = require('../../package.json');
const debug = require('debug')('SASDN:CLI:Services');
program.version(pkg.version)
    .option('-p, --proto <dir>', 'directory of proto files')
    .option('-o, --output <dir>', 'directory to output service codes')
    .parse(process.argv);
const PROTO_DIR = program.proto === undefined ? undefined : LibPath.normalize(program.proto);
const OUTPUT_DIR = program.output === undefined ? undefined : LibPath.normalize(program.output);
class ServiceCLI {
    constructor() {
        this._protoFiles = [];
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
            this._protoFiles = yield lib_1.readProtoList(PROTO_DIR);
            if (this._protoFiles.length === 0) {
                throw new Error('no proto files found');
            }
        });
    }
    _genProtoServices() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('ServiceCLI generate services.');
            for (let i = 0; i < this._protoFiles.length; i++) {
                let protoFile = this._protoFiles[i];
                if (!protoFile) {
                    continue;
                }
                let services = yield lib_1.parseServicesFromProto(protoFile);
                if (services.length === 0) {
                    continue;
                }
                yield lib_1.mkdir(LibPath.join(OUTPUT_DIR, 'services'));
                for (let i = 0; i < services.length; i++) {
                    yield this._genService(protoFile, services[i]);
                }
            }
        });
    }
    _genService(protoFile, service) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('ServiceCLI generate service: %s', service.name);
            let methodKeys = Object.keys(service.methods);
            if (methodKeys.length === 0) {
                return;
            }
            let outputDir = LibPath.join(OUTPUT_DIR, 'services', service.name);
            yield lib_1.mkdir(outputDir);
            for (let i = 0; i < methodKeys.length; i++) {
                let methodKey = methodKeys[i];
                let method = service.methods[methodKey];
                yield this._genServiceMethod(protoFile, service, method);
            }
        });
    }
    _genServiceMethod(protoFile, service, method) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('ServiceCLI generate service method: %s.%s', service.name, method.name);
            let outputPath = LibPath.join(OUTPUT_DIR, 'services', service.name, lib_1.lcfirst(method.name) + '.ts');
        });
    }
}
ServiceCLI.instance().run().catch((err) => {
    debug('err: %O', err);
});
//# sourceMappingURL=sasdn-services.js.map