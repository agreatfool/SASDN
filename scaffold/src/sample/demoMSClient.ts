import * as grpc from 'grpc';
import {GatewayContext, RpcContext} from 'sasdn';
import {GrpcInstrumentation} from 'zipkin-instrumentation-grpcjs';

import {OrderServiceClient} from '../proto/order/order_grpc_pb';
import {GetOrderRequest, Order,} from '../proto/order/order_pb';
import {TracerHelper} from '../helper/TracerHelper';

export default class GrpcClientOrder {
    public client: OrderServiceClient;

    constructor(ctx?: GatewayContext | RpcContext) {
        this.client = GrpcInstrumentation.proxyClient(
            new OrderServiceClient('127.0.0.1:9090', grpc.credentials.createInsecure()),
            ctx,
            TracerHelper.instance().getTraceInfo(true, 'order')
        );
    }

    public getOrder(request: GetOrderRequest): Promise<Order> {
        return new Promise((resolve, reject) => {
            this.client.getOrder(request, (err, response: Order) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });
    }
}