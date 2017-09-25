import * as LibPath from 'path';
import * as Koa from 'koa';
import * as koaBodyParser from 'koa-bodyparser';
import {KoaInstrumentation} from 'zipkin-instrumentation-koa';
import RouterLoader from '../router/Router';
import {ConfigHelper} from '../helper/ConfigHelper';
import {TracerHelper} from '../helper/TracerHelper';

export default class GatewayServer {
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
                .then(() => ConfigHelper.instance().init(configPath))
                .then(() => TracerHelper.instance().init())
                .then(() => RouterLoader.instance().init())
                .then(() => {
                    const app = new Koa();

                    app.use(KoaInstrumentation.middleware(TracerHelper.instance().getTraceInfo()));
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

        const options = ConfigHelper.instance().getOption();
        this.app.listen(options.port, options.host, () => {
            console.log(`API Gateway Start, Address: ${options.host}:${options.port}!`);
        });
    }
}