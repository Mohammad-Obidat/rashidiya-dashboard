import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { StudentsModule } from './students/students.module';
import { AdvisorModule } from './advisor/advisor.module';
import { ProgramModule } from './program/program.module';
import { SessionModule } from './session/session.module';
import { AttendanceRecordModule } from './attendance-record/attendance-record.module';
import { ExportModule } from './export/export.module';

@Module({
  imports: [
    PrismaModule,
    StudentsModule,
    AdvisorModule,
    ProgramModule,
    SessionModule,
    AttendanceRecordModule,
    ExportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
