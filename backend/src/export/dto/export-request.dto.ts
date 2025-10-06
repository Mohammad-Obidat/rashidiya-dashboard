import { IsEnum, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export enum ExportFormat {
  XLSX = 'xlsx',
  PDF = 'pdf',
}

export enum DatasetType {
  STUDENTS = 'students',
  ATTENDANCE = 'attendance',
  PROGRAMS = 'programs',
  ADVISORS = 'advisors',
  SESSIONS = 'sessions',
}

export class ExportRequestDto {
  @IsEnum(ExportFormat)
  @IsNotEmpty()
  format: ExportFormat;

  @IsEnum(DatasetType)
  @IsNotEmpty()
  datasetType: DatasetType;

  @IsOptional()
  @IsObject()
  filters?: Record<string, any>;
}
