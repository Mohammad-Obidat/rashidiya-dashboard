import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { StudentProgramsService } from './student-programs.service';
import { CreateStudentProgramDto } from './dto/create-student-program.dto';
import { UpdateStudentProgramDto } from './dto/update-student-program.dto';

@Controller('student-programs')
export class StudentProgramsController {
  constructor(private readonly service: StudentProgramsService) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Post()
  create(@Body() dto: CreateStudentProgramDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStudentProgramDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get('programs/:programId')
  byProgram(@Param('programId') programId: string) {
    return this.service.byProgram(programId);
  }

  @Get('students/:studentId')
  byStudent(@Param('studentId') studentId: string) {
    return this.service.byStudent(studentId);
  }
}
