import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { BaseTable } from "../BaseTable";
import { product } from "./product";

@Entity()
export class product_image extends BaseTable {

    @ManyToOne(() => product, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "product_id" })
    product: product;

    @Column()
    @Index()
    product_id: string;

    @Column({ nullable: true })
    uploaded_image: string;

    @Column({ nullable: true })
    file_name: string;

    @Column({ nullable: true})
    display_order: number;

}
