import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm';

@Entity({
    schema: 'crm',
    name: 'campaigns',
})
export class Campaign {

    @PrimaryGeneratedColumn({ name: 'campaign_id' })
    campaignId!: number;

    @Column({
        name: 'campaign_name',
        type: 'varchar',
        length: 100,
    })
    campaignName!: string;

    @Column({
        name: 'target_market',
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    targetMarket!: string | null;
}