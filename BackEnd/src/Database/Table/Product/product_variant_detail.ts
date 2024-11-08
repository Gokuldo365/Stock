
import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseTable } from '@Database/Table/BaseTable';
import { attribute } from './attribute';
import { attribute_detail } from './attribute_detail';
import { product_variants } from './product_variant';

@Entity()
export class product_variant_detail extends BaseTable {

  @ManyToOne(() => product_variants, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_variants_id' })
  product_variants: product_variants;

  @Column({ nullable: true })
  @Index()
  product_variants_id: string;

  @ManyToOne(() => attribute, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'attribute_id' })
  attribute: attribute;

  @Column({ nullable: true })
  @Index()
  attribute_id: string;

  @ManyToOne(() => attribute_detail, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'attribute_detail_id' })
  attribute_detail: attribute_detail;

  @Column({ nullable: true })
  @Index()
  attribute_detail_id: string;

  @Column({ nullable: true})
  display_order: number;
}
