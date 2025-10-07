import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { AdvisorAssignmentsService } from './advisor-assignments.service';
import { CreateAdvisorAssignmentDto } from './dto/create-advisor-assignment.dto';
import { UpdateAdvisorAssignmentDto } from './dto/update-advisor-assignment.dto';
import { AdvisorAssignment } from '@prisma/client';

@Controller('advisor-assignments')
export class AdvisorAssignmentsController {
  constructor(private readonly service: AdvisorAssignmentsService) {}

  @Get()
  list(): Promise<AdvisorAssignment[]> {
    return this.service.list();
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<AdvisorAssignment> {
    return this.service.get(id);
  }

  @Post()
  create(@Body() dto: CreateAdvisorAssignmentDto): Promise<AdvisorAssignment> {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAdvisorAssignmentDto,
  ): Promise<AdvisorAssignment> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }

  @Get('programs/:programId')
  byProgram(
    @Param('programId') programId: string,
  ): Promise<AdvisorAssignment[]> {
    return this.service.byProgram(programId);
  }

  @Get('advisors/:advisorId')
  byAdvisor(
    @Param('advisorId') advisorId: string,
  ): Promise<AdvisorAssignment[]> {
    return this.service.byAdvisor(advisorId);
  }
}
