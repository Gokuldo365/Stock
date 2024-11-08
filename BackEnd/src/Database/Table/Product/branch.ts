import { BaseTable } from '../BaseTable';
import { Column, Entity} from 'typeorm';

@Entity()
export class branch extends BaseTable {

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    mobile_no: string;

    @Column({ nullable: true, type: "longtext" })
    address: string;

    @Column({ nullable: true})
    display_order: number;

}
