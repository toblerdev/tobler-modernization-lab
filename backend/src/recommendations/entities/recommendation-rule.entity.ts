import {
    Entity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm';

@Entity({
    schema: 'crm',
    name: 'recommendation_rules',
})
export class RecommendationRule {
    @PrimaryGeneratedColumn({
        name: 'rule_id' })
    ruleId!: number;

    @Column({
        name: 'rule_code',
        type: 'varchar',
        length: 50 })
    ruleCode!: string;

    @Column({
        name: 'default_weight',
        type: 'integer' })
    defaultWeight!: number;

    @Column({
        name: 'enabled',
        type: 'boolean',
        default: true })
    enabled!: boolean;

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
