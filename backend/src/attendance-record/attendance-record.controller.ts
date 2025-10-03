import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AttendanceRecordService } from './attendance-record.service';
import { CreateAttendanceRecordDto } from './dto/create-attendance-record.dto';
import { UpdateAttendanceRecordDto } from './dto/update-attendance-record.dto';

@Controller('attendance-records')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AttendanceRecordController {
  constructor(
    private readonly attendanceRecordService: AttendanceRecordService,
  ) {}

  @Post()
  create(@Body() createAttendanceRecordDto: CreateAttendanceRecordDto) {
    return this.attendanceRecordService.create(createAttendanceRecordDto);
  }

  @Get()
  findAll() {
    return this.attendanceRecordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceRecordService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttendanceRecordDto: UpdateAttendanceRecordDto,
  ) {
    return this.attendanceRecordService.update(id, updateAttendanceRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceRecordService.remove(id);
  }
}
