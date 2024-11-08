import { user_role } from '../Admin/user_role';
import { BaseTable } from '../BaseTable';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class employee extends BaseTable {

    @ManyToOne(() => user_role, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'user_role_id' })
    user_role: user_role;

    @Column({ nullable: true })
    @Index()
    user_role_id: string;

    @Column({ nullable: true })
    first_name: string;

    @Column({ nullable: true })
    last_name: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    mobile_number: string;

    @Column({ nullable: true})
    display_order: number;

    @Column({ type: 'mediumtext',nullable: true })
    password: string;
}


