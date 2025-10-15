import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';

@Injectable()
export class ProgramService {
  constructor(private prisma: PrismaService) {}

  async create(createProgramDto: CreateProgramDto) {
    return this.prisma.program.create({ data: createProgramDto });
  }

  async findAll() {
    return this.prisma.program.findMany({
      include: {
        currentAdvisor: true,
        advisorHistory: true,
        students: true,
        sessions: true,
        attendanceRecords: true,
      },
    });
  }

  async findOne(id: string) {
    const program = await this.prisma.program.findUnique({
      where: { id },
      include: {
        currentAdvisor: true,
        advisorHistory: true,
        students: true,
        sessions: true,
        attendanceRecords: true,
      },
    });
    if (!program) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }
    return program;
  }

  async update(id: string, updateProgramDto: UpdateProgramDto) {
    const program = await this.prisma.program.findUnique({ where: { id } });
    if (!program) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }
    return this.prisma.program.update({
      where: { id },
      data: updateProgramDto,
    });
  }

  async remove(id: string) {
    const program = await this.prisma.program.findUnique({ where: { id } });
    if (!program) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }
    return this.prisma.program.delete({ where: { id } });
  }
}
