import { Module } from '@nestjs/common';
import { StudentProgramsService } from './student-programs.service';
import { StudentProgramsController } from './student-programs.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [StudentProgramsController],
  providers: [StudentProgramsService, PrismaService],
})
export class StudentProgramsModule {}
