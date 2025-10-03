import {
  IsString,
  IsDateString,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { RecurrencePattern } from '@prisma/client';

export class CreateSessionDto {
  @IsUUID()
  programId: string;

  @IsDateString()
  date: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsString()
  location: string;

  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @IsOptional()
  @IsEnum(RecurrencePattern)
  recurrencePattern?: RecurrencePattern;

  @IsOptional()
  @IsString()
  notes?: string;
}
