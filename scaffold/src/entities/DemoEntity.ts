import {Column, Entity, PrimaryColumn} from "typeorm";
import { BaseOrmEntity, ShardTable } from 'sasdn-database';

@Entity('demo')
@ShardTable(5)
export class DemoEntity extends BaseOrmEntity {

  @PrimaryColumn('integer')
  id: number;

  @Column({type: 'varchar'})
  text: string;
}