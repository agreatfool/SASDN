import { RpcApplication } from 'sasdn';
import { GrpcImpl } from 'sasdn-zipkin';
import { Config, ConnectKey } from '../lib/Config';
import { registerServices } from '../services/Register';
import * as LibPath from "path";
import { LEVEL } from 'sasdn-log';
import { Logger, TOPIC } from '../lib/Logger';
import * as LibDotEnv from 'dotenv';
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

    GrpcImpl.init(Config.instance.getAddress(ConnectKey.Zipkin), {
      serviceName: Config.instance.getConfig(ConnectKey.Order),
      port: Config.instance.getPort(ConnectKey.Order)
    });

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
    const port = Config.instance.getPort(ConnectKey.Order);
    this.app.bind(`${host}:${port}`).start();
    debug(`MSDemo start, Address: ${host}:${port}!`);
  }
}