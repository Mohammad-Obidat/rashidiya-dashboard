import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/apiClient';
import type { CreateStudentDto, UpdateStudentDto } from '../types/program';
import { Gender } from '../types/program';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Save, ArrowRight, UserPlus, Edit } from 'lucide-react';
import {
  gradeOptions,
  sectionOptions,
  getAllGenders,
} from '../config/programConfig';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useToast } from '../contexts/ToastContext';

const StudentForm: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<CreateStudentDto | UpdateStudentDto>(
    {
      name: '',
      studentNumber: '',
      grade: '',
      section: '',
      gender: Gender.MALE,
      birthDate: '',
      phone: '',
      address: '',
    }
  );
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const genderOptions = getAllGenders();

  useEffect(() => {
    if (isEditMode) {
      const fetchStudent = async () => {
        try {
          const student = await api.students.get(id);
          setFormData({
            name: student.name,
            studentNumber: student.studentNumber,
            grade: student.grade,
            section: student.section,
            gender: student.gender || Gender.MALE,
            birthDate: student.birthDate
              ? new Date(student.birthDate).toISOString().split('T')[0]
              : '',
            phone: student.phone || '',
            address: student.address || '',
          });
        } catch (err) {
          setError(t('load_student_failed'));
        } finally {
          setLoading(false);
        }
      };
      fetchStudent();
    }
  }, [id, isEditMode, t]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const dataToSend = {
        ...formData,
        birthDate: formData.birthDate
          ? new Date(formData.birthDate).toISOString()
          : null,
      };

      if (isEditMode) {
        await api.students.update(id, dataToSend as UpdateStudentDto);
        toast.success(t('student_updated_success'));
      } else {
        await api.students.create(dataToSend as CreateStudentDto);
        toast.success(t('student_added_success'));
      }

      navigate('/students');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || t('student_save_failed');
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={() => navigate('/students')}
          variant="secondary"
          className="h-10 w-10 p-0 flex items-center justify-center"
        >
          <ArrowRight size={20} />
        </Button>
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          {isEditMode ? (
            <>
              <Edit size={28} />
              {t('edit_student_title')}
            </>
          ) : (
            <>
              <UserPlus size={28} />
              {t('add_student_title')}
            </>
          )}
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto"
      >
        {error && <ErrorState error={error} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            name="name"
            label={t('student_name_label')}
            value={formData.name || ''}
            onChange={handleChange}
            required
          />
          <Input
            name="studentNumber"
            label={t('student_number_label')}
            value={formData.studentNumber || ''}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('student_grade_label')}
            </label>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">{t('select_grade')}</option>
              {gradeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('student_section_label')}
            </label>
            <select
              name="section"
              value={formData.section}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">{t('select_section')}</option>
              {sectionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('student_gender_label')}
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {genderOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            type="date"
            name="birthDate"
            label={t('student_birthdate_label')}
            value={formData.birthDate || ''}
            onChange={handleChange}
          />
          <Input
            name="phone"
            label={t('student_phone_label')}
            value={formData.phone || ''}
            onChange={handleChange}
          />
          <Input
            name="address"
            label={t('student_address_label')}
            value={formData.address || ''}
            onChange={handleChange}
          />
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/students')}
            disabled={isSaving}
          >
            {t('form_cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save size={18} />
            {isSaving ? t('form_saving') : t('save')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
