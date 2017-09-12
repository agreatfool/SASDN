// package: order
// file: order/order.proto

import * as grpc from "grpc";
import * as order_order_pb from "../order/order_pb";

interface IOrderServiceService extends grpc.IMethodsMap {
    getOrder: IGetOrder;
}

interface IGetOrder {
    path: string; // "/order.OrderService/GetOrder"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: order_order_pb.GetOrderRequest,
    responseType: order_order_pb.Order,
    requestSerialize: (arg: order_order_pb.GetOrderRequest) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => order_order_pb.GetOrderRequest;
    responseSerialize: (arg: order_order_pb.Order) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => order_order_pb.Order;
}

export const OrderServiceService: IOrderServiceService;
export class OrderServiceClient extends grpc.Client {
    constructor(address: string, credentials: any, options?: grpc.IClientOptions);
    getOrder(request: order_order_pb.GetOrderRequest, callback: (error: Error | null, response: order_order_pb.Order) => void): grpc.ClientUnaryCall;
    getOrder(request: order_order_pb.GetOrderRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: order_order_pb.Order) => void): grpc.ClientUnaryCall;
}

interface IOrderApiServiceService extends grpc.IMethodsMap {
    getOrderApi: IGetOrderApi;
}

interface IGetOrderApi {
    path: string; // "/order.OrderApiService/GetOrderApi"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestType: order_order_pb.GetOrderRequest,
    responseType: order_order_pb.Order,
    requestSerialize: (arg: order_order_pb.GetOrderRequest) => Buffer;
    requestDeserialize: (buffer: Uint8Array) => order_order_pb.GetOrderRequest;
    responseSerialize: (arg: order_order_pb.Order) => Buffer;
    responseDeserialize: (buffer: Uint8Array) => order_order_pb.Order;
}

export const OrderApiServiceService: IOrderApiServiceService;
export class OrderApiServiceClient extends grpc.Client {
    constructor(address: string, credentials: any, options?: grpc.IClientOptions);
    getOrderApi(request: order_order_pb.GetOrderRequest, callback: (error: Error | null, response: order_order_pb.Order) => void): grpc.ClientUnaryCall;
}
