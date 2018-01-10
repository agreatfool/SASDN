import * as grpc from 'grpc';
import { GatewayContext, RpcContext } from 'sasdn';
import { GrpcImpl } from 'sasdn-zipkin';
import { ConfigHelper, ConfigKey } from '../../helper/ConfigHelper';
import { OrderServiceClient } from '../../proto/order/order_grpc_pb';
import { GetOrderRequest, Order, } from '../../proto/order/order_pb';

export default class MSOrderClient {
  public client: OrderServiceClient;

  constructor(ctx?: GatewayContext | RpcContext) {
    GrpcImpl.setReceiverServiceInfo({
      serviceName: ConfigHelper.instance.getConfig(ConfigKey.Order),
      host: ConfigHelper.instance.getHost(ConfigKey.Order),
      port: ConfigHelper.instance.getPort(ConfigKey.Order),
    });

    this.client = new GrpcImpl().createClient(
      new OrderServiceClient(
        ConfigHelper.instance.getAddress(ConfigKey.Order),
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