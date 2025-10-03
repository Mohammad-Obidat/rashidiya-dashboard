// src/lib/mockApi.ts
export type Mentor = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
};
export type Student = {
  id: string;
  fullName: string;
  grade: string;
  section?: string;
  studentNumber?: string;
  birthDate?: string;
};
export type Session = {
  id: string;
  title?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  place?: string;
  recurring?: 'none' | 'weekly' | 'monthly';
};
export type AttendanceRecord = {
  id: string;
  studentId: string;
  sessionId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
};

const timeout = (ms = 120) => new Promise((res) => setTimeout(res, ms));

export const mockApi = {
  mentors: {
    list: async (): Promise<Mentor[]> => {
      await timeout();
      return [
        {
          id: 'm1',
          name: 'أحمد محمد',
          phone: '+966500000000',
          email: 'ahmed@school.edu.sa',
        },
        {
          id: 'm2',
          name: 'خالد سالم',
          phone: '+966500000001',
          email: 'khalid@school.edu.sa',
        },
      ];
    },
  },
  students: {
    list: async (): Promise<Student[]> => {
      await timeout();
      return [
        {
          id: 's1',
          fullName: 'محمد حسن',
          grade: '10',
          section: 'A',
          studentNumber: '1001',
          birthDate: '2008-04-12',
        },
        {
          id: 's2',
          fullName: 'فاطمة النور',
          grade: '10',
          section: 'B',
          studentNumber: '1002',
          birthDate: '2008-09-02',
        },
        {
          id: 's3',
          fullName: 'يوسف علي',
          grade: '11',
          section: 'A',
          studentNumber: '1103',
          birthDate: '2007-03-22',
        },
      ];
    },
  },
  sessions: {
    list: async (): Promise<Session[]> => {
      await timeout();
      const today = new Date().toISOString().slice(0, 10);
      return [
        {
          id: 'sess1',
          title: 'جلسة تعريفية',
          date: today,
          startTime: '16:00',
          endTime: '17:00',
          place: 'قاعة 1',
          recurring: 'weekly',
        },
        {
          id: 'sess2',
          title: 'ورشة عمل',
          date: today,
          startTime: '10:00',
          endTime: '12:00',
          place: 'المختبر',
          recurring: 'none',
        },
      ];
    },
  },
  attendance: {
    list: async (): Promise<AttendanceRecord[]> => {
      await timeout();
      return [];
    },
    saveMany: async (records: AttendanceRecord[]) => {
      await timeout();
      return records;
    },
  },
};
