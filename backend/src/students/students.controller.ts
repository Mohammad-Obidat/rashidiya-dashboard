import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importStudents(@UploadedFile() file: Express.Multer.File | undefined) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }
    return this.studentsService.importStudents(
      file.buffer as Buffer<ArrayBufferLike>,
    );
  }

  @Get()
  list() {
    return this.studentsService.list();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.studentsService.get(id);
  }

  @Post()
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }

  @Get('number/:studentNumber')
  byStudentNumber(@Param('studentNumber') studentNumber: string) {
    return this.studentsService.byStudentNumber(studentNumber);
  }
}
