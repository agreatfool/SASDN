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
///<reference path="../../node_modules/grpc-tsd/src/grpc.d.ts"/>
const EventEmitter = require("events");
const assert = require("assert");
const koaCompose = require("koa-compose");
const koaConvert = require("koa-convert");
const isGeneratorFunction = require("is-generator-function");
const grpc_1 = require("grpc");
const Context_1 = require("./Context");
const deprecate = require('depd')('SASDN');
const debug = require('debug')('SASDN:application');
class Application extends EventEmitter {
    constructor() {
        super();
        this._middleware = [];
        this._context = new Context_1.Context();
        this._server = new grpc_1.Server();
    }
    /**
     * Get the gRPC Server.
     * @returns {Server}
     */
    get server() {
        return this._server;
    }
    /**
     * Bind the server with a port and a given credential.
     * @param {string} address format: "address:port"
     * @param {ServerCredentials} creds optional
     * @returns {Application}
     */
    bind(address, creds) {
        if (!creds) {
            creds = grpc_1.ServerCredentials.createInsecure();
        }
        debug('bind address: %s', address);
        this._server.bind(address, creds);
        return this;
    }
    /**
     * Start the Application server.
     */
    start() {
        this._server.start();
    }
    /**
     * Use the given middleware.
     * @param {Middleware} middleware
     * @returns {Application}
     */
    use(middleware) {
        if (typeof middleware !== 'function')
            throw new TypeError('middleware must be a function!');
        if (isGeneratorFunction(middleware)) {
            deprecate('Support for generators will be removed in v3. ' +
                'See the documentation for examples of how to convert old middleware ' +
                'https://github.com/koajs/koa/blob/master/docs/migration.md');
            middleware = koaConvert(middleware);
        }
        debug('use %s', middleware._name || middleware.name || '-');
        this._middleware.push(middleware);
        return this;
    }
    /**
     * Create context instance.
     * @param {IServerCall} call
     * @param {RpcImplCallback} callback optional
     * @returns {Context}
     * @private
     */
    _createContext(call, callback) {
        let ctx = new Context_1.Context();
        ctx.app = this;
        ctx.call = call;
        ctx.callback = callback ? callback : () => {
        };
        return ctx;
    }
    /**
     * Default Application error handler.
     * @param {Error} err
     * @private
     */
    _onError(err) {
        assert(err instanceof Error, `non-error thrown: ${err}`);
        const msg = err.stack || err.toString();
        console.error();
        console.error(msg.replace(/^/gm, '  '));
        console.error();
    }
    /**
     * Wrap gRPC handler with other middleware.
     * @param {Middleware} reqHandler
     * @returns {WrappedHandler}
     */
    wrapGrpcHandler(reqHandler) {
        let middleware = [...this._middleware, reqHandler];
        let fn = koaCompose(middleware);
        if (!this.listeners('error').length) {
            this.on('error', this._onError);
        }
        return (call, callback) => __awaiter(this, void 0, void 0, function* () {
            const ctx = this._createContext(call, callback);
            const onError = err => ctx.onError(err);
            return fn(ctx).catch(onError);
        });
    }
}
exports.Application = Application;
