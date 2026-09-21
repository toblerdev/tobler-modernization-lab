import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
 @IsInt()
 companyId!: number;

 @IsString()
 @IsNotEmpty()
 contactName!: string;

 @IsEmail()
 email!: string;

 @IsString()
 phone!: string;

 @IsOptional()
 @IsString()
 role?: string;
}

