import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ProgramType, ProgramStatus } from '@prisma/client';

export class CreateProgramDto {
  @IsString()
  name: string;

  @IsEnum(ProgramType)
  type: ProgramType;

  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(ProgramStatus)
  status?: ProgramStatus;

  @IsOptional()
  @IsUUID()
  currentAdvisorId?: string;
}
