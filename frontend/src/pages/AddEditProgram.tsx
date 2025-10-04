import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProgramStatus, ProgramTypeEnum } from '../types/program';
import { getAllStatuses, getAllTypes } from '../config/programConfig';
import { api } from '../lib/apiClient';
import type { Program } from '../types/program';

// Import separated components
import FormHeader from '../components/form/FormHeader';
import FormInputField from '../components/form/FormInputField';
import FormTextAreaField from '../components/form/FormTextAreaField';
import FormSelectField from '../components/form/FormSelectField';
import FormActionButtons from '../components/form//FormActionButtons';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

interface ProgramFormData {
  name: string;
  type: ProgramTypeEnum;
  description: string;
  status: ProgramStatus;
}

const AddEditProgram: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = id !== 'new' && !!id;

  const [formData, setFormData] = useState<ProgramFormData>({
    name: '',
    type: ProgramTypeEnum.SCIENTIFIC,
    description: '',
    status: ProgramStatus.ACTIVE,
  });

  const [errors, setErrors] = useState<Partial<ProgramFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const statusOptions = getAllStatuses();
  const typeOptions = getAllTypes();

  useEffect(() => {
    if (isEditMode && id) {
      const fetchProgram = async () => {
        try {
          setIsLoading(true);
          setLoadError(null);
          const program: Program = await api.programs.get(id);
          setFormData({
            name: program.name,
            type: program.type,
            description: program.description,
            status: program.status,
          });
        } catch (err: any) {
          setLoadError(err.message || 'فشل في تحميل بيانات البرنامج');
          console.error('Error fetching program:', err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProgram();
    }
  }, [id, isEditMode]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ProgramFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'اسم البرنامج مطلوب';
    } else if (formData.name.length < 3) {
      newErrors.name = 'اسم البرنامج يجب أن يكون 3 أحرف على الأقل';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'وصف البرنامج مطلوب';
    } else if (formData.description.length < 10) {
      newErrors.description = 'وصف البرنامج يجب أن يكون 10 أحرف على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (isEditMode && id) {
        await api.programs.update(id, formData);
      } else {
        await api.programs.create(formData);
      }
      navigate('/');
    } catch (err: any) {
      console.error('Error saving program:', err);
      alert(
        err.response?.data?.message ||
          err.message ||
          'فشل في حفظ البرنامج. الرجاء المحاولة مرة أخرى.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    field: keyof ProgramFormData,
    value: string | ProgramTypeEnum | ProgramStatus
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return;

    const hasChanges =
      formData.name ||
      formData.description !== '' ||
      formData.type !== ProgramTypeEnum.SCIENTIFIC ||
      formData.status !== ProgramStatus.ACTIVE;

    if (hasChanges && !isEditMode) {
      if (
        window.confirm('هل أنت متأكد من الإلغاء؟ سيتم فقدان جميع التغييرات.')
      ) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (loadError) {
    return (
      <ErrorState error={loadError} onRetry={() => window.location.reload()} />
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
      <div className='container mx-auto px-4 py-8'>
        <FormHeader
          isEditMode={isEditMode}
          onBack={() => navigate('/')}
          disabled={isSubmitting}
        />

        <div className='bg-white rounded-xl shadow-lg p-8 border border-gray-100'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <FormInputField
              label='اسم البرنامج'
              value={formData.name}
              onChange={(value) => handleChange('name', value)}
              placeholder='مثال: نادي الروبوت'
              error={errors.name}
              disabled={isSubmitting}
              required
            />

            <FormSelectField
              label='نوع البرنامج'
              value={formData.type}
              onChange={(value) =>
                handleChange('type', value as ProgramTypeEnum)
              }
              options={typeOptions}
              disabled={isSubmitting}
              required
            />

            <FormTextAreaField
              label='وصف البرنامج'
              value={formData.description}
              onChange={(value) => handleChange('description', value)}
              placeholder='أدخل وصفاً مختصراً للبرنامج...'
              error={errors.description}
              disabled={isSubmitting}
              required
              rows={4}
              showCharCount
            />

            <FormSelectField
              label='حالة البرنامج'
              value={formData.status}
              onChange={(value) =>
                handleChange('status', value as ProgramStatus)
              }
              options={statusOptions}
              disabled={isSubmitting}
              required
            />

            <FormActionButtons
              isEditMode={isEditMode}
              isSubmitting={isSubmitting}
              onCancel={handleCancel}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditProgram;
