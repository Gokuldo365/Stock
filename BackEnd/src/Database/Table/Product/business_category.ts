import { BaseTable } from '../BaseTable';
import { Column, Entity } from 'typeorm';

@Entity()
export class business_category extends BaseTable {

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true})
    display_order: number;

}

