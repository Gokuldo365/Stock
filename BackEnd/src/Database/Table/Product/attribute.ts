import { Entity, Column } from 'typeorm';
import { BaseTable } from '@Database/Table/BaseTable';

@Entity()
export class attribute extends BaseTable {

  @Column({nullable: true})
  name: string;

  @Column({ nullable: true})
  display_order: number;

}
