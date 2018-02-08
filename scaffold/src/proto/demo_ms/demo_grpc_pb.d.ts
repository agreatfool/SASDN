// package: demo
// file: demo/demo.proto

import * as grpc from "grpc";
import * as demo_demo_pb from "../demo/demo_pb";
import * as order_order_pb from "../order/order_pb";

interface IDemoServiceService extends grpc.ServiceDefinition {
    getDemoOrder: IGetDemoOrder;
}

interface IGetDemoOrder {
    path: string; // "/demo.DemoService/GetDemoOrder"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: demo_demo_pb.GetDemoOrderRequest,
    responseType: order_order_pb.Order,
    requestSerialize: (arg: demo_demo_pb.GetDemoOrderRequest) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => demo_demo_pb.GetDemoOrderRequest;
    responseSerialize: (arg: order_order_pb.Order) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => order_order_pb.Order;
}

export interface IDemoServiceClient {
    getDemoOrder(request: demo_demo_pb.GetDemoOrderRequest, callback: (error: Error | null, response: order_order_pb.Order) => void): grpc.ClientUnaryCall;
    getDemoOrder(request: demo_demo_pb.GetDemoOrderRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: order_order_pb.Order) => void): grpc.ClientUnaryCall;
}

export const DemoServiceService: IDemoServiceService;
export class DemoServiceClient extends grpc.Client implements IDemoServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getDemoOrder(request: demo_demo_pb.GetDemoOrderRequest, callback: (error: Error | null, response: order_order_pb.Order) => void): grpc.ClientUnaryCall;
    public getDemoOrder(request: demo_demo_pb.GetDemoOrderRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: order_order_pb.Order) => void): grpc.ClientUnaryCall;
}
