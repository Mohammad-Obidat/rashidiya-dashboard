import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdvisorDto } from './dto/create-advisor.dto';
import { UpdateAdvisorDto } from './dto/update-advisor.dto';

@Injectable()
export class AdvisorService {
  constructor(private prisma: PrismaService) {}

  async create(createAdvisorDto: CreateAdvisorDto) {
    return this.prisma.advisor.create({ data: createAdvisorDto });
  }

  async findAll() {
    return this.prisma.advisor.findMany({
      include: { currentPrograms: true, assignments: true },
    });
  }

  async findOne(id: string) {
    const advisor = await this.prisma.advisor.findUnique({
      where: { id },
      include: { currentPrograms: true, assignments: true },
    });
    if (!advisor) {
      throw new NotFoundException(`Advisor with ID ${id} not found`);
    }
    return advisor;
  }

  async update(id: string, updateAdvisorDto: UpdateAdvisorDto) {
    const advisor = await this.prisma.advisor.findUnique({ where: { id } });
    if (!advisor) {
      throw new NotFoundException(`Advisor with ID ${id} not found`);
    }
    return this.prisma.advisor.update({
      where: { id },
      data: updateAdvisorDto,
    });
  }

  async remove(id: string) {
    const advisor = await this.prisma.advisor.findUnique({ where: { id } });
    if (!advisor) {
      throw new NotFoundException(`Advisor with ID ${id} not found`);
    }
    return this.prisma.advisor.delete({ where: { id } });
  }
}
