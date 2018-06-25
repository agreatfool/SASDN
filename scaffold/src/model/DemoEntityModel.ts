import { RpcContext, GatewayContext } from 'sasdn';
import { BaseModel } from './base/BaseModel';
import { DemoEntity } from '../entities/DemoEntity';
import { DeepPartial } from 'typeorm/browser/common/DeepPartial';

export class DemoEntityModel extends BaseModel<DemoEntity> {

  constructor(ctx: RpcContext | GatewayContext, shardKey?: string | number) {
    super(DemoEntity.name, ctx, shardKey);
  }
}
