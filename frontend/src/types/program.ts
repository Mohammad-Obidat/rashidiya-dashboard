import {
  ProgramType as PrismaProgramType,
  ProgramStatus as PrismaProgramStatus,
  AttendanceStatus as PrismaAttendanceStatus,
  Gender,
  RecurrencePattern,
} from '@prisma/client';

export const ProgramType = PrismaProgramType;
export type ProgramType = PrismaProgramType;

export const ProgramStatus = PrismaProgramStatus;
export type ProgramStatus = PrismaProgramStatus;

export const AttendanceStatus = PrismaAttendanceStatus;
export type AttendanceStatus = PrismaAttendanceStatus;

export type GenderType = Gender;
export type RecurrencePatternType = RecurrencePattern;

export interface IAdvisor {
  id: string;
  name: string;
  phone: string;
  email: string;
  // assignedDate will be part of AdvisorAssignment, not Advisor directly
}

export interface IAdvisorAssignment {
  id: string;
  advisorId: string;
  programId: string;
  assignedDate: Date;
  endDate?: Date;
  advisor: IAdvisor;
}

export interface IStudent {
  id: string;
  name: string;
  studentNumber: string;
  grade: string;
  section: string;
  gender?: GenderType;
  birthDate?: Date;
  phone?: string;
  address?: string;
  joinDate?: Date; // This is part of StudentProgram, not Student directly
}

export interface IStudentProgram {
  id: string;
  studentId: string;
  programId: string;
  joinDate: Date;
  student: IStudent;
}

export interface IAttendanceRecord {
  id: string;
  studentId: string;
  sessionId: string;
  programId: string;
  date: Date;
  status: AttendanceStatus;
  notes?: string;
  student?: IStudent;
  session?: ISession;
  program?: IProgram;
}

export interface ISession {
  id: string;
  programId: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePatternType;
  notes?: string;
  program?: IProgram;
  attendanceRecords?: IAttendanceRecord[];
}

export interface IProgram {
  id: string;
  name: string;
  type: ProgramType;
  description: string;
  status: ProgramStatus;
  createdDate: Date;
  createdAt: Date;
  updatedAt: Date;
  currentAdvisorId?: string;
  currentAdvisor?: IAdvisor;
  advisorHistory?: IAdvisorAssignment[];
  students?: IStudentProgram[];
  sessions?: ISession[];
  attendanceRecords?: IAttendanceRecord[];
}

export interface IProgramFormData {
  name: string;
  type: ProgramType;
  description: string;
  status: ProgramStatus;
  currentAdvisorId?: string;
}
