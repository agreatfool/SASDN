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
const grpc = require("grpc");
class GrpcInstrumentation {
    static middleware({ tracer, serviceName = 'unknown', port = 0, remoteServiceName }) {
        if (tracer === false) {
            return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
                yield next();
            });
        }
        return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
            const reqId = libCrypto.randomBytes(12).toString('base64');
            const metadata = ctx.call.metadata;
            function readMetadata(headerName) {
                const val = metadata.get(headerName.toLowerCase())[0];
                if (val !== undefined) {
                    return new zipkin.option.Some(val);
                }
                else {
                    return zipkin.option.None;
                }
            }
            if (GrpcInstrumentation._containsIncomingMetadata(metadata)) {
                const spanId = readMetadata(zipkin.HttpHeaders.SpanId);
                spanId.ifPresent((sid) => {
                    const childId = new zipkin.TraceId({
                        traceId: readMetadata(zipkin.HttpHeaders.TraceId),
                        parentId: readMetadata(zipkin.HttpHeaders.ParentSpanId),
                        spanId: sid,
                        sampled: readMetadata(zipkin.HttpHeaders.Sampled).map(GrpcInstrumentation._stringToBoolean),
                        flags: readMetadata(zipkin.HttpHeaders.Flags).flatMap(GrpcInstrumentation._stringToIntOption).getOrElse(0)
                    });
                    tracer.setId(childId);
                });
            }
            else {
                const rootId = tracer.createRootId();
                if (metadata.get(zipkin.HttpHeaders.Flags.toLowerCase())[0]) {
                    const rootIdWithFlags = new zipkin.TraceId({
                        traceId: rootId.traceId,
                        parentId: rootId.parentId,
                        spanId: rootId.spanId,
                        sampled: rootId.sampled,
                        flags: readMetadata(zipkin.HttpHeaders.Flags)
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
                tracer.recordRpc('rpc');
                tracer.recordAnnotation(new zipkin.Annotation.ServerRecv());
                tracer.recordAnnotation(new zipkin.Annotation.LocalAddr({ port }));
                if (remoteServiceName) {
                    tracer.recordAnnotation(new zipkin.Annotation.ServerAddr({
                        serviceName: remoteServiceName
                    }));
                }
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
                tracer.recordAnnotation(new zipkin.Annotation.ServerSend());
            });
        });
    }
    static proxyClient(client, ctx, { tracer, serviceName = 'unknown', port = 0 }) {
        if (tracer === false) {
            return client;
        }
        if (ctx['traceId'] instanceof zipkin.TraceId) {
            tracer.setId(ctx['traceId']);
        }
        Object.getOwnPropertyNames(Object.getPrototypeOf(client)).forEach((property) => {
            const original = client[property];
            if (property != 'constructor' && typeof original == 'function') {
                client[property] = function () {
                    // has grpc.Metadata
                    if (arguments[0] instanceof grpc.Metadata || arguments[1] instanceof grpc.Metadata) {
                        return original.apply(client, arguments);
                    }
                    // create SpanId
                    tracer.setId(tracer.createChildId());
                    const traceId = tracer.id;
                    console.log(ctx["reqId"], "traceId", traceId.traceId);
                    const metadata = GrpcInstrumentation._makeMetadata(traceId);
                    const argus = GrpcInstrumentation._replaceArguments(arguments, metadata, (callback) => {
                        return (err, res) => {
                            tracer.scoped(() => {
                                tracer.setId(traceId);
                                tracer.recordBinary('rpc.end', 'callback');
                                tracer.recordAnnotation(new zipkin.Annotation.ClientRecv());
                            });
                            callback(err, res);
                        };
                    });
                    tracer.scoped(() => {
                        tracer.recordServiceName(serviceName);
                        tracer.recordRpc(`rpc`);
                        tracer.recordBinary('rpc.query', property);
                        tracer.recordAnnotation(new zipkin.Annotation.ClientSend());
                        tracer.recordAnnotation(new zipkin.Annotation.LocalAddr({ port }));
                        if (traceId.flags !== 0 && traceId.flags != null) {
                            tracer.recordBinary(zipkin.HttpHeaders.Flags, traceId.flags.toString());
                        }
                    });
                    const call = original.apply(client, argus);
                    call.on('end', function () {
                        tracer.scoped(() => {
                            tracer.setId(traceId);
                            tracer.recordBinary('rpc.end', 'call');
                            tracer.recordAnnotation(new zipkin.Annotation.ClientRecv());
                        });
                    });
                    return call;
                };
            }
        });
        return client;
    }
    static _containsIncomingMetadata(metadata) {
        return metadata.get(zipkin.HttpHeaders.TraceId.toLowerCase())[0] !== undefined && metadata.get(zipkin.HttpHeaders.SpanId.toLowerCase())[0] !== undefined;
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
    static _makeMetadata(traceId) {
        const metadata = new grpc.Metadata();
        metadata.add(zipkin.HttpHeaders.TraceId, traceId.traceId);
        metadata.add(zipkin.HttpHeaders.ParentSpanId, traceId.parentId);
        metadata.add(zipkin.HttpHeaders.SpanId, traceId.spanId);
        metadata.add(zipkin.HttpHeaders.Sampled, traceId.sampled.getOrElse() ? '1' : '0');
        return metadata;
    }
    static _replaceArguments(argus, metadata, callback) {
        let i = 0;
        if (argus.length == 0) {
            argus[i] = metadata;
            argus.length++;
        }
        else {
            const oldArguments = Object.assign({}, argus);
            for (let key in oldArguments) {
                if (typeof oldArguments[key] == 'function') {
                    argus[i] = callback(oldArguments[key]);
                }
                else {
                    argus[i] = oldArguments[key];
                }
                if (parseInt(key) == 0) {
                    i++;
                    argus[i] = metadata;
                    argus.length++;
                }
                i++;
            }
        }
        return argus;
    }
}
exports.GrpcInstrumentation = GrpcInstrumentation;
//# sourceMappingURL=zipkin-instrumentation-grpc.js.map