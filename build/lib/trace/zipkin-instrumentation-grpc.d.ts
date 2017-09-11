import {TraceInfo} from "../handler/TracerHandler";
import {RpcMiddleware} from "../rpc/App";
import {GatewayContext} from "../gateway/ApiBase";
import {RpcContext} from "../rpc/Context";

export declare class GrpcInstrumentation {
    public static middleware(options: TraceInfo): RpcMiddleware;
    public static proxyClient<T>(client: T, ctx: GatewayContext | RpcContext, options: TraceInfo): T;
}