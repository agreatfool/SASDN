import * as Mock from 'mockjs';
import { GatewayApiBase, GatewayContext, MiddlewareNext, joi as LibJoi } from 'sasdn';
import { ProtobufJoiValidation as PbJoi } from '../../../lib/ProtobufJoiValidation';
import { GetDemoOrderResponse, GetDemoOrderRequest, } from '../../../proto/demo/demo_pb';
import { CommonLogic } from '../../../logic/gateway/CommonLogic';
import { Exception } from '../../../lib/Exception';
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
        paramInt64: PbJoi.vInt64.activate().required().valid([200, 300, 400]),
        paramInt32: PbJoi.vInt32.activate().required().greater(3000).less(6000),
        paramBool: PbJoi.vBool.activate().optional().truthy(['1', 1, 'true']).falsy(['0', 0, 'false']),
        paramString: PbJoi.vString.activate().optional().default('string').max(50).min(5),
      }),
    };
  }

  public async handle(ctx: GatewayContext, next: MiddlewareNext, params: RequestParams): Promise<GetDemoOrderResponse.AsObject> {
    try {
      let response = await OrderLogic.getOrder(ctx, next, params);
      return Promise.resolve(response.toObject());
    } catch (error) {
      return Promise.resolve(Exception.parseErrorMsg(error));
    }
  }

  public async handleMock(ctx: GatewayContext, next: MiddlewareNext, params: RequestParams): Promise<GetDemoOrderResponse.AsObject> {
    const response = new GetDemoOrderResponse();
    response.setOrderId(Mock.Random.natural());
    response.setOrderContent(Mock.Random.string('symbol', 5, 10));

    return Promise.resolve(response.toObject());
  }
}

export const api = new PostGetDemoOrderApi();
