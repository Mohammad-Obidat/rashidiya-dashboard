import React from 'react';
import { useTranslation } from 'react-i18next';
import Input from '../common/Input';
import { ProgramStatus, ProgramTypeEnum } from '../../types/program';

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: 'all' | ProgramTypeEnum;
  onTypeChange: (value: 'all' | ProgramTypeEnum) => void;
  filterStatus: 'all' | ProgramStatus;
  onStatusChange: (value: 'all' | ProgramStatus) => void;
  typeOptions: Array<{ value: ProgramTypeEnum; icon: string }>;
  statusOptions: Array<{ value: ProgramStatus; icon: string }>;
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
  const { t } = useTranslation();

  const hasActiveFilters =
    searchTerm || filterType !== 'all' || filterStatus !== 'all';

  // Dynamically translate labels based on current language
  const typeOptionsTranslated = typeOptions.map((option) => ({
    ...option,
    label: t(`type.${option.value}`),
  }));

  const statusOptionsTranslated = statusOptions.map((option) => ({
    ...option,
    label: t(`status.${option.value}`),
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8 backdrop-blur-sm bg-opacity-90">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {t('search_filter_title')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search Input */}
        <Input
          label={t('search_label')}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('search_placeholder')}
        />

        {/* Program Type Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('program_type_label')}
          </label>
          <select
            value={filterType}
            onChange={(e) => onTypeChange(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{t('all_types_option')}</option>
            {typeOptionsTranslated.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('status_label')}
          </label>
          <select
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{t('all_statuses_option')}</option>
            {statusOptionsTranslated.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Info */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {t('showing_results', {
              filtered: filteredCount,
              total: totalCount,
            })}
          </p>
          <button
            onClick={onResetFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {t('reset_filters_button')}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchFilterBar;
