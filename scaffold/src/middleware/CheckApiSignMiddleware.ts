import { Context as KoaContext, Middleware as KoaMiddleware } from 'koa';
import * as crypto from 'crypto';
import { Exception } from '../lib/Exception';
import { Config, ConfigConst } from '../lib/Config';
import { NEED_CHECK_SIGN_PATH_LIST } from '../constant/const';

export namespace CheckApiSign {
  export function createMiddleware(): KoaMiddleware {

    return async (ctx: KoaContext, next: () => Promise<any>) => {
      if (NEED_CHECK_SIGN_PATH_LIST.indexOf(ctx.path) !== -1) {
        const body = ctx.request.body;
        if (!body) {
          throw new Exception(121);
        }

        const sign = body.sign || '';

        let privateKey = Config.instance.getConfig(ConfigConst.DEMO_PRIVATE_KEY);

        let bodyCopy = JSON.parse(JSON.stringify(body));
        delete bodyCopy.sign;

        let srcString = _genParamStr(bodyCopy, ctx);
        if (!srcString) {
          throw new Exception(122);
        }

        let hmac = crypto.createHmac('sha1', privateKey);
        hmac.update(srcString);
        let localSign = hmac.digest('hex');
        if (localSign !== sign) {
          throw new Exception(123, `${srcString}`);
        }
      }

      await next();
    };
  }

  function _genParamStr(data: any, ctx: KoaContext): string {
    let src;

    // 如果 data 是数字、数组或布尔值，则直接返回 `${data}`
    if (typeof data === 'number' || typeof data === 'string' || typeof data === 'boolean') {
      return `${data}`;
    }

    // 如果 data 是数组，则先将 data 排序，
    // 并遍历其中的元素，递归调用 _genParamStr(data[i]) 方法生成结果存入 src 数组，
    // 并将结果集用 & 拼接成一个字符串
    if (data instanceof Array) {
      src = [];
      data.sort();
      for (let i = 0; i < data.length; i++) {
        src[i] = _genParamStr(data[i], ctx);
      }
      return src.join('&');
    }

    // 如果 data 是对象，则先将 data 的键排序，
    // 并遍历 data 的键，递归调用 _genParamStr(data[k]) 方法生成结果，
    // 和键值拼接后存入 src 数组，并将结果集用 & 拼接成一个字符串
    if (data instanceof Object) {
      src = [];
      let keys = Object.keys(data).sort();
      for (let k of keys) {
        if (data.hasOwnProperty(k)) {
          src.push(`${k}=${_genParamStr(data[k], ctx)}`);
        }
      }
      return src.join('&');
    }

    // 如果 data 既不是数字、数组或布尔值，又不是 Array 或者 Object，则抛出错误：
    // Unable to generate sign with params
    throw new Exception(124, `params=${JSON.stringify(data)}`);
  }
}
