import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentProgramDto } from './dto/create-student-program.dto';
import { UpdateStudentProgramDto } from './dto/update-student-program.dto';

@Injectable()
export class StudentProgramsService {
  constructor(private prisma: PrismaService) {}

  async list() {
    return this.prisma.studentProgram.findMany({
      include: { student: true, program: true },
    });
  }

  async get(id: string) {
    const record = await this.prisma.studentProgram.findUnique({
      where: { id },
      include: { student: true, program: true },
    });
    if (!record)
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    return record;
  }

  async create(dto: CreateStudentProgramDto) {
    return this.prisma.studentProgram.create({
      data: {
        studentId: dto.studentId,
        programId: dto.programId,
        joinDate: dto.joinDate ? new Date(dto.joinDate) : undefined,
      },
      include: { student: true, program: true },
    });
  }

  async update(id: string, dto: UpdateStudentProgramDto) {
    const existing = await this.prisma.studentProgram.findUnique({
      where: { id },
    });
    if (!existing)
      throw new NotFoundException(`Enrollment with ID ${id} not found`);

    return this.prisma.studentProgram.update({
      where: { id },
      data: {
        studentId: dto.studentId,
        programId: dto.programId,
        joinDate: dto.joinDate ? new Date(dto.joinDate) : undefined,
      },
      include: { student: true, program: true },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.studentProgram.findUnique({
      where: { id },
    });
    if (!existing)
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    await this.prisma.studentProgram.delete({ where: { id } });
    return;
  }

  async byProgram(programId: string) {
    return this.prisma.studentProgram.findMany({
      where: { programId },
      include: { student: true, program: true },
    });
  }

  async byStudent(studentId: string) {
    return this.prisma.studentProgram.findMany({
      where: { studentId },
      include: { student: true, program: true },
    });
  }
}
