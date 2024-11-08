import { Column, Entity } from "typeorm";
import { BaseTable } from "../BaseTable";

@Entity()
export class unit_of_measurement extends BaseTable {

    @Column({ nullable: true, unique: false })
    name: string;

    @Column({ nullable: true })
    code: string;

    @Column({ nullable: true })
    quantity: string;

    @Column({ nullable: true})
    display_order: number;

}
