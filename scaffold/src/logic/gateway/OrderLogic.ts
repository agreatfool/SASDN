import { GatewayContext, MiddlewareNext } from 'sasdn';
import { Order, GetOrderRequest, } from '../../proto/order/order_pb';
import MSOrderClient from '../../clients/order/MSOrderClient';

interface RequestParams {
  body: GetOrderRequest.AsObject;
}

export namespace OrderLogic {

  export async function getOrder(ctx: GatewayContext, next?: MiddlewareNext, params?: RequestParams): Promise<Order> {
    const orderId = params.body.orderId;

    if (!orderId) {
      throw new Error('Error: orderId is required!');
    }

    // build request params
    const request = new GetOrderRequest();
    request.setOrderId(orderId);

    // connect && query
    const orderClient = new MSOrderClient(ctx);
    const order = await orderClient.getOrder(request);

    // return
    return Promise.resolve(order);
  }

}