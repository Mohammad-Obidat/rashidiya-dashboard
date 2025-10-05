import React from 'react';
import Button from './common/Button';

interface EmptyStateProps {
  isFiltered: string;
  onAddProgram: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onAddProgram,
}) => {
  return (
    <div className='text-center py-16 bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300'>
      <div className='text-gray-400 text-6xl mb-4'>📋</div>
      <p className='text-gray-500 text-xl font-medium mb-2'>
        {isFiltered ? 'لا توجد برامج مطابقة للبحث' : 'لا توجد برامج متاحة'}
      </p>
      <p className='text-gray-400 text-sm mb-6'>
        {isFiltered
          ? 'جرب تغيير معايير البحث أو الفلترة'
          : 'ابدأ بإضافة برنامج جديد'}
      </p>
      {!isFiltered && (
        <Button onClick={onAddProgram} variant='primary'>
          + إضافة برنامج جديد
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
