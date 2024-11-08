import { BaseTable } from '../BaseTable';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { metal } from './metal';
import { purity } from './purity';

@Entity()
export class price extends BaseTable {

  @Column({ type: "datetime" })
  date_time: Date;

  @ManyToOne(() => metal, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "metal_id" })
  metal: metal;

  @Column({ nullable: true })
  @Index()
  metal_id: string;

  @ManyToOne(() => purity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "purity_id" })
  purity: purity;

  @Column({ nullable: true })
  @Index()
  purity_id: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 ,nullable: true})
  price: number;
}
