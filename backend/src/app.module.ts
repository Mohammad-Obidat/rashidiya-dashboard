import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { StudentsModule } from './students/students.module';
import { AdvisorModule } from './advisor/advisor.module';
import { ProgramModule } from './program/program.module';
import { SessionsModule } from './session/session.module';
import { AttendanceRecordModule } from './attendance-record/attendance-record.module';
import { AdvisorAssignmentsModule } from './advisor-assignments/advisor-assignments.module';
import { StudentProgramsModule } from './student-programs/student-programs.module';

@Module({
  imports: [
    PrismaModule,
    StudentsModule,
    AdvisorModule,
    ProgramModule,
    SessionsModule,
    StudentProgramsModule,
    AttendanceRecordModule,
    AdvisorAssignmentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
