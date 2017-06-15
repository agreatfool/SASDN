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
const LibShell = require("shelljs");
const lib_1 = require("./lib/lib");
const pkg = require('../../package.json');
const debug = require('debug')('SASDN:CLI:Proto');
program.version(pkg.version)
    .option('-p, --proto <dir>', 'directory of proto files')
    .option('-o, --output <dir>', 'directory to output service codes')
    .parse(process.argv);
const PROTO_DIR = program.proto === undefined ? undefined : LibPath.normalize(program.proto);
const OUTPUT_DIR = program.output === undefined ? undefined : LibPath.normalize(program.output);
class ProtoCLI {
    constructor() {
        this._protoFiles = [];
    }
    static instance() {
        return new ProtoCLI();
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('ProtoCLI start.');
            yield this._validate();
            yield this._loadProtos();
            yield this._genProtos();
        });
    }
    _validate() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('ProtoCLI validate.');
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
            debug('ProtoCLI load proto files.');
            this._protoFiles = yield lib_1.readProtoList(PROTO_DIR, OUTPUT_DIR);
            if (this._protoFiles.length === 0) {
                throw new Error('no proto files found');
            }
        });
    }
    _genProtos() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('ProtoCLI generate proto stub codes.');
            for (let i = 0; i < this._protoFiles.length; i++) {
                let protoFile = this._protoFiles[i];
                debug(`ProtoCLI generate proto: ${protoFile.fileName}`);
                let cmd = `
grpc_tools_node_protoc \\
--js_out=import_style=commonjs,binary:${OUTPUT_DIR} \\
--grpc_out=${OUTPUT_DIR} \\
--plugin=protoc-gen-grpc=\`which grpc_tools_node_protoc_plugin\` \\
-I ./proto \\
${lib_1.Proto.genFullProtoFilePath(protoFile)}

protoc \\
--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \\
--ts_out=:${OUTPUT_DIR} \\
-I ./proto \\
${lib_1.Proto.genFullProtoFilePath(protoFile)}
`;
                if (LibShell.exec(cmd).code !== 0) {
                    throw new Error(`err in generating proto: ${protoFile.fileName}`);
                }
            }
        });
    }
}
ProtoCLI.instance().run().catch((err) => {
    debug('err: %O', err.message);
});
