// Gender
export const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
} as const;
export type Gender = (typeof Gender)[keyof typeof Gender];

// Program Types
export const ProgramTypeEnum = {
  SPORTS: 'SPORTS',
  CULTURAL: 'CULTURAL',
  SCIENTIFIC: 'SCIENTIFIC',
  ARTISTIC: 'ARTISTIC',
  SOCIAL: 'SOCIAL',
  RELIGIOUS: 'RELIGIOUS',
  OTHER: 'OTHER',
} as const;
export type ProgramTypeEnum =
  (typeof ProgramTypeEnum)[keyof typeof ProgramTypeEnum];

// Program Status
export const ProgramStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ARCHIVED: 'ARCHIVED',
} as const;
export type ProgramStatus = (typeof ProgramStatus)[keyof typeof ProgramStatus];

// Attendance Status
export const AttendanceStatus = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  EXCUSED: 'EXCUSED',
  LATE: 'LATE',
} as const;
export type AttendanceStatus =
  (typeof AttendanceStatus)[keyof typeof AttendanceStatus];

// Recurrence Pattern
export const RecurrencePattern = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
} as const;
export type RecurrencePattern =
  (typeof RecurrencePattern)[keyof typeof RecurrencePattern];

// Interfaces
export interface Program {
  id: string;
  name: string;
  type: ProgramTypeEnum;
  description: string;
  status: ProgramStatus;
  createdDate: Date;
  createdAt: Date;
  updatedAt: Date;
  currentAdvisorId?: string | null;
  currentAdvisor?: Advisor | null;
  advisorHistory: AdvisorAssignment[];
  students: StudentProgram[];
  sessions: Session[];
  attendanceRecords: AttendanceRecord[];
}

export interface Advisor {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  currentPrograms: Program[];
  assignments: AdvisorAssignment[];
}

export interface AdvisorAssignment {
  id: string;
  advisorId: string;
  programId: string;
  assignedDate: Date;
  endDate?: Date | null;
  advisor: Advisor;
  program: Program;
}

export interface Student {
  id: string;
  name: string;
  studentNumber: string;
  grade: string;
  section: string;
  gender?: Gender;
  birthDate?: Date | null;
  phone?: string | null;
  address?: string | null;
  createdAt: Date;
  updatedAt: Date;
  programs: StudentProgram[];
  attendanceRecords: AttendanceRecord[];
}

export interface StudentProgram {
  id: string;
  studentId: string;
  programId: string;
  joinDate: Date;
  student: Student;
  program: Program;
}

export interface Session {
  id: string;
  programId: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;

  program: Program;
  attendanceRecords: AttendanceRecord[];
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  sessionId: string;
  programId: string;
  date: Date;
  status: AttendanceStatus;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  student: Student;
  session: Session;
  program: Program;
}

// Type aliases
export type ProgramType = Program;
export type AdvisorType = Advisor;
export type SessionType = Session;
export type AttendanceRecordType = AttendanceRecord;
export type StudentType = Student;
