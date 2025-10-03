import axios from 'axios';
import type {
  Advisor,
  AttendanceRecord,
  Program,
  Session,
  Student,
} from '../types/program';

const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Type aliases
export type ProgramType = Program;
export type AdvisorType = Advisor;
export type SessionType = Session;
export type AttendanceRecordType = AttendanceRecord;
export type StudentType = Student;

export const api = {
  programs: {
    list: async (): Promise<Program[]> => {
      const response = await apiClient.get('/programs');
      return response.data;
    },
    get: async (id: string): Promise<Program> => {
      const response = await apiClient.get(`/programs/${id}`);
      return response.data;
    },
    create: async (
      data: Omit<ProgramType, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<ProgramType> => {
      const response = await apiClient.post('/programs', data);
      return response.data;
    },
    update: async (
      id: string,
      data: Partial<Omit<ProgramType, 'id' | 'createdAt' | 'updatedAt'>>
    ): Promise<ProgramType> => {
      const response = await apiClient.patch(`/programs/${id}`, data);
      return response.data;
    },
    remove: async (id: string): Promise<void> => {
      await apiClient.delete(`/programs/${id}`);
    },
  },

  advisors: {
    list: async (): Promise<AdvisorType[]> => {
      const response = await apiClient.get('/advisors');
      return response.data;
    },
    get: async (id: string): Promise<AdvisorType> => {
      const response = await apiClient.get(`/advisors/${id}`);
      return response.data;
    },
    create: async (
      data: Omit<AdvisorType, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<AdvisorType> => {
      const response = await apiClient.post('/advisors', data);
      return response.data;
    },
    update: async (
      id: string,
      data: Partial<Omit<AdvisorType, 'id' | 'createdAt' | 'updatedAt'>>
    ): Promise<AdvisorType> => {
      const response = await apiClient.patch(`/advisors/${id}`, data);
      return response.data;
    },
    remove: async (id: string): Promise<void> => {
      await apiClient.delete(`/advisors/${id}`);
    },
  },

  sessions: {
    list: async (): Promise<SessionType[]> => {
      const response = await apiClient.get('/sessions');
      return response.data;
    },
    get: async (id: string): Promise<SessionType> => {
      const response = await apiClient.get(`/sessions/${id}`);
      return response.data;
    },
    create: async (
      data: Omit<SessionType, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<SessionType> => {
      const response = await apiClient.post('/sessions', data);
      return response.data;
    },
    update: async (
      id: string,
      data: Partial<Omit<SessionType, 'id' | 'createdAt' | 'updatedAt'>>
    ): Promise<SessionType> => {
      const response = await apiClient.patch(`/sessions/${id}`, data);
      return response.data;
    },
    remove: async (id: string): Promise<void> => {
      await apiClient.delete(`/sessions/${id}`);
    },
  },

  attendanceRecords: {
    list: async (): Promise<AttendanceRecordType[]> => {
      const response = await apiClient.get('/attendance-records');
      return response.data;
    },
    get: async (id: string): Promise<AttendanceRecordType> => {
      const response = await apiClient.get(`/attendance-records/${id}`);
      return response.data;
    },
    create: async (
      data: Omit<AttendanceRecordType, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<AttendanceRecordType> => {
      const response = await apiClient.post('/attendance-records', data);
      return response.data;
    },
    update: async (
      id: string,
      data: Partial<
        Omit<AttendanceRecordType, 'id' | 'createdAt' | 'updatedAt'>
      >
    ): Promise<AttendanceRecordType> => {
      const response = await apiClient.patch(`/attendance-records/${id}`, data);
      return response.data;
    },
    remove: async (id: string): Promise<void> => {
      await apiClient.delete(`/attendance-records/${id}`);
    },
  },

  students: {
    list: async (): Promise<StudentType[]> => {
      const response = await apiClient.get('/students');
      return response.data;
    },
    get: async (id: string): Promise<StudentType> => {
      const response = await apiClient.get(`/students/${id}`);
      return response.data;
    },
    create: async (
      data: Omit<StudentType, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<StudentType> => {
      const response = await apiClient.post('/students', data);
      return response.data;
    },
    update: async (
      id: string,
      data: Partial<Omit<StudentType, 'id' | 'createdAt' | 'updatedAt'>>
    ): Promise<StudentType> => {
      const response = await apiClient.patch(`/students/${id}`, data);
      return response.data;
    },
    remove: async (id: string): Promise<void> => {
      await apiClient.delete(`/students/${id}`);
    },
  },
};
