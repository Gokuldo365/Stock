import { Column, Entity } from "typeorm";
import { BaseTable } from "../BaseTable";

@Entity()
export class mixed_material extends BaseTable {

    @Column({ nullable: true, unique: false })
    name: string;

    @Column({ type: 'decimal', precision: 18, scale: 2 ,nullable: true})
    weight: number;

    @Column({ nullable: true, unique: false,type:'int', default:0 })
    karat: number;

    @Column({ nullable: true, unique: false,type:'int', default:0 })
    cent: number;

    @Column({ nullable: true})
    display_order: number;

}
