import * as LibPath from 'path';
import * as Koa from 'koa';
import * as koaBodyParser from 'koa-bodyparser';
import {KoaInstrumentation} from 'zipkin-instrumentation-koa';
import RouterLoader from '../router/Router';
import {ConfigHelper} from '../helper/ConfigHelper';
import {TracerHelper} from '../helper/TracerHelper';

export default class GWDemo {
    private _initialized: boolean;
    public app: Koa;

    constructor() {
        this._initialized = false;
    }

    public async init(isDev: boolean = false): Promise<any> {
        const configPath = (isDev)
            ? LibPath.join(__dirname, '..', '..', 'config.dev.json')
            : LibPath.join(__dirname, '..', '..', 'config.json');

        await ConfigHelper.instance().init(configPath);
        await TracerHelper.instance().init();
        await RouterLoader.instance().init();

        const app = new Koa();

        app.use(KoaInstrumentation.middleware(TracerHelper.instance().getTraceInfo()));
        app.use(koaBodyParser({formLimit: '2048kb'})); // post body parser
        app.use(RouterLoader.instance().getRouter().routes());

        this._initialized = true;

        return Promise.resolve();
    }

    public start(): void {
        if (!this._initialized) {
            return;
        }

        const options = ConfigHelper.instance().getOption();
        this.app.listen(options.port, options.host, () => {
            console.log(`API Gateway Start, Address: ${options.host}:${options.port + 1}!`);
        });
    }
}