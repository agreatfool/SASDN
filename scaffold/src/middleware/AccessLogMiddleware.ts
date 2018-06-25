import { Context as KoaContext, Middleware as KoaMiddleware } from 'koa';
import { Logger, TOPIC } from '../lib/Logger';

export namespace AccessLog {
  export function createMiddleware(): KoaMiddleware {
    return async (ctx: KoaContext, next: () => Promise<any>) => {
      const body = { ...ctx.request.body };
      Logger.instance.info(`Router: ${ctx.originalUrl} | Body: ${JSON.stringify(body)}`, { kafkaTopic: TOPIC.BUSINESS });
      await next();
    };
  }
}
