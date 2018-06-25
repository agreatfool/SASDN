// package: demo
// file: demo/demo.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as demo_demo_pb from "../demo/demo_pb";

interface IDemoApiServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getDemoOrderApi: IGetDemoOrderApi;
}

interface IGetDemoOrderApi {
    path: string; // "/demo.DemoApiService/GetDemoOrderApi"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: demo_demo_pb.GetDemoOrderRequest;
    responseType: demo_demo_pb.GetDemoOrderResponse;
    requestSerialize: (arg: demo_demo_pb.GetDemoOrderRequest) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => demo_demo_pb.GetDemoOrderRequest;
    responseSerialize: (arg: demo_demo_pb.GetDemoOrderResponse) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => demo_demo_pb.GetDemoOrderResponse;
}

export interface IDemoApiServiceClient {
    getDemoOrderApi(request: demo_demo_pb.GetDemoOrderRequest, callback: (error: Error | null, response: demo_demo_pb.GetDemoOrderResponse) => void): grpc.ClientUnaryCall;
    getDemoOrderApi(request: demo_demo_pb.GetDemoOrderRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: demo_demo_pb.GetDemoOrderResponse) => void): grpc.ClientUnaryCall;
}

export const DemoApiServiceService: IDemoApiServiceService;
export class DemoApiServiceClient extends grpc.Client implements IDemoApiServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getDemoOrderApi(request: demo_demo_pb.GetDemoOrderRequest, callback: (error: Error | null, response: demo_demo_pb.GetDemoOrderResponse) => void): grpc.ClientUnaryCall;
    public getDemoOrderApi(request: demo_demo_pb.GetDemoOrderRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: demo_demo_pb.GetDemoOrderResponse) => void): grpc.ClientUnaryCall;
}
