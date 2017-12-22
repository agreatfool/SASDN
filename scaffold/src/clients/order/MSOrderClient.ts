import * as grpc from 'grpc';
import { GatewayContext, RpcContext } from 'sasdn';
import { GrpcImpl } from 'sasdn-zipkin';

import { OrderServiceClient } from '../../proto/order/order_grpc_pb';
import { GetOrderRequest, Order, } from '../../proto/order/order_pb';

export default class MSOrderClient {
  public client: OrderServiceClient;

  constructor(ctx?: GatewayContext | RpcContext) {
    GrpcImpl.init(process.env.ZIPKIN_URL, {
      serviceName: process.env.DEMO,
      port: process.env.DEMO_PORT
    });
    GrpcImpl.setReceiverServiceInfo({
      serviceName: process.env.ORDER,
      host: process.env.ORDER_ADDRESS,
      port: process.env.ORDER_PORT
    });

    this.client = new GrpcImpl().createClient(
      new OrderServiceClient(
        `${process.env.DEMO_ADDRESS}:${process.env.DEMO_PORT}`,
        grpc.credentials.createInsecure()
      ),
      ctx
    );
  }

  public getOrder(request: GetOrderRequest): Promise<Order> {
    return new Promise((resolve, reject) => {
      this.client.getOrder(request, (err, res: Order) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
    });
  }
}