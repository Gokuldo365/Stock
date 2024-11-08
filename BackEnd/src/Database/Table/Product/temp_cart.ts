import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseTable } from '@Database/Table/BaseTable';
import { product } from './product';
import { product_variants } from './product_variant';
import { category } from './category';
import { purity } from './purity';

@Entity()
export class temp_cart extends BaseTable {

    @ManyToOne(() => product, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "product_id" })
    product: product;

    @Column({ nullable: false })
    @Index()
    product_id: string;

    @ManyToOne(() => product_variants, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "product_variants_id" })
    product_variants: product_variants;

    @Column({ nullable: true })
    @Index()
    product_variants_id: string;

    @Column({ unique: false, nullable: true })
    combination: string;

    @ManyToOne(() => category, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "category_id" })
    category: category;

    @Column( {nullable: true})
    @Index()
    category_id: string;

    @ManyToOne(() => purity, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "purity_id" })
    purity: purity;

    @Column( {nullable: true})
    @Index()
    purity_id: string;

    @Column({ type: 'bigint', nullable: true })
    stock: number;
  
    @Column({ type: 'bigint', nullable: false })
    quantity: number;

    @Column({ nullable: true})
    is_cart : boolean;

}