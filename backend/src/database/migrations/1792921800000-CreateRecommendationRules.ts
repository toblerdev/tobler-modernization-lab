import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRecommendationRules1792921800000
  implements MigrationInterface
{
  name = 'CreateRecommendationRules1792921800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE crm.recommendation_rules (
        rule_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        rule_code VARCHAR(50) NOT NULL UNIQUE,
        description VARCHAR(255) NOT NULL,
        default_weight INTEGER NOT NULL
          CHECK (default_weight >= 0),
        enabled BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE TABLE crm.campaign_rule_overrides (
        override_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        campaign_id INTEGER NOT NULL,
        rule_id INTEGER NOT NULL,
        weight_override INTEGER
          CHECK (weight_override >= 0),
        enabled_override BOOLEAN,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_override_campaign
          FOREIGN KEY (campaign_id)
          REFERENCES crm.campaigns(campaign_id)
          ON DELETE CASCADE,

        CONSTRAINT fk_override_rule
          FOREIGN KEY (rule_id)
          REFERENCES crm.recommendation_rules(rule_id)
          ON DELETE CASCADE,

        CONSTRAINT uq_campaign_rule
          UNIQUE (campaign_id, rule_id),

        CONSTRAINT chk_override_present
          CHECK (
            weight_override IS NOT NULL
            OR enabled_override IS NOT NULL
          )
      )
    `);

    await queryRunner.query(`
      INSERT INTO crm.recommendation_rules
        (rule_code, description, default_weight, enabled)
      VALUES
        ('TARGET_MARKET_MATCH', 'Company matches campaign target market', 25, TRUE),
        ('CONTACT_AVAILABLE', 'Company has usable contact information', 15, TRUE),
        ('NEVER_CONTACTED', 'Company has no previous outreach', 20, TRUE),
        ('FOLLOWUP_OVERDUE', 'Company has an overdue follow-up', 25, TRUE),
        ('FOLLOWUP_DUE_TODAY', 'Company has a follow-up due today', 15, TRUE)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE crm.campaign_rule_overrides
    `);

    await queryRunner.query(`
      DROP TABLE crm.recommendation_rules
    `);
  }
}