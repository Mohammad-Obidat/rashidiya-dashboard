import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

interface FormHeaderProps {
  isEditMode: boolean;
  onBack: () => void;
  disabled?: boolean;
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  isEditMode,
  onBack,
  disabled = false,
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
        disabled={disabled}
      >
        <ArrowRight className="w-5 h-5" />
        <span>{t('form_back_to_list')}</span>
      </button>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {isEditMode ? t('edit_program') : t('add_new_program')}
        </h1>
        <p className="text-gray-600">
          {isEditMode ? t('edit_program_info') : t('add_program_info')}
        </p>
      </div>
    </div>
  );
};
