export const ProgramType = {
  SPORTS: 'رياضية',
  CULTURAL: 'ثقافية',
  SCIENTIFIC: 'علمية',
  ARTISTIC: 'فنية',
  SOCIAL: 'اجتماعية',
  RELIGIOUS: 'دينية',
  OTHER: 'أخرى',
} as const;

export type ProgramType = (typeof ProgramType)[keyof typeof ProgramType];

export const ProgramStatus = {
  ACTIVE: 'نشط',
  INACTIVE: 'غير نشط',
  ARCHIVED: 'مؤرشف',
} as const;

export type ProgramStatus = (typeof ProgramStatus)[keyof typeof ProgramStatus];

export const AttendanceStatus = {
  PRESENT: 'حاضر',
  ABSENT: 'غائب',
  EXCUSED: 'غياب بعذر',
  LATE: 'متأخر',
} as const;

export type AttendanceStatus =
  (typeof AttendanceStatus)[keyof typeof AttendanceStatus];

export interface IAdvisor {
  id: string;
  name: string;
  phone: string;
  email: string;
  assignedDate?: Date;
}

export interface IStudent {
  id: string;
  name: string;
  studentNumber: string;
  grade: string;
  section: string;
  joinDate: Date;
}

export interface IAttendanceRecord {
  id: string;
  studentId: string;
  sessionId: string;
  date: Date;
  status: AttendanceStatus;
  notes?: string;
}

export interface ISession {
  id: string;
  programId: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  isRecurring: boolean;
  recurrencePattern?: 'daily' | 'weekly' | 'monthly';
  notes?: string;
}

export interface IProgram {
  id: string;
  name: string;
  type: ProgramType;
  description: string;
  status: ProgramStatus;
  createdDate: Date;
  currentAdvisor?: IAdvisor;
  advisorHistory?: IAdvisor[];
  students?: IStudent[];
  sessions?: ISession[];
  attendanceRecords?: IAttendanceRecord[];
}

export interface IProgramFormData {
  name: string;
  type: ProgramType;
  description: string;
  status: ProgramStatus;
}
