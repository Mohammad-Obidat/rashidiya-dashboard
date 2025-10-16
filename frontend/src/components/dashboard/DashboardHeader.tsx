import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';

interface DashboardHeaderProps {
  programCount: number;
  onAddProgram: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  programCount,
  onAddProgram,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1 py-2">
          {t('dashboard_title')}
        </h2>
        <p className="text-gray-600">
          {programCount === 1
            ? t('dashboard_subtitle', { count: programCount })
            : t('dashboard_subtitle_plural', { count: programCount })}
        </p>
      </div>
      <Button onClick={onAddProgram} variant="success">
        {t('add_new_program_button')}
      </Button>
    </div>
  );
};

export default DashboardHeader;
