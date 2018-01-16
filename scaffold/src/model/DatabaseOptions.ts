import { DatabaseOptions } from 'sasdn-database';
import { Config, ConfigConst } from '../lib/Config';
import * as LibPath from 'path';

export namespace DatabaseOption {
  export function getOptions(): DatabaseOptions {
    return {
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
  };
}