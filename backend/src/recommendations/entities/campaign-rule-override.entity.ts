
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity({
  schema: 'crm',
  name: 'campaign_rule_overrides',
})
export class CampaignRuleOverride {
  @PrimaryGeneratedColumn({ name: 'override_id' })
  overrideId!: number;

  @Column({ name: 'campaign_id', type: 'integer' })
  campaignId!: number;

  @Column({ name: 'rule_id', type: 'integer' })
  ruleId!: number;

  @Column({
    name: 'weight_override',
    type: 'integer',
    nullable: true,
  })
  weightOverride!: number | null;

  @Column({
    name: 'enabled_override',
    type: 'boolean',
    nullable: true,
  })
  enabledOverride!: boolean | null;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;
}
