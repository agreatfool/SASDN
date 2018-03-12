import { BaseOrmEntity, DatabaseFactory, EntityStorage } from 'sasdn-database';
import { Exception } from '../../lib/Exception';
import { TypeOrmImpl } from 'sasdn-zipkin';
import { DeepPartial } from 'typeorm/browser/common/DeepPartial';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { UpdateQueryBuilder } from 'typeorm/query-builder/UpdateQueryBuilder';
import { DeleteQueryBuilder } from 'typeorm/query-builder/DeleteQueryBuilder';

export interface FindOptions<T> {
  where?: DeepPartial<T>;
  whereIn?: { [P in keyof T]?: any[]; };
  whereLike?: { [P in keyof T]?: string; };
  orWhere?: DeepPartial<T>;
  orWhereIn?: { [P in keyof T]?: any[]; };
  orWhereLike?: { [P in keyof T]?: string; };
  order?: { [P in keyof T]?: 'ASC' | 'DESC' | 1 | -1; };
  start?: number;
  limit?: number;
}

/**
 * 如果分表的话，必须生成实例的时候传入 shardKey.
 */
export class BaseModel<E extends BaseOrmEntity> {
  // _Entity 是 SASDN-database 的 Entity 类
  protected _EntityClass: any;
  protected _entityName: string;
  protected _shardKey: string | number;

  protected constructor(entityName: string, ctx?: object, shardKey?: string | number) {
    this._shardKey = shardKey;
    this._entityName = entityName;
    this._EntityClass = DatabaseFactory.instance.getEntity(entityName, shardKey);
    if (ctx) {
      DatabaseFactory.instance.updateZipkin(new TypeOrmImpl(), ctx);
    }
  }

