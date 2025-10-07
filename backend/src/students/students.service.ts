import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async list() {
    return this.prisma.student.findMany();
  }

  async get(id: string) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student)
      throw new NotFoundException(`Student with ID ${id} not found`);
    return student;
  }

  async create(dto: CreateStudentDto) {
    return this.prisma.student.create({ data: dto });
  }

  async update(id: string, dto: UpdateStudentDto) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student)
      throw new NotFoundException(`Student with ID ${id} not found`);
    return this.prisma.student.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student)
      throw new NotFoundException(`Student with ID ${id} not found`);
    await this.prisma.student.delete({ where: { id } });
    return;
  }

  async byStudentNumber(studentNumber: string) {
    const student = await this.prisma.student.findUnique({
      where: { studentNumber },
    });
    if (!student)
      throw new NotFoundException(
        `Student with number ${studentNumber} not found`,
      );
    return student;
  }
}
