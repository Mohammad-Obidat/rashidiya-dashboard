import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
          console.error(err);
          setError(t('load_mentor_failed'));
        } finally {
          setLoading(false);
        }
      };
      fetchMentor();
    }
  }, [id, isEditMode, t]);

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
        toast.success(t('mentor_updated_success'));
      } else {
        await api.advisors.create(formData as CreateAdvisorDto);
        toast.success(t('mentor_added_success'));
      }
      navigate('/mentors');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || t('mentor_save_failed');
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingState />;
  if (error && !formData.name) return <ErrorState error={error} />;

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Button
          onClick={() => navigate('/mentors')}
          variant="secondary"
          className="h-9 w-9 sm:h-10 sm:w-10 p-0 flex items-center justify-center flex-shrink-0"
        >
          <ArrowRight size={18} className="sm:w-5 sm:h-5" />
        </Button>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2 flex-wrap">
          {isEditMode ? (
            <Edit className="inline-block w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <UserPlus className="inline-block w-5 h-5 sm:w-6 sm:h-6" />
          )}
          <span className="break-words">
            {isEditMode ? t('edit_mentor_title') : t('add_mentor_title')}
          </span>
        </h2>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md max-w-2xl mx-auto"
      >
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm sm:text-base">{error}</p>
          </div>
        )}

        <div className="space-y-4 sm:space-y-6">
          <Input
            name="name"
            label={t('mentor_full_name')}
            value={formData.name || ''}
            onChange={handleChange}
            required
            className="text-sm sm:text-base"
          />
          <Input
            type="email"
            name="email"
            label={t('mentor_email')}
            value={formData.email || ''}
            onChange={handleChange}
            required
            className="text-sm sm:text-base"
          />
          <Input
            name="phone"
            label={t('mentor_phone')}
            value={formData.phone || ''}
            onChange={handleChange}
            required
            className="text-sm sm:text-base"
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/mentors')}
            disabled={isSaving}
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSaving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Save size={16} className="sm:w-[18px] sm:h-[18px]" />
            {isSaving ? t('saving') : t('save')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MentorForm;
