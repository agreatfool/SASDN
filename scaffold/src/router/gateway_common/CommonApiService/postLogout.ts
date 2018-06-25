import { GatewayApiBase, GatewayContext, joi as LibJoi, MiddlewareNext } from 'sasdn';
import { ProtobufJoiValidation as PbJoi } from '../../../lib/ProtobufJoiValidation';
import { LogoutReq, LogoutRes } from '../../../proto/gateway_common/gateway_common_pb';
import { Exception } from '../../../lib/Exception';
import { CommonLogic } from '../../../logic/gateway/CommonLogic';

interface RequestParams {
  body: LogoutReq.AsObject;
}

class PostLogout extends GatewayApiBase {
  constructor() {
    super();
    this.method = 'post';
    this.uri = '/v1/common/logout';
    this.type = 'application/json; charset=utf-8';
    this.schemaDefObj = {
      body: LibJoi.object().keys({
        timestamp: PbJoi.vUint32.activate().required().min(1000000000),
      }),
    };
  }

  public async handle(ctx: GatewayContext, next: MiddlewareNext, params: RequestParams): Promise<LogoutRes.AsObject> {
    try {
      let response = await CommonLogic.logout(ctx, next, params);
      return Promise.resolve(response.toObject());
    } catch (error) {
      return Promise.resolve(Exception.parseErrorMsg(error));
    }
  }

  public async handleMock(ctx: GatewayContext, next: MiddlewareNext, params: RequestParams): Promise<LogoutRes.AsObject> {
    const response = new LogoutRes();
    response.setCode(1);

    return Promise.resolve(response.toObject());
  }
}

export const api = new PostLogout();
