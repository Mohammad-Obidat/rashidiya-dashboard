import { useState, useEffect } from 'react';
import { api } from '../lib/apiClient';
import type { Program, Advisor, Student } from '../types/program';

interface UseProgramDataResult {
  advisors: Advisor[];
  students: Student[];
  loading: boolean;
  error: string | null;
  initialProgram?: Program;
}

const useProgramData = (
  programId?: string,
  isEditMode?: boolean
): UseProgramDataResult => {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [initialProgram, setInitialProgram] = useState<Program | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [advisorsData, studentsData] = await Promise.all([
          api.advisors.list(),
          api.students.list(),
        ]);
        setAdvisors(advisorsData);
        setStudents(studentsData);

        if (isEditMode && programId) {
          const programData = await api.programs.get(programId);
          setInitialProgram(programData);
        }
      } catch (err: any) {
        console.error('Failed to fetch data:', err);
        setError(err.message || 'Failed to load data for the form.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [programId, isEditMode]);

  return { advisors, students, loading, error, initialProgram };
};

export default useProgramData;
