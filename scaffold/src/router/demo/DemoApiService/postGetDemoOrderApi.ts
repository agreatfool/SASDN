import * as Mock from 'mockjs';
import {GatewayApiBase, GatewayContext, MiddlewareNext, joi as LibJoi} from 'sasdn';
import { PbJoi } from '../../../lib/PbJoi';
import {Order, } from '../../../proto/order/order_pb';
import {GetDemoOrderRequest, } from '../../../proto/demo/demo_pb';
import { OrderLogic } from '../../../logic/gateway/OrderLogic';

interface RequestParams {
  body: GetDemoOrderRequest.AsObject;
}

class PostGetDemoOrderApi extends GatewayApiBase {
  constructor() {
    super();
    this.method = 'post';
    this.uri = '/v1/getDemoOrder';
    this.type = 'application/json; charset=utf-8';
    this.schemaDefObj = {
      body: LibJoi.object().keys({
        orderId: PbJoi.vInt64.base().required(),
      })
    };
  }

  public async handle(ctx: GatewayContext, next: MiddlewareNext, params: RequestParams): Promise<Order.AsObject> {
    const response = await OrderLogic.getOrder(ctx, next, params);
    return Promise.resolve(response.toObject());
  }

  public async handleMock(ctx: GatewayContext, next: MiddlewareNext, params: RequestParams): Promise<Order.AsObject> {
    const response = new Order();
    response.setOrderId(Mock.Random.natural());
    response.setUserId(Mock.Random.string('symbol', 5, 10));
    response.setPrice(Mock.Random.string('symbol', 5, 10));
    response.setIspayed(Mock.Random.boolean());

    // Map Items
    response.getItemsMap()
      .set(Mock.Random.string('lower', 5, 10), Mock.Random.string('lower', 5, 10));

    return Promise.resolve(response.toObject());
  }
}

export const api = new PostGetDemoOrderApi();