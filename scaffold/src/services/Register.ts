///<reference path="../../node_modules/grpc-tsd/src/grpc.d.ts"/>
import {IServerCall, RpcImplCallback} from "grpc";
import {RpcApplication, WrappedHandler} from "sasdn";

import {
    OrderServiceService,
} from "../proto/order/order_grpc_pb";



import {getOrderHandler} from "./order/order_grpc_pb/OrderService/getOrder";

export const registerServices = function (app: RpcApplication) {

    app.server.addService(OrderServiceService, {
        getOrder: async (call: IServerCall, callback: RpcImplCallback) => {
            let wrappedHandler: WrappedHandler = app.wrapGrpcHandler(getOrderHandler);
            wrappedHandler(call, callback).then(_ => _);
        },
    });

};