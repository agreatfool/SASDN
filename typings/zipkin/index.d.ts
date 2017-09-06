// Type definitions for zipkin-transport-http 0.7.3
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="node" />

import * as CLSContext from 'zipkin-context-cls';
import {Callback} from "grpc";

export interface TracerOption {
    ctxImpl?: CLSContext;
    recorder?: zipkin.BatchRecorder;
    sampler?: any;
    traceId128Bit?: boolean;
}

interface TraceIdOption {
    traceId?: Option;
    parentId?: Option;
    spanId?: any;
    sampled?: Option;
    flags?: number
}

declare class SimpleAnnotation {
    toString(): string
}

declare class ClientSend extends SimpleAnnotation {
}

declare class ClientRecv extends SimpleAnnotation {
}

declare class ServerSend extends SimpleAnnotation {
}

declare class ServerRecv extends SimpleAnnotation {
}

declare class Option {
    constructor(value: any);

    map(f: any): Option;

    ifPresent(f: any): Option;

    flatMap(f: any): any;

    getOrElse(f?: any): any;

    equals(other: any): boolean;

    toString(): string;

    type: string;

    present: boolean;
}

export declare namespace zipkin {

    export class Tracer {
        constructor(options: TracerOption)

        scoped(callback: Callback): any;

        createRootId(): TraceId;

        createChildId(): TraceId;

        letChildId(callable: Callback): any;

        setId(traceId: TraceId): void;

        id: TraceId;

        recordAnnotation(annotation: Annotation): void;

        recordMessage(message: string): void;

        recordServiceName(serviceName: string): void;

        recordRpc(name: string): void;

        recordClientAddr(ia: any): void;

        recordServerAddr(ia: any): void;

        recordLocalAddr(ia: any): void;

        recordBinary(key: string, value: string): void;

        writeIdToConsole(message: string): void;
    }

    export function createNoopTracer(): Tracer;

    export class TraceId {
        constructor(options: TraceIdOption);

        spanId: any;

        parentId: any;

        traceId: any;

        sampled: any;

        flags: any;

        isDebug(): boolean;

        toString(): string;
    }

    export namespace option {
        export class Some extends Option {

        }

        export const None: Option;

        export function verifyIsOptional(data: any): void;

        export function fromNullable(nullable: any): Option;
    }

    export interface Annotation {
        ClientSend: ClientSend;
        ClientRecv: ClientRecv;
        ServerSend: ServerSend;
        ServerRecv: ServerRecv;

        Message(message: any): void;

        ServiceName(serviceName: any): void;

        Rpc(name: any): void;

        ClientAddr(options: { host?: any, port?: any }): void;

        ServerAddr(options: { serviceName?: string, host?: any, port?: any }): void;

        LocalAddr(options: { host?: any, port?: any }): void;

        BinaryAnnotation(key: string, value: any): void;
    }

    export interface HttpHeaders {
        TraceId: string;
        SpanId: string;
        ParentSpanId: string;
        Sampled: string;
        Flags: string;
    }

    export class BatchRecorder {
        constructor({logger, timeout}: any);
    }

    export interface sampler {
        Sampler: any;
        CountingSampler: any;

        neverSample(traceId: TraceId): boolean;

        alwaysSample(traceId: TraceId): boolean;
    }

    export type InetAddress = any;

    export type ConsoleRecorder = any;

    export type serializeSpan = any;

    export type ExplicitContext = any;

    export type Request = any;
}