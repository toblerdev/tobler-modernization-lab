
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CompanyInputDto {
  @IsInt()
  @IsPositive()
  companyId!: number;

  @IsString()
  companyName!: string;

  @IsString()
  targetGroup!: string;

  @IsBoolean()
  hasUsableContact!: boolean;

  @IsBoolean()
  hasOutreachHistory!: boolean;

  @IsOptional()
  @IsDateString()
  nextFollowUpDate!: string | null;
}
