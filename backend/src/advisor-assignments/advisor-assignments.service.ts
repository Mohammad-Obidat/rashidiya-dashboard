import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdvisorAssignmentDto } from './dto/create-advisor-assignment.dto';
import { UpdateAdvisorAssignmentDto } from './dto/update-advisor-assignment.dto';
import { AdvisorAssignment } from '@prisma/client';

@Injectable()
export class AdvisorAssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<AdvisorAssignment[]> {
    return this.prisma.advisorAssignment.findMany({
      include: {
        advisor: true,
        program: true,
      },
    });
  }

  async get(id: string): Promise<AdvisorAssignment> {
    const assignment = await this.prisma.advisorAssignment.findUnique({
      where: { id },
      include: {
        advisor: true,
        program: true,
      },
    });
    if (!assignment) {
      throw new NotFoundException(`AdvisorAssignment with ID ${id} not found`);
    }
    return assignment;
  }

  async create(dto: CreateAdvisorAssignmentDto): Promise<AdvisorAssignment> {
    return this.prisma.advisorAssignment.create({
      data: {
        advisorId: dto.advisorId,
        programId: dto.programId,
        assignedDate: dto.assignedDate
          ? new Date(dto.assignedDate)
          : new Date(),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
      include: {
        advisor: true,
        program: true,
      },
    });
  }

  async update(
    id: string,
    dto: UpdateAdvisorAssignmentDto,
  ): Promise<AdvisorAssignment> {
    const existing = await this.prisma.advisorAssignment.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`AdvisorAssignment with ID ${id} not found`);
    }

    return this.prisma.advisorAssignment.update({
      where: { id },
      data: {
        advisorId: dto.advisorId ?? existing.advisorId,
        programId: dto.programId ?? existing.programId,
        assignedDate: dto.assignedDate
          ? new Date(dto.assignedDate)
          : existing.assignedDate,
        endDate: dto.endDate ? new Date(dto.endDate) : existing.endDate,
      },
      include: {
        advisor: true,
        program: true,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const existing = await this.prisma.advisorAssignment.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`AdvisorAssignment with ID ${id} not found`);
    }

    await this.prisma.advisorAssignment.delete({ where: { id } });
  }

  async byProgram(programId: string): Promise<AdvisorAssignment[]> {
    return this.prisma.advisorAssignment.findMany({
      where: { programId },
      include: {
        advisor: true,
        program: true,
      },
    });
  }

  async byAdvisor(advisorId: string): Promise<AdvisorAssignment[]> {
    return this.prisma.advisorAssignment.findMany({
      where: { advisorId },
      include: {
        advisor: true,
        program: true,
      },
    });
  }
}
