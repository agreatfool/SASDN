import { ServerUnaryCall, RpcImplCallback } from 'grpc';
import { RpcContext, RpcMiddleware, MiddlewareNext } from 'sasdn';
import { GetOrderRequest, Order, } from '../../../../proto/order/order_pb';
import { OrderLogic } from '../../../../logic/order/OrderLogic';

export const getOrderHandler: RpcMiddleware = async (ctx: RpcContext, next: MiddlewareNext) => {
  let call: ServerUnaryCall = ctx.call as ServerUnaryCall;
  let callback: RpcImplCallback = ctx.callback;
  let request = call.request as GetOrderRequest;

  let order = await OrderLogic.getOrder(request);

  callback(null, order);

  return Promise.resolve();
};