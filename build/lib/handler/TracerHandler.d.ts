import * as zipkin from "zipkin";

export interface TraceInfo {
    tracer: zipkin.Tracer;
    serviceName?: string;
    port?: number;
}

export declare class TracerHandler {
    private static _instance: TracerHandler;

    private _initialized: boolean;
    private _tracer: zipkin.Tracer;
    private _serviceName: string;
    private _port: number;

    public static instance(): TracerHandler;

    private constructor();

    public init(): Promise<void>;

    public getTraceInfo(isRequest?: boolean, childServiceName?: string): TraceInfo;
}