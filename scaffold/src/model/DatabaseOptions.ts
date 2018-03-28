import { DatabaseOptions } from 'sasdn-database';
import { ContainerEnv } from '../constant/const';

const dbOptions = require('../../dboptions.json');

export namespace DatabaseOption {
  export function getOptions(): DatabaseOptions {
    return {
      name: 'mysql',
      type: 'mysql',
      needCheckShard: process.env.NODE_ENV === 'build' || process.env.CONTAINER === ContainerEnv.K8S,
      // 需要先在数据库上生成对应的表，不然会报错
      // 第一次使用可不指定，使用默认进行表分配
      shardingStrategies: dbOptions.shardingStrategies,
      connectionList: dbOptions.connectionList,
    };
  };
}