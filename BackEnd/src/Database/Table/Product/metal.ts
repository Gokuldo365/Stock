import { BaseTable } from '../BaseTable';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { purity } from './purity';

@Entity()
export class metal extends BaseTable {

    @Column({unique:false})
    name: string;

    @Column({unique:false})
    code: string;

    @Column({ nullable: true})
    display_order: number;

}
