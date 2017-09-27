///<reference path="../../node_modules/grpc-tsd/src/grpc.d.ts"/>
import {IServerCall, RpcImplCallback} from "grpc";
import {RpcApplication, WrappedHandler} from "sasdn";

import {
    DemoApiServiceService,
} from "../proto/demo/demo_grpc_pb";
import {
    OrderServiceService,
} from "../proto/order/order_grpc_pb";


import {getDemoOrderApiHandler} from "./demo/demo_grpc_pb/DemoApiService/getDemoOrderApi";


import {getOrderHandler} from "./order/order_grpc_pb/OrderService/getOrder";

export const registerServices = function (app: RpcApplication) {

    app.server.addService(DemoApiServiceService, {
        getDemoOrderApi: async (call: IServerCall, callback: RpcImplCallback) => {
            let wrappedHandler: WrappedHandler = app.wrapGrpcHandler(getDemoOrderApiHandler);
            wrappedHandler(call, callback).then(_ => _);
        },
    });

    app.server.addService(OrderServiceService, {
        getOrder: async (call: IServerCall, callback: RpcImplCallback) => {
            let wrappedHandler: WrappedHandler = app.wrapGrpcHandler(getOrderHandler);
            wrappedHandler(call, callback).then(_ => _);
        },
    });

};