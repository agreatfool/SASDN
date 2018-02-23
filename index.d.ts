import * as EventEmitter from "events";
import {
  Server,
  ServerCredentials,
  ServerDuplexStream,
  ServerReadableStream,
  ServerUnaryCall,
  ServerWriteableStream,
  sendUnaryData,
} from 'grpc';
import {Context as KoaContext, Middleware as KoaMiddleware, Request as KoaRequest} from "koa";
import * as joi from "joi";
import * as bluebird from "bluebird";

export type GrpcServerUnaryCall<RequestType, ResponseType> = ServerUnaryCall<RequestType>;
export type GrpcServerReadableStream<RequestType, ResponseType> = ServerReadableStream<RequestType>;
export type GrpcServerWriteableStream<RequestType, ResponseType> = ServerWriteableStream<RequestType>;
export type GrpcServerDuplexStream<RequestType, ResponseType> = ServerDuplexStream<RequestType, ResponseType>;

export type GrpcServerCall<RequestType, ResponseType> = GrpcServerUnaryCall<RequestType, ResponseType>
  | GrpcServerReadableStream<RequestType, ResponseType>
  | GrpcServerWriteableStream<RequestType, ResponseType>
  | GrpcServerDuplexStream<RequestType, ResponseType>;

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
}

export declare type RpcMiddleware = (ctx: RpcContext, next: MiddlewareNext) => Promise<any>;
export declare type MiddlewareNext = () => Promise<any>;
export declare type WrappedHandler = (call: GrpcServerCall<RequestType, ResponseType>, callback?: sendUnaryData<ResponseType>) => Promise<any>;

export declare class RpcApplication extends EventEmitter {
    constructor();

    /**
     * Get the gRPC Server.
     * @returns {Server}
     */
    readonly server: Server;

    /**
     * Bind the server with a port and a given credential.
     * @param {string} address format: "address:port"
     * @param {ServerCredentials} creds optional
     * @returns {RpcApplication}
     */
    bind(address: string, creds?: ServerCredentials): RpcApplication;

    /**
     * Start the RpcApplication server.
     */
    start(): void;

    /**
     * Use the given middleware.
     * @param {RpcMiddleware} middleware
     * @returns {RpcApplication}
     */
    use(middleware: RpcMiddleware): this;

    /**
     * Wrap gRPC handler with other middleware.
     * @param {RpcMiddleware} reqHandler
     * @returns {WrappedHandler}
     */
    wrapGrpcHandler(reqHandler: RpcMiddleware): (call: GrpcServerCall<RequestType, ResponseType>, callback?: sendUnaryData<ResponseType>) => Promise<void>;
}

export declare enum GrpcOpType {
    SEND_INITIAL_METADATA = 0,
    SEND_MESSAGE = 1,
    SEND_CLOSE_FROM_CLIENT = 2,
    SEND_STATUS_FROM_SERVER = 3,
    RECV_INITIAL_METADATA = 4,
    RECV_MESSAGE = 5,
    RECV_STATUS_ON_CLIENT = 6,
    RECV_CLOSE_ON_SERVER = 7,
}

export declare class RpcContext {
    app: RpcApplication;
    call: GrpcServerCall<RequestType, ResponseType>;
    callback: sendUnaryData<ResponseType>;

    constructor();

    /**
     * Handle error with gRPC status.
     * @see {@link https://github.com/grpc/grpc/blob/v1.3.7/src/node/src/server.js#L69-L101}
     * @param {Error} err
     */
    onError(err: Error): void;
}

declare let joiValidate: <T>(value: Object, schema: Object, options: joi.ValidationOptions) => bluebird<T>;
export { joi, joiValidate };