import { Module } from '@nestjs/common';
import { AdvisorAssignmentsController } from './advisor-assignments.controller';
import { AdvisorAssignmentsService } from './advisor-assignments.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AdvisorAssignmentsController],
  providers: [AdvisorAssignmentsService, PrismaService],
})
export class AdvisorAssignmentsModule {}
