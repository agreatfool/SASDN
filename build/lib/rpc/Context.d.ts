/// <reference path="../../../node_modules/grpc-tsd/src/grpc.d.ts" />
import { IServerCall, RpcImplCallback } from 'grpc';
import { RpcApplication } from './App';
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
