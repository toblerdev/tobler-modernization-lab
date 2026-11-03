
import {
  IsArray,
  IsDateString,
  IsInt,
  IsPositive,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ScoringRuleInputDto } from './scoring-rule-input.dto';
import { CompanyInputDto } from './company-input.dto';

export class CompanyRecommendationRequestDto {
  @IsInt()
  @IsPositive()
  campaignId!: number;

  @IsString()
  targetMarket!: string;

  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  evaluationDate!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScoringRuleInputDto)
  rules!: ScoringRuleInputDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompanyInputDto)
  companies!: CompanyInputDto[];
}
