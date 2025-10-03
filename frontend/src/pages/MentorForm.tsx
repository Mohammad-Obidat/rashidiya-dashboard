import { useEffect, useState } from 'react';
import { api } from '../lib/apiClient';
import type { AdvisorType } from '../lib/apiClient';

import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function MentorForm({
  mode = 'new',
}: {
  mode?: 'new' | 'edit';
}) {
  const { id } = useParams();
  const [advisor, setAdvisor] = useState<
    Omit<AdvisorType, 'id' | 'createdAt' | 'updatedAt'>
  >({
    name: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdvisor = async () => {
      if (mode === 'edit' && id) {
        try {
          setLoading(true);
          const fetchedAdvisor = await api.advisors.get(id);
          setAdvisor(fetchedAdvisor);
        } catch (err) {
          console.error('Failed to fetch advisor:', err);
          setError('Failed to load advisor details.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchAdvisor();
  }, [mode, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === 'edit' && id) {
        await api.advisors.update(id, advisor);
      } else {
        await api.advisors.create(advisor);
      }
      navigate('/mentors');
    } catch (err) {
      console.error('Failed to save advisor:', err);
      setError('فشل في حفظ المرشد. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/mentors');
  };

  const handleChange = (field: keyof typeof advisor, value: string) => {
    setAdvisor((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <div className='text-center py-8'>جاري تحميل بيانات المرشد...</div>;
  }

  if (error) {
    return <div className='text-center py-8 text-red-600'>{error}</div>;
  }

  return (
    <div className='p-6 max-w-2xl mx-auto'>
      <h2 className='text-xl font-semibold mb-4'>
        {mode === 'new' ? 'إضافة مرشد' : 'تعديل مرشد'}
      </h2>
      <div className='bg-white p-6 rounded shadow'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <Input
            label='اسم المرشد'
            value={advisor.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder='اسم المرشد'
            required
          />
          <Input
            label='الهاتف'
            value={advisor.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder='رقم الهاتف'
            required
          />
          <Input
            label='البريد الإلكتروني'
            type='email'
            value={advisor.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder='البريد الإلكتروني'
            required
          />
          <div className='flex gap-2 mt-4 justify-end'>
            <Button
              type='button'
              variant='secondary'
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button type='submit' variant='primary' disabled={isSubmitting}>
              {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
