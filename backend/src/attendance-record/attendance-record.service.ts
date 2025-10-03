import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendanceRecordDto } from './dto/create-attendance-record.dto';
import { UpdateAttendanceRecordDto } from './dto/update-attendance-record.dto';

@Injectable()
export class AttendanceRecordService {
  constructor(private prisma: PrismaService) {}

  async create(createAttendanceRecordDto: CreateAttendanceRecordDto) {
    return this.prisma.attendanceRecord.create({
      data: createAttendanceRecordDto,
    });
  }

  async findAll() {
    return this.prisma.attendanceRecord.findMany({
      include: { student: true, session: true, program: true },
    });
  }

  async findOne(id: string) {
    const attendanceRecord = await this.prisma.attendanceRecord.findUnique({
      where: { id },
      include: { student: true, session: true, program: true },
    });
    if (!attendanceRecord) {
      throw new NotFoundException(`AttendanceRecord with ID ${id} not found`);
    }
    return attendanceRecord;
  }

  async update(
    id: string,
    updateAttendanceRecordDto: UpdateAttendanceRecordDto,
  ) {
    const attendanceRecord = await this.prisma.attendanceRecord.findUnique({
      where: { id },
    });
    if (!attendanceRecord) {
      throw new NotFoundException(`AttendanceRecord with ID ${id} not found`);
    }
    return this.prisma.attendanceRecord.update({
      where: { id },
      data: updateAttendanceRecordDto,
    });
  }

  async remove(id: string) {
    const attendanceRecord = await this.prisma.attendanceRecord.findUnique({
      where: { id },
    });
    if (!attendanceRecord) {
      throw new NotFoundException(`AttendanceRecord with ID ${id} not found`);
    }
    return this.prisma.attendanceRecord.delete({ where: { id } });
  }
}
