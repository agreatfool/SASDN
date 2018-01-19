import { BaseOrmEntity } from 'sasdn-database';
import { DeepPartial } from 'typeorm/browser/common/DeepPartial';
import { ObjectType } from 'typeorm';
export namespace Cache {
  export async function cacheSet<T extends BaseOrmEntity>(entity: BaseOrmEntity, expire?: number): Promise<boolean> {
    expire = expire || 25200;
    if(!entity.hasId()) {
      return false;
    }
    const cacheKey = `${entity.constructor.name}_${(entity.constructor as any).getId(entity)}`;
    // todo store cache by cacheKey
    console.log('cacheKey = ', cacheKey);
    return true;
  }

  export async function cacheGet<T extends BaseOrmEntity>(Entity: ObjectType<T>, options: DeepPartial<T>): Promise<T | undefined> {
    const entity = (Entity as any).create(options);
    if(!entity.hasId()) {
      console.log('need primary key');
    }

    const primaryKey = (Entity as any).getId(entity);
    const cacheKey = `${Entity.name}_${primaryKey}`;
    // todo find cache by cacheKey
    return undefined;
  }

  export async function cacheDel<T extends BaseOrmEntity>(Entity: ObjectType<T>, options: DeepPartial<T>): Promise<boolean> {
    const entity = (Entity as any).create(options);
    if(!entity.hasId()) {
      return false;
    }

    const primaryKey = (Entity as any).getId(entity);
    const cacheKey = `${Entity.name}_${primaryKey}`;

    // todo delete cache by cacheKey
    return true;
  }

  export async function cacheSetMulti(entities: BaseOrmEntity[], key?: string, expire?: number): Promise<boolean> {
    expire = expire || 25200;
    // means to package as one cache
    if(key) {
      const stringify = JSON.stringify(entities);
      const totalLength = key.length + stringify.length;
      // max length 1024
      if(totalLength > 900) {
        return false;
      }
      // todo delete cache by key
    } else {
      for(const entity of entities) {
        cacheSet(entity, expire);
      }
    }

    return true;
  }

  export async function cacheGetMutli<T extends BaseOrmEntity>(key: string, Entity: ObjectType<T>): Promise<T[]> {
    // todo found cache from memcached
    const foundCache = 'xxx';
    const result: T[] = [];
    const parseList = JSON.parse(foundCache);
    if(parseList) {
      for(const entity of parseList) {
        const constructor = (Entity as any).create(entity);
        parseList.push(constructor as T);
      }
    }
    return result;
  }
}