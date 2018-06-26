// package: web_common
// file: web_common/web_common.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as web_common_web_common_pb from "../web_common/web_common_pb";

interface ICommonApiServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    login: ILogin;
    logout: ILogout;
    getUploadingUrl: IGetUploadingUrl;
    kickOffUser: IKickOffUser;
}

interface ILogin {
    path: string; // "/web_common.CommonApiService/Login"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: web_common_web_common_pb.LoginReq;
    responseType: web_common_web_common_pb.LoginRes;
    requestSerialize: (arg: web_common_web_common_pb.LoginReq) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => web_common_web_common_pb.LoginReq;
    responseSerialize: (arg: web_common_web_common_pb.LoginRes) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => web_common_web_common_pb.LoginRes;
}
interface ILogout {
    path: string; // "/web_common.CommonApiService/Logout"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: web_common_web_common_pb.LogoutReq;
    responseType: web_common_web_common_pb.LogoutRes;
    requestSerialize: (arg: web_common_web_common_pb.LogoutReq) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => web_common_web_common_pb.LogoutReq;
    responseSerialize: (arg: web_common_web_common_pb.LogoutRes) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => web_common_web_common_pb.LogoutRes;
}
interface IGetUploadingUrl {
    path: string; // "/web_common.CommonApiService/GetUploadingUrl"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: web_common_web_common_pb.UploadingUrlGetReq;
    responseType: web_common_web_common_pb.UploadingUrlGetRes;
    requestSerialize: (arg: web_common_web_common_pb.UploadingUrlGetReq) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => web_common_web_common_pb.UploadingUrlGetReq;
    responseSerialize: (arg: web_common_web_common_pb.UploadingUrlGetRes) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => web_common_web_common_pb.UploadingUrlGetRes;
}
interface IKickOffUser {
    path: string; // "/web_common.CommonApiService/KickOffUser"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: web_common_web_common_pb.UserKickOffReq;
    responseType: web_common_web_common_pb.UserKickOffRes;
    requestSerialize: (arg: web_common_web_common_pb.UserKickOffReq) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => web_common_web_common_pb.UserKickOffReq;
    responseSerialize: (arg: web_common_web_common_pb.UserKickOffRes) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => web_common_web_common_pb.UserKickOffRes;
}

export interface ICommonApiServiceClient {
    login(request: web_common_web_common_pb.LoginReq, callback: (error: Error | null, response: web_common_web_common_pb.LoginRes) => void): grpc.ClientUnaryCall;
    login(request: web_common_web_common_pb.LoginReq, metadata: grpc.Metadata, callback: (error: Error | null, response: web_common_web_common_pb.LoginRes) => void): grpc.ClientUnaryCall;
    logout(request: web_common_web_common_pb.LogoutReq, callback: (error: Error | null, response: web_common_web_common_pb.LogoutRes) => void): grpc.ClientUnaryCall;
    logout(request: web_common_web_common_pb.LogoutReq, metadata: grpc.Metadata, callback: (error: Error | null, response: web_common_web_common_pb.LogoutRes) => void): grpc.ClientUnaryCall;
    getUploadingUrl(request: web_common_web_common_pb.UploadingUrlGetReq, callback: (error: Error | null, response: web_common_web_common_pb.UploadingUrlGetRes) => void): grpc.ClientUnaryCall;
    getUploadingUrl(request: web_common_web_common_pb.UploadingUrlGetReq, metadata: grpc.Metadata, callback: (error: Error | null, response: web_common_web_common_pb.UploadingUrlGetRes) => void): grpc.ClientUnaryCall;
    kickOffUser(request: web_common_web_common_pb.UserKickOffReq, callback: (error: Error | null, response: web_common_web_common_pb.UserKickOffRes) => void): grpc.ClientUnaryCall;
    kickOffUser(request: web_common_web_common_pb.UserKickOffReq, metadata: grpc.Metadata, callback: (error: Error | null, response: web_common_web_common_pb.UserKickOffRes) => void): grpc.ClientUnaryCall;
}

export const CommonApiServiceService: ICommonApiServiceService;
export class CommonApiServiceClient extends grpc.Client implements ICommonApiServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public login(request: web_common_web_common_pb.LoginReq, callback: (error: Error | null, response: web_common_web_common_pb.LoginRes) => void): grpc.ClientUnaryCall;
    public login(request: web_common_web_common_pb.LoginReq, metadata: grpc.Metadata, callback: (error: Error | null, response: web_common_web_common_pb.LoginRes) => void): grpc.ClientUnaryCall;
    public logout(request: web_common_web_common_pb.LogoutReq, callback: (error: Error | null, response: web_common_web_common_pb.LogoutRes) => void): grpc.ClientUnaryCall;
    public logout(request: web_common_web_common_pb.LogoutReq, metadata: grpc.Metadata, callback: (error: Error | null, response: web_common_web_common_pb.LogoutRes) => void): grpc.ClientUnaryCall;
    public getUploadingUrl(request: web_common_web_common_pb.UploadingUrlGetReq, callback: (error: Error | null, response: web_common_web_common_pb.UploadingUrlGetRes) => void): grpc.ClientUnaryCall;
    public getUploadingUrl(request: web_common_web_common_pb.UploadingUrlGetReq, metadata: grpc.Metadata, callback: (error: Error | null, response: web_common_web_common_pb.UploadingUrlGetRes) => void): grpc.ClientUnaryCall;
    public kickOffUser(request: web_common_web_common_pb.UserKickOffReq, callback: (error: Error | null, response: web_common_web_common_pb.UserKickOffRes) => void): grpc.ClientUnaryCall;
    public kickOffUser(request: web_common_web_common_pb.UserKickOffReq, metadata: grpc.Metadata, callback: (error: Error | null, response: web_common_web_common_pb.UserKickOffRes) => void): grpc.ClientUnaryCall;
}
