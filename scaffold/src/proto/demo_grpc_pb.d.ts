// package: demo
// file: demo.proto

import * as grpc from "grpc";
import * as demo_pb from "./demo_pb";

interface IDemoServiceService extends grpc.IMethodsMap {
    getDemo: IGetDemo;
}

interface IGetDemo {
    path: string; // "/demo.DemoService/GetDemo"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: demo_pb.GetDemoRequest,
    responseType: demo_pb.Demo,
    requestSerialize: (arg: demo_pb.GetDemoRequest) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => demo_pb.GetDemoRequest;
    responseSerialize: (arg: demo_pb.Demo) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => demo_pb.Demo;
}

export const DemoServiceService: IDemoServiceService;
export class DemoServiceClient extends grpc.Client {
    constructor(address: string, credentials: any, options?: grpc.IClientOptions);
    getDemo(request: demo_pb.GetDemoRequest, callback: (error: Error | null, response: demo_pb.Demo) => void): grpc.ClientUnaryCall;
    getDemo(request: demo_pb.GetDemoRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: demo_pb.Demo) => void): grpc.ClientUnaryCall;
}

interface IDemoApiServiceService extends grpc.IMethodsMap {
    getDemoApi: IGetDemoApi;
}

interface IGetDemoApi {
    path: string; // "/demo.DemoApiService/GetDemoApi"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: demo_pb.GetDemoRequest,
    responseType: demo_pb.Demo,
    requestSerialize: (arg: demo_pb.GetDemoRequest) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => demo_pb.GetDemoRequest;
    responseSerialize: (arg: demo_pb.Demo) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => demo_pb.Demo;
}

export const DemoApiServiceService: IDemoApiServiceService;
export class DemoApiServiceClient extends grpc.Client {
    constructor(address: string, credentials: any, options?: grpc.IClientOptions);
    getDemoApi(request: demo_pb.GetDemoRequest, callback: (error: Error | null, response: demo_pb.Demo) => void): grpc.ClientUnaryCall;
    getDemoApi(request: demo_pb.GetDemoRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: demo_pb.Demo) => void): grpc.ClientUnaryCall;
}
