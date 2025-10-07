import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async list() {
    return this.prisma.session.findMany({
      include: { program: true },
      orderBy: { date: 'desc' },
    });
  }

  async get(id: string) {
    const session = await this.prisma.session.findUnique({
      where: { id },
      include: { program: true },
    });
    if (!session) throw new NotFoundException(`Session ${id} not found`);
    return session;
  }

  async create(dto: CreateSessionDto) {
    return this.prisma.session.create({
      data: {
        programId: dto.programId,
        date: new Date(dto.date),
        startTime: dto.startTime,
        endTime: dto.endTime,
        location: dto.location,
        isRecurring: dto.isRecurring ?? false,
        recurrencePattern: dto.recurrencePattern,
        notes: dto.notes,
      },
      include: { program: true },
    });
  }

  async update(id: string, dto: UpdateSessionDto) {
    const existing = await this.prisma.session.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Session ${id} not found`);

    return this.prisma.session.update({
      where: { id },
      data: {
        programId: dto.programId,
        date: dto.date ? new Date(dto.date) : undefined,
        startTime: dto.startTime,
        endTime: dto.endTime,
        location: dto.location,
        isRecurring: dto.isRecurring,
        recurrencePattern: dto.recurrencePattern,
        notes: dto.notes,
      },
      include: { program: true },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.session.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Session ${id} not found`);
    await this.prisma.session.delete({ where: { id } });
  }

  async byProgram(programId: string) {
    return this.prisma.session.findMany({
      where: { programId },
      include: { program: true },
      orderBy: { date: 'desc' },
    });
  }

  async byDateRange(startDate: string, endDate: string) {
    return this.prisma.session.findMany({
      where: {
        date: { gte: new Date(startDate), lte: new Date(endDate) },
      },
      include: { program: true },
      orderBy: { date: 'asc' },
    });
  }
}
