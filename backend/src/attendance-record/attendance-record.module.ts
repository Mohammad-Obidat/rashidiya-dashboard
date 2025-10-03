import { Module } from '@nestjs/common';
import { AttendanceRecordService } from './attendance-record.service';
import { AttendanceRecordController } from './attendance-record.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AttendanceRecordController],
  providers: [AttendanceRecordService],
})
export class AttendanceRecordModule {}
