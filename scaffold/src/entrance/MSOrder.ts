import { RpcApplication } from 'sasdn';
import { GrpcImpl } from 'sasdn-zipkin';
import { DatabaseFactory, DatabaseOptions } from 'sasdn-database';
import { Config, ConfigConst } from '../lib/Config';
import { registerServices } from '../services/Register';
import { LEVEL } from 'sasdn-log';
import { Logger, TOPIC } from '../lib/Logger';
import * as LibDotEnv from 'dotenv';
import { DatabaseOption } from '../model/DatabaseOptions';

const debug = require('debug')('SASDN:MSDemo');

export default class MSOrder {
  private _initialized: boolean;
  public app: RpcApplication;

  constructor() {
    this._initialized = false;
  }

  public async init(isDev: boolean = false): Promise<any> {
    if (isDev) {
      const loadEnv = LibDotEnv.config();
      if (loadEnv.error) {
        return Promise.reject(loadEnv.error);
      }
    }

    await Config.instance.initalize();
    await Logger.instance.initalize({
      kafkaTopic: TOPIC.BUSINESS,
      loggerName: Config.instance.getConfig(ConfigConst.CONNECT_GATEWAY),
      loggerLevel: LEVEL.INFO
    });

    GrpcImpl.init(Config.instance.getAddress(ConfigConst.CONNECT_ZIPKIN), {
      serviceName: Config.instance.getConfig(ConfigConst.CONNECT_ORDER),
      port: Config.instance.getPort(ConfigConst.CONNECT_ORDER)
    });

    await DatabaseFactory.instance.initialize(DatabaseOption.getOptions());

    const app = new RpcApplication();
    app.use(new GrpcImpl().createMiddleware());
    this.app = app;

    this._initialized = true;

    return Promise.resolve();
  }

  public start(): void {
    if (!this._initialized) {
      return;
    }

    registerServices(this.app);

    const host = '0.0.0.0';
    const port = Config.instance.getPort(ConfigConst.CONNECT_ORDER);
    this.app.bind(`${host}:${port}`).start();
    debug(`MSDemo start, Address: ${host}:${port}!`);
  }
}