import * as LibPath from "path";
import * as LibFs from "mz/fs";
import * as recursive from "recursive-readdir";
import * as protobuf from "protobufjs";
import {Namespace, Service} from "protobufjs";
import * as bluebird from "bluebird";
import * as LibMkdirP from "mkdirp";

const mkdirp = bluebird.promisify<string, string>(LibMkdirP);

export interface ProtoFile {
    protoPath: string;
    relativePath: string;
    fileName: string;
}

export const readProtoList = async function (protoDir: string): Promise<Array<ProtoFile>> {
    let files = await recursive(protoDir, ['.DS_Store']);

    let protoFiles = files.map((file: string) => {
        let protoFile = {} as ProtoFile;

        file = file.replace(protoDir, ''); // remove base dir
        protoFile.protoPath = protoDir;
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

    return Promise.resolve(protoFiles);
};

export const parseServicesFromProto = async function (filePath: ProtoFile): Promise<Array<Service>> {
    let content = await LibFs.readFile(getFullProtoFilePath(filePath));
    let proto = protobuf.parse(content.toString());
    let pkgRoot = proto.root.lookup(proto.package) as Namespace;

    let services = [] as Array<Service>;
    let nestedKeys = Object.keys(pkgRoot.nested);
    nestedKeys.forEach((nestedKey) => {
        let nestedInstance = pkgRoot.nested[nestedKey];
        if (!(nestedInstance instanceof Service)) {
            return;
        }
        services.push(nestedInstance as Service);
    });

    return Promise.resolve(services);
};

export const mkdir = async function (path: string): Promise<string> {
    return mkdirp(path);
};

export const lcfirst = function (str): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
};

export const getFullProtoFilePath = function (file: ProtoFile): string {
    return LibPath.join(file.protoPath, file.relativePath, file.fileName);
};