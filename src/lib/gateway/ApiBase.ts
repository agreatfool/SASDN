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

export interface GatewayJoiSchema {
  type: string;
  required: boolean;
  schema?: GatewayJoiSchemaMap;
}

export interface GatewayJoiSchemaMap {
  [name: string]: GatewayJoiSchema;
}

export interface GatewayApiParams {
  [key: string]: any;
}

export abstract class GatewayApiBase {

  public method: string;
  public uri: string;
  public type: string;
  public schemaDefObj: GatewayJoiSchemaMap;

  public abstract handle(ctx: GatewayContext, next: MiddlewareNext, params: GatewayApiParams): Promise<any>;

  public abstract handleMock(ctx: GatewayContext, next: MiddlewareNext, params: GatewayApiParams): Promise<any>;

  public register(): Array<string | KoaMiddleware> {
    return [this.uri, this._validate(), this._mock(), this._execute()];
  };

  protected _validate(): KoaMiddleware {
    return async (ctx: GatewayContext, next: MiddlewareNext): Promise<void> => {
      let aggregatedParams = this._parseParams(ctx);
      let joiSchemaMap = this._convertSchemaDefToJoiSchema(this.schemaDefObj);

      try {
        await joiValidate(aggregatedParams, joiSchemaMap, { allowUnknown: true });
        await next();
      } catch (e) {
        const errorObject = {
          code: -1,
          message: 'Invalid Params'
        };
        ctx.body = JSON.stringify(errorObject);
      }
    };
  }

  protected _mock(): KoaMiddleware {
    return async (ctx: GatewayContext, next: MiddlewareNext): Promise<void> => {
      let aggregatedParams = this._parseParams(ctx);
      if (process.env.NODE_ENV == 'development' && aggregatedParams.hasOwnProperty('mock') && aggregatedParams['mock'] == 1) {
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

  protected _convertSchemaDefToJoiSchema(gatewayJoiSchemaMap: GatewayJoiSchemaMap): joi.SchemaMap {
    let joiSchemaMap = {} as joi.SchemaMap;

    for (let key in gatewayJoiSchemaMap) {
      let gatewayJoiSchema = gatewayJoiSchemaMap[key] as GatewayJoiSchema;
      let joiSchema = {} as joi.Schema;

      switch (gatewayJoiSchema.type) {
        case 'array':
          joiSchema = (gatewayJoiSchema.required)
            ? joi.array().required()
            : joi.array().optional();
          break;
        case 'boolean':
          joiSchema = (gatewayJoiSchema.required)
            ? joi.boolean().required()
            : joi.boolean().optional();
          break;
        case 'number':
          joiSchema = (gatewayJoiSchema.required)
            ? joi.number().required()
            : joi.number().optional();
          break;
        case 'object':
          joiSchema = (gatewayJoiSchema.required)
            ? joi.object(this._convertSchemaDefToJoiSchema(gatewayJoiSchema.schema)).required()
            : joi.object(this._convertSchemaDefToJoiSchema(gatewayJoiSchema.schema)).optional();
          break;
        case 'string':
          joiSchema = (gatewayJoiSchema.required)
            ? joi.string().required()
            : joi.string().optional();
          break;
        default:
          joiSchema = (gatewayJoiSchema.required)
            ? joi.any().required()
            : joi.any().optional();
          break;
      }

      joiSchemaMap[key] = joiSchema;
    }

    return joiSchemaMap;
  }

}