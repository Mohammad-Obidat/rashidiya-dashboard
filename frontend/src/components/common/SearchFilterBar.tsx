import React from 'react';
import Input from '../common/Input';
import { ProgramStatus, ProgramTypeEnum } from '../../types/program';

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: 'all' | ProgramTypeEnum;
  onTypeChange: (value: 'all' | ProgramTypeEnum) => void;
  filterStatus: 'all' | ProgramStatus;
  onStatusChange: (value: 'all' | ProgramStatus) => void;
  typeOptions: Array<{ value: string; label: string; icon: string }>;
  statusOptions: Array<{ value: string; label: string; icon: string }>;
  totalCount: number;
  filteredCount: number;
  onResetFilters: () => void;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  filterType,
  onTypeChange,
  filterStatus,
  onStatusChange,
  typeOptions,
  statusOptions,
  totalCount,
  filteredCount,
  onResetFilters,
}) => {
  const hasActiveFilters =
    searchTerm || filterType !== 'all' || filterStatus !== 'all';

  return (
    <div className='bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8 backdrop-blur-sm bg-opacity-90'>
      <h3 className='text-lg font-semibold text-gray-800 mb-4'>
        البحث والفلترة
      </h3>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Input
          label='البحث'
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder='ابحث عن برنامج...'
        />
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            نوع البرنامج
          </label>
          <select
            value={filterType}
            onChange={(e) => onTypeChange(e.target.value as any)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='all'>جميع الأنواع</option>
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            الحالة
          </label>
          <select
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value as any)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='all'>جميع الحالات</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className='mt-4 pt-4 border-t border-gray-200 flex items-center justify-between'>
          <p className='text-sm text-gray-600'>
            عرض {filteredCount} من {totalCount} برنامج
          </p>
          <button
            onClick={onResetFilters}
            className='text-sm text-blue-600 hover:text-blue-700 font-medium'
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchFilterBar;
