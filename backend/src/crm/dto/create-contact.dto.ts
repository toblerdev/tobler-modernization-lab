import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateContactDto {
 @IsInt()
 companyId!: number;

 @IsString()
 phone!: string;

 @IsString()
 @IsNotEmpty()
 contactName!: string;

 @IsEmail()
 email!: string;

}
