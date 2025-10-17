import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/apiClient';
import type { CreateStudentDto, UpdateStudentDto } from '../types/program';
import { Gender } from '../types/program';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Save, ArrowRight, UserPlus, Edit, ArrowLeft } from 'lucide-react';
import {
  gradeOptions,
  sectionOptions,
  getAllGenders,
} from '../config/programConfig';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useToast } from '../contexts/ToastContext';

const StudentForm: React.FC = () => {
  const { t, i18n } = useTranslation();
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

  // Dynamically get translated options based on current language
  const getTranslatedGradeOptions = () =>
    gradeOptions.map((opt) => ({
      value: opt.value,
      label: t(`grade.${opt.value}`),
    }));

  const getTranslatedSectionOptions = () =>
    sectionOptions.map((opt) => ({
      value: opt.value,
      label: t(`section.${opt.value}`),
    }));

  const getTranslatedGenderOptions = () =>
    genderOptions.map((opt) => ({
      value: opt.value,
      label: t(`gender.${opt.value}`),
    }));

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
  if (error && isEditMode) return <ErrorState error={error} />;

  const isRTL = i18n.language === 'ar' || i18n.language === 'he';

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={`flex items-center gap-4 mb-6`}>
        <Button
          onClick={() => navigate('/students')}
          variant="secondary"
          className="h-10 w-10 p-0 flex items-center justify-center flex-shrink-0"
        >
          {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
        </Button>
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          {isEditMode ? (
            <>
              <Edit size={28} className="flex-shrink-0" />
              {t('edit_student_title')}
            </>
          ) : (
            <>
              <UserPlus size={28} className="flex-shrink-0" />
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
          {/* Name Field */}
          <Input
            name="name"
            label={t('student_name_label')}
            value={formData.name || ''}
            onChange={handleChange}
            required
            placeholder={t('student_name_label')}
          />

          {/* Student Number Field */}
          <Input
            name="studentNumber"
            label={t('student_number_label')}
            value={formData.studentNumber || ''}
            onChange={handleChange}
            required
            placeholder={t('student_number_label')}
          />

          {/* Grade Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('student_grade_label')}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isRTL ? 'text-right' : 'text-left'
              }`}
              required
            >
              <option value="">{t('select_grade')}</option>
              {getTranslatedGradeOptions().map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Section Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('student_section_label')}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              name="section"
              value={formData.section}
              onChange={handleChange}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isRTL ? 'text-right' : 'text-left'
              }`}
              required
            >
              <option value="">{t('select_section')}</option>
              {getTranslatedSectionOptions().map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Gender Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('student_gender_label')}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender || Gender.MALE}
              onChange={handleChange}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isRTL ? 'text-right' : 'text-left'
              }`}
              required
            >
              {getTranslatedGenderOptions().map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Birth Date Field */}
          <Input
            type="date"
            name="birthDate"
            label={t('student_birthdate_label')}
            value={formData.birthDate || ''}
            onChange={handleChange}
          />

          {/* Phone Field */}
          <Input
            name="phone"
            label={t('student_phone_label')}
            value={formData.phone || ''}
            onChange={handleChange}
            placeholder={t('student_phone_label')}
            type="tel"
          />

          {/* Address Field */}
          <Input
            name="address"
            label={t('student_address_label')}
            value={formData.address || ''}
            onChange={handleChange}
            placeholder={t('student_address_label')}
          />
        </div>

        {/* Form Actions */}
        <div
          className={`mt-8 flex justify-end gap-4 ${
            isRTL ? 'flex-row-reverse' : ''
          }`}
        >
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
