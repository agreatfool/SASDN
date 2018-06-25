import { GatewayApiBase, GatewayContext, joi as LibJoi, MiddlewareNext } from 'sasdn';
import { ProtobufJoiValidation as PbJoi } from '../../../lib/ProtobufJoiValidation';
import { UploadingUrl, UploadingUrlGetReq, UploadingUrlGetRes } from '../../../proto/gateway_common/gateway_common_pb';
import { Exception } from '../../../lib/Exception';
import { CommonLogic } from '../../../logic/gateway/CommonLogic';

interface RequestParams {
  body: UploadingUrlGetReq.AsObject;
}

class PostGetUploadingUrl extends GatewayApiBase {
  constructor() {
    super();
    this.method = 'post';
    this.uri = '/v1/common/getUploadingUrl';
    this.type = 'application/json; charset=utf-8';
    this.schemaDefObj = {
      body: LibJoi.object().keys({
        timestamp: PbJoi.vUint32.activate().required().min(1000000000),
        fileName: PbJoi.vString.activate().required(),
      }),
    };
  }

  public async handle(ctx: GatewayContext, next: MiddlewareNext, params: RequestParams): Promise<UploadingUrlGetRes.AsObject> {
    try {
      let response = await CommonLogic.getUploadingUrl(ctx, next, params);
      return Promise.resolve(response.toObject());
    } catch (error) {
      return Promise.resolve(Exception.parseErrorMsg(error));
    }
  }

  public async handleMock(ctx: GatewayContext, next: MiddlewareNext, params: RequestParams): Promise<UploadingUrlGetRes.AsObject> {
    const response = new UploadingUrlGetRes();
    response.setCode(1);

    // PB UploadingUrl Data
    const data = new UploadingUrl();
    data.setUploadingUrl('https://shinezone-arch-dev.s3.amazonaws.com/image/GMTool/201805/29042127G0i6.xlsx?AWSAccessKeyId=AKIAILYWAXHBKRKIH2HQ&Content-Type=application%2Fx-www-form-urlencoded&Expires=1527585687&Signature=0l2Y4GjFAHeR31r7NGG7LyMNKmU%3D');
    response.setData(data);

    return Promise.resolve(response.toObject());
  }
}

export const api = new PostGetUploadingUrl();
