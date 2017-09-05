// Type definitions for zipkin-transport-http 0.7.3
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="node" />

interface HttpLoggerOption {
    endpoint: string;
    httpInterval?: number;
}

export declare namespace TransportHttp {
    class HttpLogger {
        constructor(options: HttpLoggerOption)
    }
}