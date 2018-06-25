import { GatewayApiBase, GatewayContext, joi as LibJoi, MiddlewareNext } from 'sasdn';
import { ProtobufJoiValidation as PbJoi } from '../../../lib/ProtobufJoiValidation';
import { LoginData, LoginReq, LoginRes } from '../../../proto/gateway_common/gateway_common_pb';
import { CommonLogic } from '../../../logic/gateway/CommonLogic';
import { Exception } from '../../../lib/Exception';

interface RequestParams {
  body: LoginReq.AsObject;
}

class PostLogin extends GatewayApiBase {
  constructor() {
    super();
    this.method = 'post';
    this.uri = '/v1/common/login';
    this.type = 'application/json; charset=utf-8';
    this.schemaDefObj = {
      body: LibJoi.object().keys({
        timestamp: PbJoi.vUint32.activate().required().min(1000000000),
        userName: PbJoi.vString.activate().required().regex(/^(.){0,32}$/),
        password: PbJoi.vString.activate().required(),
      }),
    };
  }

  public async handle(ctx: GatewayContext, next: MiddlewareNext, params: RequestParams): Promise<LoginRes.AsObject> {
    try {
      let response = await CommonLogic.login(ctx, next, params);
      return Promise.resolve(response.toObject());
    } catch (error) {
      return Promise.resolve(Exception.parseErrorMsg(error));
    }
  }

  public async handleMock(ctx: GatewayContext, next: MiddlewareNext, params: RequestParams): Promise<LoginRes.AsObject> {
    const response = new LoginRes();
    response.setCode(1);

    // PB LoginData Data
    const data = new LoginData();
    data.setUserId(63085977014276);
    data.setUserName('lihualiang@shinezone.com');
    data.setPermissionAliasNameList(JSON.stringify(['advManage', 'newsManage', 'guestBookManage', 'jobManage']));
    data.setDisplayName('李化亮');
    data.setJwt('aaaaaaaaaaaa.bbbbbbbbbbbbbbbbbbbbbbbbbb.cccccc');
    response.setData(data);

    return Promise.resolve(response.toObject());
  }
}

export const api = new PostLogin();
