import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OneToMany } from 'typeorm';
import { Contact } from '../contact/entities/contact.entity';

@Entity({ schema: 'crm', name: 'companies' })
export class Company {
  @PrimaryGeneratedColumn({ name: 'company_id' })
  companyId!: number;

  @OneToMany(() => Contact, (contact) => contact.company)
  contacts!: Contact[];

  @Column({ name: 'company_name', type: 'varchar', length: 100 })
  companyName!: string;

  @Column({ name: 'office_location', type: 'varchar', length: 100 })
  officeLocation!: string;

  @Column({ name: 'target_group', type: 'varchar', length: 100 })
  industry!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}