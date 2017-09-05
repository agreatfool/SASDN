import {TraceInfo} from "../handler/TracerHandler";
import {RpcMiddleware} from "../rpc/App";

export declare class GrpcInstrumentation {
    public static middleware(options: TraceInfo): RpcMiddleware;
    public static proxyClient<T>(client: T, options: TraceInfo): T;
}