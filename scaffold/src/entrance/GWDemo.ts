import * as Koa from 'koa';
import * as koaBodyParser from 'koa-bodyparser';
import { KoaImpl, ZIPKIN_EVENT } from 'sasdn-zipkin';
import RouterLoader from '../router/Router';
import { Config, ConnectKey } from '../lib/Config';
import { LEVEL } from 'sasdn-log';
import { Logger, TOPIC } from '../lib/Logger';
import * as LibDotEnv from 'dotenv';
const debug = require('debug')('SASDN:GWDemo');

export default class GWDemo {
  private _initialized: boolean;
  public app: Koa;

  constructor() {
    this._initialized = false;
  }

  public async init(isDev: boolean = false): Promise<any> {
    if (isDev) {
      const loadEnv = LibDotEnv.config();
      if(loadEnv.error) {
        return Promise.reject(loadEnv.error);
      }
    }

    await Config.instance.init();

    await Logger.instance.initalize({
      kafkaTopic: TOPIC.BUSINESS,
      loggerName: Config.instance.getConfig(ConnectKey.Gateway),
      loggerLevel: LEVEL.INFO
    });

    await RouterLoader.instance().init();

    KoaImpl.init(Config.instance.getAddress(ConnectKey.Zipkin), {
      serviceName: Config.instance.getConfig(ConnectKey.Gateway),
      port: Config.instance.getPort(ConnectKey.Gateway)
    });

    const ZipkinImpl = new KoaImpl();
    const app = new Koa();
    app.use(ZipkinImpl.createMiddleware());
    app.use(koaBodyParser({ formLimit: '2048kb' })); // post body parser
    app.use(RouterLoader.instance().getRouter().routes());
    app.use(async (ctx, next) => {
      ZipkinImpl.setCustomizedRecords(ZIPKIN_EVENT.SERVER_SEND, {
        httpRequest: JSON.stringify(ctx.request.body),
        httpResponse: JSON.stringify(ctx.body)
      });
      await next();
    });
    this.app = app;

    this._initialized = true;

    return Promise.resolve();
  }

  public start(): void {
    if (!this._initialized) {
      return;
    }

    const host: string = '0.0.0.0';
    const port: number = Config.instance.getPort(ConnectKey.Gateway);
    this.app.listen(port, host, () => {
      debug(`API Gateway Start, Address: ${host}:${port}!`);
    });
  }
}