import { IsString, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateAdvisorDto {
  @IsString()
  name: string;

  @IsPhoneNumber('IL')
  phone: string;

  @IsEmail()
  email: string;
}
