import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateStudentProgramDto {
  @IsString()
  studentId: string;

  @IsString()
  programId: string;

  @IsOptional()
  @IsDateString()
  joinDate?: string;
}
