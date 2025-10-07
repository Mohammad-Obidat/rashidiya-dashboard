import { Module } from '@nestjs/common';
import { SessionsService } from './session.service';
import { SessionsController } from './session.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SessionsController],
  providers: [SessionsService, PrismaService],
})
export class SessionsModule {}
