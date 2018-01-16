import { RpcApplication } from 'sasdn';
import { GrpcImpl } from 'sasdn-zipkin';
import { DatabaseFactory, DatabaseOptions } from 'sasdn-database';
import { Config, ConfigConst } from '../lib/Config';
import { registerServices } from '../services/Register';
import { LEVEL } from 'sasdn-log';
import { Logger, TOPIC } from '../lib/Logger';
import * as LibDotEnv from 'dotenv';
import * as LibPath from "path";

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

    const databaseOptions: DatabaseOptions = {
      name: 'mysql',
      type: 'mysql',
      // 需要先在数据库上生成对应的表，不然会报错
      // 第一次使用可不指定，使用默认进行表分配
      shardingStrategies: [
        {
          connctionName: 'demo_0',
          entities: [
            'DemoEntity_0',
            'DemoEntity_3',
          ],
        },
        {
          connctionName: 'demo_1',
          entities: [
            'DemoEntity_1',
            'DemoEntity_4',
          ],
        },
        {
          connctionName: 'demo_2',
          entities: [
            'DemoEntity_2',
          ],
        },
      ],
      connectionList: [
        {
          name: 'demo_0',
          type: 'mysql',
          host: Config.instance.getHost(ConfigConst.CONNECT_DEMO_MYSQL),
          port: Config.instance.getPort(ConfigConst.CONNECT_DEMO_MYSQL),
          username: Config.instance.getConfig(ConfigConst.DATABASE_USER),
          password: Config.instance.getConfig(ConfigConst.DATABASE_PASSWORD),
          database: Config.instance.getConfig(ConfigConst.DATABASE0),
          synchronize: false,
          // 默认采用*.js进行泛指
          entities: [LibPath.join(__dirname, '..', 'entities/*.js')],
        },
        {
          name: 'demo_1',
          type: 'mysql',
          host: Config.instance.getHost(ConfigConst.CONNECT_DEMO_MYSQL),
          port: Config.instance.getPort(ConfigConst.CONNECT_DEMO_MYSQL),
          username: Config.instance.getConfig(ConfigConst.DATABASE_USER),
          password: Config.instance.getConfig(ConfigConst.DATABASE_PASSWORD),
          database: Config.instance.getConfig(ConfigConst.DATABASE1),
          synchronize: false,
          entities: [LibPath.join(__dirname, '..', 'entities/*.js')],
        },
        {
          name: 'demo_2',
          type: 'mysql',
          host: Config.instance.getHost(ConfigConst.CONNECT_DEMO_MYSQL),
          port: Config.instance.getPort(ConfigConst.CONNECT_DEMO_MYSQL),
          username: Config.instance.getConfig(ConfigConst.DATABASE_USER),
          password: Config.instance.getConfig(ConfigConst.DATABASE_PASSWORD),
          database: Config.instance.getConfig(ConfigConst.DATABASE2),
          synchronize: false,
          entities: [LibPath.join(__dirname, '..', 'entities/*.js')],
        },
      ],
    };

    await DatabaseFactory.instance.initialize(databaseOptions);

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