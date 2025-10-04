import axios, { AxiosError, type AxiosInstance } from 'axios';
import type {
  Program,
  Advisor,
  AdvisorAssignment,
  Student,
  StudentProgram,
  Session,
  AttendanceRecord,
  CreateProgramDto,
  UpdateProgramDto,
  CreateAdvisorDto,
  UpdateAdvisorDto,
  CreateAdvisorAssignmentDto,
  UpdateAdvisorAssignmentDto,
  CreateStudentDto,
  UpdateStudentDto,
  CreateStudentProgramDto,
  UpdateStudentProgramDto,
  CreateSessionDto,
  UpdateSessionDto,
  CreateAttendanceRecordDto,
  UpdateAttendanceRecordDto,
} from '../types/program';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }

    // Extract error message
    const message =
      (error.response?.data as any)?.message ||
      error.message ||
      'An unexpected error occurred';

    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

// API methods
export const api = {
  // Programs
  programs: {
    list: async (): Promise<Program[]> => {
      const { data } = await apiClient.get<Program[]>('/programs');
      return data;
    },
    get: async (id: string): Promise<Program> => {
      const { data } = await apiClient.get<Program>(`/programs/${id}`);
      return data;
    },
    create: async (dto: CreateProgramDto): Promise<Program> => {
      const { data } = await apiClient.post<Program>('/programs', dto);
      return data;
    },
    update: async (id: string, dto: UpdateProgramDto): Promise<Program> => {
      const { data } = await apiClient.patch<Program>(`/programs/${id}`, dto);
      return data;
    },
    remove: async (id: string): Promise<void> => {
      await apiClient.delete(`/programs/${id}`);
    },
  },

  // Advisors
  advisors: {
    list: async (): Promise<Advisor[]> => {
      const { data } = await apiClient.get<Advisor[]>('/advisors');
      return data;
    },
    get: async (id: string): Promise<Advisor> => {
      const { data } = await apiClient.get<Advisor>(`/advisors/${id}`);
      return data;
    },
    create: async (dto: CreateAdvisorDto): Promise<Advisor> => {
      const { data } = await apiClient.post<Advisor>('/advisors', dto);
      return data;
    },
    update: async (id: string, dto: UpdateAdvisorDto): Promise<Advisor> => {
      const { data } = await apiClient.patch<Advisor>(`/advisors/${id}`, dto);
      return data;
    },
    remove: async (id: string): Promise<void> => {
      await apiClient.delete(`/advisors/${id}`);
    },
  },

  // Advisor Assignments
  advisorAssignments: {
    list: async (): Promise<AdvisorAssignment[]> => {
      const { data } = await apiClient.get<AdvisorAssignment[]>(
        '/advisor-assignments'
      );
      return data;
    },
    get: async (id: string): Promise<AdvisorAssignment> => {
      const { data } = await apiClient.get<AdvisorAssignment>(
        `/advisor-assignments/${id}`
      );
      return data;
    },
    create: async (
      dto: CreateAdvisorAssignmentDto
    ): Promise<AdvisorAssignment> => {
      const { data } = await apiClient.post<AdvisorAssignment>(
        '/advisor-assignments',
        dto
      );
      return data;
    },
    update: async (
      id: string,
      dto: UpdateAdvisorAssignmentDto
    ): Promise<AdvisorAssignment> => {
      const { data } = await apiClient.patch<AdvisorAssignment>(
        `/advisor-assignments/${id}`,
        dto
      );
      return data;
    },
    remove: async (id: string): Promise<void> => {
      await apiClient.delete(`/advisor-assignments/${id}`);
    },
    // Get assignments by program
    byProgram: async (programId: string): Promise<AdvisorAssignment[]> => {
      const { data } = await apiClient.get<AdvisorAssignment[]>(
        `/advisor-assignments/program/${programId}`
      );
      return data;
    },
    // Get assignments by advisor
    byAdvisor: async (advisorId: string): Promise<AdvisorAssignment[]> => {
      const { data } = await apiClient.get<AdvisorAssignment[]>(
        `/advisor-assignments/advisor/${advisorId}`
      );
      return data;
    },
  },

  // Students
  students: {
    list: async (): Promise<Student[]> => {
      const { data } = await apiClient.get<Student[]>('/students');
      return data;
    },
    get: async (id: string): Promise<Student> => {
      const { data } = await apiClient.get<Student>(`/students/${id}`);
      return data;
    },
    create: async (dto: CreateStudentDto): Promise<Student> => {
      const { data } = await apiClient.post<Student>('/students', dto);
      return data;
    },
    update: async (id: string, dto: UpdateStudentDto): Promise<Student> => {
      const { data } = await apiClient.patch<Student>(`/students/${id}`, dto);
      return data;
    },
    remove: async (id: string): Promise<void> => {
      await apiClient.delete(`/students/${id}`);
    },
    // Search students by student number
    byStudentNumber: async (studentNumber: string): Promise<Student> => {
      const { data } = await apiClient.get<Student>(
        `/students/number/${studentNumber}`
      );
      return data;
    },
  },

  // Student Programs (enrollments)
  studentPrograms: {
    list: async (): Promise<StudentProgram[]> => {
      const { data } = await apiClient.get<StudentProgram[]>(
        '/student-programs'
      );
      return data;
    },
    get: async (id: string): Promise<StudentProgram> => {
      const { data } = await apiClient.get<StudentProgram>(
        `/student-programs/${id}`
      );
      return data;
    },
    create: async (dto: CreateStudentProgramDto): Promise<StudentProgram> => {
      const { data } = await apiClient.post<StudentProgram>(
        '/student-programs',
        dto
      );
      return data;
    },
    update: async (
      id: string,
      dto: UpdateStudentProgramDto
    ): Promise<StudentProgram> => {
      const { data } = await apiClient.patch<StudentProgram>(
        `/student-programs/${id}`,
        dto
      );
      return data;
    },
    remove: async (id: string): Promise<void> => {
      await apiClient.delete(`/student-programs/${id}`);
    },
    // Get enrollments by program
    byProgram: async (programId: string): Promise<StudentProgram[]> => {
      const { data } = await apiClient.get<StudentProgram[]>(
        `/student-programs/program/${programId}`
      );
      return data;
    },
    // Get enrollments by student
    byStudent: async (studentId: string): Promise<StudentProgram[]> => {
      const { data } = await apiClient.get<StudentProgram[]>(
        `/student-programs/student/${studentId}`
      );
      return data;
    },
  },

  // Sessions
  sessions: {
    list: async (): Promise<Session[]> => {
      const { data } = await apiClient.get<Session[]>('/sessions');
      return data;
    },
    get: async (id: string): Promise<Session> => {
      const { data } = await apiClient.get<Session>(`/sessions/${id}`);
      return data;
    },
    create: async (dto: CreateSessionDto): Promise<Session> => {
      const { data } = await apiClient.post<Session>('/sessions', dto);
      return data;
    },
    update: async (id: string, dto: UpdateSessionDto): Promise<Session> => {
      const { data } = await apiClient.patch<Session>(`/sessions/${id}`, dto);
      return data;
    },
    remove: async (id: string): Promise<void> => {
      await apiClient.delete(`/sessions/${id}`);
    },
    // Get sessions by program
    byProgram: async (programId: string): Promise<Session[]> => {
      const { data } = await apiClient.get<Session[]>(
        `/sessions/program/${programId}`
      );
      return data;
    },
    // Get sessions by date range
    byDateRange: async (
      startDate: string,
      endDate: string
    ): Promise<Session[]> => {
      const { data } = await apiClient.get<Session[]>(`/sessions/date-range`, {
        params: { startDate, endDate },
      });
      return data;
    },
  },

  // Attendance Records
  attendanceRecords: {
    list: async (): Promise<AttendanceRecord[]> => {
      const { data } = await apiClient.get<AttendanceRecord[]>(
        '/attendance-records'
      );
      return data;
    },
    get: async (id: string): Promise<AttendanceRecord> => {
      const { data } = await apiClient.get<AttendanceRecord>(
        `/attendance-records/${id}`
      );
      return data;
    },
    create: async (
      dto: CreateAttendanceRecordDto
    ): Promise<AttendanceRecord> => {
      const { data } = await apiClient.post<AttendanceRecord>(
        '/attendance-records',
        dto
      );
      return data;
    },
    update: async (
      id: string,
      dto: UpdateAttendanceRecordDto
    ): Promise<AttendanceRecord> => {
      const { data } = await apiClient.patch<AttendanceRecord>(
        `/attendance-records/${id}`,
        dto
      );
      return data;
    },
    remove: async (id: string): Promise<void> => {
      await apiClient.delete(`/attendance-records/${id}`);
    },
    // Bulk create attendance for a session
    bulkCreate: async (
      records: CreateAttendanceRecordDto[]
    ): Promise<AttendanceRecord[]> => {
      const { data } = await apiClient.post<AttendanceRecord[]>(
        '/attendance-records/bulk',
        records
      );
      return data;
    },
    // Get attendance by session
    bySession: async (sessionId: string): Promise<AttendanceRecord[]> => {
      const { data } = await apiClient.get<AttendanceRecord[]>(
        `/attendance-records/session/${sessionId}`
      );
      return data;
    },
    // Get attendance by student
    byStudent: async (studentId: string): Promise<AttendanceRecord[]> => {
      const { data } = await apiClient.get<AttendanceRecord[]>(
        `/attendance-records/student/${studentId}`
      );
      return data;
    },
    // Get attendance by program
    byProgram: async (programId: string): Promise<AttendanceRecord[]> => {
      const { data } = await apiClient.get<AttendanceRecord[]>(
        `/attendance-records/program/${programId}`
      );
      return data;
    },
  },
};

// Export the axios instance for custom requests
export default apiClient;
