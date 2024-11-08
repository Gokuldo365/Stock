import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { BaseTable } from "../BaseTable";
import { business } from "./business";

@Entity()
export class order extends BaseTable {

    @Column({ unique: false, nullable: true })
    order_number: string;

    @Column({ type: 'date' })
    order_date: Date;

    @ManyToOne(() => business, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "business_id" })
    business: business;

    @Column()
    @Index()
    business_id: string;

}
