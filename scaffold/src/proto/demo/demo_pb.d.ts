// package: demo
// file: demo/demo.proto

import * as jspb from "google-protobuf";
import * as order_order_pb from "../order/order_pb";

export class Demo extends jspb.Message { 
    getId(): number;
    setId(value: number): void;

    getName(): string;
    setName(value: string): void;

    getFlag(): boolean;
    setFlag(value: boolean): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Demo.AsObject;
    static toObject(includeInstance: boolean, msg: Demo): Demo.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Demo, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Demo;
    static deserializeBinaryFromReader(message: Demo, reader: jspb.BinaryReader): Demo;
}

export namespace Demo {
    export type AsObject = {
        id: number,
        name: string,
        flag: boolean,
    }
}

export class GetDemoRequest extends jspb.Message { 
    getId(): number;
    setId(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetDemoRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetDemoRequest): GetDemoRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetDemoRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetDemoRequest;
    static deserializeBinaryFromReader(message: GetDemoRequest, reader: jspb.BinaryReader): GetDemoRequest;
}

export namespace GetDemoRequest {
    export type AsObject = {
        id: number,
    }
}
