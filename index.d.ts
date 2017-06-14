import * as EventEmitter from "events";
import {IServerCall, RpcImplCallback, Server, ServerCredentials} from "grpc";

export declare type Middleware = (ctx: Context, next: MiddlewareNext) => Promise<any>;
export declare type MiddlewareNext = () => Promise<any>;
export declare type WrappedHandler = (call: IServerCall, callback?: RpcImplCallback) => Promise<any>;
export declare class Application extends EventEmitter {
    private _middleware;
    private _context;
    private _server;

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
     * @returns {Application}
     */
    bind(address: string, creds?: ServerCredentials): Application;

    /**
     * Start the Application server.
     */
    start(): void;

    /**
     * Use the given middleware.
     * @param {Middleware} middleware
     * @returns {Application}
     */
    use(middleware: Middleware): this;

    /**
     * Create context instance.
     * @param {IServerCall} call
     * @param {RpcImplCallback} callback optional
     * @returns {Context}
     * @private
     */
    private _createContext(call, callback?);

    /**
     * Default Application error handler.
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
export declare class Context {
    app: Application;
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