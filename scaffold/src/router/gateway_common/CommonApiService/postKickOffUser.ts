import { GatewayApiBase, GatewayContext, joi as LibJoi, MiddlewareNext } from 'sasdn';
import { ProtobufJoiValidation as PbJoi } from '../../../lib/ProtobufJoiValidation';
import { UserKickOffReq, UserKickOffRes } from '../../../proto/gateway_common/gateway_common_pb';
import { CommonLogic } from '../../../logic/gateway/CommonLogic';
import { Exception } from '../../../lib/Exception';

interface RequestParams {
  body: UserKickOffReq.AsObject;
}

class PostKickOffUser extends GatewayApiBase {
  constructor() {
    super();
    this.method = 'post';
    this.uri = '/common';
    this.type = 'application/json; charset=utf-8';
    this.schemaDefObj = {
      body: LibJoi.object().keys({
        userIdList: LibJoi.array().items(PbJoi.vUint64.activate().optional()),
        type: PbJoi.vUint32.activate().required(),
      }),
    };
  }

  public async handle(ctx: GatewayContext, next: MiddlewareNext, params: RequestParams): Promise<UserKickOffRes.AsObject> {
    try {
      let response = await CommonLogic.kickOffUser(ctx, next, params);
      return Promise.resolve(response.toObject());
    } catch (error) {
      return Promise.resolve(Exception.parseErrorMsg(error));
    }
  }

  public async handleMock(ctx: GatewayContext, next: MiddlewareNext, params: RequestParams): Promise<UserKickOffRes.AsObject> {
    const response = new UserKickOffRes();
    response.setCode(1);

    return Promise.resolve(response.toObject());
  }
}

export const api = new PostKickOffUser();
