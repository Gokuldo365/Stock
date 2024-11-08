import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseTable } from '@Database/Table/BaseTable';
import { attribute } from './attribute';
import { AttributeDetailEnum} from '@Root/Helper/Enum/InwardTypeEnum';

@Entity()
export class attribute_detail extends BaseTable {

  @ManyToOne(() => attribute, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'attribute_id' })
  attribute: attribute;

  @Column({ nullable: true })
  @Index()
  attribute_id: string;

  @Column({nullable: true })
  name: string;

  @Column({ type: 'enum', enum: AttributeDetailEnum, nullable: true })
  att_type : AttributeDetailEnum;

  @Column({nullable: true })
  att_prefix: string;

  @Column({unique:false})
  att_value: string;

  @Column({nullable: true })
  att_suffix: string;

  @Column({ nullable: true})
  display_order: number;

}
