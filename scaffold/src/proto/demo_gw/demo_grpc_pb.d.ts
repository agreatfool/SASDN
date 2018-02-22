// package: demo
// file: demo/demo.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as demo_demo_pb from "../demo/demo_pb";
import * as order_order_pb from "../order/order_pb";

interface IDemoApiServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getDemoOrderApi: IGetDemoOrderApi;
}

interface IGetDemoOrderApi {
    path: string; // "/demo.DemoApiService/GetDemoOrderApi"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: demo_demo_pb.GetDemoOrderRequest;
    responseType: order_order_pb.Order;
    requestSerialize: (arg: demo_demo_pb.GetDemoOrderRequest) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => demo_demo_pb.GetDemoOrderRequest;
    responseSerialize: (arg: order_order_pb.Order) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => order_order_pb.Order;
}

export interface IDemoApiServiceClient {
    getDemoOrderApi(request: demo_demo_pb.GetDemoOrderRequest, callback: (error: Error | null, response: order_order_pb.Order) => void): grpc.ClientUnaryCall;
    getDemoOrderApi(request: demo_demo_pb.GetDemoOrderRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: order_order_pb.Order) => void): grpc.ClientUnaryCall;
}

export const DemoApiServiceService: IDemoApiServiceService;
export class DemoApiServiceClient extends grpc.Client implements IDemoApiServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getDemoOrderApi(request: demo_demo_pb.GetDemoOrderRequest, callback: (error: Error | null, response: order_order_pb.Order) => void): grpc.ClientUnaryCall;
    public getDemoOrderApi(request: demo_demo_pb.GetDemoOrderRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: order_order_pb.Order) => void): grpc.ClientUnaryCall;
}
