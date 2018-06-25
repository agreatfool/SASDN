import { Context as KoaContext, Middleware as KoaMiddleware } from 'koa';
import { Exception } from '../lib/Exception';

export namespace ErrorHandler {
  export function createMiddleware(): KoaMiddleware {
    return async (ctx: KoaContext, next: () => Promise<any>) => {
      try {
        await next();
      } catch (err) {
        // handle jwt error
        if (err.status === 401) {
          ctx.state = 200;
          ctx.message = 'OK';
          err = new Exception(106);
        }

        // translate error whose error code in exception
        if (err.code) {
          ctx.body = err.message;
          ctx.set('Content-Type', 'application/json; charset=utf-8');
          return;
        } else {
          err = new Exception(6);
          ctx.body = err.message;
          ctx.set('Content-Type', 'application/json; charset=utf-8');
          return;
        }
      }
    };
  }
}
