import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { BaseTable } from "../BaseTable";
import { stock_entry } from "./stock_entry";
import { product } from "./product";
import { product_variants } from "./product_variant";

@Entity()
export class stock_entry_detail extends BaseTable {

    @ManyToOne(() => stock_entry, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "stock_entry_id" })
    stock_entry: stock_entry;

    @Column({ nullable: true})
    @Index()
    stock_entry_id: string;

    @ManyToOne(() => product, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "product_id" })
    product: product;

    @Column({ nullable: true})
    @Index()
    product_id: string;

    @ManyToOne(() => product_variants, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "product_variants_id" })
    product_variants: product_variants;

    @Column({ nullable: true})
    @Index()
    product_variants_id: string;

    @Column({ nullable: true})
    combination: string;

    @Column({ nullable: true})
    stock_qty: number;

    @Column({ type: 'decimal', precision: 18, scale: 3,nullable: true ,default: 0 })
    gross_weight: number;

    @Column({ type: 'decimal', precision: 18, scale: 3,nullable: true ,default: 0  })
    other_weight: number;

    @Column({ type: 'decimal', precision: 18, scale: 3, nullable: true ,default: 0  })
    net_weight: number;

    @Column({ type: 'decimal', precision: 18, scale: 2,nullable: true ,default: 0   })
    other_charges: number;

    @Column({ type: 'decimal', precision: 18, scale: 2,nullable: true ,default: 0   })
    melting: number;

    @Column({ type: 'decimal', precision: 18, scale: 3,nullable: true ,default: 0   })
    pure_weight: number;

    @Column({ type: 'decimal', precision: 18, scale: 2,nullable: true ,default: 0  })
    wastage: number;

    @Column({ type: 'decimal', precision: 18, scale: 3,nullable: true ,default: 0   })
    wastage_weight: number;

    @Column({ type: 'decimal', precision: 18, scale: 3,nullable: true ,default: 0   })
    fine_weight: number;

    @Column({ type: 'decimal', precision: 18, scale: 2,nullable: true ,default: 0   })
    mc_amount: number;

    @Column({ type: 'decimal', precision: 18, scale: 2,nullable: true ,default: 0   })
    lab_rate: number;

    @Column({ type: 'decimal', precision: 18, scale: 2,nullable: true ,default: 0   })
    amount: number;

}
