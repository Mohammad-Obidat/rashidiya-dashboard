import React from 'react';
import { useTranslation } from 'react-i18next';
import ProgramCard from './ProgramCard';
import type { Program } from '../types/program';

interface ProgramsGridProps {
  programs: Program[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProgramsGrid: React.FC<ProgramsGridProps> = ({
  programs,
  onView,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {programs.map((program) => (
        <ProgramCard
          key={program.id}
          program={program}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProgramsGrid;
