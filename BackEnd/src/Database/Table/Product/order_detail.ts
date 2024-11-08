import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { BaseTable } from "../BaseTable";
import { order } from "./order";
import { product } from "./product";
import { product_variants } from "./product_variant";
import { metal } from "./metal";
import { purity } from "./purity";
import { category } from "./category";

@Entity()
export class order_detail extends BaseTable {

    @ManyToOne(() => order, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "order_id" })
    order: order;

    @Column()
    @Index()
    order_id: string;

    @ManyToOne(() => product, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "product_id" })
    product: product;

    @Column()
    @Index()
    product_id: string;

    @ManyToOne(() => product_variants, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "product_variants_id" })
    product_variants: product_variants;

    @Column( {nullable: true})
    @Index()
    product_variants_id: string;

    @ManyToOne(() => metal, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "metal_id" })
    metal: metal;

    @Column( {nullable: true})
    @Index()
    metal_id: string;

    @ManyToOne(() => purity, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "purity_id" })
    purity: purity;

    @Column( {nullable: true})
    @Index()
    purity_id: string;

    @ManyToOne(() => category, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "category_id" })
    category: category;

    @Column( {nullable: true})
    @Index()
    category_id: string;

    @Column({ type: 'bigint' })
    quantity: number;

    @Column({unique: false, nullable: true})
    combination: string;

}
