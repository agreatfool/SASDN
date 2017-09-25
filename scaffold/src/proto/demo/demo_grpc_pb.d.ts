// package: demo
// file: demo/demo.proto

import * as grpc from "grpc";
import * as demo_demo_pb from "../demo/demo_pb";
import * as order_order_pb from "../order/order_pb";

interface IDemoServiceService extends grpc.IMethodsMap {
    getDemo: IGetDemo;
}

interface IGetDemo {
    path: string; // "/demo.DemoService/GetDemo"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: demo_demo_pb.GetDemoRequest,
    responseType: order_order_pb.Order,
    requestSerialize: (arg: demo_demo_pb.GetDemoRequest) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => demo_demo_pb.GetDemoRequest;
    responseSerialize: (arg: order_order_pb.Order) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => order_order_pb.Order;
}

export const DemoServiceService: IDemoServiceService;
export class DemoServiceClient extends grpc.Client {
    constructor(address: string, credentials: any, options?: grpc.IClientOptions);
    getDemo(request: demo_demo_pb.GetDemoRequest, callback: (error: Error | null, response: order_order_pb.Order) => void): grpc.ClientUnaryCall;
    getDemo(request: demo_demo_pb.GetDemoRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: order_order_pb.Order) => void): grpc.ClientUnaryCall;
}

interface IDemoApiServiceService extends grpc.IMethodsMap {
    getDemoApi: IGetDemoApi;
}

interface IGetDemoApi {
    path: string; // "/demo.DemoApiService/GetDemoApi"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: demo_demo_pb.GetDemoRequest,
    responseType: order_order_pb.Order,
    requestSerialize: (arg: demo_demo_pb.GetDemoRequest) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => demo_demo_pb.GetDemoRequest;
    responseSerialize: (arg: order_order_pb.Order) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => order_order_pb.Order;
}

export const DemoApiServiceService: IDemoApiServiceService;
export class DemoApiServiceClient extends grpc.Client {
    constructor(address: string, credentials: any, options?: grpc.IClientOptions);
    getDemoApi(request: demo_demo_pb.GetDemoRequest, callback: (error: Error | null, response: order_order_pb.Order) => void): grpc.ClientUnaryCall;
    getDemoApi(request: demo_demo_pb.GetDemoRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: order_order_pb.Order) => void): grpc.ClientUnaryCall;
}
