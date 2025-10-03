import {
  IsString,
  IsDateString,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { AttendanceStatus } from '@prisma/client';

export class CreateAttendanceRecordDto {
  @IsUUID()
  studentId: string;

  @IsUUID()
  sessionId: string;

  @IsUUID()
  programId: string;

  @IsDateString()
  date: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
