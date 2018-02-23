import { ServerUnaryCall, sendUnaryData as GrpcSendUnaryData } from 'grpc';
import { RpcContext, RpcMiddleware, MiddlewareNext } from 'sasdn';
import { GetOrderRequest, Order, } from '../../../../proto/order/order_pb';
import { OrderLogic } from '../../../../logic/order/OrderLogic';

export const getOrderHandler: RpcMiddleware = async (ctx: RpcContext, next: MiddlewareNext) => {
  let call: ServerUnaryCall<GetOrderRequest> = ctx.call as ServerUnaryCall<GetOrderRequest>;
  let callback: GrpcSendUnaryData<Order> = ctx.callback;
  let request = call.request as GetOrderRequest;

  try {
    const order = await OrderLogic.getOrder(request);
    callback(null, order);
  } catch(error) {
    callback(error, null);
  }

  await next();

  return Promise.resolve();
};