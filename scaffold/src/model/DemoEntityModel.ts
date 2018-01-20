import { RpcContext, GatewayContext } from 'sasdn';
import { BaseModel, FindOptions } from './base/BaseModel';
import { DemoEntity } from '../entities/DemoEntity';
import { DeepPartial } from 'typeorm/browser/common/DeepPartial';
import { Cache } from '../lib/Cache';

export class DemoEntityModel extends BaseModel<DemoEntity> {

  constructor(ctx: RpcContext | GatewayContext, shardKey?: string) {
    super(DemoEntity.name, ctx, shardKey);
  }

  public async findOne(params: DeepPartial<DemoEntity>, expire?: number): Promise<DemoEntity> {
    const cache = await Cache.getSingle(DemoEntity, params);
    if (cache && cache instanceof DemoEntity) {
      return cache;
    }

    const dbResult = await super.findOne(params);

    await Cache.setSingle(dbResult, expire);

    return dbResult;
  }

  // key 可以采用 微服名:函数名:EntityName 的方式进行拼接
  public async findWithKey(params: FindOptions<DemoEntity> | DeepPartial<DemoEntity>, key: string): Promise<DemoEntity[]> {
    const cache = await Cache.getMutliWithKey(DemoEntity, key);
    if (cache === false) {
      const dbResult = await super.find(params);

      await Cache.setMultiWithKey(dbResult, key);

      return dbResult;
    } else {
      return cache as DemoEntity[];
    }
  }

  private _isFindOptions(obj: any): obj is FindOptions<any> {
    const possibleOptions: FindOptions<any> = obj;
    return possibleOptions &&
      (
        possibleOptions.where instanceof Object ||
        typeof possibleOptions.where === 'string' ||
        possibleOptions.order instanceof Object ||
        typeof (possibleOptions as FindOptions<any>).offset === 'number' ||
        typeof (possibleOptions as FindOptions<any>).limit === 'number'
      );
  }

  public async find(params: FindOptions<DemoEntity> | DeepPartial<DemoEntity>, expire?: number, needCache: boolean = true): Promise<DemoEntity[]> {
    let deepPartial = params;
    let result;
    if (this._isFindOptions(params) && !<FindOptions<DemoEntity>>params.where) {
      if (!<FindOptions<DemoEntity>>params.where) {
        result = await super.find(params);
      } else {
        deepPartial = <FindOptions<DemoEntity>>params.where;
      }
    }
    const cache = needCache ? await Cache.getSingle(DemoEntity, deepPartial) : needCache;
    if (cache === false) {
      result = await super.find(deepPartial);
    } else {
      return [cache as DemoEntity];
    }

    await Cache.setMulti(result, expire);

    return result;
  }

  public async findAndCount(params: FindOptions<DemoEntity> | DeepPartial<DemoEntity>, expire?: number): Promise<[DemoEntity[], number]> {
    let deepPartial = params;
    let result;
    if (this._isFindOptions(params) && !<FindOptions<DemoEntity>>params.where) {
      if (!<FindOptions<DemoEntity>>params.where) {
        result = await super.findAndCount(params);
      } else {
        deepPartial = <FindOptions<DemoEntity>>params.where;
      }
    }
    const cache = await Cache.getSingle(DemoEntity, deepPartial);
    if (cache === false) {
      result = await super.find(deepPartial);
    } else {
      return [[cache as DemoEntity], 1];
    }

    await Cache.setMulti(result, expire);

    return result;
  }

  public async update(queryParams: DeepPartial<DemoEntity>, updateParams: DeepPartial<DemoEntity>, expire?: number): Promise<void> {
    await super.update(queryParams, updateParams);
    const entity = (DemoEntity as any).create(queryParams);
    if(!entity.hasId()) {
      // 没有主键，批量更新的话在使用缓存的情况下必须在更新完再查询一次，确保缓存更新
      // 强制读取更新
      const findResult = await this.find(queryParams, expire, false);
      for(const delEntity of findResult) {
        await Cache.delSingle(DemoEntity, delEntity);
      }
    } else {
      // 有主键，只会更新一条
      await Cache.delSingle(DemoEntity, entity);
    }
  }

  protected async _delete(Entity: any, params: DeepPartial<DemoEntity>): Promise<void> {
    const entity = (Entity as any).create(params);
    if(!entity.hasId()) {
      // 没有主键，批量删除的话在使用缓存的情况下必须先查询一次
      const findResult = await this.find(params, 0);
      for(const delEntity of findResult) {
        await Cache.delSingle(Entity, delEntity);
      }
    } else {
      // 有主键，只会更新一条
      await Cache.delSingle(Entity, entity);
    }
    await super._delete(Entity, params);
  }
}