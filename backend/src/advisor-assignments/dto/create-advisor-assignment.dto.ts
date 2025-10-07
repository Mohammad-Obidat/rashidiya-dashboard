import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateAdvisorAssignmentDto {
  @IsString()
  advisorId: string;

  @IsString()
  programId: string;

  @IsOptional()
  @IsDateString()
  assignedDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
