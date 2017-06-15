import * as protobuf from "protobufjs";
export interface ProtoFile {
    protoPath: string;
    relativePath: string;
    fileName: string;
}
export declare const readProtoList: (protoDir: string) => Promise<ProtoFile[]>;
export declare const parseServicesFromProto: (filePath: ProtoFile) => Promise<protobuf.Service[]>;
export declare const mkdir: (path: string) => Promise<string>;
export declare const lcfirst: (str: any) => string;
export declare const getFullProtoFilePath: (file: ProtoFile) => string;
