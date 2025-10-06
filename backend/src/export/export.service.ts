import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DatasetType, ExportFormat } from './dto/export-request.dto';
import { XLSXGenerator } from './utils/xlsx-generator';
import { PDFGenerator } from './utils/pdf-generator';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  /**
   * Export data based on dataset type and format
   */
  async exportData(
    datasetType: DatasetType,
    format: ExportFormat,
    filters?: Record<string, any>,
  ): Promise<Buffer> {
    // Fetch data based on dataset type
    const { data, columns, title } = await this.fetchDataset(
      datasetType,
      filters,
    );

    // Generate file based on format
    if (format === ExportFormat.XLSX) {
      return this.generateXLSX(data, columns, title);
    } else if (format === ExportFormat.PDF) {
      return await this.generatePDF(data, columns, title);
    }

    throw new Error(`Unsupported export format: ${format}`);
  }

  /**
   * Fetch dataset based on type
   */
  private async fetchDataset(
    datasetType: DatasetType,
    filters?: Record<string, any>,
  ): Promise<{
    data: any[];
    columns: Array<{ header: string; key: string; width?: number }>;
    title: string;
  }> {
    switch (datasetType) {
      case DatasetType.STUDENTS:
        return this.fetchStudentsData(filters);

      case DatasetType.ATTENDANCE:
        return this.fetchAttendanceData(filters);

      case DatasetType.PROGRAMS:
        return this.fetchProgramsData(filters);

      case DatasetType.ADVISORS:
        return this.fetchAdvisorsData(filters);

      case DatasetType.SESSIONS:
        return this.fetchSessionsData(filters);

      default:
        throw new Error(`Unsupported dataset type: ${datasetType}`);
    }
  }

  /**
   * Fetch students data
   */
  private async fetchStudentsData(filters?: Record<string, any>) {
    const students = await this.prisma.student.findMany({
      where: {
        ...(filters?.grade && { grade: filters.grade }),
        ...(filters?.section && { section: filters.section }),
      },
      orderBy: { name: 'asc' },
    });

    const data = students.map((s) => ({
      name: s.name,
      studentNumber: s.studentNumber,
      grade: s.grade,
      section: s.section,
      gender: s.gender === 'MALE' ? 'ذكر' : 'أنثى',
      birthDate: s.birthDate ? s.birthDate.toISOString().split('T')[0] : '',
      phone: s.phone || '',
      address: s.address || '',
    }));

    const columns = [
      { header: 'الاسم', key: 'name', width: 25 },
      { header: 'الرقم الأكاديمي', key: 'studentNumber', width: 20 },
      { header: 'الصف', key: 'grade', width: 10 },
      { header: 'الشعبة', key: 'section', width: 10 },
      { header: 'الجنس', key: 'gender', width: 10 },
      { header: 'تاريخ الميلاد', key: 'birthDate', width: 15 },
      { header: 'الهاتف', key: 'phone', width: 15 },
      { header: 'العنوان', key: 'address', width: 25 },
    ];

    return { data, columns, title: 'قائمة الطلاب' };
  }

  /**
   * Fetch attendance data
   */
  private async fetchAttendanceData(filters?: Record<string, any>) {
    const attendance = await this.prisma.attendanceRecord.findMany({
      where: {
        ...(filters?.programId && { programId: filters.programId }),
        ...(filters?.date && { date: new Date(filters.date) }),
      },
      include: {
        student: true,
        program: true,
        session: true,
      },
      orderBy: { date: 'desc' },
    });

    const data = attendance.map((a) => ({
      programName: a.program.name,
      studentName: a.student.name,
      studentNumber: a.student.studentNumber,
      date: a.date.toISOString().split('T')[0],
      status: this.translateAttendanceStatus(a.status),
      notes: a.notes || '',
    }));

    const columns = [
      { header: 'البرنامج', key: 'programName', width: 25 },
      { header: 'اسم الطالب', key: 'studentName', width: 25 },
      { header: 'الرقم الأكاديمي', key: 'studentNumber', width: 20 },
      { header: 'التاريخ', key: 'date', width: 15 },
      { header: 'الحالة', key: 'status', width: 15 },
      { header: 'ملاحظات', key: 'notes', width: 30 },
    ];

    return { data, columns, title: 'سجل الحضور والغياب' };
  }

  /**
   * Fetch programs data
   */
  private async fetchProgramsData(filters?: Record<string, any>) {
    const programs = await this.prisma.program.findMany({
      where: {
        ...(filters?.type && { type: filters.type }),
        ...(filters?.status && { status: filters.status }),
      },
      include: {
        currentAdvisor: true,
        _count: {
          select: {
            students: true,
            sessions: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const data = programs.map((p) => ({
      name: p.name,
      type: this.translateProgramType(p.type),
      status: this.translateProgramStatus(p.status),
      description: p.description,
      advisorName: p.currentAdvisor?.name || 'غير محدد',
      studentsCount: p._count.students,
      sessionsCount: p._count.sessions,
      createdDate: p.createdDate.toISOString().split('T')[0],
    }));

    const columns = [
      { header: 'اسم البرنامج', key: 'name', width: 25 },
      { header: 'النوع', key: 'type', width: 15 },
      { header: 'الحالة', key: 'status', width: 15 },
      { header: 'الوصف', key: 'description', width: 30 },
      { header: 'المشرف', key: 'advisorName', width: 20 },
      { header: 'عدد الطلاب', key: 'studentsCount', width: 12 },
      { header: 'عدد الجلسات', key: 'sessionsCount', width: 12 },
      { header: 'تاريخ الإنشاء', key: 'createdDate', width: 15 },
    ];

    return { data, columns, title: 'قائمة البرامج' };
  }

  /**
   * Fetch advisors data
   */
  private async fetchAdvisorsData(filters?: Record<string, any>) {
    const advisors = await this.prisma.advisor.findMany({
      include: {
        currentPrograms: true,
        _count: {
          select: {
            assignments: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const data = advisors.map((a) => ({
      name: a.name,
      phone: a.phone,
      email: a.email,
      currentProgramsCount: a.currentPrograms.length,
      totalAssignments: a._count.assignments,
      createdAt: a.createdAt.toISOString().split('T')[0],
    }));

    const columns = [
      { header: 'الاسم', key: 'name', width: 25 },
      { header: 'الهاتف', key: 'phone', width: 15 },
      { header: 'البريد الإلكتروني', key: 'email', width: 25 },
      { header: 'البرامج الحالية', key: 'currentProgramsCount', width: 15 },
      { header: 'إجمالي التكليفات', key: 'totalAssignments', width: 15 },
      { header: 'تاريخ الإضافة', key: 'createdAt', width: 15 },
    ];

    return { data, columns, title: 'قائمة المشرفين' };
  }

  /**
   * Fetch sessions data
   */
  private async fetchSessionsData(filters?: Record<string, any>) {
    const sessions = await this.prisma.session.findMany({
      where: {
        ...(filters?.programId && { programId: filters.programId }),
      },
      include: {
        program: true,
        _count: {
          select: {
            attendanceRecords: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    const data = sessions.map((s) => ({
      programName: s.program.name,
      date: s.date.toISOString().split('T')[0],
      startTime: s.startTime,
      endTime: s.endTime,
      location: s.location,
      isRecurring: s.isRecurring ? 'نعم' : 'لا',
      attendanceCount: s._count.attendanceRecords,
      notes: s.notes || '',
    }));

    const columns = [
      { header: 'البرنامج', key: 'programName', width: 25 },
      { header: 'التاريخ', key: 'date', width: 15 },
      { header: 'وقت البدء', key: 'startTime', width: 12 },
      { header: 'وقت الانتهاء', key: 'endTime', width: 12 },
      { header: 'الموقع', key: 'location', width: 20 },
      { header: 'متكرر', key: 'isRecurring', width: 10 },
      { header: 'عدد الحضور', key: 'attendanceCount', width: 12 },
      { header: 'ملاحظات', key: 'notes', width: 30 },
    ];

    return { data, columns, title: 'الجدول الزمني' };
  }

  /**
   * Generate XLSX file
   */
  private generateXLSX(
    data: any[],
    columns: Array<{ header: string; key: string; width?: number }>,
    sheetName: string,
  ): Buffer {
    return XLSXGenerator.generate({
      sheetName,
      columns,
      data,
      rtl: true,
    });
  }

  /**
   * Generate PDF file
   */
  private async generatePDF(
    data: any[],
    columns: Array<{ header: string; key: string; width?: number }>,
    title: string,
  ): Promise<Buffer> {
    return await PDFGenerator.generate({
      title,
      columns,
      data,
      rtl: true,
    });
  }

  /**
   * Translate attendance status to Arabic
   */
  private translateAttendanceStatus(status: string): string {
    const translations: Record<string, string> = {
      PRESENT: 'حاضر',
      ABSENT: 'غائب',
      EXCUSED: 'غياب بعذر',
      LATE: 'متأخر',
    };
    return translations[status] || status;
  }

  /**
   * Translate program type to Arabic
   */
  private translateProgramType(type: string): string {
    const translations: Record<string, string> = {
      SPORTS: 'رياضية',
      CULTURAL: 'ثقافية',
      SCIENTIFIC: 'علمية',
      ARTISTIC: 'فنية',
      SOCIAL: 'اجتماعية',
      RELIGIOUS: 'دينية',
      OTHER: 'أخرى',
    };
    return translations[type] || type;
  }

  /**
   * Translate program status to Arabic
   */
  private translateProgramStatus(status: string): string {
    const translations: Record<string, string> = {
      ACTIVE: 'نشط',
      INACTIVE: 'غير نشط',
      ARCHIVED: 'مؤرشف',
    };
    return translations[status] || status;
  }
}
