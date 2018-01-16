import { BaseOrmEntity, DatabaseFactory } from 'sasdn-database';
import { Exception } from '../../lib/Exception';
import { TypeOrmImpl } from 'sasdn-zipkin';
import { DeepPartial } from 'typeorm/browser/common/DeepPartial';

export interface FindOptions<T> {
  where?: DeepPartial<T>;
  whereIn?: { [P in keyof T]?: any[]; };
  whereLike?: { [P in keyof T]?: string; };
  order?: { [P in keyof T]?: 'ASC' | 'DESC' | 1 | -1; };
  offset?: number;
  limit?: number;
}

/**
 * 如果分表的话，必须生成实例的时候传入 shardKey.
 */
export class BaseModel<E extends BaseOrmEntity> {
  // _Entity 是 SASDN-database 的 Entity 类
  protected _Entity: any;
  protected _entityName: string;
  protected _shardKey: string;

  protected constructor(entityName: string, ctx?: object, shardKey?: string) {
    this._shardKey = shardKey;
    this._entityName = entityName;
    this._Entity = DatabaseFactory.instance.getEntity(entityName, shardKey);
    if (ctx) {
      DatabaseFactory.instance.updateZipkin(new TypeOrmImpl(), ctx);
    }
  }

  /**
   *
   * @param {DeepPartial<E extends BaseOrmEntity>} params
   * @returns {Promise<E extends BaseOrmEntity>}
   */
  public async insert(params: DeepPartial<E>): Promise<E> {
    const qb = this._Entity.createQueryBuilder();
    try {
      const result = await qb
        .insert()
        .values(params)
        .execute();
      const entity = new this._Entity.create(params);
      // 如果是自增主键，则从 result 中获取主键，并且添加到 entity 中
      if (!this._Entity.hasId(entity)) {
        const primaryKey = result.insertId;
        entity.id = primaryKey;
      }
      return entity;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new Exception(3, `params=${JSON.stringify(params)}`);
      } else {
        throw new Exception(2, `${err.toString()}`);
      }
    }
  }

  /**
   * 如果分表，paramsList 必须和 shardKeyList 一一对应
   * @param {DeepPartial<E extends BaseOrmEntity>[]} paramsList
   * @param {string[]} shardKeyList
   * @returns {Promise<void>}
   */
  public async insertMulti(paramsList: DeepPartial<E>[], shardKeyList?: string[]): Promise<void> {
    // 不分表的情况
    if (!shardKeyList || shardKeyList.length === 0) {
      await this._insertMulti(this._Entity, paramsList);
      // 分表的情况
    } else {
      const entityMap = new Map();
      for (let i = 0; i < shardKeyList.length; i++) {
        const shardKey = shardKeyList[i];
        const params = paramsList[i];
        const Entity = DatabaseFactory.instance.getEntity(this._entityName, shardKey);
        if (entityMap.has(Entity)) {
          entityMap.get(Entity).push(params);
        } else {
          entityMap.set(Entity, [params]);
        }
      }
      for (const i of entityMap) {
        await this._insertMulti.apply(this, i);
      }
    }
  }

  /**
   *
   * @param {DeepPartial<E extends BaseOrmEntity>} params
   * @returns {Promise<E extends BaseOrmEntity>}
   */
  public async findOne(params: DeepPartial<E>): Promise<E> {
    let result: E;
    try {
      result = await this._Entity.findOne(params);
    } catch (err) {
      throw new Exception(2, `${err.toString()}`);
    }
    if (!result) {
      throw new Exception(4, `params: ${JSON.stringify(params)}`);
    }
    return result;
  }

  /**
   * 分表的时候不能用这个操作
   * @param {FindOptions<E extends BaseOrmEntity> | DeepPartial<E extends BaseOrmEntity>} params
   * @returns {Promise<E[]>}
   */
  public async find(params?: FindOptions<E> | DeepPartial<E>): Promise<E[]> {
    if (this._shardKey) {
      throw new Exception(5, ``);
    }
    try {
      if (!params) {
        const result = await this._Entity.find();
        return result;
      }
      if (!((<FindOptions<E>>params).offset || (<FindOptions<E>>params).limit || (<FindOptions<E>>params).whereIn || (<FindOptions<E>>params).whereLike)) {
        const result = await this._Entity.find(params);
        return result;
      }
      if ((<FindOptions<E>>params).whereIn) {
        const whereInKeys = Object.keys((<FindOptions<E>>params).whereIn);
        for (const key of whereInKeys) {
          const value = (<FindOptions<E>>params).whereIn[key];
          if (value.length === 0) {
            return [];
          }
        }
      }
      const tempQuery = this._genFindTempQuery(params);
      const result = await tempQuery.getMulti(tempQuery);
      return result;
    } catch (err) {
      throw new Exception(2, `${err.toString()}`);
    }
  }

  /**
   * 分表的时候不能用这个操作
   * @param {FindOptions<E extends BaseOrmEntity> | DeepPartial<E extends BaseOrmEntity>} params
   * @returns {Promise<[E[] , number]>}
   */
  public async findAndCount(params?: FindOptions<E> | DeepPartial<E>): Promise<[E[], number]> {
    if (this._shardKey) {
      throw new Exception(5, ``);
    }
    try {
      if (!params) {
        const result = await this._Entity.find();
        return result;
      }
      if (!((<FindOptions<E>>params).offset || (<FindOptions<E>>params).limit || (<FindOptions<E>>params).whereIn || (<FindOptions<E>>params).whereLike)) {
        const result = await this._Entity.findAndCount(params);
        return result;
      }
      if ((<FindOptions<E>>params).whereIn) {
        const whereInKeys = Object.keys((<FindOptions<E>>params).whereIn);
        for (const key of whereInKeys) {
          const value = (<FindOptions<E>>params).whereIn[key];
          if (value.length === 0) {
            return [[], 0];
          }
        }
      }
      const tempQuery = this._genFindTempQuery(params);
      const result = await tempQuery.printSql().getMultiAndCount(tempQuery);
      return result;
    } catch (err) {
      throw new Exception(2, `${err.toString()}`);
    }
  }

  /**
   * 如果是单表，update 既可以更新单条记录也可以更新多条记录，
   * 如果分表，仅当更新单条记录的时候用这个方法
   * @param {DeepPartial<E extends BaseOrmEntity>} queryParams
   * @param {DeepPartial<E extends BaseOrmEntity>} updateParams
   * @returns {Promise<void>}
   */
  public async update(queryParams: DeepPartial<E>, updateParams: DeepPartial<E>): Promise<void> {
    await this._update(this._Entity, queryParams, updateParams);
  }

  /**
   * 如果分表，需要传入 entityNameList(即需要执行批量更新操作的表的 entityName 列表)
   * @param {DeepPartial<E extends BaseOrmEntity>} queryParams
   * @param {DeepPartial<E extends BaseOrmEntity>} updateParams
   * @param {string[]} entityNameList
   * @returns {Promise<void>}
   */
  public async updateMulti(queryParams: DeepPartial<E>, updateParams: DeepPartial<E>, entityNameList?: string[]): Promise<void> {
    // 不分表的情况
    if (!entityNameList || entityNameList.length === 0) {
      await this._update(this._Entity, queryParams, updateParams);
      // 分表的情况
    } else {
      const EntitySet = new Set();
      for (const entityName of entityNameList) {
        const Entity = DatabaseFactory.instance.getEntity(entityName);
        EntitySet.add(Entity);
      }
      for (const Entity of EntitySet) {
        await this._update(Entity, queryParams, updateParams);
      }
    }
  }

  /**
   * 如果是单表，delete 既可以删除单条记录也可以删除多条记录，
   * 如果分表，仅当删除单条记录的时候用这个方法
   * @param {DeepPartial<E extends BaseOrmEntity>} params
   * @returns {Promise<void>}
   */
  public async delete(params: DeepPartial<E>): Promise<void> {
    await this._delete(this._Entity, params);
  }

  /**
   * 如果分表，需要传入 entityNameList(即需要执行批量删除操作的表的 entityName 列表)
   * @param {DeepPartial<E extends BaseOrmEntity>} params
   * @param {string[]} entityNameList
   * @returns {Promise<void>}
   */
  public async deleteMulti(params: DeepPartial<E>, entityNameList?: string[]): Promise<void> {
    // 不分表的情况
    if (!entityNameList || entityNameList.length === 0) {
      await this._delete(this._Entity, params);
      // 分表的情况
    } else {
      const EntitySet = new Set();
      for (const entityName of entityNameList) {
        const Entity = DatabaseFactory.instance.getEntity(entityName);
        EntitySet.add(Entity);
      }
      for (const Entity of EntitySet) {
        await this._delete(Entity, params);
      }
    }
  }

  private _genFindTempQuery(params: FindOptions<E> | DeepPartial<E>): any {
    let tempQuery: any = this._Entity.createQueryBuilder('item');
    if ((<FindOptions<E>>params).where) {
      const whereOptions = Object.keys((<FindOptions<E>>params).where);
      for (const w of whereOptions) {
        tempQuery = tempQuery.andWhere(`item.${w} = :${w}`, { [w]: (<FindOptions<E>>params).where[w] });
      }
    }
    if ((<FindOptions<E>>params).whereIn) {
      const whereInOptions = Object.keys((<FindOptions<E>>params).whereIn);
      for (const w of whereInOptions) {
        tempQuery = tempQuery.andWhere(`item.${w} IN (:${w})`, { [w]: (<FindOptions<E>>params).whereIn[w] });
      }
    }
    if ((<FindOptions<E>>params).whereLike) {
      const whereLikeOptions = Object.keys((<FindOptions<E>>params).whereLike);
      for (const w of whereLikeOptions) {
        tempQuery = tempQuery.andWhere(`item.${w} LIKE :${w}`, { [w]: `%${(<FindOptions<E>>params).whereLike[w]}%` });
      }
    }
    if ((<FindOptions<E>>params).order) {
      const orderKeys = Object.keys((<FindOptions<E>>params).order);
      const options: object = {};
      orderKeys.map(k => options[`item.${k}`] = (<FindOptions<E>>params).order[k]);
      tempQuery = tempQuery.orderBy(options);
    }
    if ((<FindOptions<E>>params).offset) {
      tempQuery = tempQuery.offset((<FindOptions<E>>params).offset);
    }
    if ((<FindOptions<E>>params).limit) {
      tempQuery = tempQuery.limit((<FindOptions<E>>params).limit);
    }
    return tempQuery;
  }

  private async _insertMulti(Entity: any, paramsList: DeepPartial<E>[]): Promise<void> {
    const qb = Entity.createQueryBuilder();
    try {
      await qb
        .insert()
        .values(paramsList)
        .execute();
      return;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new Exception(3, `paramsList=${JSON.stringify(paramsList)}`);
      } else {
        throw new Exception(2, `${err.toString()}`);
      }
    }
  }

  private async _update(Entity: any, queryParams: DeepPartial<E>, updateParams: DeepPartial<E>): Promise<void> {
    try {
      await Entity.update(queryParams, updateParams);
    } catch (err) {
      throw new Exception(2, `${err.toString()}`);
    }
  }

  private async _delete(Entity: any, params: DeepPartial<E>): Promise<void> {
    let tempQuery: any = Entity
      .createQueryBuilder()
      .delete();
    const whereOptions = Object.keys(params);
    for (const w of whereOptions) {
      tempQuery = tempQuery.andWhere(`${w} = :${w}`, { [w]: params[w] });
    }
    try {
      await tempQuery.execute();
      return;
    } catch (err) {
      throw new Exception(2, `${err.toString()}`);
    }
  }
}
