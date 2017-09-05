// Type definitions for zipkin-context-cls 0.6.1
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="node" />

export declare class CLSContext {
    constructor(namespace: string);

    setContext(ctx);

    getContext(): any;

    scoped(callable): any;

    letContext(ctx, callable): any;
}