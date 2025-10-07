import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AttendanceRecord, AttendanceStatus } from '@prisma/client';
import { CreateAttendanceRecordDto } from './dto/create-attendance-record.dto';

@Injectable()
export class AttendanceRecordsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<AttendanceRecord[]> {
    return this.prisma.attendanceRecord.findMany({
      include: { student: true, session: true, program: true },
    });
  }

  async findOne(id: string): Promise<AttendanceRecord> {
    const record = await this.prisma.attendanceRecord.findUnique({
      where: { id },
      include: { student: true, session: true, program: true },
    });
    if (!record)
      throw new NotFoundException(`AttendanceRecord ${id} not found`);
    return record;
  }

  async create(dto: CreateAttendanceRecordDto): Promise<AttendanceRecord> {
    return this.prisma.attendanceRecord.create({
      data: {
        studentId: dto.studentId,
        sessionId: dto.sessionId,
        programId: dto.programId,
        status: dto.status,
        date: dto.date ? new Date(dto.date) : new Date(),
        notes: dto.notes,
      },
      include: { student: true, session: true, program: true },
    });
  }

  async update(
    id: string,
    data: Partial<AttendanceRecord>,
  ): Promise<AttendanceRecord> {
    return this.prisma.attendanceRecord.update({
      where: { id },
      data,
      include: { student: true, session: true, program: true },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.attendanceRecord.delete({ where: { id } });
  }

  async bulkCreate(
    records: CreateAttendanceRecordDto[],
  ): Promise<AttendanceRecord[]> {
    const created = await this.prisma.$transaction(
      records.map((dto) =>
        this.prisma.attendanceRecord.create({
          data: {
            studentId: dto.studentId,
            sessionId: dto.sessionId,
            programId: dto.programId,
            status: dto.status,
            date: dto.date ? new Date(dto.date) : new Date(),
            notes: dto.notes,
          },
          include: { student: true, session: true, program: true },
        }),
      ),
    );
    return created;
  }

  async findBySession(sessionId: string): Promise<AttendanceRecord[]> {
    return this.prisma.attendanceRecord.findMany({
      where: { sessionId },
      include: { student: true, session: true, program: true },
    });
  }

  async findByStudent(studentId: string): Promise<AttendanceRecord[]> {
    return this.prisma.attendanceRecord.findMany({
      where: { studentId },
      include: { student: true, session: true, program: true },
    });
  }

  async findByProgram(programId: string): Promise<AttendanceRecord[]> {
    return this.prisma.attendanceRecord.findMany({
      where: { programId },
      include: { student: true, session: true, program: true },
    });
  }
}
