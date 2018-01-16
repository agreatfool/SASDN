import * as Koa from 'koa';
import * as koaBodyParser from 'koa-bodyparser';
import { KoaImpl, ZIPKIN_EVENT } from 'sasdn-zipkin';
import { DatabaseFactory, DatabaseOptions } from 'sasdn-database';
import RouterLoader from '../router/Router';
import { Config, ConfigConst } from '../lib/Config';
import { LEVEL } from 'sasdn-log';
import { Logger, TOPIC } from '../lib/Logger';
import * as LibDotEnv from 'dotenv';
import * as LibPath from "path";

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

    await RouterLoader.instance().init();

    KoaImpl.init(Config.instance.getAddress(ConfigConst.CONNECT_ZIPKIN), {
      serviceName: Config.instance.getConfig(ConfigConst.CONNECT_GATEWAY),
      port: Config.instance.getPort(ConfigConst.CONNECT_GATEWAY)
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
    const port: number = Config.instance.getPort(ConfigConst.CONNECT_GATEWAY);
    this.app.listen(port, host, () => {
      debug(`API Gateway Start, Address: ${host}:${port}!`);
    });
  }
}