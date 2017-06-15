import * as LibFs from "mz/fs";
import * as program from "commander";
import * as LibPath from "path";
import * as LibShell from "shelljs";
import {Proto, ProtoFile, readProtoList} from "./lib/lib";

const pkg = require('../../package.json');
const debug = require('debug')('SASDN:CLI:Proto');

program.version(pkg.version)
    .option('-p, --proto <dir>', 'directory of proto files')
    .option('-o, --output <dir>', 'directory to output service codes')
    .parse(process.argv);

const PROTO_DIR = (program as any).proto === undefined ? undefined : LibPath.normalize((program as any).proto);
const OUTPUT_DIR = (program as any).output === undefined ? undefined : LibPath.normalize((program as any).output);

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

        this._protoFiles = await readProtoList(PROTO_DIR, OUTPUT_DIR);
        if (this._protoFiles.length === 0) {
            throw new Error('no proto files found');
        }
    }

    private async _genProtos() {
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
${Proto.genFullProtoFilePath(protoFile)}

protoc \\
--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \\
--ts_out=:${OUTPUT_DIR} \\
-I ./proto \\
${Proto.genFullProtoFilePath(protoFile)}
`;

            if (LibShell.exec(cmd).code !== 0) {
                throw new Error(`err in generating proto: ${protoFile.fileName}`);
            }
        }
    }

}

ProtoCLI.instance().run().catch((err: Error) => {
    debug('err: %O', err.message);
});