import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  officeLocation: string;

  @IsString()
  @IsNotEmpty()
  industry: string;
}
