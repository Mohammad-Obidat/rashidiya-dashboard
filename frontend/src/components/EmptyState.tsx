import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from './common/Button';

interface EmptyStateProps {
  isFiltered: boolean;
  onAddProgram: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onAddProgram,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <div
      className="text-center py-16 bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300"
      dir={i18n.dir()}
    >
      <div className="text-gray-400 text-6xl mb-4">📋</div>
      <p className="text-gray-500 text-xl font-medium mb-2">
        {isFiltered
          ? t('emptyState.noMatchingPrograms')
          : t('emptyState.noPrograms')}
      </p>
      <p className="text-gray-400 text-sm mb-6">
        {isFiltered
          ? t('emptyState.tryAdjustFilters')
          : t('emptyState.startByAdding')}
      </p>
      {!isFiltered && (
        <Button onClick={onAddProgram} variant="primary">
          {t('emptyState.addNewProgram')}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
