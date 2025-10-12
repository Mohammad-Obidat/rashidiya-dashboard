import { useState, useMemo } from 'react';
import type { Program, ProgramStatus, ProgramTypeEnum } from '../types/program';

interface UseProgramFilteringResult {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: 'all' | ProgramTypeEnum;
  setFilterType: (type: 'all' | ProgramTypeEnum) => void;
  filterStatus: 'all' | ProgramStatus;
  setFilterStatus: (status: 'all' | ProgramStatus) => void;
  filteredPrograms: Program[];
  hasActiveFilters: boolean;
  resetFilters: () => void;
}

const useProgramFiltering = (
  programs: Program[]
): UseProgramFilteringResult => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | ProgramTypeEnum>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | ProgramStatus>(
    'all'
  );

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const matchesSearch =
        program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === 'all' || program.type === filterType;
      const matchesStatus =
        filterStatus === 'all' || program.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [programs, searchTerm, filterType, filterStatus]);

  const hasActiveFilters =
    !!searchTerm || filterType !== 'all' || filterStatus !== 'all';

  const resetFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterStatus('all');
  };

  return {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    filteredPrograms,
    hasActiveFilters,
    resetFilters,
  };
};

export default useProgramFiltering;
