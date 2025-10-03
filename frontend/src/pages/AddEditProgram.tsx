import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/common/Button';
import { ArrowRight, Save, X } from 'lucide-react';
import { ProgramType, ProgramStatus } from '../types/program';
import type { IProgramFormData } from '../types/program';

const AddEditProgram: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = id !== 'new';

  const [formData, setFormData] = useState<IProgramFormData>({
    name: '',
    type: ProgramType.SCIENTIFIC,
    description: '',
    status: ProgramStatus.ACTIVE,
  });

  const [errors, setErrors] = useState<Partial<IProgramFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && id) {
      // في التطبيق الحقيقي، سيتم جلب بيانات البرنامج من الخادم
      // هنا نستخدم بيانات تجريبية
      setFormData({
        name: 'نادي الروبوت',
        type: ProgramType.SCIENTIFIC,
        description:
          'برنامج تعليمي لتطوير مهارات البرمجة والروبوتات للطلاب المهتمين بالتكنولوجيا',
        status: ProgramStatus.ACTIVE,
      });
    }
  }, [id, isEditMode]);

  const validateForm = (): boolean => {
    const newErrors: Partial<IProgramFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'اسم البرنامج مطلوب';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'وصف البرنامج مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // محاكاة عملية الحفظ
    setTimeout(() => {
      console.log('حفظ البرنامج:', formData);
      navigate('/');
    }, 1500);
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleChange = (
    field: keyof IProgramFormData,
    value: string | ProgramType | ProgramStatus
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // مسح الخطأ عند التعديل
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <button
            onClick={handleCancel}
            className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200'
          >
            <ArrowRight className='w-5 h-5' />
            <span>العودة إلى القائمة</span>
          </button>

          <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-100'>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 pb-2'>
              {isEditMode ? 'تعديل البرنامج' : 'إضافة برنامج جديد'}
            </h1>
            <p className='text-gray-600'>
              {isEditMode
                ? 'قم بتعديل معلومات البرنامج'
                : 'أدخل معلومات البرنامج الجديد'}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className='bg-white rounded-xl shadow-lg p-8 border border-gray-100'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* اسم البرنامج */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                اسم البرنامج <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.name
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder='مثال: نادي الروبوت'
              />
              {errors.name && (
                <p className='mt-1 text-sm text-red-600'>{errors.name}</p>
              )}
            </div>

            {/* نوع البرنامج */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                نوع البرنامج <span className='text-red-500'>*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  handleChange('type', e.target.value as ProgramType)
                }
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200'
              >
                {Object.values(ProgramType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* وصف البرنامج */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                وصف البرنامج <span className='text-red-500'>*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${
                  errors.description
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder='أدخل وصفاً مختصراً للبرنامج...'
              />
              {errors.description && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.description}
                </p>
              )}
            </div>

            {/* حالة البرنامج */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                حالة البرنامج <span className='text-red-500'>*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  handleChange('status', e.target.value as ProgramStatus)
                }
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200'
              >
                {Object.values(ProgramStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* معلومات إضافية */}
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <h3 className='text-sm font-semibold text-blue-900 mb-2'>
                ملاحظة
              </h3>
              <p className='text-sm text-blue-700'>
                بعد إنشاء البرنامج، يمكنك إضافة المرشد والطلاب والجدول الزمني من
                صفحة تفاصيل البرنامج.
              </p>
            </div>

            {/* Action Buttons */}
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
                    <span>
                      {isEditMode ? 'حفظ التعديلات' : 'إضافة البرنامج'}
                    </span>
                  </div>
                )}
              </Button>

              <Button
                type='button'
                variant='secondary'
                onClick={handleCancel}
                disabled={isSubmitting}
                className='flex-1 py-3 text-base font-semibold'
              >
                <div className='flex items-center justify-center gap-2'>
                  <X className='w-5 h-5' />
                  <span>إلغاء</span>
                </div>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditProgram;
