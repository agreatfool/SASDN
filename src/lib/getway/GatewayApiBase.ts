"use strict";
import {Middleware as KoaMiddleware, Context as KoaContext, Request as KoaRequest} from "koa";
import {joi, joiValidate} from "../Utility";
import {MiddlewareNext} from "../App";
import * as ts from "typescript/lib/tsserverlibrary";
import Err = ts.server.Msg.Err;

export interface GatewayContext extends KoaContext {
  params: any,
  request: GatewayRequest;
}
export interface GatewayRequest extends KoaRequest {
  body?: any;
}
export type GatewaySchema = {
  type: string;
  required: boolean;
  schema?: GatewaySchemaMap;
}
export type GatewaySchemaMap = { [name: string]: GatewaySchema };
export type GatewayParams = { [key: string]: any };

export abstract class GatewayApiBase {
  public method: string;
  public uri: string;
  public type: string;
  public schemaDefObj: GatewaySchemaMap;

  public abstract handle(ctx: GatewayContext, next: MiddlewareNext, params: GatewayParams): Promise<any>;

  public register(): Array<string | KoaMiddleware> {
    return [this.uri, this._validate(), this._execute()];
  };

  protected _validate(): KoaMiddleware {
    let _this: GatewayApiBase = this;
    return async function (ctx: GatewayContext, next: MiddlewareNext): Promise<void> {
      let aggregatedParams = _this._parseParams(ctx);
      let joiSchemas = _this._convertSchemaDefToJoiSchema(_this.schemaDefObj);

      try {
        await joiValidate(aggregatedParams, joiSchemas, {allowUnknown: true});
        await next();
      } catch (err) {
        ctx.body = err.toString();
      }
    }
  }

  protected _execute(): KoaMiddleware {
    let _this: GatewayApiBase = this;
    return async function (ctx: GatewayContext, next: MiddlewareNext): Promise<void> {
      let aggregatedParams = _this._parseParams(ctx);
      ctx.body = await _this.handle(ctx, next, aggregatedParams);
      await next();
    }
  }

  protected _parseParams(ctx: GatewayContext): { [key: string]: any } {
    return Object.assign({}, ctx.params, ctx.query, {body: ctx.request.body}); // bodyParse required
  }

  protected _convertSchemaDefToJoiSchema(gatewaySchemas: GatewaySchemaMap): joi.SchemaMap {
    let schemaMap = {} as joi.SchemaMap;

    for (let key in gatewaySchemas) {
      let gatewaySchema = gatewaySchemas[key] as GatewaySchema;
      let joiSchema = {} as joi.Schema;

      switch (gatewaySchema.type) {
        case "array":
          joiSchema = (gatewaySchema.required)
            ? joi.array().required()
            : joi.array().optional();
          break;
        case "boolean":
          joiSchema = (gatewaySchema.required)
            ? joi.boolean().required()
            : joi.boolean().optional();
          break;
        case "number":
          joiSchema = (gatewaySchema.required)
            ? joi.number().required()
            : joi.number().optional();
          break;
        case "object":
          joiSchema = (gatewaySchema.required)
            ? joi.object(this._convertSchemaDefToJoiSchema(gatewaySchema.schema)).required()
            : joi.object(this._convertSchemaDefToJoiSchema(gatewaySchema.schema)).optional();
          break;
        case "string":
          joiSchema = (gatewaySchema.required)
            ? joi.string().required()
            : joi.string().optional();
          break;
        default:
          joiSchema = (gatewaySchema.required)
            ? joi.any().required()
            : joi.any().optional();
          break;
      }

      schemaMap[key] = joiSchema;
    }

    return schemaMap;
  }
}