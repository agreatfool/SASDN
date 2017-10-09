/// <reference types="koa" />
import { Context as KoaContext, Middleware as KoaMiddleware, Request as KoaRequest } from 'koa';
import { joi } from '../utility/Joi';
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
export declare abstract class GatewayApiBase {
    method: string;
    uri: string;
    type: string;
    schemaDefObj: GatewayJoiSchemaMap;
    abstract handle(ctx: GatewayContext, next: MiddlewareNext, params: GatewayApiParams): Promise<any>;
    register(): Array<string | KoaMiddleware>;
    protected _validate(): KoaMiddleware;
    protected _execute(): KoaMiddleware;
    protected _parseParams(ctx: GatewayContext): {
        [key: string]: any;
    };
    protected _convertSchemaDefToJoiSchema(gatewayJoiSchemaMap: GatewayJoiSchemaMap): joi.SchemaMap;
}
