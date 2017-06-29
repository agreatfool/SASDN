import * as EventEmitter from "events";
import {IServerCall, RpcImplCallback, Server, ServerCredentials} from "grpc";
import {Middleware as KoaMiddleware, Context as KoaContext, Request as KoaRequest} from "koa";
export declare type Middleware = (ctx: RpcContext, next: MiddlewareNext) => Promise<any>;
export declare type MiddlewareNext = () => Promise<any>;
export declare type WrappedHandler = (call: IServerCall, callback?: RpcImplCallback) => Promise<any>;
export declare class RpcApplication extends EventEmitter {
    private _middleware: Array<Middleware>;
    private _context: RpcContext;
    private _server: Server;
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
     * @param {Middleware} middleware
     * @returns {RpcApplication}
     */
    use(middleware: Middleware): this;
    /**
     * Create context instance.
     * @param {IServerCall} call
     * @param {RpcImplCallback} callback optional
     * @returns {RpcContext}
     * @private
     */
    private _createContext(call: IServerCall, callback?: RpcImplCallback): RpcContext;
    /**
     * Default RpcApplication error handler.
     * @param {Error} err
     * @private
     */
    private _onError(err);
    /**
     * Wrap gRPC handler with other middleware.
     * @param {Middleware} reqHandler
     * @returns {WrappedHandler}
     */
    wrapGrpcHandler(reqHandler: Middleware): (call: IServerCall, callback?: RpcImplCallback) => Promise<any>;
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
    call: IServerCall;
    callback: RpcImplCallback;
    constructor();
    /**
     * Handle error with gRPC status.
     * @see {@link https://github.com/grpc/grpc/blob/v1.3.7/src/node/src/server.js#L69-L101}
     * @param {Error} err
     */
    onError(err: Error): void;
}

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
export interface GatewayApiParams {
    [key: string]: any;
}
export declare abstract class GatewayApiBase {
    public method: string;
    public uri: string;
    public type: string;
    public schemaDefObj: GatewaySchemaMap;

    public abstract handle(ctx: GatewayContext, next: MiddlewareNext, params: GatewayApiParams): Promise<any>;

    public register(): Array<string | KoaMiddleware>;
}
