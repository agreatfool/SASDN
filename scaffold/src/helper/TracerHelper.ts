import * as zipkin from "zipkin";
import * as TransportHttp from "zipkin-transport-http";
import * as CLSContext from "zipkin-context-cls";
import {ConfigHelper} from "./ConfigHelper";

export interface TracerOptions {
    host: string;
    port: number;
}

export interface TraceInfo {
    tracer: zipkin.Tracer;
    serviceName?: string;
    port?: number;
    remoteServiceName?: string;
}

export class TracerHelper {
    private static _instance: TracerHelper;

    private _initialized: boolean;
    private _tracer: zipkin.Tracer;
    private _serviceName: string;
    private _port: number;

    public static instance(): TracerHelper {
        if (TracerHelper._instance === undefined) {
            TracerHelper._instance = new TracerHelper();
        }
        return TracerHelper._instance;
    }

    private constructor() {
        this._tracer = false;
        this._serviceName = 'unknown';
        this._port = 0;
        this._initialized = false;
    }

    public init() {
        return new Promise((resolve) => {
            const options = ConfigHelper.instance().getOption();

            if (options.tracer !== false) {
                this._tracer = new zipkin.Tracer({
                    ctxImpl: new CLSContext('zipkin'),
                    recorder: new zipkin.BatchRecorder({
                        logger: new TransportHttp.HttpLogger({
                            endpoint: `http://${(options.tracer as TracerOptions).host}:${(options.tracer as TracerOptions).port}/api/v1/spans`
                        })
                    }),
                    sampler: new zipkin.sampler.CountingSampler(1), // sample rate 0.5 will sample 1 % of all incoming requests
                });
            }

            this._serviceName = options.name;
            this._port = options.port;
            this._initialized = true;
            resolve();
        });
    }

    public getTraceInfo(isRequest?: boolean, remoteServiceName?: string): TraceInfo {
        if (!this._initialized) {
            throw new Error('[Tracer] Tracer Instance has not initialized!');
        }

        const traceInfo = {} as TraceInfo;
        traceInfo.tracer = this._tracer;
        traceInfo.serviceName = this._serviceName;
        traceInfo.port = (isRequest) ? this._port : 0;
        if (remoteServiceName) {
            traceInfo.remoteServiceName = remoteServiceName;
        }

        return traceInfo;
    }
}
