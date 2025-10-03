import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto) {
    return this.prisma.student.create({
      data: {
        ...createStudentDto,
        ...(createStudentDto.birthDate && {
          birthDate: new Date(createStudentDto.birthDate),
        }),
      },
    });
  }

  async findAll(filters?: { grade?: string; section?: string }) {
    return this.prisma.student.findMany({
      where: {
        ...(filters?.grade && { grade: filters.grade }),
        ...(filters?.section && { section: filters.section }),
      },
      include: {
        programs: {
          include: { program: true },
        },
        attendanceRecords: {
          include: { session: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        programs: {
          include: {
            program: {
              include: {
                currentAdvisor: true,
                sessions: true,
              },
            },
          },
        },
        attendanceRecords: {
          include: {
            session: { include: { program: true } },
          },
          orderBy: { session: { date: 'desc' } },
        },
      },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    await this.findOne(id);

    return this.prisma.student.update({
      where: { id },
      data: {
        ...updateStudentDto,
        ...(updateStudentDto.birthDate && {
          birthDate: new Date(updateStudentDto.birthDate),
        }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.student.delete({ where: { id } });
  }
}
