// package: memcached
// file: memcached/memcached.proto

/* tslint:disable */

import * as jspb from "google-protobuf";

export class SetRequest extends jspb.Message { 
    getKey(): string;
    setKey(value: string): void;

    getValue(): string;
    setValue(value: string): void;

    getLifeTime(): number;
    setLifeTime(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SetRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SetRequest): SetRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SetRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SetRequest;
    static deserializeBinaryFromReader(message: SetRequest, reader: jspb.BinaryReader): SetRequest;
}

export namespace SetRequest {
    export type AsObject = {
        key: string,
        value: string,
        lifeTime: number,
    }
}

export class SetMultiRequest extends jspb.Message { 
    clearMultiSetsList(): void;
    getMultiSetsList(): Array<SetRequest>;
    setMultiSetsList(value: Array<SetRequest>): void;
    addMultiSets(value?: SetRequest, index?: number): SetRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SetMultiRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SetMultiRequest): SetMultiRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SetMultiRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SetMultiRequest;
    static deserializeBinaryFromReader(message: SetMultiRequest, reader: jspb.BinaryReader): SetMultiRequest;
}

export namespace SetMultiRequest {
    export type AsObject = {
        multiSetsList: Array<SetRequest.AsObject>,
    }
}

export class GetRequest extends jspb.Message { 
    getKey(): string;
    setKey(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetRequest): GetRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetRequest;
    static deserializeBinaryFromReader(message: GetRequest, reader: jspb.BinaryReader): GetRequest;
}

export namespace GetRequest {
    export type AsObject = {
        key: string,
    }
}

export class GetMultiRequest extends jspb.Message { 
    clearKeysList(): void;
    getKeysList(): Array<string>;
    setKeysList(value: Array<string>): void;
    addKeys(value: string, index?: number): string;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetMultiRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetMultiRequest): GetMultiRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetMultiRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetMultiRequest;
    static deserializeBinaryFromReader(message: GetMultiRequest, reader: jspb.BinaryReader): GetMultiRequest;
}

export namespace GetMultiRequest {
    export type AsObject = {
        keysList: Array<string>,
    }
}

export class AddRequest extends jspb.Message { 
    getKey(): string;
    setKey(value: string): void;

    getValue(): string;
    setValue(value: string): void;

    getLifeTime(): number;
    setLifeTime(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AddRequest.AsObject;
    static toObject(includeInstance: boolean, msg: AddRequest): AddRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AddRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AddRequest;
    static deserializeBinaryFromReader(message: AddRequest, reader: jspb.BinaryReader): AddRequest;
}

export namespace AddRequest {
    export type AsObject = {
        key: string,
        value: string,
        lifeTime: number,
    }
}

export class DelRequest extends jspb.Message { 
    getKey(): string;
    setKey(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DelRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DelRequest): DelRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DelRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DelRequest;
    static deserializeBinaryFromReader(message: DelRequest, reader: jspb.BinaryReader): DelRequest;
}

export namespace DelRequest {
    export type AsObject = {
        key: string,
    }
}

export class BoolResponse extends jspb.Message { 
    getError(): string;
    setError(value: string): void;

    getResult(): boolean;
    setResult(value: boolean): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BoolResponse.AsObject;
    static toObject(includeInstance: boolean, msg: BoolResponse): BoolResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BoolResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BoolResponse;
    static deserializeBinaryFromReader(message: BoolResponse, reader: jspb.BinaryReader): BoolResponse;
}

export namespace BoolResponse {
    export type AsObject = {
        error: string,
        result: boolean,
    }
}

export class BoolsResponse extends jspb.Message { 
    getError(): string;
    setError(value: string): void;

    clearResultList(): void;
    getResultList(): Array<boolean>;
    setResultList(value: Array<boolean>): void;
    addResult(value: boolean, index?: number): boolean;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BoolsResponse.AsObject;
    static toObject(includeInstance: boolean, msg: BoolsResponse): BoolsResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BoolsResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BoolsResponse;
    static deserializeBinaryFromReader(message: BoolsResponse, reader: jspb.BinaryReader): BoolsResponse;
}

export namespace BoolsResponse {
    export type AsObject = {
        error: string,
        resultList: Array<boolean>,
    }
}

export class DataResponse extends jspb.Message { 
    getError(): string;
    setError(value: string): void;

    getResult(): string;
    setResult(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DataResponse.AsObject;
    static toObject(includeInstance: boolean, msg: DataResponse): DataResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DataResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DataResponse;
    static deserializeBinaryFromReader(message: DataResponse, reader: jspb.BinaryReader): DataResponse;
}

export namespace DataResponse {
    export type AsObject = {
        error: string,
        result: string,
    }
}

export class MapResult extends jspb.Message { 
    getKey(): string;
    setKey(value: string): void;

    getValue(): string;
    setValue(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): MapResult.AsObject;
    static toObject(includeInstance: boolean, msg: MapResult): MapResult.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: MapResult, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): MapResult;
    static deserializeBinaryFromReader(message: MapResult, reader: jspb.BinaryReader): MapResult;
}

export namespace MapResult {
    export type AsObject = {
        key: string,
        value: string,
    }
}

export class DatasResponse extends jspb.Message { 
    getError(): string;
    setError(value: string): void;

    clearResultList(): void;
    getResultList(): Array<MapResult>;
    setResultList(value: Array<MapResult>): void;
    addResult(value?: MapResult, index?: number): MapResult;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DatasResponse.AsObject;
    static toObject(includeInstance: boolean, msg: DatasResponse): DatasResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DatasResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DatasResponse;
    static deserializeBinaryFromReader(message: DatasResponse, reader: jspb.BinaryReader): DatasResponse;
}

export namespace DatasResponse {
    export type AsObject = {
        error: string,
        resultList: Array<MapResult.AsObject>,
    }
}
