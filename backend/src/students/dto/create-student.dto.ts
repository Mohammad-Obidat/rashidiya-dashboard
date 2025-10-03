import { Gender } from '@prisma/client';
import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  name: string;

  @IsString()
  studentNumber: string;

  @IsString()
  grade: string;

  @IsString()
  section: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;
}

export class UpdateStudentDto extends CreateStudentDto {}
