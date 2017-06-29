import {Middleware as KoaMiddleware, Context as KoaContext, Request as KoaRequest} from "koa";
import {MiddlewareNext} from "../rpc/App";

export interface GatewayContext extends KoaContext {
    params: any;
    request: GatewayRequest;
}
export interface GatewayRequest extends KoaRequest {
    body?: any;
}
export interface GatewaySchema {
    type: string;
    required: boolean;
    schema?: GatewaySchemaMap;
}
export interface GatewaySchemaMap {
    [name: string]: GatewaySchema;
}
export interface GatewayParams {
    [key: string]: any;
}
export declare abstract class GatewayApiBase {
    public method: string;
    public uri: string;
    public type: string;
    public schemaDefObj: GatewaySchemaMap;

    public abstract handle(ctx: GatewayContext, next: MiddlewareNext, params: { [key: string]: any }): Promise<any>;

    public register(): Array<string | KoaMiddleware>;
}
