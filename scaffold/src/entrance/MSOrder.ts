import { RpcApplication } from 'sasdn';
import { GrpcImpl } from 'sasdn-zipkin';
import { ConfigHelper, ConfigKey } from '../../helper/ConfigHelper';
import { registerServices } from '../services/Register';
import * as LibPath from "path";
import { LEVEL } from 'sasdn-log';
import { LoggerHelper, TOPIC } from '../../helper/LoggerHelper';

const debug = require('debug')('SASDN:MSDemo');

export default class MSOrder {
  private _initialized: boolean;
  public app: RpcApplication;

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

    GrpcImpl.init(ConfigHelper.instance.getAddress(ConfigKey.Zipkin), {
      serviceName: ConfigHelper.instance.getConfig(ConfigKey.Order),
      port: ConfigHelper.instance.getPort(ConfigKey.Order)
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
    const port = ConfigHelper.instance.getPort(ConfigKey.Order);
    this.app.bind(`${host}:${port}`).start();
    debug(`MSDemo start, Address: ${host}:${port}!`);
  }
}