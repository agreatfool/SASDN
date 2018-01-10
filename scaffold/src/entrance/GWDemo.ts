import * as Koa from 'koa';
import * as koaBodyParser from 'koa-bodyparser';
import { KoaImpl, ZIPKIN_EVENT } from 'sasdn-zipkin';
import RouterLoader from '../router/Router';
import { ConfigHelper, ConfigKey } from '../../helper/ConfigHelper';
import * as LibPath from "path";
import { LEVEL } from 'sasdn-log';
import { LoggerHelper, TOPIC } from '../../helper/LoggerHelper';

const debug = require('debug')('SASDN:GWDemo');

export default class GWDemo {
  private _initialized: boolean;
  public app: Koa;

  constructor() {
    this._initialized = false;
  }

  public async init(isDev: boolean = false): Promise<any> {
    let configPath: string;
    if (isDev) {
      configPath = LibPath.join(__dirname, '..', '..', 'config.dev.json');
    } else {
      configPath = LibPath.join(__dirname, '..', '..', 'config.json');
    }

    await ConfigHelper.instance.init(configPath);

    await LoggerHelper.instance.initalize({
      kafkaTopic: TOPIC.BUSINESS,
      loggerName: ConfigHelper.instance.getConfig(ConfigKey.Gateway),
      loggerLevel: LEVEL.INFO
    });

    await RouterLoader.instance().init();

    KoaImpl.init(ConfigHelper.instance.getAddress(ConfigKey.Zipkin), {
      serviceName: ConfigHelper.instance.getConfig(ConfigKey.Gateway),
      port: ConfigHelper.instance.getPort(ConfigKey.Gateway)
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
    const port: number = ConfigHelper.instance.getPort(ConfigKey.Gateway);
    this.app.listen(port, host, () => {
      debug(`API Gateway Start, Address: ${host}:${port}!`);
    });
  }
}