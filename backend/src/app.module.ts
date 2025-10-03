import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { StudentsModule } from './students/students.module';
import { AdvisorModule } from './advisor/advisor.module';
import { ProgramModule } from './program/program.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    PrismaModule,
    StudentsModule,
    AdvisorModule,
    ProgramModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
