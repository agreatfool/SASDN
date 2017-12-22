import * as Koa from 'koa';
import * as koaBodyParser from 'koa-bodyparser';
import { KoaImpl } from 'sasdn-zipkin';
import RouterLoader from '../router/Router';

const debug = require('debug')('SASDN:GWDemo');

export default class GWDemo {
  private _initialized: boolean;
  public app: Koa;

  constructor() {
    this._initialized = false;
  }

  public async init(isDev: boolean = false): Promise<any> {
    await RouterLoader.instance().init();

    KoaImpl.init(process.env.ZIPKIN_URL, {
      serviceName: 'api-gateway',
      port: 9090
    });

    const app = new Koa();
    app.use(new KoaImpl().createMiddleware());
    app.use(koaBodyParser({ formLimit: '2048kb' })); // post body parser
    app.use(RouterLoader.instance().getRouter().routes());
    this.app = app;

    this._initialized = true;

    return Promise.resolve();
  }

  public start(): void {
    if (!this._initialized) {
      return;
    }

    const host: string = process.env.DEMO_ADDRESS;
    const port: number = parseInt(process.env.DEMO_PORT);
    this.app.listen(port, host, () => {
      debug(`API Gateway Start, Address: ${host}:${port}!`);
    });
  }
}