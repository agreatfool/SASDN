import { sendUnaryData as GrpcSendUnaryData } from 'grpc';
import { RpcApplication, WrappedHandler, GrpcServerCall } from 'sasdn';

import {
  OrderServiceService,
} from '../proto/order/order_grpc_pb';
import {
  GetOrderRequest,
  Order,
} from '../proto/order/order_pb';

import { getOrderHandler } from './order/order_grpc_pb/OrderService/getOrder';

export const registerServices = function (app: RpcApplication) {

  app.server.addService(OrderServiceService, {
    getOrder: async (call: GrpcServerCall<GetOrderRequest, Order>, callback: GrpcSendUnaryData<Order>) => {
      let wrappedHandler: WrappedHandler = app.wrapGrpcHandler(getOrderHandler);
      wrappedHandler(call, callback).then(_ => _);
    },
  });

};