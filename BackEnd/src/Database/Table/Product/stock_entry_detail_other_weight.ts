import { Entity, Column, JoinColumn, ManyToOne, Index } from "typeorm";
import { BaseTable } from "../BaseTable";
import { stock_entry_detail } from "./stock_entry_detail";
import { mixed_material } from "./mixed_material";
import { product_mixed_material } from "./product_mixed_material";

@Entity()
export class stock_entry_detail_other_weight extends BaseTable {

    @ManyToOne(() => stock_entry_detail, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "stock_entry_detail_id" })
    stock_entry_detail: stock_entry_detail;

    @Column()
    @Index()
    stock_entry_detail_id: string;

    @ManyToOne(() => product_mixed_material, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "product_mixed_material_id" })
    product_mixed_material: product_mixed_material;

    @Column()
    @Index()
    product_mixed_material_id: string;

    @Column({ type: 'decimal', precision: 18, scale: 3, nullable: true})
    weight: number;

    @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true})
    amount: number;

}
