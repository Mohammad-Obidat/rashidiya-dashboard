// Enums matching Prisma schema
export enum ProgramStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum ProgramTypeEnum {
  SPORTS = 'SPORTS',
  CULTURAL = 'CULTURAL',
  SCIENTIFIC = 'SCIENTIFIC',
  ARTISTIC = 'ARTISTIC',
  SOCIAL = 'SOCIAL',
  RELIGIOUS = 'RELIGIOUS',
  OTHER = 'OTHER',
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  EXCUSED = 'EXCUSED',
  LATE = 'LATE',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum RecurrencePattern {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

// Base interfaces matching Prisma models
export interface Advisor {
  id: string;
  name: string;
  phone: string;
  email: string;
  currentPrograms?: Program[];
  assignments?: AdvisorAssignment[];
}

export interface AdvisorAssignment {
  id: string;
  advisorId: string;
  programId: string;
  assignedDate: string;
  endDate: string | null;
  advisor?: Advisor;
  program?: Program;
}

export interface Student {
  id: string;
  name: string;
  studentNumber: string;
  grade: string;
  section: string;
  gender: Gender | null;
  birthDate: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  programs?: StudentProgram[];
  attendanceRecords?: AttendanceRecord[];
}

export interface StudentProgram {
  id: string;
  studentId: string;
  programId: string;
  joinDate: string;
  student?: Student;
  program?: Program;
}

export interface Session {
  id: string;
  programId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  isRecurring: boolean;
  recurrencePattern: RecurrencePattern | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  program?: Program;
  attendanceRecords?: AttendanceRecord[];
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  sessionId: string;
  programId: string;
  date: string;
  status: AttendanceStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  student?: Student;
  session?: Session;
  program?: Program;
}

export interface Program {
  id: string;
  name: string;
  type: ProgramTypeEnum;
  description: string;
  status: ProgramStatus;
  createdDate: string;
  currentAdvisorId: string | null;
  createdAt: string;
  updatedAt: string;
  currentAdvisor?: Advisor;
  advisorHistory?: AdvisorAssignment[];
  students?: StudentProgram[];
  sessions?: Session[];
  attendanceRecords?: AttendanceRecord[];
}

// ============ DTOs ============

// Program DTOs
export interface CreateProgramDto {
  name: string;
  type: ProgramTypeEnum;
  description: string;
  status?: ProgramStatus;
  createdDate?: string;
  currentAdvisorId?: string;
}

export interface UpdateProgramDto {
  name?: string;
  type?: ProgramTypeEnum;
  description?: string;
  status?: ProgramStatus;
  createdDate?: string;
  currentAdvisorId?: string;
}

// Advisor DTOs
export interface CreateAdvisorDto {
  name: string;
  phone: string;
  email: string;
}

export interface UpdateAdvisorDto {
  name?: string;
  phone?: string;
  email?: string;
}

// AdvisorAssignment DTOs
export interface CreateAdvisorAssignmentDto {
  advisorId: string;
  programId: string;
  assignedDate?: string;
  endDate?: string;
}

export interface UpdateAdvisorAssignmentDto {
  advisorId?: string;
  programId: string;
  assignedDate?: string;
  endDate?: string;
}

// Student DTOs
export interface CreateStudentDto {
  name: string;
  studentNumber: string;
  grade: string;
  section: string;
  gender?: Gender;
  birthDate?: string;
  phone?: string;
  address?: string;
}

export interface UpdateStudentDto {
  name?: string;
  studentNumber?: string;
  grade?: string;
  section?: string;
  gender?: Gender;
  birthDate?: string;
  phone?: string;
  address?: string;
}

// StudentProgram DTOs
export interface CreateStudentProgramDto {
  studentId: string;
  programId: string;
  joinDate?: string;
}

export interface UpdateStudentProgramDto {
  studentId?: string;
  programId: string;
  joinDate?: string;
}

// Session DTOs
export interface CreateSessionDto {
  programId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  isRecurring?: boolean;
  recurrencePattern?: RecurrencePattern;
  notes?: string;
}

export interface UpdateSessionDto {
  programId: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  isRecurring?: boolean;
  recurrencePattern?: RecurrencePattern;
  notes?: string;
}

// Attendance Record DTOs
export interface CreateAttendanceRecordDto {
  studentId: string;
  sessionId: string;
  programId: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface UpdateAttendanceRecordDto {
  studentId?: string;
  sessionId?: string;
  programId: string;
  date: string;
  status?: AttendanceStatus;
  notes?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
