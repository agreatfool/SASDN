import { BaseOrmEntity } from 'sasdn-database';
import { DeepPartial } from 'typeorm/browser/common/DeepPartial';
import { ObjectType } from 'typeorm';
import { Logger } from './Logger';
import {
  SetRequest,
  GetRequest,
  DelRequest,
} from '../proto/memcached/memcached_pb';
import MSMemcachedClient from '../clients/memcached/MSMemcachedClient';

// 7 days
const DEFAULT_CACHE_EXPIRE = 604800;

export namespace Cache {
  export async function setSingle(entity: BaseOrmEntity, expire?: number): Promise<boolean> {
    expire = expire || DEFAULT_CACHE_EXPIRE;
    if (!entity.hasId()) {
      Logger.instance.warn(`Cache set failed, ${entity.constructor.name} has not given primary key`);
      return false;
    }
    const cacheKey = `${entity.constructor.name}:${(entity.constructor as any).getId(entity)}`;
    const setReq = new SetRequest();
    setReq.setKey(cacheKey);
    setReq.setValue(JSON.stringify(entity));
    setReq.setLifeTime(expire);

    const client = new MSMemcachedClient();
    return (await client.memSet(setReq)).getResult();
  }

  export async function getSingle<T extends BaseOrmEntity>(Entity: ObjectType<T>, options: DeepPartial<T>): Promise<T | boolean> {
    const entity = (Entity as any).create(options);
    if (!entity.hasId()) {
      Logger.instance.warn(`Cache get failed, ${Entity.name} has not given primary key`);
      return false;
    }

    const primaryKey = (Entity as any).getId(entity);
    const cacheKey = `${Entity.name}:${primaryKey}`;
    const getReq = new GetRequest();
    getReq.setKey(cacheKey);

    const client = new MSMemcachedClient();
    const result = (await client.memGet(getReq)).getResult();
    if (result) {
      const parse = JSON.parse(result);
      if (parse) {
        return (Entity as any).create(parse) as T;
      }
    }
    return false;
  }

  export async function delSingle<T extends BaseOrmEntity>(Entity: ObjectType<T>, options: DeepPartial<T>): Promise<boolean> {
    const entity = (Entity as any).create(options);
    if (!entity.hasId()) {
      Logger.instance.warn(`Cache delete failed, ${Entity.name} has not given primary key`);
      return false;
    }

    const primaryKey = (Entity as any).getId(entity);
    const cacheKey = `${Entity.name}:${primaryKey}`;

    const delReq = new DelRequest();
    delReq.setKey(cacheKey);

    const client = new MSMemcachedClient();
    return (await client.memDel(delReq)).getResult();
  }

  export async function setMulti(entities: BaseOrmEntity[], expire?: number): Promise<boolean> {
    expire = expire || DEFAULT_CACHE_EXPIRE;
    // means to package as one cache
    for (const entity of entities) {
      setSingle(entity, expire).catch(_ => _);
    }

    return true;
  }

  export async function setMultiWithKey(entities: BaseOrmEntity[], key: string, expire?: number): Promise<boolean> {
    expire = expire || DEFAULT_CACHE_EXPIRE;
    // means to package as one cache
    const stringify = JSON.stringify(entities);
    const totalLength = key.length + stringify.length;
    // max length 1024
    if (totalLength > (900 * 1024)) {
      Logger.instance.warn(`Cache setMultiWithKey failed, exceed maximum length`);
      return false;
    }

    const setReq = new SetRequest();
    setReq.setKey(key);
    setReq.setValue(stringify);
    setReq.setLifeTime(expire);

    const client = new MSMemcachedClient();
    return (await client.memSet(setReq)).getResult();
  }

  export async function getMutliWithKey<T extends BaseOrmEntity>(Entity: ObjectType<T>, key: string): Promise<T[] | boolean> {
    const getReq = new GetRequest();
    getReq.setKey(key);

    const client = new MSMemcachedClient();
    const memResult = await client.memGet(getReq);
    const foundCache = memResult.getResult();
    if (!foundCache) {
      return false;
    }
    const result: T[] = [];
    const parseList = JSON.parse(foundCache);
    if (parseList) {
      for (const entity of parseList) {
        const constructor = (Entity as any).create(entity);
        result.push(constructor as T);
      }
    }
    return result;
  }
}