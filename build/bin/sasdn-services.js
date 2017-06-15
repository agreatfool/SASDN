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
const recursive = require("recursive-readdir");
const LibPath = require("path");
const protobuf = require("protobufjs");
const protobufjs_1 = require("protobufjs");
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
            yield this._genServices();
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
            let files = yield recursive(PROTO_DIR, ['.DS_Store']);
            this._protoFiles = files.map((file) => {
                let protoFile = {};
                file = file.replace(PROTO_DIR, ''); // remove base dir
                protoFile.protoPath = PROTO_DIR;
                protoFile.relativePath = LibPath.dirname(file);
                protoFile.fileName = LibPath.basename(file);
                if (protoFile.fileName.match(/.+\.proto/) !== null) {
                    return protoFile;
                }
                else {
                    return undefined;
                }
            }).filter((value) => {
                return value !== undefined;
            });
            if (this._protoFiles.length === 0) {
                throw new Error('no proto files found');
            }
        });
    }
    _genServices() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('ServiceCLI generate services.');
            let content = yield LibFs.readFile(this._getFullProtoFilePath(this._protoFiles[0]));
            let proto = protobuf.parse(content.toString());
            let pkgRoot = proto.root.lookup(proto.package);
            let nestedKeys = Object.keys(pkgRoot.nested);
            console.log(nestedKeys);
            nestedKeys.forEach((nestedKey) => {
                let nestedInstance = pkgRoot.nested[nestedKey];
                if (!(nestedInstance instanceof protobufjs_1.Service)) {
                    return;
                }
                console.log(nestedInstance.methods);
            });
            // for (let [key, value] of pkgRoot.nested) {
            //     console.log(key);
            // }
        });
    }
    _getFullProtoFilePath(file) {
        return LibPath.join(file.protoPath, file.relativePath, file.fileName);
    }
}
ServiceCLI.instance().run().catch((err) => {
    debug('err: %O', err);
});
//# sourceMappingURL=sasdn-services.js.map