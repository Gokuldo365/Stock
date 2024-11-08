import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseTable } from '@Database/Table/BaseTable';
import { product } from './product';

@Entity()
export class product_variants extends BaseTable {

  @ManyToOne(() => product, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: product;

  @Column({ nullable: true })
  @Index()
  product_id: string;

  @Column({unique: false, nullable: true})
  combination: string;

  @Column({ nullable: true })
  display_order: number;

}
