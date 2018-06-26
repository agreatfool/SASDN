import { GatewayContext, MiddlewareNext } from 'sasdn';
import { GetDemoOrderRequest, GetDemoOrderResponse } from '../../proto/demo/demo_pb';
import { DemoEntityModel } from '../../model/DemoEntityModel';
import { DemoEntity } from '../../entities/DemoEntity';

interface RequestParams {
  body: GetDemoOrderRequest.AsObject;
}

export namespace OrderLogic {

  export async function getOrder(ctx: GatewayContext, next?: MiddlewareNext, params?: RequestParams): Promise<GetDemoOrderResponse> {
    const orderId = params.body.paramInt32;

    if (!orderId) {
      throw new Error('Error: orderId is required!');
    }

    // get order from database using model
    const orderModel = new DemoEntityModel(ctx, orderId);
    const order: DemoEntity = await orderModel.findOne({ id: orderId });

    if (!order) {
      throw new Error('Error: order does not exist');
    }

    // set data to response
    const response = new GetDemoOrderResponse();
    response.setOrderId(order.id);
    response.setOrderContent(order.text);

    // return
    return response;
  }

}
