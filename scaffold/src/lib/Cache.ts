import { BaseOrmEntity } from 'sasdn-database';
import { DeepPartial } from 'typeorm/browser/common/DeepPartial';
import { ObjectType } from 'typeorm';
import { Logger } from './Logger';
import { Memcached, setDefine } from './Memcached';

export interface MemcachedObject {
  key: string;
  value: string;
  expire?: number;
}

// 7 days
const DEFAULT_CACHE_EXPIRE = 604800;

export namespace Cache {
  export async function setSingle(entity: BaseOrmEntity, expire: number = DEFAULT_CACHE_EXPIRE): Promise<boolean> {
    if (!entity.hasId()) {
      Logger.instance.warn(`Cache set failed, ${entity.constructor.name} has not given primary key`);
      return false;
    }
    const cacheKey = `${entity.constructor.name}:${(entity.constructor as any).getId(entity)}`;
    const res = await Memcached.instance.syncSet(cacheKey, JSON.stringify(entity), expire);

    return res.result;
  }

  export async function getSingle<T extends BaseOrmEntity>(Entity: ObjectType<T>, options: DeepPartial<T>): Promise<T | boolean> {
    const entity = (Entity as any).create(options);
    if (!entity.hasId()) {
      Logger.instance.warn(`Cache get failed, ${Entity.name} has not given primary key`);
      return false;
    }

    const primaryKey = (Entity as any).getId(entity);
    const cacheKey = `${Entity.name}:${primaryKey}`;

    const res = await Memcached.instance.syncGet(cacheKey);

    if (res && res.result) {
      const parse = JSON.parse(res.result);
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

    const res = await Memcached.instance.syncDel(cacheKey);

    return res.result;
  }

  export async function setMulti(entities: BaseOrmEntity[], expire?: number): Promise<boolean> {
    expire = expire || DEFAULT_CACHE_EXPIRE;
    // means to package as one cache
    for (const entity of entities) {
      setSingle(entity, expire).catch(_ => _);
    }

    return true;
  }

  export async function setMultiWithKey(entities: BaseOrmEntity[], key: string, expire: number = DEFAULT_CACHE_EXPIRE): Promise<boolean> {
    // means to package as one cache
    const stringify = JSON.stringify(entities);
    const totalLength = key.length + stringify.length;
    // max length 900K
    if (totalLength > (900 * 1024)) {
      Logger.instance.warn(`Cache setMultiWithKey failed, exceed maximum length`);
      return false;
    }

    const res = await Memcached.instance.syncSet(key, stringify, expire);

    return res.result;
  }

  export async function getMutliWithKey<T extends BaseOrmEntity>(Entity: ObjectType<T>, key: string): Promise<T[] | boolean> {
    const res = await Memcached.instance.syncGet(key);

    const foundCache = res.result;
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

  export async function delMultiWithKey(key: string): Promise<boolean> {
    return await this.memDel(key);
  }

  export async function memSet(setObj: MemcachedObject): Promise<boolean> {
    const { key, value, expire } = setObj;

    const res = await Memcached.instance.syncSet(key, value, expire || DEFAULT_CACHE_EXPIRE);
    return res.result;
  }

  export async function memGet(key: string): Promise<string> {
    const res = await Memcached.instance.syncGet(key);

    return res.result;
  }

  export async function memSetMulti(setObjs: MemcachedObject[]): Promise<boolean[]> {
    const objs = setObjs.map(obj => {
      obj.expire = obj.expire || DEFAULT_CACHE_EXPIRE;
      return obj;
    });
    return await Memcached.instance.syncSetMulti(objs as setDefine[]);
  }

  export async function memGetMulti(keys: string[]): Promise<{ [key: string]: string }> {
    const res = await Memcached.instance.syncGetMulti(keys);

    return res.result;
  }

  export async function memAdd(setObj: MemcachedObject): Promise<boolean> {
    const { key, value, expire } = setObj;
    const res = await Memcached.instance.syncAdd(key, value, expire || DEFAULT_CACHE_EXPIRE);

    return res.result;
  }

  export async function memDel(key: string): Promise<boolean> {
    const res = await Memcached.instance.syncDel(key);

    return res.result;
  }
}