import { PartialType } from '@nestjs/mapped-types';
import { CreateAdvisorAssignmentDto } from './create-advisor-assignment.dto';

export class UpdateAdvisorAssignmentDto extends PartialType(
  CreateAdvisorAssignmentDto,
) {}