  /**
   *返回值是 Entity 的实例，在分表的情况下不知道 Entity 是什么，所以返回值类型是 any
   * @param {DeepPartial<E extends BaseOrmEntity>} params
   * @returns {Promise<any>}
   */
  public async insert(params: DeepPartial<E>): Promise<any> {
    const qb = this._EntityClass.createQueryBuilder();
    try {
      const result = await qb
        .insert()
        .values(params)
        .execute();
      const entity = this._EntityClass.create(params);
      let primaryKey = this._getPrimaryKey(this._EntityClass);
      // 如果是自增主键，则从 result 中获取主键，并且添加到 entity 中
      if (!this._EntityClass.hasId(entity)) {
        const primaryValue = result.insertId;
        entity[primaryKey] = primaryValue;
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
  public async insertMulti(paramsList: DeepPartial<E>[], shardKeyList?: (string | number)[]): Promise<void> {
    // 不分表的情况
    if (!shardKeyList || shardKeyList.length === 0) {
      await this._insertMulti(this._EntityClass, paramsList);
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
   *返回值是 Entity 的实例或 undefined(找不到的情况下)，在分表的情况下不知道 Entity 是什么，所以返回值类型是 any
   * @param {DeepPartial<E extends BaseOrmEntity>} params
   * @returns {Promise<E extends BaseOrmEntity>}
   */
  public async findOne(params: DeepPartial<E>): Promise<any> {
    let result: any;
    try {
      result = await this._EntityClass.findOne(params);
    } catch (err) {
      throw new Exception(2, `${err.toString()}`);
    }
    return result;
  }

  /**
   * 返回值是 Entity 的实例数组或 空数组(找不到的情况下)，在分表的情况下不知道 Entity 是什么，所以返回值类型是 any[]
   * @param {FindOptions<E extends BaseOrmEntity> | DeepPartial<E extends BaseOrmEntity>} params
   * @param {number[]} tableIndexList
   * @returns {Promise<any[]>}
   */
  public async find(params?: FindOptions<E> | DeepPartial<E>, tableIndexList?: number[]): Promise<any[]> {
    // 有 metaData 说明分表了
    const metaData = EntityStorage.instance.shardTableMetadataStorage[this._EntityClass.name];
    let result: any[] = [];
    if (!metaData) {
      result = await this._find(this._EntityClass, params);
    } else {
      const shardCount = metaData.shardCount;
      if (!tableIndexList || tableIndexList.length === 0) {
        for (let i = 0; i < shardCount; i++) {
          let entityName = `${this._entityName}_${i}`;
          let Entity = DatabaseFactory.instance.getEntity(entityName);
          let tempResult = await this._find(Entity, params);
          result = [...result, ...tempResult];
        }
      } else {
        // 如果 tableIndex 不在 0 - shardCount 之内，抛出错误.
        for (let tableIndex of tableIndexList) {
          if (tableIndex < 0 || tableIndex > shardCount) {
            throw new Exception(6, `${tableIndex} not in [0, ${shardCount}]`);
          }
        }
        for (let tableIndex of [...new Set(tableIndexList)]) {
          let entityName = `${this._entityName}_${tableIndex}`;
          let Entity = DatabaseFactory.instance.getEntity(entityName);
          let tempResult = await this._find(Entity, params);
          result = [...result, ...tempResult];
        }
      }
    }
    return result;
  }

  /**
   * 返回值是 Entity 的实例数组或 空数组(找不到的情况下)，在分表的情况下不知道 Entity 是什么，所以返回值类型是 any[]
   * @param {FindOptions<E extends BaseOrmEntity> | DeepPartial<E extends BaseOrmEntity>} params
   * @param {number[]} tableIndexList
   * @returns {Promise<[any[] , number]>}
   */
  public async findAndCount(params?: FindOptions<E> | DeepPartial<E>, tableIndexList?: number[]): Promise<[any[], number]> {
    const metaData = EntityStorage.instance.shardTableMetadataStorage[this._EntityClass.name];
    let result: [any[], number] = [[], 0];
    if (!metaData) {
      result = await this._findAndCount(this._EntityClass, params);
    } else {
      const shardCount = metaData.shardCount;
      if (!tableIndexList || tableIndexList.length === 0) {
        for (let i = 0; i < shardCount; i++) {
          let entityName = `${this._entityName}_${i}`;
          let Entity = DatabaseFactory.instance.getEntity(entityName);
          let tempResult = await this._findAndCount(Entity, params);
          let entityList = [...result[0], ...tempResult[0]];
          let count = entityList.length;
          result = [entityList, count];
        }
      } else {
        // 如果 tableIndex 不在 0 - shardCount 之内，抛出错误.
        for (let tableIndex of tableIndexList) {
          if (tableIndex < 0 || tableIndex > shardCount) {
            throw new Exception(6, `${tableIndex} not in [0, ${shardCount}]`);
          }
        }
        for (let tableIndex of [...new Set(tableIndexList)]) {
          let entityName = `${this._entityName}_${tableIndex}`;
          let Entity = DatabaseFactory.instance.getEntity(entityName);
          let tempResult = await this._findAndCount(Entity, params);
          let entityList = [...result[0], ...tempResult[0]];
          let count = entityList.length;
          result = [entityList, count];
        }
      }
    }
    return result;
  }

  /**
   * 仅当更新单条记录的时候用这个方法
   * @param {DeepPartial<E extends BaseOrmEntity>} queryParams
   * @param {DeepPartial<E extends BaseOrmEntity>} updateParams
   * @returns {Promise<void>}
   */
  public async update(queryParams: DeepPartial<E>, updateParams: DeepPartial<E>): Promise<void> {
    if (!this._ifUniqueExist(queryParams, this._EntityClass)) {
      throw new Exception(7, `queryParams=${JSON.stringify(queryParams)}`);
    }
    let affectedRows = await this._update(this._EntityClass, queryParams, updateParams);
    if (affectedRows !== 1) {
      throw new Exception(8, `affectedRows=${affectedRows}`);
    }
  }

  /**
   *如果分表，需要传入 tableIndexList(即需要执行批量更新操作的表的 index 列表, 如 [0, 1, 2, 3])
   * @param {DeepPartial<E extends BaseOrmEntity>} queryParams
   * @param {DeepPartial<E extends BaseOrmEntity>} updateParams
   * @param {number[]} tableIndexList
   * @returns {Promise<void>}
   */
  public async updateMulti(queryParams: DeepPartial<E>, updateParams: DeepPartial<E>, tableIndexList?: number[]): Promise<void> {
    const metaData = EntityStorage.instance.shardTableMetadataStorage[this._EntityClass.name];
    // 不分表的情况
    if (!metaData) {
      await this._update(this._EntityClass, queryParams, updateParams);
      // 分表的情况
    } else {
      const shardCount = metaData.shardCount;
      if (!tableIndexList || tableIndexList.length === 0) {
        for (let i = 0; i < shardCount; i++) {
          let entityName = `${this._entityName}_${i}`;
          let Entity = DatabaseFactory.instance.getEntity(entityName);
          await this._update(Entity, queryParams, updateParams);
        }
      } else {
        // 如果 tableIndex 不在 0 - shardCount 之内，抛出错误.
        for (let tableIndex of tableIndexList) {
          if (tableIndex < 0 || tableIndex > shardCount) {
            throw new Exception(6, `${tableIndex} not in [0, ${shardCount}]`);
          }
        }
        for (let tableIndex of [...new Set(tableIndexList)]) {
          let entityName = `${this._entityName}_${tableIndex}`;
          let Entity = DatabaseFactory.instance.getEntity(entityName);
          await this._update(Entity, queryParams, updateParams);
        }
      }
    }
  }

  /**
   * 仅当删除单条记录的时候用这个方法
   * @param {DeepPartial<E extends BaseOrmEntity>} params
   * @returns {Promise<void>}
   */
  public async delete(params: DeepPartial<E>): Promise<void> {
    if (!this._ifUniqueExist(params, this._EntityClass)) {
      throw new Exception(7, `params=${params}`);
    }
    let affectedRows = await this._delete(this._EntityClass, params);
    if (affectedRows !== 1) {
      throw new Exception(8, `affectedRows=${JSON.stringify(params)}`);
    }
  }

  /**
   * 如果分表，需要传入 tableIndexList(即需要执行批量删除操作的表的 index 列表, 如 [0, 1, 2, 3])
   * @param {DeepPartial<E extends BaseOrmEntity>} params
   * @param {string[]} tableIndexList
   * @returns {Promise<void>}
   */
  public async deleteMulti(params: DeepPartial<E>, tableIndexList?: number[]): Promise<void> {
    const metaData = EntityStorage.instance.shardTableMetadataStorage[this._EntityClass.name];
    // 不分表的情况
    if (!metaData) {
      await this._delete(this._EntityClass, params);
      // 分表的情况
    } else {
      let shardCount = metaData.shardCount;
      if (!tableIndexList || tableIndexList.length === 0) {
        for (let i = 0; i < shardCount; i++) {
          let entityName = `${this._entityName}_${i}`;
          let Entity = DatabaseFactory.instance.getEntity(entityName);
          await this._delete(Entity, params);
        }
      } else {
        // 如果 tableIndex 不在 0 - shardCount 之内，抛出错误.
        for (let tableIndex of tableIndexList) {
          if (tableIndex < 0 || tableIndex > shardCount) {
            throw new Exception(6, `${tableIndex} not in [0, ${shardCount}]`);
          }
        }
        for (let tableIndex of [...new Set(tableIndexList)]) {
          let entityName = `${this._entityName}_${tableIndex}`;
          let Entity = DatabaseFactory.instance.getEntity(entityName);
          await this._delete(Entity, params);
        }
      }
    }
  }

  private _genFindTempQuery(Entity: any, params: FindOptions<E> | DeepPartial<E>): SelectQueryBuilder<E> {
    let tempQuery: SelectQueryBuilder<E> = Entity.createQueryBuilder('item');
    if ((params as FindOptions<E>).where) {
      const whereOptions = Object.keys((params as FindOptions<E>).where);
      for (const w of whereOptions) {
        tempQuery = tempQuery.andWhere(`item.${w} = :${w}`, { [w]: (params as FindOptions<E>).where[w] });
      }
    }
    if ((params as FindOptions<E>).whereIn) {
      const whereInOptions = Object.keys((params as FindOptions<E>).whereIn);
      for (const w of whereInOptions) {
        tempQuery = tempQuery.andWhere(`item.${w} IN (:${w})`, { [w]: (params as FindOptions<E>).whereIn[w] });
      }
    }
    if ((params as FindOptions<E>).whereLike) {
      const whereLikeOptions = Object.keys((params as FindOptions<E>).whereLike);
      for (const w of whereLikeOptions) {
        tempQuery = tempQuery.andWhere(`item.${w} LIKE :${w}`, { [w]: `%${(params as FindOptions<E>).whereLike[w]}%` });
      }
    }
    if ((params as FindOptions<E>).orWhere) {
      const whereOptions = Object.keys((params as FindOptions<E>).where);
      for (const w of whereOptions) {
        tempQuery = tempQuery.orWhere(`item.${w} = :${w}`, { [w]: (params as FindOptions<E>).where[w] });
      }
    }
    if ((params as FindOptions<E>).orWhereIn) {
      const whereInOptions = Object.keys((params as FindOptions<E>).whereIn);
      for (const w of whereInOptions) {
        tempQuery = tempQuery.orWhere(`item.${w} IN (:${w})`, { [w]: (params as FindOptions<E>).whereIn[w] });
      }
    }
    if ((params as FindOptions<E>).orWhereLike) {
      const whereLikeOptions = Object.keys((params as FindOptions<E>).whereLike);
      for (const w of whereLikeOptions) {
        tempQuery = tempQuery.orWhere(`item.${w} LIKE :${w}`, { [w]: `%${(params as FindOptions<E>).whereLike[w]}%` });
      }
    }
    if ((params as FindOptions<E>).order) {
      const orderKeys = Object.keys((params as FindOptions<E>).order);
      const options: { [key: string]: any } = {};
      orderKeys.map(k => options[`item.${k}`] = (params as FindOptions<E>).order[k]);
      tempQuery = tempQuery.orderBy(options);
    }
    if ((params as FindOptions<E>).start) {
      tempQuery = tempQuery.offset((params as FindOptions<E>).start);
    }
    if ((params as FindOptions<E>).limit) {
      tempQuery = tempQuery.limit((params as FindOptions<E>).limit);
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

  protected async _update(Entity: any, queryParams: DeepPartial<E>, updateParams: DeepPartial<E>): Promise<number> {
    let tempQuery: UpdateQueryBuilder<E> = Entity.createQueryBuilder()
      .update()
      .set(updateParams);

    for (let key of Object.keys(queryParams)) {
      tempQuery = tempQuery.andWhere(`${key} = :${key}`, { [key]: queryParams[key] });
    }

    let result: any;
    try {
      result = await tempQuery.execute();
    } catch (err) {
      throw new Exception(2, `${err.toString()}`);
    }

    return result.affectedRows as number;
  }

  protected async _delete(Entity: any, params: DeepPartial<E>): Promise<number> {
    let tempQuery: DeleteQueryBuilder<E> = Entity
      .createQueryBuilder()
      .delete();
    const whereOptions = Object.keys(params);
    for (const w of whereOptions) {
      tempQuery = tempQuery.andWhere(`${w} = :${w}`, { [w]: params[w] });
    }

    let result: any;
    try {
      result = await tempQuery.execute();
    } catch (err) {
      throw new Exception(2, `${err.toString()}`);
    }

    return result.affectedRows as number;
  }

  protected async _find(Entity: any, params?: FindOptions<E> | DeepPartial<E>): Promise<any[]> {
    try {
      if (!params) {
        const result = await Entity.find();
        return result;
      }
      if (!((params as FindOptions<E>).start || (params as FindOptions<E>).limit || (params as FindOptions<E>).whereIn
          || (params as FindOptions<E>).whereLike || (params as FindOptions<E>).orWhere || (params as FindOptions<E>).orWhereIn
          || (params as FindOptions<E>).orWhereLike)) {
        const result = await Entity.find(params);
        return result;
      }
      if ((params as FindOptions<E>).whereIn) {
        const whereInKeys = Object.keys((params as FindOptions<E>).whereIn);
        for (const key of whereInKeys) {
          const value = (params as FindOptions<E>).whereIn[key];
          if (value.length === 0) {
            return [];
          }
        }
      }
      if ((params as FindOptions<E>).orWhereIn) {
        const whereInKeys = Object.keys((params as FindOptions<E>).orWhereIn);
        for (const key of whereInKeys) {
          const value = (params as FindOptions<E>).orWhereIn[key];
          if (value.length === 0) {
            delete (params as FindOptions<E>).orWhereIn[key];
          }
        }
      }
      const tempQuery: SelectQueryBuilder<E> = this._genFindTempQuery(Entity, params);
      const result = await tempQuery.getMany();
      return result;
    } catch (err) {
      throw new Exception(2, `${err.toString()}`);
    }
  }

  protected async _findAndCount(Entity: any, params?: FindOptions<E> | DeepPartial<E>): Promise<[any[], number]> {
    try {
      if (!params) {
        const result = await Entity.findAndCount();
        return result;
      }
      if (!((params as FindOptions<E>).start || (params as FindOptions<E>).limit || (params as FindOptions<E>).whereIn
          || (params as FindOptions<E>).whereLike || (params as FindOptions<E>).orWhere || (params as FindOptions<E>).orWhereIn
          || (params as FindOptions<E>).orWhereLike)) {
        const result = await Entity.findAndCount(params);
        return result;
      }
      if ((params as FindOptions<E>).whereIn) {
        const whereInKeys = Object.keys((params as FindOptions<E>).whereIn);
        for (const key of whereInKeys) {
          const value = (params as FindOptions<E>).whereIn[key];
          if (value.length === 0) {
            return [[], 0];
          }
        }
      }
      if ((params as FindOptions<E>).orWhereIn) {
        const whereInKeys = Object.keys((params as FindOptions<E>).orWhereIn);
        for (const key of whereInKeys) {
          const value = (params as FindOptions<E>).orWhereIn[key];
          if (value.length === 0) {
            delete (params as FindOptions<E>).orWhereIn[key];
          }
        }
      }
      const tempQuery = this._genFindTempQuery(Entity, params);
      const result = await tempQuery.getManyAndCount();
      return result;
    } catch (err) {
      throw new Exception(2, `${err.toString()}`);
    }
  }

  protected _isFindOptions(obj: any): obj is FindOptions<any> {
    return obj.where instanceof Object ||
      typeof obj.where === 'string' ||
      obj.order instanceof Object ||
      typeof obj.start === 'number' ||
      typeof obj.limit === 'number' ||
      obj.whereIn instanceof Object ||
      obj.whereLike instanceof Object ||
      obj.orWhere instanceof Object ||
      obj.orWhereIn instanceof Object ||
      obj.orWhereLike instanceof Object;
  }

  protected _getPrimaryKey(Entity: any): string {
    let rep = Entity.getRepository();
    let columns = rep.metadata.ownColumns;
    for (let column of columns) {
      if (column.isPrimary) {
        return column.propertyName;
      }
    }
  }

  protected _ifUniqueExist(params: DeepPartial<E>, Entity: any): boolean {
    let uniquePropertyList: string[] = [];
    let uniqueIndicesList: string[][] = [];

    let rep = Entity.getRepository();
    let columns = rep.metadata.ownColumns;
    let indices = rep.metadata.indices;

    for (let column of columns) {
      if (column.isPrimary || column.isUnique) {
        uniquePropertyList.push(column.propertyName);
      }
    }

    for (let indice of indices) {
      if (indice.isUnique) {
        uniqueIndicesList.push(indice.columns.map(c => c.propertyName));
      }
    }

    let keyList = Object.keys(params);
    for (let property of uniquePropertyList) {
      if (keyList.indexOf(property) !== -1) {
        return true;
      }
    }

    for (let uniqueIndices of uniqueIndicesList) {
      let bool = uniqueIndices.every(property => keyList.indexOf(property) !== -1);
      if (bool) {
        return bool;
      }
    }

    return false;
  }
}
