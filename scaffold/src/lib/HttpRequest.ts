import fetch from 'node-fetch';
import { Exception } from './Exception';
import * as promiseRetry from 'promise-retry';
import { ReqFunc, ReqOptions } from './GatewayApiClient';
import { Config, ConfigConst } from './Config';
import { GatewayContext } from 'sasdn';

// 重试选项，具体见 https://www.npmjs.com/package/promise-retry
// retries: 重试次数，默认是 0
// factor: 指数因子，默认是 2
// minTimeout: 开始第一次 retry 之前的等待时间，默认是 1000(ms)
// maxTimeout: 两次 retries 之间的最大间隔，默认是 Infinity
// randomize: 1 ~ 2 之间的随机数，不传的话默认是 false
export interface RetryOptions {
  retries?: number;
  factor?: number;
  minTimeout?: number;
  maxTimeout?: number;
  randomize?: number | boolean;
}

export namespace HttpRequest {
  export function postWithCtx(ctx: GatewayContext): ReqFunc {
    return async function post(path: string, options: ReqOptions, retryOptions: RetryOptions = { retries: 0 }): Promise<any> {
      let url = Config.instance.getConfig(ConfigConst.SHINEZONE_GATEWAY_HOST) + path;
      try {
        return await promiseRetry((retry, count) => {
          return fetch(url, options)
            .then(res => {
              if (res.headers.get('set-cookie')) {
                let cookieStr = res.headers.get('set-cookie');
                let [cookieKey, cookieValue] = cookieStr.split(';')[0].split('=');
                ctx.cookies.set(cookieKey, cookieValue, { domain: Config.instance.getConfig(ConfigConst.COOKIE_DOMAIN) });
                ctx.set('Access-Control-Allow-Origin', ctx.header.origin);
              }
              return res.json();
            })
            .then((data) => {
              if (data.code === undefined || data.message === undefined) {
                throw new Exception(103, `response: ${JSON.stringify(data)}`);
              }
              if (data.code !== 1) {
                throw new Exception(104, `message: ${data.message}`);
              }
              return data;
            })
            .catch((err) => {
              if ((!err.code || [103, 104].indexOf(err.code) === -1) && count - 1 <= retryOptions.retries && retryOptions.retries > 0) {
                retry(err);
              } else {
                throw err;
              }
            });
        }, retryOptions);
      } catch (err) {
        if (err.code && [103, 104].indexOf(err.code) !== -1) {
          throw err;
        }
        throw new Exception(102, `${err.message}`);
      }
    };
  }

  export async function post(path: string, options: ReqOptions, retryOptions: RetryOptions = { retries: 0 }): Promise<any> {
    let url = Config.instance.getConfig(ConfigConst.SHINEZONE_GATEWAY_HOST) + path;
    try {
      return await promiseRetry((retry, count) => {
        return fetch(url, options)
          .then(res => res.json())
          .then((data) => {
            if (data.code === undefined || data.message === undefined) {
              throw new Exception(103, `response: ${JSON.stringify(data)}`);
            }
            if (data.code !== 1) {
              throw new Exception(104, `message: ${data.message}`);
            }
            return data;
          })
          .catch((err) => {
            if ((!err.code || [103, 104].indexOf(err.code) === -1) && count - 1 <= retryOptions.retries && retryOptions.retries > 0) {
              retry(err);
            } else {
              throw err;
            }
          });
      }, retryOptions);
    } catch (err) {
      if (err.code && [103, 104].indexOf(err.code) !== -1) {
        throw err;
      }
      throw new Exception(102, `${err.message}`);
    }
  }
}
