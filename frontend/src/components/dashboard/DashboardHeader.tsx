import React from 'react';
import Button from '../common/Button';

interface DashboardHeaderProps {
  programCount: number;
  onAddProgram: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  programCount,
  onAddProgram,
}) => {
  return (
    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
      <div>
        <h2 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1 py-2'>
          لوحة التحكم - البرامج اللامنهجية
        </h2>
        <p className='text-gray-600'>
          إدارة ومتابعة جميع البرامج اللامنهجية ({programCount} برنامج)
        </p>
      </div>
      <Button onClick={onAddProgram} variant='success'>
        + إضافة برنامج جديد
      </Button>
    </div>
  );
};

export default DashboardHeader;
