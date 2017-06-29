///<reference path="../../../node_modules/grpc-tsd/src/grpc.d.ts"/>
import * as EventEmitter from "events";
import * as assert from "assert";
import * as koaCompose from "koa-compose";
import * as koaConvert from "koa-convert";
import * as isGeneratorFunction from "is-generator-function";
import {IServerCall, RpcImplCallback, Server, ServerCredentials} from "grpc";
import {RpcContext} from "./Context";

const deprecate = require('depd')('SASDN');
const debug = require('debug')('SASDN:application');

export type RpcMiddleware = (ctx: RpcContext, next: MiddlewareNext) => Promise<any>;
export type MiddlewareNext = () => Promise<any>;
export type WrappedHandler = (call: IServerCall, callback?: RpcImplCallback) => Promise<any>;

export class RpcApplication extends EventEmitter {

    private _middleware: Array<RpcMiddleware>;
    private _context: RpcContext;
    private _server: Server;

    constructor() {
        super();
        this._middleware = [];
        this._context = new RpcContext();
        this._server = new Server();
    }

    /**
     * Get the gRPC Server.
     * @returns {Server}
     */
    public get server() {
        return this._server;
    }

    /**
     * Bind the server with a port and a given credential.
     * @param {string} address format: "address:port"
     * @param {ServerCredentials} creds optional
     * @returns {RpcApplication}
     */
    public bind(address: string, creds?: ServerCredentials): RpcApplication {
        if (!creds) {
            creds = ServerCredentials.createInsecure();
        }
        debug('bind address: %s', address);
        this._server.bind(address, creds);
        return this;
    }

    /**
     * Start the RpcApplication server.
     */
    public start(): void {
        this._server.start();
    }

    /**
     * Use the given middleware.
     * @param {RpcMiddleware} middleware
     * @returns {RpcApplication}
     */
    use(middleware: RpcMiddleware) {
        if (typeof middleware !== 'function') throw new TypeError('middleware must be a function!');
        if (isGeneratorFunction(middleware)) {
            deprecate('Support for generators will be removed in v3. ' +
                'See the documentation for examples of how to convert old middleware ' +
                'https://github.com/koajs/koa/blob/master/docs/migration.md');
            middleware = koaConvert(middleware);
        }
        debug('use %s', (middleware as any)._name || middleware.name || '-');
        this._middleware.push(middleware);
        return this;
    }

    /**
     * Create context instance.
     * @param {IServerCall} call
     * @param {RpcImplCallback} callback optional
     * @returns {RpcContext}
     * @private
     */
    private _createContext(call: IServerCall, callback?: RpcImplCallback): RpcContext {
        let ctx = new RpcContext();

        ctx.app = this;
        ctx.call = call;
        ctx.callback = callback ? callback : () => {
        };

        return ctx;
    }

    /**
     * Default RpcApplication error handler.
     * @param {Error} err
     * @private
     */
    private _onError(err: Error) {
        assert(err instanceof Error, `non-error thrown: ${err}`);

        const msg = err.stack || err.toString();
        console.error();
        console.error(msg.replace(/^/gm, '  '));
        console.error();
    }

    /**
     * Wrap gRPC handler with other middleware.
     * @param {RpcMiddleware} reqHandler
     * @returns {WrappedHandler}
     */
    public wrapGrpcHandler(reqHandler: RpcMiddleware) {
        let middleware = [...this._middleware, reqHandler];
        let fn = koaCompose(middleware);

        if (!this.listeners('error').length) {
            this.on('error', this._onError);
        }

        return async (call: IServerCall, callback?: RpcImplCallback) => {
            const ctx = this._createContext(call, callback);
            const onError = err => ctx.onError(err);
            return fn(ctx).catch(onError);
        };
    }

}