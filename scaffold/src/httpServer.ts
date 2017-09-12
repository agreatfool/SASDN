import * as LibPath from "path";
import * as Koa from "koa";
import * as koaBodyParser from "koa-bodyparser";
import {KoaInstrumentation} from "zipkin-instrumentation-koa"
import RouterLoader from "./router/Router";
import {ConfigHandler} from "./handler/ConfigHandler";
import {TracerHandler} from "./handler/TracerHandler";

export default class HttpServer {
    private _initialized: boolean;
    public app: Koa;

    constructor() {
        this._initialized = false;
    }

    public init(isDev: boolean = false): Promise<any> {

        const configPath = (isDev)
            ? LibPath.join(__dirname, '..', 'config.dev.json')
            : LibPath.join(__dirname, '..', 'config.json');

        return new Promise((resolve, reject) => {
            Promise.resolve()
                .then(() => ConfigHandler.instance().init(configPath))
                .then(() => TracerHandler.instance().init())
                .then(() => RouterLoader.instance().init())
                .then(() => {
                    const app = new Koa();

                    app.use(KoaInstrumentation.middleware(TracerHandler.instance().getTraceInfo()));
                    app.use(koaBodyParser({formLimit: '2048kb'})); // post body parser
                    app.use(RouterLoader.instance().getRouter().routes());

                    this.app = app;
                })
                .then(() => {
                    this._initialized = true;
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });

    }

    public start(): void {
        if (!this._initialized) {
            return;
        }

        const options = ConfigHandler.instance().getOption();
        this.app.listen(options.port, options.host, () => {
            console.log(`API Gateway Start, Address: ${options.host}:${options.port}!`);
        });
    }
}