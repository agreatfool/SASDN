import {ServerUnaryCall, RpcImplCallback} from "grpc";
import {RpcContext, RpcMiddleware, MiddlewareNext} from "sasdn";
import {GetDemoRequest, } from "../../../../proto/demo/demo_pb";
import {Order, } from "../../../../proto/order/order_pb";

export const getDemoApiHandler: RpcMiddleware = async (ctx: RpcContext, next: MiddlewareNext) => {
    let call: ServerUnaryCall = ctx.call as ServerUnaryCall;
    let callback: RpcImplCallback = ctx.callback;
    let request = call.request as GetDemoRequest;

    await next();

    return Promise.resolve();
};