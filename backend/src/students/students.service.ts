import { Gender } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExcelService } from '../excel/excel.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    private prisma: PrismaService,
    private excelService: ExcelService,
  ) {}

  async list() {
    return this.prisma.student.findMany();
  }

  async get(id: string) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student)
      throw new NotFoundException(`Student with ID ${id} not found`);
    return student;
  }

  async create(dto: CreateStudentDto) {
    return this.prisma.student.create({ data: dto });
  }

  async update(id: string, dto: UpdateStudentDto) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student)
      throw new NotFoundException(`Student with ID ${id} not found`);
    return this.prisma.student.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student)
      throw new NotFoundException(`Student with ID ${id} not found`);
    await this.prisma.student.delete({ where: { id } });
    return;
  }

  async byStudentNumber(studentNumber: string) {
    const student = await this.prisma.student.findUnique({
      where: { studentNumber },
    });
    if (!student)
      throw new NotFoundException(
        `Student with number ${studentNumber} not found`,
      );
    return student;
  }

  private parseDMY(dateStr: string): Date | null {
    // Handle Excel serial numbers (e.g. 44000)
    if (/^\d+$/.test(dateStr)) {
      const excelEpoch = new Date(1899, 11, 30);
      const date = new Date(excelEpoch);
      date.setDate(excelEpoch.getDate() + parseInt(dateStr));
      return date;
    }

    // Handle dd/mm/yyyy or dd-mm-yyyy
    const parts = dateStr.split(/[\/\-]/);
    if (parts.length !== 3) return null;

    const [day, month, year] = parts.map(Number);
    if (!day || !month || !year) return null;

    return new Date(year, month - 1, day);
  }

  async importStudents(
    fileBuffer: Buffer,
  ): Promise<{ created: number; updated: number }> {
    const headers = [
      { header: '#', key: 'id' },
      { header: 'name', key: 'name' },
      { header: 'BirthDate', key: 'birthDate' },
      { header: 'ID', key: 'studentNumber' },
      { header: 'phone1', key: 'phone' },
      { header: 'phone2', key: 'phone2' },
      { header: 'grade', key: 'grade' },
      { header: 'section', key: 'section' },
    ] satisfies { header: string; key: keyof ImportedStudent }[];

    type ImportedStudent = {
      id?: string;
      name?: string;
      birthDate?: string;
      studentNumber?: string;
      phone?: string;
      phone2?: string;
      grade?: string;
      section?: string;
    };

    const importedData = this.excelService.importData<ImportedStudent>(
      fileBuffer,
      headers,
      'طلاب',
    );

    let createdCount = 0;
    let updatedCount = 0;

    for (const row of importedData) {
      const studentNumber = row.studentNumber?.toString();
      if (!studentNumber) {
        console.warn('Skipping row due to missing studentNumber:', row);
        continue;
      }

      const existingStudent = await this.prisma.student.findUnique({
        where: { studentNumber },
        select: { id: true },
      });

      const studentData = {
        name: row.name ?? '',
        studentNumber,
        birthDate: row.birthDate
          ? this.parseDMY(row.birthDate.toString())
          : null,
        phone: row.phone?.toString() ?? null,
        grade: row.grade ? row.grade : 'N/A',
        section: row.section ? row.section : 'N/A',
        gender: Gender.MALE,
      };

      if (existingStudent) {
        await this.prisma.student.update({
          where: { studentNumber },
          data: studentData,
        });
        updatedCount++;
      } else {
        await this.prisma.student.create({ data: studentData });
        createdCount++;
      }
    }

    return { created: createdCount, updated: updatedCount };
  }
}
