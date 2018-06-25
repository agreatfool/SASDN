// package: gateway_common
// file: gateway_common/gateway_common.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as gateway_common_gateway_common_pb from "../gateway_common/gateway_common_pb";

interface ICommonApiServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    login: ILogin;
    logout: ILogout;
    getUploadingUrl: IGetUploadingUrl;
    kickOffUser: IKickOffUser;
}

interface ILogin {
    path: string; // "/gateway_common.CommonApiService/Login"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: gateway_common_gateway_common_pb.LoginReq;
    responseType: gateway_common_gateway_common_pb.LoginRes;
    requestSerialize: (arg: gateway_common_gateway_common_pb.LoginReq) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => gateway_common_gateway_common_pb.LoginReq;
    responseSerialize: (arg: gateway_common_gateway_common_pb.LoginRes) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => gateway_common_gateway_common_pb.LoginRes;
}
interface ILogout {
    path: string; // "/gateway_common.CommonApiService/Logout"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: gateway_common_gateway_common_pb.LogoutReq;
    responseType: gateway_common_gateway_common_pb.LogoutRes;
    requestSerialize: (arg: gateway_common_gateway_common_pb.LogoutReq) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => gateway_common_gateway_common_pb.LogoutReq;
    responseSerialize: (arg: gateway_common_gateway_common_pb.LogoutRes) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => gateway_common_gateway_common_pb.LogoutRes;
}
interface IGetUploadingUrl {
    path: string; // "/gateway_common.CommonApiService/GetUploadingUrl"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: gateway_common_gateway_common_pb.UploadingUrlGetReq;
    responseType: gateway_common_gateway_common_pb.UploadingUrlGetRes;
    requestSerialize: (arg: gateway_common_gateway_common_pb.UploadingUrlGetReq) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => gateway_common_gateway_common_pb.UploadingUrlGetReq;
    responseSerialize: (arg: gateway_common_gateway_common_pb.UploadingUrlGetRes) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => gateway_common_gateway_common_pb.UploadingUrlGetRes;
}
interface IKickOffUser {
    path: string; // "/gateway_common.CommonApiService/KickOffUser"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: gateway_common_gateway_common_pb.UserKickOffReq;
    responseType: gateway_common_gateway_common_pb.UserKickOffRes;
    requestSerialize: (arg: gateway_common_gateway_common_pb.UserKickOffReq) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => gateway_common_gateway_common_pb.UserKickOffReq;
    responseSerialize: (arg: gateway_common_gateway_common_pb.UserKickOffRes) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => gateway_common_gateway_common_pb.UserKickOffRes;
}

export interface ICommonApiServiceClient {
    login(request: gateway_common_gateway_common_pb.LoginReq, callback: (error: Error | null, response: gateway_common_gateway_common_pb.LoginRes) => void): grpc.ClientUnaryCall;
    login(request: gateway_common_gateway_common_pb.LoginReq, metadata: grpc.Metadata, callback: (error: Error | null, response: gateway_common_gateway_common_pb.LoginRes) => void): grpc.ClientUnaryCall;
    logout(request: gateway_common_gateway_common_pb.LogoutReq, callback: (error: Error | null, response: gateway_common_gateway_common_pb.LogoutRes) => void): grpc.ClientUnaryCall;
    logout(request: gateway_common_gateway_common_pb.LogoutReq, metadata: grpc.Metadata, callback: (error: Error | null, response: gateway_common_gateway_common_pb.LogoutRes) => void): grpc.ClientUnaryCall;
    getUploadingUrl(request: gateway_common_gateway_common_pb.UploadingUrlGetReq, callback: (error: Error | null, response: gateway_common_gateway_common_pb.UploadingUrlGetRes) => void): grpc.ClientUnaryCall;
    getUploadingUrl(request: gateway_common_gateway_common_pb.UploadingUrlGetReq, metadata: grpc.Metadata, callback: (error: Error | null, response: gateway_common_gateway_common_pb.UploadingUrlGetRes) => void): grpc.ClientUnaryCall;
    kickOffUser(request: gateway_common_gateway_common_pb.UserKickOffReq, callback: (error: Error | null, response: gateway_common_gateway_common_pb.UserKickOffRes) => void): grpc.ClientUnaryCall;
    kickOffUser(request: gateway_common_gateway_common_pb.UserKickOffReq, metadata: grpc.Metadata, callback: (error: Error | null, response: gateway_common_gateway_common_pb.UserKickOffRes) => void): grpc.ClientUnaryCall;
}

export const CommonApiServiceService: ICommonApiServiceService;
export class CommonApiServiceClient extends grpc.Client implements ICommonApiServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public login(request: gateway_common_gateway_common_pb.LoginReq, callback: (error: Error | null, response: gateway_common_gateway_common_pb.LoginRes) => void): grpc.ClientUnaryCall;
    public login(request: gateway_common_gateway_common_pb.LoginReq, metadata: grpc.Metadata, callback: (error: Error | null, response: gateway_common_gateway_common_pb.LoginRes) => void): grpc.ClientUnaryCall;
    public logout(request: gateway_common_gateway_common_pb.LogoutReq, callback: (error: Error | null, response: gateway_common_gateway_common_pb.LogoutRes) => void): grpc.ClientUnaryCall;
    public logout(request: gateway_common_gateway_common_pb.LogoutReq, metadata: grpc.Metadata, callback: (error: Error | null, response: gateway_common_gateway_common_pb.LogoutRes) => void): grpc.ClientUnaryCall;
    public getUploadingUrl(request: gateway_common_gateway_common_pb.UploadingUrlGetReq, callback: (error: Error | null, response: gateway_common_gateway_common_pb.UploadingUrlGetRes) => void): grpc.ClientUnaryCall;
    public getUploadingUrl(request: gateway_common_gateway_common_pb.UploadingUrlGetReq, metadata: grpc.Metadata, callback: (error: Error | null, response: gateway_common_gateway_common_pb.UploadingUrlGetRes) => void): grpc.ClientUnaryCall;
    public kickOffUser(request: gateway_common_gateway_common_pb.UserKickOffReq, callback: (error: Error | null, response: gateway_common_gateway_common_pb.UserKickOffRes) => void): grpc.ClientUnaryCall;
    public kickOffUser(request: gateway_common_gateway_common_pb.UserKickOffReq, metadata: grpc.Metadata, callback: (error: Error | null, response: gateway_common_gateway_common_pb.UserKickOffRes) => void): grpc.ClientUnaryCall;
}
