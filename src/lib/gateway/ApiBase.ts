import {Middleware as KoaMiddleware, Context as KoaContext, Request as KoaRequest} from "koa";
import {joi, joiValidate} from "../utility/Joi";
import {MiddlewareNext} from "../rpc/App";

export interface GatewayContext extends KoaContext {
    params: any;
    request: GatewayRequest;
}
export interface GatewayRequest extends KoaRequest {
    body?: any;
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

    public register(): Array<string | KoaMiddleware> {
        return [this.uri, this._validate(), this._execute()];
    };

    protected _validate(): KoaMiddleware {
        let _this: GatewayApiBase = this;
        return async function (ctx: GatewayContext, next: MiddlewareNext): Promise<void> {
            let aggregatedParams = _this._parseParams(ctx);
            let joiSchemaMap = _this._convertSchemaDefToJoiSchema(_this.schemaDefObj);

            try {
                await joiValidate(aggregatedParams, joiSchemaMap, {allowUnknown: true});
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

    protected _convertSchemaDefToJoiSchema(gatewayJoiSchemaMap: GatewayJoiSchemaMap): joi.SchemaMap {
        let joiSchemaMap = {} as joi.SchemaMap;

        for (let key in gatewayJoiSchemaMap) {
            let gatewayJoiSchema = gatewayJoiSchemaMap[key] as GatewayJoiSchema;
            let joiSchema = {} as joi.Schema;

            switch (gatewayJoiSchema.type) {
                case "array":
                    joiSchema = (gatewayJoiSchema.required)
                        ? joi.array().required()
                        : joi.array().optional();
                    break;
                case "boolean":
                    joiSchema = (gatewayJoiSchema.required)
                        ? joi.boolean().required()
                        : joi.boolean().optional();
                    break;
                case "number":
                    joiSchema = (gatewayJoiSchema.required)
                        ? joi.number().required()
                        : joi.number().optional();
                    break;
                case "object":
                    joiSchema = (gatewayJoiSchema.required)
                        ? joi.object(this._convertSchemaDefToJoiSchema(gatewayJoiSchema.schema)).required()
                        : joi.object(this._convertSchemaDefToJoiSchema(gatewayJoiSchema.schema)).optional();
                    break;
                case "string":
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