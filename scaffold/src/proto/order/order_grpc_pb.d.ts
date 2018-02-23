// package: order
// file: order/order.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as order_order_pb from "../order/order_pb";

interface IOrderServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getOrder: IGetOrder;
}

interface IGetOrder {
    path: string; // "/order.OrderService/GetOrder"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: order_order_pb.GetOrderRequest;
    responseType: order_order_pb.Order;
    requestSerialize: (arg: order_order_pb.GetOrderRequest) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => order_order_pb.GetOrderRequest;
    responseSerialize: (arg: order_order_pb.Order) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => order_order_pb.Order;
}

export interface IOrderServiceClient {
    getOrder(request: order_order_pb.GetOrderRequest, callback: (error: Error | null, response: order_order_pb.Order) => void): grpc.ClientUnaryCall;
    getOrder(request: order_order_pb.GetOrderRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: order_order_pb.Order) => void): grpc.ClientUnaryCall;
}

export const OrderServiceService: IOrderServiceService;
export class OrderServiceClient extends grpc.Client implements IOrderServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getOrder(request: order_order_pb.GetOrderRequest, callback: (error: Error | null, response: order_order_pb.Order) => void): grpc.ClientUnaryCall;
    public getOrder(request: order_order_pb.GetOrderRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: order_order_pb.Order) => void): grpc.ClientUnaryCall;
}
