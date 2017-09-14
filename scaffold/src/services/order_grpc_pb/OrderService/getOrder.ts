import {ServerUnaryCall, RpcImplCallback} from "grpc";
import {RpcContext, RpcMiddleware, MiddlewareNext} from "sasdn";
import {GetOrderRequest, Order, } from "../../../proto/order/order_pb";
import * as OrderService from "../../../lib/OrderServerService"

export const getOrderHandler: RpcMiddleware = async (ctx: RpcContext, next: MiddlewareNext) => {
    let call: ServerUnaryCall = ctx.call as ServerUnaryCall;
    let callback: RpcImplCallback = ctx.callback;
    let request = call.request as GetOrderRequest;

    console.log('request:', request.toObject());
    try {
        const order = await OrderService.getOrder(request, ctx);
        callback(null, order);
    } catch (e) {
        console.log(e);
    }
    console.log('done');

    return Promise.resolve();
};