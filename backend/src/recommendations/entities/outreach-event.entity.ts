
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity({ schema: 'crm', name: 'outreach_events' })
export class OutreachEvent {
  @PrimaryGeneratedColumn({ name: 'outreach_event_id' })
  outreachEventId!: number;

  @Column({ name: 'company_id', type: 'integer' })
  companyId!: number;

  @Column({ name: 'contact_id', type: 'integer', nullable: true })
  contactId!: number | null;

  @Column({ name: 'campaign_id', type: 'integer', nullable: true })
  campaignId!: number | null;

  @Column({ name: 'outreach_type', type: 'varchar', length: 50, nullable: true })
  outreachType!: string | null;

  @Column({ name: 'outreach_status', type: 'varchar', length: 50, nullable: true })
  outreachStatus!: string | null;

  @Column({ name: 'outreach_date', type: 'date', nullable: true })
  outreachDate!: string | null;

  @Column({ name: 'follow_up_date', type: 'date', nullable: true })
  followUpDate!: string | null;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes!: string | null;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date | null;
}
