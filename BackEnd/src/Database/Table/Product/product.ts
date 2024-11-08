import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseTable } from '@Database/Table/BaseTable';
import { category } from './category';
import { productTypeEnum } from '@Root/Helper/Enum/InwardTypeEnum';
import { metal } from './metal';
import { purity } from './purity';
import { unit_of_measurement } from './unit_of_measurement';

@Entity()
export class product extends BaseTable {

  @Column({unique:false})
  name: string;

  @Column({nullable:true})
  product_code: string;

  @ManyToOne(() => category, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: category;

  @Column({ nullable: true })
  @Index()
  category_id: string;

  @ManyToOne(() => metal, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'metal_id' })
  metal: metal;

  @Column({ nullable: true })
  @Index()
  metal_id: string;

  @ManyToOne(() => purity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'purity_id' })
  purity: purity;

  @Column({ nullable: true })
  @Index()
  purity_id: string;

  @Column({ type: 'enum', enum: productTypeEnum, nullable: true })
  product_type : productTypeEnum;

  @Column({ nullable: true })
  display_order: number;

  @Column({ type: "text", nullable: true })
  description: string;

  @ManyToOne(() => unit_of_measurement, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'unit_of_measurement_id' })
  unit_of_measurement: unit_of_measurement;

  @Column({ nullable: true })
  @Index()
  unit_of_measurement_id: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 , nullable: true})
  melting: number;
}
