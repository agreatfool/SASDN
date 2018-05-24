import { RpcApplication } from 'sasdn';
import { GrpcImpl } from 'sasdn-zipkin';
import { DatabaseFactory, DatabaseOptions } from 'sasdn-database';
import { Config, ConfigConst } from '../lib/Config';
import { registerServices } from '../services/Register';
import { LEVEL } from 'sasdn-log';
import { Logger, TOPIC } from '../lib/Logger';
import * as LibDotEnv from 'dotenv';
import { DatabaseOption } from '../model/DatabaseOptions';
import { ContainerEnv } from '../constant/const';
import { Memcached } from '../lib/Memcached';
import * as LibPath from 'path';
import { ModuleName } from '../constant/exception';

export default class MSOrder {
  private _initialized: boolean;
  public app: RpcApplication;

  constructor() {
    this._initialized = false;
  }

  public async init(container: string = ContainerEnv.PM2): Promise<any> {
    if (container === ContainerEnv.PM2) {
      const loadEnv = LibDotEnv.config();
      if (loadEnv.error) {
        return Promise.reject(loadEnv.error);
      }
    }

    await Config.instance.initalize();
    await Logger.instance.initalize({
      loggerName: Config.instance.getConfig(ConfigConst.CONNECT_GATEWAY),
      loggerLevel: LEVEL.INFO,
    });

    await Memcached.instance.initalize();

    GrpcImpl.init({
      transType: 'FILE',
      filePath: LibPath.join(process.env.ZIPKIN_LOG_FILE_PATH, `${ModuleName}.log`),
      serviceName: Config.instance.getConfig(ConfigConst.CONNECT_ORDER),
      port: Config.instance.getPort(ConfigConst.CONNECT_ORDER),
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
    Logger.instance.info(`MSDemo start, Address: ${host}:${port}!`);
  }
}