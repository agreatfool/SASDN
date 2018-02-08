/// <reference types="node" />
import * as EventEmitter from 'events';
import {
  sendUnaryData as GrpcSendUnaryData,
  Server as GrpcServer,
  ServerCredentials as GrpcServerCredentials,
  ServerWriteableStream,
  ServerDuplexStream,
  ServerUnaryCall,
  ServerReadableStream,
} from 'grpc'
export type GrpcServerCall = ServerUnaryCall | ServerReadableStream | ServerWriteableStream | ServerDuplexStream;
import { RpcContext } from './Context';
export declare type RpcMiddleware = (ctx: RpcContext, next: MiddlewareNext) => Promise<any>;
export declare type MiddlewareNext = () => Promise<any>;
export declare type WrappedHandler = (call: GrpcServerCall, callback?: GrpcSendUnaryData) => Promise<any>;
export declare class RpcApplication extends EventEmitter {
    private _middleware;
    private _context;
    private _server;
    constructor();
    /**
     * Get the gRPC Server.
     * @returns {Server}
     */
    readonly server: GrpcServer;
    /**
     * Bind the server with a port and a given credential.
     * @param {string} address format: "address:port"
     * @param {ServerCredentials} creds optional
     * @returns {RpcApplication}
     */
    bind(address: string, creds?: GrpcServerCredentials): RpcApplication;
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
     * Create context instance.
     * @param {IServerCall} call
     * @param {RpcImplCallback} callback optional
     * @returns {RpcContext}
     * @private
     */
    private _createContext(call, callback?);
    /**
     * Default RpcApplication error handler.
     * @param {Error} err
     * @private
     */
    private _onError(err);
    /**
     * Wrap gRPC handler with other middleware.
     * @param {RpcMiddleware} reqHandler
     * @returns {WrappedHandler}
     */
    wrapGrpcHandler(reqHandler: RpcMiddleware): (call: GrpcServerCall, callback?: GrpcSendUnaryData) => Promise<void>;
}
