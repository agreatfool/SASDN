import { DatabaseOptions } from 'sasdn-database';
import { ContainerEnv } from '../constant/const';
import * as LibPath from 'path';

const dbOptions = require('../../dboptions.json');

export namespace DatabaseOption {

  export function getOptions(): DatabaseOptions {
    dbOptions.connectionList = dbOptions.connectionList.map((value) => {
      value.entities = [LibPath.join(__dirname, '..', 'entities/*.js')];
      return value;
    });
    return {
      name: 'mysql',
      type: 'mysql',
      needCheckShard: process.env.NODE_ENV === 'build' || process.env.CONTAINER === ContainerEnv.K8S,
      // 需要先在数据库上生成对应的表，不然会报错
      // 第一次使用可不指定，使用默认进行表分配
      shardingStrategies: dbOptions.shardingStrategies,
      connectionList: dbOptions.connectionList,
    };
  }
}
