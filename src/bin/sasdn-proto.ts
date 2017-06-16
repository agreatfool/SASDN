import * as LibFs from "mz/fs";
import * as program from "commander";
import * as LibPath from "path";
import * as LibShell from "shelljs";
import {Proto, ProtoFile, readProtoList} from "./lib/lib";

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
    .option('-a, --all', 'also parse & output all proto files in import path?')
    .parse(process.argv);

const PROTO_DIR = (program as any).proto === undefined ? undefined : LibPath.normalize((program as any).proto);
const OUTPUT_DIR = (program as any).output === undefined ? undefined : LibPath.normalize((program as any).output);
const JS = (program as any).javascript !== undefined;
const DTS = (program as any).typescript !== undefined;
const SWAGGER = (program as any).swagger !== undefined;
const ALL = (program as any).all !== undefined;
const EXCLUDES = (program as any).exclude === undefined ? [] : (program as any).exclude;
const IMPORTS = (program as any).import === undefined ? [] : (program as any).import;

class ProtoCLI {

    private _protoFiles: Array<ProtoFile> = [];

    static instance() {
        return new ProtoCLI();
    }

    public async run() {
        debug('ProtoCLI start.');
        await this._validate();
        await this._loadProtos();
        await this._genProtos();
    }

    private async _validate() {
        debug('ProtoCLI validate.');

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
        debug('ProtoCLI load proto files.');

        this._protoFiles = this._protoFiles.concat(await readProtoList(PROTO_DIR, OUTPUT_DIR, EXCLUDES));
        if (IMPORTS.length > 0) {
            for (let i = 0; i < IMPORTS.length; i++) {
                this._protoFiles = this._protoFiles.concat(await readProtoList(IMPORTS[i], OUTPUT_DIR, EXCLUDES));
            }
        }
        if (this._protoFiles.length === 0) {
            throw new Error('no proto files found');
        }
    }

    private async _genProtos() {
        debug('ProtoCLI generate proto codes.');

        for (let i = 0; i < this._protoFiles.length; i++) {
            let protoFile = this._protoFiles[i];
            debug(`ProtoCLI generate proto: ${protoFile.fileName}`);

            let cmds = [];
            let imports = '';
            IMPORTS.forEach((importPath: string) => {
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
                cmd += ` ${Proto.genFullProtoFilePath(protoFile)}`;
                cmds.push(cmd);
            }

            if (DTS) {
                let cmd = '';
                cmd += 'protoc';
                cmd += ' --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts';
                cmd += ` --ts_out=:${OUTPUT_DIR}`;
                cmd += ` --proto_path ${PROTO_DIR}`;
                cmd += imports;
                cmd += ` ${Proto.genFullProtoFilePath(protoFile)}`;
                cmds.push(cmd);
            }

            if (SWAGGER) {
                let cmd = '';
                cmd += 'protoc';
                cmd += ` --swagger_out=:${OUTPUT_DIR}`;
                cmd += ` --proto_path ${PROTO_DIR}`;
                cmd += imports;
                cmd += ` ${Proto.genFullProtoFilePath(protoFile)}`;
                cmds.push(cmd);
            }

            if (cmds.length === 0) {
                throw new Error('Choose one of --javascript | --typescript | --swagger to output');
            }
            cmds.forEach((cmd: string) => {
                if (LibShell.exec(cmd).code !== 0) {
                    throw new Error(`err in generating proto: ${protoFile.fileName}`);
                }
            });
        }
    }

}

ProtoCLI.instance().run().catch((err: Error) => {
    debug('err: %O', err.message);
});