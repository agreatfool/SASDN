import * as LibFs from "mz/fs";
import * as program from "commander";
import * as recursive from "recursive-readdir";
import * as LibPath from "path";
import * as grpc from "grpc";
import * as protobuf from "protobufjs";
import {Namespace, Service} from "protobufjs";

const pkg = require('../../package.json');
const debug = require('debug')('SASDN:CLI:Services');

program.version(pkg.version)
    .option('-p, --proto <dir>', 'directory of proto files')
    .option('-o, --output <dir>', 'directory to output service codes')
    .parse(process.argv);

const PROTO_DIR = (program as any).proto === undefined ? undefined : LibPath.normalize((program as any).proto);
const OUTPUT_DIR = (program as any).output === undefined ? undefined : LibPath.normalize((program as any).output);

interface ProtoFile {
    protoPath: string;
    relativePath: string;
    fileName: string;
}

class ServiceCLI {

    private _protoFiles: Array<ProtoFile> = [];

    static instance() {
        return new ServiceCLI();
    }

    public async run() {
        debug('ServiceCLI start.');
        await this._validate();
        await this._loadProtos();
        await this._genServices();
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

        let files = await recursive(PROTO_DIR, ['.DS_Store']);
        this._protoFiles = files.map((file: string) => {
            let protoFile = {} as ProtoFile;

            file = file.replace(PROTO_DIR, ''); // remove base dir
            protoFile.protoPath = PROTO_DIR;
            protoFile.relativePath = LibPath.dirname(file);
            protoFile.fileName = LibPath.basename(file);

            if (protoFile.fileName.match(/.+\.proto/) !== null) {
                return protoFile;
            } else {
                return undefined;
            }
        }).filter((value: undefined | ProtoFile) => {
            return value !== undefined;
        });

        if (this._protoFiles.length === 0) {
            throw new Error('no proto files found');
        }
    }

    private async _genServices() {
        debug('ServiceCLI generate services.');

        let content = await LibFs.readFile(this._getFullProtoFilePath(this._protoFiles[0]));
        let proto = protobuf.parse(content.toString());
        let pkgRoot = proto.root.lookup(proto.package) as Namespace;

        let nestedKeys = Object.keys(pkgRoot.nested);
        console.log(nestedKeys);
        nestedKeys.forEach((nestedKey) => {
            let nestedInstance = pkgRoot.nested[nestedKey];
            if (!(nestedInstance instanceof Service)) {
                return;
            }
            console.log((nestedInstance as Service).methods);
        });
        // for (let [key, value] of pkgRoot.nested) {
        //     console.log(key);
        // }

    }

    private _getFullProtoFilePath(file: ProtoFile): string {
        return LibPath.join(file.protoPath, file.relativePath, file.fileName);
    }

}

ServiceCLI.instance().run().catch((err: Error) => {
    debug('err: %O', err);
});