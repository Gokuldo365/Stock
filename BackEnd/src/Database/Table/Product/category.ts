import { Entity, Column, ManyToOne, JoinColumn, Index, OneToMany } from "typeorm";
import { BaseTable } from "../BaseTable";
import { metal } from "./metal";

@Entity()
export class category extends BaseTable {

    @Column({nullable: true})
    name: string;

    @ManyToOne(() => metal, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "metal_id" })
    metal: metal;

    @Column()
    @Index()
    metal_id: string;

    @Column({ nullable: true, unique: false })
    code: string;

    @Column({ nullable: true})
    parent_category_id: string;

    @Column({ nullable: true, unique: false })
    is_catagory_type: string;

    @Column({ nullable: true})
    is_stock_category : boolean;

    @Column({ nullable: true})
    display_order: number;

}
