
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class GenerateRecommendationsDto {
  @IsInt()
  @Min(1)
  campaignId!: number;

  @IsString()
  @IsNotEmpty()
  targetMarket!: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'evaluationDate must use YYYY-MM-DD format',
  })
  evaluationDate!: string;
}
