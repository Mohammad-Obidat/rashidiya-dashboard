import { Module } from '@nestjs/common';
import { AttendanceRecordsService } from './attendance-record.service';
import { AttendanceRecordsController } from './attendance-record.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AttendanceRecordsController],
  providers: [AttendanceRecordsService],
})
export class AttendanceRecordModule {}
