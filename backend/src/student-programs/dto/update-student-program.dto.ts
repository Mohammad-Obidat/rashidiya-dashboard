import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentProgramDto } from './create-student-program.dto';

export class UpdateStudentProgramDto extends PartialType(
  CreateStudentProgramDto,
) {}
