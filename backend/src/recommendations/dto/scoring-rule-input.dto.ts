
import { IsString, IsInt, IsBoolean } from 'class-validator';

export class ScoringRuleInputDto {
  @IsString()
  code: string;

  @IsInt()
  weight: number;

  @IsBoolean()
  enabled: boolean;
}
