/// <reference path="../../../node_modules/grpc-tsd/src/grpc.d.ts" />
/// <reference types="node" />
import * as EventEmitter from "events";
import { IServerCall, RpcImplCallback, Server, ServerCredentials } from "grpc";
import { RpcContext } from "./Context";
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
