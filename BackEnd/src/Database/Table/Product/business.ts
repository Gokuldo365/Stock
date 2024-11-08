import { BaseTable } from '../BaseTable';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { business_category } from './business_category';

@Entity()
export class business extends BaseTable {

  @ManyToOne(() => business_category, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "business_category_id" })
  business_category: business_category;

  @Column({ nullable: false })
  @Index()
  business_category_id: string;

    @Column({ nullable: false })
    business_name: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    mobile_no: string;

    @Column({ nullable: true, type: "longtext" })
    address: string;

    @Column({ nullable: true})
    display_order: number;

}
