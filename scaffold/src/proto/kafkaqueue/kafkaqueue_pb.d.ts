// package: kafkaqueue
// file: kafkaqueue/kafkaqueue.proto

import * as jspb from "google-protobuf";

export class SendRequest extends jspb.Message { 
    getTopic(): string;
    setTopic(value: string): void;

    clearMessagesList(): void;
    getMessagesList(): Array<string>;
    setMessagesList(value: Array<string>): void;
    addMessages(value: string, index?: number): string;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SendRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SendRequest): SendRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SendRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SendRequest;
    static deserializeBinaryFromReader(message: SendRequest, reader: jspb.BinaryReader): SendRequest;
}

export namespace SendRequest {
    export type AsObject = {
        topic: string,
        messagesList: Array<string>,
    }
}

export class SendResponse extends jspb.Message { 
    getResult(): boolean;
    setResult(value: boolean): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SendResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SendResponse): SendResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SendResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SendResponse;
    static deserializeBinaryFromReader(message: SendResponse, reader: jspb.BinaryReader): SendResponse;
}

export namespace SendResponse {
    export type AsObject = {
        result: boolean,
    }
}
