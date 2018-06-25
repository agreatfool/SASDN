import * as crypto from 'crypto';
import { Exception } from './Exception';
import { Config, ConfigConst } from './Config';

export namespace GenApiSign {
  export function genApiSign(data: { [key: string]: any; }): string {
    delete data.sign;
    let srcString = _genParamStr(data);
    let hmac = crypto.createHmac('sha1', Config.instance.getConfig(ConfigConst.DEMO_PRIVATE_KEY));
    hmac.update(srcString);
    let sign = hmac.digest('hex');
    return sign;
  }

  function _genParamStr(data) {
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
        src[i] = _genParamStr(data[i]);
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
          src.push(`${k}=${_genParamStr(data[k])}`);
        }
      }
      return src.join('&');
    }

    // 如果 data 既不是数字、数组或布尔值，又不是 Array 或者 Object，则抛出错误：
    // Unable to generate sign with params
    throw new Exception(114, `params = ${JSON.stringify(data)}`);
  }
}
