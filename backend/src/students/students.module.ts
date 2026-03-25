import { Module } from '@nestjs/common';
import { ExcelModule } from '../excel/excel.module';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService, PrismaService],
  imports: [ExcelModule],
})
export class StudentsModule {}
