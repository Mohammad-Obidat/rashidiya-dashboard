import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/apiClient';
import type { CreateAdvisorDto, UpdateAdvisorDto } from '../types/program';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Save, ArrowRight, UserPlus, Edit } from 'lucide-react';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useToast } from '../contexts/ToastContext';

const MentorForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<CreateAdvisorDto | UpdateAdvisorDto>(
    {
      name: '',
      email: '',
      phone: '',
    }
  );
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchMentor = async () => {
        try {
          const mentor = await api.advisors.get(id);
          setFormData({
            name: mentor.name,
            email: mentor.email,
            phone: mentor.phone,
          });
        } catch (err) {
          setError('فشل في تحميل بيانات المشرف');
        } finally {
          setLoading(false);
        }
      };
      fetchMentor();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (isEditMode) {
        await api.advisors.update(id, formData as UpdateAdvisorDto);
        toast.success('تم تحديث بيانات المشرف بنجاح');
      } else {
        await api.advisors.create(formData as CreateAdvisorDto);
        toast.success('تم إضافة المشرف بنجاح');
      }
      navigate('/mentors');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'فشل في حفظ المشرف';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div className='flex items-center gap-4 mb-6'>
        <Button
          onClick={() => navigate('/mentors')}
          variant='secondary'
          className='h-10 w-10 p-0 flex items-center justify-center'
        >
          <ArrowRight size={20} />
        </Button>
        <h2 className='text-3xl font-bold text-gray-800'>
          {isEditMode ? (
            <Edit className='inline-block ml-2' />
          ) : (
            <UserPlus className='inline-block ml-2' />
          )}
          {isEditMode ? 'تعديل بيانات مشرف' : 'إضافة مشرف جديد'}
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className='bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto'
      >
        {error && <ErrorState error={error} />}

        <div className='space-y-6'>
          <Input
            name='name'
            label='الاسم الكامل'
            value={formData.name || ''}
            onChange={handleChange}
            required
          />
          <Input
            type='email'
            name='email'
            label='البريد الإلكتروني'
            value={formData.email || ''}
            onChange={handleChange}
            required
          />
          <Input
            name='phone'
            label='رقم الهاتف'
            value={formData.phone || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className='mt-8 flex justify-end gap-4'>
          <Button
            type='button'
            variant='secondary'
            onClick={() => navigate('/mentors')}
            disabled={isSaving}
          >
            إلغاء
          </Button>
          <Button
            type='submit'
            variant='primary'
            disabled={isSaving}
            className='flex items-center gap-2'
          >
            <Save size={18} />
            {isSaving ? 'جاري الحفظ...' : 'حفظ'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MentorForm;
