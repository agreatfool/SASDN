import * as assert from "assert";
import {IServerCall, RpcImplCallback} from "grpc";

import {Application} from "./App";

export class Context {

    public app: Application;
    public call: IServerCall;
    public callback: RpcImplCallback;

    constructor() {
    }

    /**
     * Handle error in request processing.
     * @param err
     */
    public onError(err: Error) {
        assert(err instanceof Error, `non-error thrown: ${err}`);

        const msg = err.stack || err.toString();
        console.error();
        console.error(msg.replace(/^/gm, '  '));
        console.error();
    }

}