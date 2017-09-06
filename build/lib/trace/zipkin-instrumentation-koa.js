"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const libCrypto = require("crypto");
const zipkin = require("zipkin");
const url = require("url");
class KoaInstrumentation {
    static middleware({ tracer, serviceName = 'unknown', port = 0 }) {
        if (tracer === false) {
            return () => __awaiter(this, void 0, void 0, function* () {
                // do nothing
            });
        }
        return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
            const reqId = libCrypto.randomBytes(12).toString('base64');
            const req = ctx.request;
            const res = ctx.response;
            ctx.response.set('Access-Control-Allow-Origin', '*');
            ctx.response.set('Access-Control-Allow-Headers', [
                'Origin', 'Accept', 'X-Requested-With', 'X-B3-TraceId',
                'X-B3-ParentSpanId', 'X-B3-SpanId', 'X-B3-Sampled'
            ].join(', '));
            function readHeader(headerName) {
                const val = req.header[headerName];
                if (val != null) {
                    return new zipkin.option.Some(val);
                }
                else {
                    return zipkin.option.None;
                }
            }
            if (KoaInstrumentation._containsRequiredHeaders(req)) {
                const spanId = readHeader(zipkin.HttpHeaders.SpanId);
                spanId.ifPresent((sid) => {
                    const childId = new zipkin.TraceId({
                        traceId: readHeader(zipkin.HttpHeaders.TraceId),
                        parentId: readHeader(zipkin.HttpHeaders.ParentSpanId),
                        spanId: sid,
                        sampled: readHeader(zipkin.HttpHeaders.Sampled).map(KoaInstrumentation._stringToBoolean),
                        flags: readHeader(zipkin.HttpHeaders.Flags).flatMap(KoaInstrumentation._stringToIntOption).getOrElse(0)
                    });
                    tracer.setId(childId);
                });
            }
            else {
                const rootId = tracer.createRootId();
                if (req.header[zipkin.HttpHeaders.Flags]) {
                    const rootIdWithFlags = new zipkin.TraceId({
                        traceId: rootId.traceId,
                        parentId: rootId.parentId,
                        spanId: rootId.spanId,
                        sampled: rootId.sampled,
                        flags: readHeader(zipkin.HttpHeaders.Flags)
                    });
                    tracer.setId(rootIdWithFlags);
                }
                else {
                    tracer.setId(rootId);
                }
            }
            const traceId = tracer.id;
            console.log(reqId, ">> traceId", traceId.traceId);
            tracer.scoped(() => {
                tracer.setId(traceId);
                tracer.recordServiceName(serviceName);
                tracer.recordRpc(req.method.toUpperCase());
                tracer.recordBinary('http.url', KoaInstrumentation._formatRequestUrl(req));
                tracer.recordAnnotation(new zipkin.Annotation.ServerRecv());
                tracer.recordAnnotation(new zipkin.Annotation.LocalAddr({ port }));
                if (traceId.flags !== 0 && traceId.flags != null) {
                    tracer.recordBinary(zipkin.HttpHeaders.Flags, traceId.flags.toString());
                }
            });
            ctx['reqId'] = reqId;
            ctx['traceId'] = traceId;
            yield next();
            console.log(reqId, "<< traceId", traceId.traceId);
            tracer.scoped(() => {
                tracer.setId(traceId);
                tracer.recordBinary('http.status_code', res.status.toString());
                tracer.recordAnnotation(new zipkin.Annotation.ServerSend());
            });
        });
    }
    static _containsRequiredHeaders(req) {
        return req.header[zipkin.HttpHeaders.TraceId] !== undefined &&
            req.header[zipkin.HttpHeaders.SpanId] !== undefined;
    }
    static _formatRequestUrl(req) {
        const parsed = url.parse(req.originalUrl);
        return url.format({
            protocol: req.protocol,
            host: req.header['host'],
            pathname: parsed.pathname,
            search: parsed.search
        });
    }
    static _stringToBoolean(str) {
        return str === '1';
    }
    static _stringToIntOption(str) {
        try {
            return new zipkin.option.Some(parseInt(str));
        }
        catch (err) {
            return zipkin.option.None;
        }
    }
}
exports.KoaInstrumentation = KoaInstrumentation;
//# sourceMappingURL=zipkin-instrumentation-koa.js.map