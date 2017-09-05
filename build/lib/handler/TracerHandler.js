"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zipkin = require("zipkin");
const TransportHttp = require("zipkin-transport-http");
const CLSContext = require("zipkin-context-cls");
const ConfigHandler_1 = require("./ConfigHandler");
class TracerHandler {
    static instance() {
        if (TracerHandler._instance === undefined) {
            TracerHandler._instance = new TracerHandler();
        }
        return TracerHandler._instance;
    }
    constructor() {
        this._tracer = false;
        this._serviceName = 'unknown';
        this._port = 0;
        this._initialized = false;
    }
    init() {
        return new Promise((resolve) => {
            const options = ConfigHandler_1.ConfigHandler.instance().getOption();
            if (options.tracer !== false) {
                this._tracer = new zipkin.Tracer({
                    ctxImpl: new CLSContext('zipkin'),
                    recorder: new zipkin.BatchRecorder({
                        logger: new TransportHttp.HttpLogger({
                            endpoint: `http://${options.tracer.host}:${options.tracer.port}/api/v1/spans`
                        })
                    }),
                    sampler: new zipkin.sampler.CountingSampler(1),
                });
                this._serviceName = options.name;
                this._port = options.port;
            }
            this._initialized = true;
            resolve();
        });
    }
    getTraceInfo(isRequest, remoteServiceName) {
        if (!this._initialized) {
            throw new Error('[Tracer] Tracer Instance has not initialized!');
        }
        const traceInfo = {};
        traceInfo.tracer = this._tracer;
        traceInfo.serviceName = this._serviceName;
        traceInfo.port = (isRequest) ? this._port : 0;
        if (remoteServiceName) {
            traceInfo.remoteServiceName = remoteServiceName;
        }
        return traceInfo;
    }
}
exports.TracerHandler = TracerHandler;
//# sourceMappingURL=TracerHandler.js.map