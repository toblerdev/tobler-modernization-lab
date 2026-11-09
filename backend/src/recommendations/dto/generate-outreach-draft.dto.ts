import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class GenerateOutreachDraftDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  companyName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  targetMarket: string;
}