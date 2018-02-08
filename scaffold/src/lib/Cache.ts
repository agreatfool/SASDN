import { BaseOrmEntity } from 'sasdn-database';
import { DeepPartial } from 'typeorm/browser/common/DeepPartial';
import { ObjectType } from 'typeorm';
import { Logger } from './Logger';
import {
  AddRequest as MemAddRequest,
  SetRequest as MemSetRequest,
  GetRequest as MemGetRequest,
  DelRequest as MemDelRequest,
  SetMultiRequest as MemSetMultiRequest,
  GetMultiRequest as MemGetMultiRequest,
} from '../proto/memcached/memcached_pb';
import MSMemcachedClient from '../clients/memcached/MSMemcachedClient';

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
    const setReq = new MemSetRequest();
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
    const getReq = new MemGetRequest();
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

    const delReq = new MemDelRequest();
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

  export async function setMultiWithKey(entities: BaseOrmEntity[], key: string, expire: number = DEFAULT_CACHE_EXPIRE): Promise<boolean> {
    // means to package as one cache
    const stringify = JSON.stringify(entities);
    const totalLength = key.length + stringify.length;
    // max length 900K
    if (totalLength > (900 * 1024)) {
      Logger.instance.warn(`Cache setMultiWithKey failed, exceed maximum length`);
      return false;
    }

    const setReq = new MemSetRequest();
    setReq.setKey(key);
    setReq.setValue(stringify);
    setReq.setLifeTime(expire);

    const client = new MSMemcachedClient();
    return (await client.memSet(setReq)).getResult();
  }

  export async function getMutliWithKey<T extends BaseOrmEntity>(Entity: ObjectType<T>, key: string): Promise<T[] | boolean> {
    const getReq = new MemGetRequest();
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

  export async function delMultiWithKey(key: string): Promise<boolean> {
    return await this.memDel(key);
  }

  export async function memSet(setObj: MemcachedObject): Promise<boolean> {
    const { key, value, expire } = setObj;
    const setReq = new MemSetRequest();

    setReq.setKey(key);
    setReq.setValue(value);
    setReq.setLifeTime(expire);

    const client = new MSMemcachedClient();
    return (await client.memSet(setReq)).getResult();
  }

  export async function memGet(key: string): Promise<string> {
    const getReq = new MemGetRequest();

    getReq.setKey(key);

    const client = new MSMemcachedClient();
    return (await client.memGet(getReq)).getResult();
  }

  export async function memSetMulti(setObjs: MemcachedObject[]): Promise<boolean[]> {
    const setMultiReq = new MemSetMultiRequest();
    setObjs.forEach(obj => {
      const { key, value, expire } = obj;
      const setReq = new MemSetRequest();

      setReq.setKey(key);
      setReq.setValue(value);
      setReq.setLifeTime(expire);

      setMultiReq.addMultiSets(setReq);
    });

    const client = new MSMemcachedClient();
    return (await client.memSetMulti(setMultiReq)).getResultList();
  }

  export async function memGetMulti(keys: string[]): Promise<{ [key: string]: string }> {
    const getMultiReq = new MemGetMultiRequest();
    keys.forEach(key => {
      getMultiReq.addKeys(key);
    });

    const client = new MSMemcachedClient();
    const resultList = (await client.memGetMulti(getMultiReq)).getResultList();
    const resultMap: { [key: string]: string } = {};
    resultList.forEach(result => {
      resultMap[result.getKey()] = result.getValue();
    });
    return resultMap;
  }

  export async function memAdd(setObj: MemcachedObject): Promise<boolean> {
    const { key, value, expire } = setObj;
    const addReq = new MemAddRequest();

    addReq.setKey(key);
    addReq.setValue(value);
    addReq.setLifeTime(expire);

    const client = new MSMemcachedClient();
    return (await client.memAdd(addReq)).getResult();
  }

  export async function memDel(key: string): Promise<boolean> {
    const delReq = new MemDelRequest();

    delReq.setKey(key);

    const client = new MSMemcachedClient();
    return (await client.memDel(delReq)).getResult();
  }
}