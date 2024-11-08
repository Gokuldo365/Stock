import { Entity, Column, JoinColumn, ManyToOne, Index } from "typeorm";
import { BaseTable } from "../BaseTable";
import { stock_entry_detail } from "./stock_entry_detail";
import { mixed_material } from "./mixed_material";
import { StockEntryTypeEnum } from "@Root/Helper/Enum/StockEntryTypeEnum";

@Entity()
export class stock_entry_history extends BaseTable {

    @ManyToOne(() => stock_entry_detail, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "stock_entry_detail_id" })
    stock_entry_detail: stock_entry_detail;

    @Column()
    @Index()
    stock_entry_detail_id: string;

    @Column({ nullable: true})
    modified_by: string;

    @Column({ type: "datetime" , nullable: true })
    modified_date: Date;

    @Column({ nullable: true})
    notes: string;

}
