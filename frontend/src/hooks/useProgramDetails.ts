import { useState, useEffect } from 'react';
import { api } from '../lib/apiClient';
import type {
  Program,
  Student,
  Session,
  AttendanceRecord,
  Advisor,
} from '../types/program';

interface UseProgramDetailsResult {
  program: Program | null;
  students: Student[];
  sessions: Session[];
  attendance: AttendanceRecord[];
  advisor: Advisor | null;
  loading: boolean;
  error: string | null;
}

const useProgramDetails = (programId?: string): UseProgramDetailsResult => {
  const [program, setProgram] = useState<Program | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [advisor, setAdvisor] = useState<Advisor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!programId || programId === 'new') {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [progData, studData, sessData, attData] = await Promise.all([
          api.programs.get(programId),
          api.students.list(),
          api.sessions.byProgram(programId),
          api.attendanceRecords.byProgram(programId),
        ]);

        setProgram(progData);
        setStudents(
          studData.filter((s) =>
            progData.students?.some((ps) => ps.studentId === s.id)
          )
        );
        setSessions(sessData);
        setAttendance(attData);
        if (progData.currentAdvisorId) {
          const advData = await api.advisors.get(progData.currentAdvisorId);
          setAdvisor(advData);
        }
      } catch (err: any) {
        setError(err.message || 'فشل في تحميل تفاصيل البرنامج');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [programId]);

  return { program, students, sessions, attendance, advisor, loading, error };
};

export default useProgramDetails;
