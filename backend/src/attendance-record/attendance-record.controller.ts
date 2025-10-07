import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { AttendanceRecordsService } from './attendance-record.service';
import { AttendanceRecord } from '@prisma/client';
import { CreateAttendanceRecordDto } from './dto/create-attendance-record.dto';

@Controller('attendance-records')
export class AttendanceRecordsController {
  constructor(private readonly service: AttendanceRecordsService) {}

  @Get()
  async list(): Promise<AttendanceRecord[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<AttendanceRecord> {
    return this.service.findOne(id);
  }

  @Post()
  async create(
    @Body() dto: CreateAttendanceRecordDto,
  ): Promise<AttendanceRecord> {
    return this.service.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<AttendanceRecord>,
  ): Promise<AttendanceRecord> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }

  @Post('bulk')
  async bulkCreate(
    @Body() records: CreateAttendanceRecordDto[],
  ): Promise<AttendanceRecord[]> {
    return this.service.bulkCreate(records);
  }

  @Get('sessions/:sessionId')
  async bySession(
    @Param('sessionId') sessionId: string,
  ): Promise<AttendanceRecord[]> {
    return this.service.findBySession(sessionId);
  }

  @Get('students/:studentId')
  async byStudent(
    @Param('studentId') studentId: string,
  ): Promise<AttendanceRecord[]> {
    return this.service.findByStudent(studentId);
  }

  @Get('programs/:programId')
  async byProgram(
    @Param('programId') programId: string,
  ): Promise<AttendanceRecord[]> {
    return this.service.findByProgram(programId);
  }
}
