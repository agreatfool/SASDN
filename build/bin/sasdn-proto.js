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
    .option('-p, --proto <dir>', 'directory of source proto files')
    .option('-o, --output <dir>', 'directory to output codes')
    .option('-i, --import <items>', 'third party proto import path: e.g path1,path2,path3', function list(val) {
    return val.split(',');
})
    .option('-e, --exclude <items>', 'files or paths in -p shall be excluded: e.g file1,path1,path2,file2', function list(val) {
    return val.split(',');
})
    .option('-j, --javascript', 'add -j to output javascript codes')
    .option('-t, --typescript', 'add -t to output typescript d.ts definitions')
    .option('-s, --swagger', 'add -s to output swagger json')
    .parse(process.argv);
const PROTO_DIR = program.proto === undefined ? undefined : LibPath.normalize(program.proto);
const OUTPUT_DIR = program.output === undefined ? undefined : LibPath.normalize(program.output);
const JS = program.javascript !== undefined;
const DTS = program.typescript !== undefined;
const SWAGGER = program.swagger !== undefined;
const EXCLUDES = program.exclude === undefined ? [] : program.exclude;
const IMPORTS = program.import === undefined ? [] : program.import;
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
            this._protoFiles = yield lib_1.readProtoList(PROTO_DIR, OUTPUT_DIR, EXCLUDES);
            if (this._protoFiles.length === 0) {
                throw new Error('no proto files found');
            }
        });
    }
    _genProtos() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('ProtoCLI generate proto codes.');
            for (let i = 0; i < this._protoFiles.length; i++) {
                let protoFile = this._protoFiles[i];
                debug(`ProtoCLI generate proto: ${protoFile.fileName}`);
                let cmds = [];
                let imports = '';
                IMPORTS.forEach((importPath) => {
                    imports += ` --proto_path ${importPath}`;
                });
                if (JS) {
                    let cmd = '';
                    cmd += 'grpc_tools_node_protoc';
                    cmd += ` --js_out=import_style=commonjs,binary:${OUTPUT_DIR}`;
                    cmd += ` --grpc_out=${OUTPUT_DIR}`;
                    cmd += ' --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin`';
                    cmd += ` --proto_path ${PROTO_DIR}`;
                    cmd += imports;
                    cmd += ` ${lib_1.Proto.genFullProtoFilePath(protoFile)}`;
                    cmds.push(cmd);
                }
                if (DTS) {
                    let cmd = '';
                    cmd += 'protoc';
                    cmd += ' --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts';
                    cmd += ` --ts_out=:${OUTPUT_DIR}`;
                    cmd += ` --proto_path ${PROTO_DIR}`;
                    cmd += imports;
                    cmd += ` ${lib_1.Proto.genFullProtoFilePath(protoFile)}`;
                    cmds.push(cmd);
                }
                if (SWAGGER) {
                    let cmd = '';
                    cmd += 'protoc';
                    cmd += ` --swagger_out=:${OUTPUT_DIR}`;
                    cmd += ` --proto_path ${PROTO_DIR}`;
                    cmd += imports;
                    cmd += ` ${lib_1.Proto.genFullProtoFilePath(protoFile)}`;
                    cmds.push(cmd);
                }
                if (cmds.length === 0) {
                    throw new Error('Choose one of --javascript | --typescript | --swagger to output');
                }
                cmds.forEach((cmd) => {
                    if (LibShell.exec(cmd).code !== 0) {
                        throw new Error(`err in generating proto: ${protoFile.fileName}`);
                    }
                });
            }
        });
    }
}
ProtoCLI.instance().run().catch((err) => {
    debug('err: %O', err.message);
});
