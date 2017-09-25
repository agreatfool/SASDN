import {GatewayContext, MiddlewareNext} from 'sasdn';
import {Order, GetOrderRequest,} from '../../proto/order/order_pb';
import GrpcClientOrder from '../../sample/demoMSClient';

interface RequestParams {
    body: GetOrderRequest.AsObject;
}

export namespace OrderLogic {

    export async function getOrder(ctx: GatewayContext, next?: MiddlewareNext, params?: RequestParams): Promise<Order> {
        const orderId = params.body.orderid;

        if (!orderId) {
            throw new Error('Error: orderId is required!');
        }

        // build request params
        const request = new GetOrderRequest();
        request.setOrderid(orderId);

        // connect && query
        const orderClient = new GrpcClientOrder(ctx);

        // return
        return await orderClient.getOrder(request);
    }

}