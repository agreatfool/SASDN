// package: gateway_common
// file: gateway_common/gateway_common.proto

/* tslint:disable */

import * as jspb from "google-protobuf";

export class LoginReq extends jspb.Message { 
    getTimestamp(): number;
    setTimestamp(value: number): void;

    getUserName(): string;
    setUserName(value: string): void;

    getPassword(): string;
    setPassword(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LoginReq.AsObject;
    static toObject(includeInstance: boolean, msg: LoginReq): LoginReq.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LoginReq, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LoginReq;
    static deserializeBinaryFromReader(message: LoginReq, reader: jspb.BinaryReader): LoginReq;
}

export namespace LoginReq {
    export type AsObject = {
        timestamp: number,
        userName: string,
        password: string,
    }
}

export class LoginRes extends jspb.Message { 
    getCode(): number;
    setCode(value: number): void;

    getMessage(): string;
    setMessage(value: string): void;


    hasData(): boolean;
    clearData(): void;
    getData(): LoginData | undefined;
    setData(value?: LoginData): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LoginRes.AsObject;
    static toObject(includeInstance: boolean, msg: LoginRes): LoginRes.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LoginRes, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LoginRes;
    static deserializeBinaryFromReader(message: LoginRes, reader: jspb.BinaryReader): LoginRes;
}

export namespace LoginRes {
    export type AsObject = {
        code: number,
        message: string,
        data?: LoginData.AsObject,
    }
}

export class LoginData extends jspb.Message { 
    getUserId(): number;
    setUserId(value: number): void;

    getUserName(): string;
    setUserName(value: string): void;

    getPermissionAliasNameList(): string;
    setPermissionAliasNameList(value: string): void;

    getDisplayName(): string;
    setDisplayName(value: string): void;

    getJwt(): string;
    setJwt(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LoginData.AsObject;
    static toObject(includeInstance: boolean, msg: LoginData): LoginData.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LoginData, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LoginData;
    static deserializeBinaryFromReader(message: LoginData, reader: jspb.BinaryReader): LoginData;
}

export namespace LoginData {
    export type AsObject = {
        userId: number,
        userName: string,
        permissionAliasNameList: string,
        displayName: string,
        jwt: string,
    }
}

export class LogoutReq extends jspb.Message { 
    getTimestamp(): number;
    setTimestamp(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LogoutReq.AsObject;
    static toObject(includeInstance: boolean, msg: LogoutReq): LogoutReq.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LogoutReq, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LogoutReq;
    static deserializeBinaryFromReader(message: LogoutReq, reader: jspb.BinaryReader): LogoutReq;
}

export namespace LogoutReq {
    export type AsObject = {
        timestamp: number,
    }
}

export class LogoutRes extends jspb.Message { 
    getCode(): number;
    setCode(value: number): void;

    getMessage(): string;
    setMessage(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LogoutRes.AsObject;
    static toObject(includeInstance: boolean, msg: LogoutRes): LogoutRes.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LogoutRes, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LogoutRes;
    static deserializeBinaryFromReader(message: LogoutRes, reader: jspb.BinaryReader): LogoutRes;
}

export namespace LogoutRes {
    export type AsObject = {
        code: number,
        message: string,
    }
}

export class UploadingUrlGetReq extends jspb.Message { 
    getTimestamp(): number;
    setTimestamp(value: number): void;

    getFileName(): string;
    setFileName(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UploadingUrlGetReq.AsObject;
    static toObject(includeInstance: boolean, msg: UploadingUrlGetReq): UploadingUrlGetReq.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UploadingUrlGetReq, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UploadingUrlGetReq;
    static deserializeBinaryFromReader(message: UploadingUrlGetReq, reader: jspb.BinaryReader): UploadingUrlGetReq;
}

export namespace UploadingUrlGetReq {
    export type AsObject = {
        timestamp: number,
        fileName: string,
    }
}

export class UploadingUrlGetRes extends jspb.Message { 
    getCode(): number;
    setCode(value: number): void;

    getMessage(): string;
    setMessage(value: string): void;


    hasData(): boolean;
    clearData(): void;
    getData(): UploadingUrl | undefined;
    setData(value?: UploadingUrl): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UploadingUrlGetRes.AsObject;
    static toObject(includeInstance: boolean, msg: UploadingUrlGetRes): UploadingUrlGetRes.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UploadingUrlGetRes, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UploadingUrlGetRes;
    static deserializeBinaryFromReader(message: UploadingUrlGetRes, reader: jspb.BinaryReader): UploadingUrlGetRes;
}

export namespace UploadingUrlGetRes {
    export type AsObject = {
        code: number,
        message: string,
        data?: UploadingUrl.AsObject,
    }
}

export class UploadingUrl extends jspb.Message { 
    getUploadingUrl(): string;
    setUploadingUrl(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UploadingUrl.AsObject;
    static toObject(includeInstance: boolean, msg: UploadingUrl): UploadingUrl.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UploadingUrl, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UploadingUrl;
    static deserializeBinaryFromReader(message: UploadingUrl, reader: jspb.BinaryReader): UploadingUrl;
}

export namespace UploadingUrl {
    export type AsObject = {
        uploadingUrl: string,
    }
}

export class UserKickOffReq extends jspb.Message { 
    clearUserIdList(): void;
    getUserIdList(): Array<number>;
    setUserIdList(value: Array<number>): void;
    addUserId(value: number, index?: number): number;

    getType(): number;
    setType(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UserKickOffReq.AsObject;
    static toObject(includeInstance: boolean, msg: UserKickOffReq): UserKickOffReq.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UserKickOffReq, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UserKickOffReq;
    static deserializeBinaryFromReader(message: UserKickOffReq, reader: jspb.BinaryReader): UserKickOffReq;
}

export namespace UserKickOffReq {
    export type AsObject = {
        userIdList: Array<number>,
        type: number,
    }
}

export class UserKickOffRes extends jspb.Message { 
    getCode(): number;
    setCode(value: number): void;

    getMessage(): string;
    setMessage(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UserKickOffRes.AsObject;
    static toObject(includeInstance: boolean, msg: UserKickOffRes): UserKickOffRes.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UserKickOffRes, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UserKickOffRes;
    static deserializeBinaryFromReader(message: UserKickOffRes, reader: jspb.BinaryReader): UserKickOffRes;
}

export namespace UserKickOffRes {
    export type AsObject = {
        code: number,
        message: string,
    }
}
