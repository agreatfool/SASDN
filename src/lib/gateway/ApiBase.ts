import { Context as KoaContext, Middleware as KoaMiddleware, Request as KoaRequest } from 'koa';
import { joi, joiValidate } from '../utility/Joi';
import { MiddlewareNext } from '../rpc/App';

export interface GatewayContext extends KoaContext {
  params: any;
  request: GatewayRequest;
}

export interface GatewayRequest extends KoaRequest {
  body: any;
}

export interface GatewayApiParams {
  [key: string]: any;
}

export abstract class GatewayApiBase {

  public method: string;
  public uri: string;
  public type: string;
  public schemaDefObj: joi.SchemaMap;

  public abstract handle(ctx: GatewayContext, next: MiddlewareNext, params: GatewayApiParams): Promise<any>;

  public abstract handleMock(ctx: GatewayContext, next: MiddlewareNext, params: GatewayApiParams): Promise<any>;

  public register(): Array<string | KoaMiddleware> {
    return [this.uri, this._validate(), this._mock(), this._execute()];
  }

  protected _validate(): KoaMiddleware {
    return async (ctx: GatewayContext, next: MiddlewareNext): Promise<void> => {
      let aggregatedParams = this._parseParams(ctx);

      try {
        await joiValidate(aggregatedParams, this.schemaDefObj, { allowUnknown: true });
        await next();
      } catch (e) {
        const error = e as joi.ValidationError;
        const validationDetail = error.details ? `: ${error.details[0].message}` : '';
        const errorObject = {
          code: 1001001,
          message: 'Invalid Params' + validationDetail,
        };
        ctx.body = JSON.stringify(errorObject);
        ctx.set('Content-Type', 'application/json; charset=utf-8');
      }
    };
  }

  protected _mock(): KoaMiddleware {
    return async (ctx: GatewayContext, next: MiddlewareNext): Promise<void> => {
      let aggregatedParams = this._parseParams(ctx);
      if (process.env.NODE_ENV === 'development' && aggregatedParams.hasOwnProperty('mock') && aggregatedParams['mock'] === 1) {
        ctx.body = await this.handleMock(ctx, next, aggregatedParams);
      } else {
        await next();
      }
    };
  }

  protected _execute(): KoaMiddleware {
    return async (ctx: GatewayContext, next: MiddlewareNext): Promise<void> => {
      let aggregatedParams = this._parseParams(ctx);
      ctx.body = await this.handle(ctx, next, aggregatedParams);
      await next();
    };
  }

  protected _parseParams(ctx: GatewayContext): { [key: string]: any } {
    return Object.assign({}, ctx.params, ctx.query, { body: ctx.request.body }); // bodyParse required
  }

}
