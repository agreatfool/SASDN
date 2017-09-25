///<reference path="../../node_modules/grpc-tsd/src/grpc.d.ts"/>
import {IServerCall, RpcImplCallback} from "grpc";
import {RpcApplication, WrappedHandler} from "sasdn";

import {
    DemoServiceService,
    DemoApiServiceService,
} from "../proto/demo/demo_grpc_pb";
import {
    OrderServiceService,
    OrderApiServiceService,
} from "../proto/order/order_grpc_pb";


import {getDemoHandler} from "./demo/demo_grpc_pb/DemoService/getDemo";

import {getDemoApiHandler} from "./demo/demo_grpc_pb/DemoApiService/getDemoApi";


import {getOrderHandler} from "./order/order_grpc_pb/OrderService/getOrder";

import {getOrderApiHandler} from "./order/order_grpc_pb/OrderApiService/getOrderApi";

export const registerServices = function (app: RpcApplication) {

    app.server.addService(DemoServiceService, {
        getDemo: async (call: IServerCall, callback: RpcImplCallback) => {
            let wrappedHandler: WrappedHandler = app.wrapGrpcHandler(getDemoHandler);
            wrappedHandler(call, callback).then(_ => _);
        },
    });

    app.server.addService(DemoApiServiceService, {
        getDemoApi: async (call: IServerCall, callback: RpcImplCallback) => {
            let wrappedHandler: WrappedHandler = app.wrapGrpcHandler(getDemoApiHandler);
            wrappedHandler(call, callback).then(_ => _);
        },
    });

    app.server.addService(OrderServiceService, {
        getOrder: async (call: IServerCall, callback: RpcImplCallback) => {
            let wrappedHandler: WrappedHandler = app.wrapGrpcHandler(getOrderHandler);
            wrappedHandler(call, callback).then(_ => _);
        },
    });

    app.server.addService(OrderApiServiceService, {
        getOrderApi: async (call: IServerCall, callback: RpcImplCallback) => {
            let wrappedHandler: WrappedHandler = app.wrapGrpcHandler(getOrderApiHandler);
            wrappedHandler(call, callback).then(_ => _);
        },
    });

};