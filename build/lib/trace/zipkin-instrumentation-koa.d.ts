import {TraceInfo} from "../handler/TracerHandler";
import {Middleware as KoaMiddleware} from "koa";

export declare class KoaInstrumentation {
    public static middleware(options: TraceInfo): KoaMiddleware;
}