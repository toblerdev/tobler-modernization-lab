import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
}   from 'typeorm';
import { Company } from '../../entities/company.entity';

@Entity({ schema: 'crm', name: 'contacts' })
export class Contact {
    @PrimaryGeneratedColumn({ name: 'contact_id' })
    contactId!: number;

    @Column({ name: 'contact_name' })
    contactName!: string;
    
    @Column({ name: 'email' })
    email!: string;

    @Column({ name: 'phone_number' })
    phone!: string;

    @Column({ name: 'role_title', type: 'varchar', length: 100, nullable: true })
    role!: string | null; 
    
    @ManyToOne(() => Company, (company) => company.contacts)
    @JoinColumn({ name: 'company_id' })
    company!: Company;
}