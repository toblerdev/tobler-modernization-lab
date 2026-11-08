
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Company } from '../crm/entities/company.entity';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';
import { OutreachEvent } from './entities/outreach-event.entity';
import { RecommendationRule } from './entities/recommendation-rule.entity';
import { CampaignRuleOverride } from './entities/campaign-rule-override.entity';
import { Campaign } from './entities/campaign.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      Company,
      OutreachEvent,
      RecommendationRule,
      CampaignRuleOverride,
      Campaign,
    ]),
  ],
  providers: [RecommendationsService],
  controllers: [RecommendationsController],
})
export class RecommendationsModule {}
