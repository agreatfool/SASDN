"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
///<reference path="../../node_modules/grpc-tsd/src/grpc.d.ts"/>
const assert = require("assert");
const grpc_1 = require("grpc");
var GrpcOpType;
(function (GrpcOpType) {
    GrpcOpType[GrpcOpType["SEND_INITIAL_METADATA"] = 0] = "SEND_INITIAL_METADATA";
    GrpcOpType[GrpcOpType["SEND_MESSAGE"] = 1] = "SEND_MESSAGE";
    GrpcOpType[GrpcOpType["SEND_CLOSE_FROM_CLIENT"] = 2] = "SEND_CLOSE_FROM_CLIENT";
    GrpcOpType[GrpcOpType["SEND_STATUS_FROM_SERVER"] = 3] = "SEND_STATUS_FROM_SERVER";
    GrpcOpType[GrpcOpType["RECV_INITIAL_METADATA"] = 4] = "RECV_INITIAL_METADATA";
    GrpcOpType[GrpcOpType["RECV_MESSAGE"] = 5] = "RECV_MESSAGE";
    GrpcOpType[GrpcOpType["RECV_STATUS_ON_CLIENT"] = 6] = "RECV_STATUS_ON_CLIENT";
    GrpcOpType[GrpcOpType["RECV_CLOSE_ON_SERVER"] = 7] = "RECV_CLOSE_ON_SERVER";
})(GrpcOpType = exports.GrpcOpType || (exports.GrpcOpType = {}));
class Context {
    constructor() {
    }
    /**
     * Handle error with gRPC status.
     * @see {@link https://github.com/grpc/grpc/blob/v1.3.7/src/node/src/server.js#L69-L101}
     * @param {Error} err
     */
    onError(err) {
        assert(err instanceof Error, `non-error thrown: ${err}`);
        let call = this.call;
        let statusMetadata = new grpc_1.Metadata();
        let status = {
            code: grpc_1.status.UNKNOWN,
            details: 'Unknown Error'
        };
        if (err.hasOwnProperty('message')) {
            status.details = err.message;
        }
        if (err.hasOwnProperty('code')) {
            status.code = err.code;
            if (err.hasOwnProperty('details')) {
                status.details = err.details;
            }
        }
        if (err.hasOwnProperty('metadata')) {
            statusMetadata = err.metadata;
        }
        status.metadata = statusMetadata._getCoreRepresentation();
        let errorBatch = {};
        if (!call.metadataSent) {
            errorBatch[GrpcOpType.SEND_INITIAL_METADATA] = (new grpc_1.Metadata())._getCoreRepresentation();
        }
        errorBatch[GrpcOpType.SEND_STATUS_FROM_SERVER] = status;
        call.call.startBatch(errorBatch, () => {
        });
    }
}
exports.Context = Context;
