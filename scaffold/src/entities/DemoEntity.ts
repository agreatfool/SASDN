import {Column, Entity, PrimaryColumn} from "typeorm";
import { BaseOrmEntity, ShardTable } from 'sasdn-database';

@Entity('demo')
@ShardTable(parseInt(process.env.DEMO_ENTITY_SHARD_COUNT))
export class DemoEntity extends BaseOrmEntity {

  @PrimaryColumn('integer')
  id: number;

  @Column({type: 'varchar'})
  text: string;
}
