import React from 'react';
import Button from '../common/Button';
import { Save, X } from 'lucide-react';

interface FormActionButtonsProps {
  isEditMode: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
}

const FormActionButtons: React.FC<FormActionButtonsProps> = ({
  isEditMode,
  isSubmitting,
  onCancel,
}) => {
  return (
    <div className='flex gap-4 pt-6 border-t border-gray-200'>
      <Button
        type='submit'
        variant='primary'
        disabled={isSubmitting}
        className='flex-1 py-3 text-base font-semibold'
      >
        {isSubmitting ? (
          <div className='flex items-center justify-center gap-2'>
            <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
            <span>جاري الحفظ...</span>
          </div>
        ) : (
          <div className='flex items-center justify-center gap-2'>
            <Save className='w-5 h-5' />
            <span>{isEditMode ? 'حفظ التعديلات' : 'إضافة البرنامج'}</span>
          </div>
        )}
      </Button>

      <Button
        type='button'
        variant='secondary'
        onClick={onCancel}
        disabled={isSubmitting}
        className='flex-1 py-3 text-base font-semibold'
      >
        <div className='flex items-center justify-center gap-2'>
          <X className='w-5 h-5' />
          <span>إلغاء</span>
        </div>
      </Button>
    </div>
  );
};

export default FormActionButtons;
