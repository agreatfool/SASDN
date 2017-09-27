import {ServerUnaryCall, RpcImplCallback} from "grpc";
import {RpcContext, RpcMiddleware, MiddlewareNext} from "sasdn";
import {GetOrderRequest, Order, } from "../../../../proto/order/order_pb";
import {OrderLogic} from "../../../../logic/microservice/OrderLogic";

export const getOrderHandler: RpcMiddleware = async (ctx: RpcContext, next: MiddlewareNext) => {
    let call: ServerUnaryCall = ctx.call as ServerUnaryCall;
    let callback: RpcImplCallback = ctx.callback;
    let request = call.request as GetOrderRequest;

    console.log(`[MicroService] getOrderHandler, request: ${JSON.stringify(request.toObject())}`);
    let order = await OrderLogic.getOrder(request);
    console.log(`[MicroService] getorderHandler, response: ${JSON.stringify(order.toObject())}`);

    callback(null, order);

    return Promise.resolve();
};