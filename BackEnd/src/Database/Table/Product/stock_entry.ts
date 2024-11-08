import { Entity, Column, JoinColumn, ManyToOne, Index } from "typeorm";
import { BaseTable } from "../BaseTable";
import { StockEntryTypeEnum } from "@Root/Helper/Enum/StockEntryTypeEnum";
import { employee } from "./employee";
import { metal } from "./metal";
import { purity } from "./purity";
import { business } from "./business";

@Entity()
export class stock_entry extends BaseTable {

    @Column({ type: 'enum', enum: StockEntryTypeEnum, nullable: true })
    stock_entry_type: StockEntryTypeEnum;

    @Column({ type: "datetime" })
    stock_entry_date_time: Date;

    @Column({ nullable: true })
    stock_number: string;

    @Column({ nullable: true })
    hand_over_name: string;

    @ManyToOne(() => metal, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'metal_id' })
    metal: metal;

    @Column({ nullable: true })
    @Index()
    metal_id: string;

    @ManyToOne(() => purity, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'purity_id' })
    purity: purity;

    @Column({ nullable: true })
    @Index()
    purity_id: string;

    @Column({ nullable: true, type: "longtext" })
    note: string;

    @ManyToOne(() => business, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "business_id" })
    business: business;

    @Column()
    @Index()
    business_id: string;

    // @ManyToOne(() => business, { onDelete: "RESTRICT" })
    // @JoinColumn({ name: "business_to_id" })
    // BusinessTo: business;

    // @Column()
    // @Index()
    // business_to_id: string;


    // Rate Cut

    @Column({ type: 'text', nullable: true })
    sales_type: string;

    @Column({ type: 'decimal', precision: 18, scale: 3,nullable: true ,default: 0   })
    rate_cut_weight: number;

    @Column({ type: 'decimal', precision: 18, scale: 2,nullable: true ,default: 0   })
    gold_rate: number;

    @Column({ type: 'decimal', precision: 18, scale: 3,nullable: true ,default: 0   })
    rate_per_gram: number;

    @Column({ type: 'decimal', precision: 18, scale: 2,nullable: true ,default: 0   })
    item_amount: number;

    @Column({ type: 'decimal', precision: 18, scale: 2,nullable: true ,default: 0   })
    other_amount: number;

    @Column({ type: 'decimal', precision: 18, scale: 2,nullable: true  ,default: 0  })
    gross_amount: number;

    @Column({ type: 'decimal', precision: 18, scale: 2,nullable: true  ,default: 0  })
    gst: number;

    @Column({ type: 'decimal', precision: 18, scale: 2,nullable: true ,default: 0   })
    gst_amount: number;

    @Column({ type: 'decimal', precision: 18, scale: 2,nullable: true ,default: 0   })
    tcs_tds: number

    @Column({ type: 'decimal', precision: 18, scale: 2,nullable: true ,default: 0   })
    tcs_tds_amount: number;

    @Column({ type: 'decimal', precision: 18, scale: 2,nullable: true ,default: 0   })
    discount: number;

    @Column({ type: 'decimal', precision: 18, scale: 2,nullable: true ,default: 0   })
    total_amount: number;

}
