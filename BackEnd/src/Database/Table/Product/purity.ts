import { BaseTable } from '../BaseTable';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { metal } from './metal';

@Entity()
export class purity extends BaseTable {

  @Column({unique:false})
  name: string;

  @Column({unique:false})
  code: string;

  @ManyToOne(() => metal, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "metal_id" })
  metal: metal;

  @Column()
  @Index()
  metal_id: string;

  @Column({ nullable: true})
  display_order: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 ,nullable: true})
  melting: number;
}
