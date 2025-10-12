import { useState, useEffect } from 'react';
import { api } from '../lib/apiClient';
import type { Program } from '../types/program';

interface UseProgramsResult {
  programs: Program[];
  loading: boolean;
  error: string | null;
  fetchPrograms: () => Promise<void>;
  setPrograms: React.Dispatch<React.SetStateAction<Program[]>>;
}

const usePrograms = (): UseProgramsResult => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.programs.list();
      setPrograms(data);
    } catch (err: any) {
      setError(err.message || 'فشل في تحميل البرامج');
      console.error('Error fetching programs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return { programs, loading, error, fetchPrograms, setPrograms };
};

export default usePrograms;
