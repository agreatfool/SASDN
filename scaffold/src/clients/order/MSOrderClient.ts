import * as grpc from 'grpc';
import { GatewayContext, RpcContext } from 'sasdn';
import { GrpcImpl } from 'sasdn-zipkin';
import { Config, ConnectKey } from '../../lib/Config';
import { OrderServiceClient } from '../../proto/order/order_grpc_pb';
import { GetOrderRequest, Order, } from '../../proto/order/order_pb';

export default class MSOrderClient {
  public client: OrderServiceClient;

  constructor(ctx?: GatewayContext | RpcContext) {
    GrpcImpl.setReceiverServiceInfo({
      serviceName: Config.instance.getConfig(ConnectKey.Order),
      host: Config.instance.getHost(ConnectKey.Order),
      port: Config.instance.getPort(ConnectKey.Order),
    });

    this.client = new GrpcImpl().createClient(
      new OrderServiceClient(
        Config.instance.getAddress(ConnectKey.Order),
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