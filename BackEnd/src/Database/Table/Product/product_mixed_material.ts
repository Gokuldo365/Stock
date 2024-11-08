
import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseTable } from '@Database/Table/BaseTable';
import { product } from './product';
import { mixed_material } from './mixed_material';

@Entity()
export class product_mixed_material extends BaseTable {

  @ManyToOne(() => product, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: product;

  @Column({ nullable: true })
  @Index()
  product_id: string;

  @ManyToOne(() => mixed_material, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'mixed_material_id' })
  mixed_material: mixed_material;

  @Column({ nullable: true })
  @Index()
  mixed_material_id: string;

  @Column({ nullable: true})
  display_order: number;

}
