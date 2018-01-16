import { RpcContext, GatewayContext } from 'sasdn';
import { BaseModel } from './base/BaseModel';
import { DemoEntity } from '../entities/DemoEntity';

export class DemoEntityModel extends BaseModel<DemoEntity> {
  constructor(ctx: RpcContext | GatewayContext, shardKey?: string) {
    super(DemoEntity.name, ctx, shardKey);
  }
}