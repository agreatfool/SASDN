import {ServerUnaryCall, RpcImplCallback} from "grpc";
import {RpcContext, RpcMiddleware, MiddlewareNext} from "sasdn";
import {GetDemoOrderRequest, } from "../../../../proto/demo/demo_pb";
import {Order, } from "../../../../proto/order/order_pb";

export const getDemoOrderApiHandler: RpcMiddleware = async (ctx: RpcContext, next: MiddlewareNext) => {
    let call: ServerUnaryCall = ctx.call as ServerUnaryCall;
    let callback: RpcImplCallback = ctx.callback;
    let request = call.request as GetDemoOrderRequest;

    await next();

    return Promise.resolve();
};