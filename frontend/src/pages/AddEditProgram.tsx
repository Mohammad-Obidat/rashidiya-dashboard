import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/common/Button';
import { ArrowRight, Save, X } from 'lucide-react';
import { ProgramTypeEnum, ProgramStatus } from '../types/program';
import type { CreateProgramDto, Advisor, Student } from '../types/program';
import { api } from '../lib/apiClient';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

const AddEditProgram: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<CreateProgramDto>({
    name: '',
    type: ProgramTypeEnum.SCIENTIFIC,
    description: '',
    status: ProgramStatus.ACTIVE,
  });

  const [selectedAdvisorId, setSelectedAdvisorId] = useState<string>('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [errors, setErrors] = useState<Partial<CreateProgramDto>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch advisors and students for selection
        const [advisorsData, studentsData] = await Promise.all([
          api.advisors.list(),
          api.students.list(),
        ]);
        setAdvisors(advisorsData);
        setStudents(studentsData);

        // If edit mode, fetch program data
        if (isEditMode && id) {
          const programData = await api.programs.get(id);
          setFormData({
            name: programData.name,
            type: programData.type,
            description: programData.description,
            status: programData.status,
            currentAdvisorId: programData.currentAdvisorId || undefined,
          });
          setSelectedAdvisorId(programData.currentAdvisorId || '');

          // Get enrolled students
          if (programData.students && programData.students.length > 0) {
            const enrolledStudentIds = programData.students.map(
              (sp) => sp.studentId
            );
            setSelectedStudentIds(enrolledStudentIds);
          }
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load data for the form.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateProgramDto> = {};

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
    setError(null);

    try {
      // Prepare program data with advisor
      const programDto = {
        ...formData,
        currentAdvisorId: selectedAdvisorId || undefined,
      };

      let programId: string;

      if (isEditMode && id) {
        // Update program
        await api.programs.update(id, programDto);
        programId = id;

        // Get current enrolled students
        const currentEnrollments = await api.studentPrograms.byProgram(id);
        const currentStudentIds = currentEnrollments.map((sp) => sp.studentId);

        // Remove students that are no longer selected
        const studentsToRemove = currentStudentIds.filter(
          (sid) => !selectedStudentIds.includes(sid)
        );
        for (const studentId of studentsToRemove) {
          const enrollment = currentEnrollments.find(
            (sp) => sp.studentId === studentId
          );
          if (enrollment) {
            await api.studentPrograms.remove(enrollment.id);
          }
        }

        // Add new students
        const studentsToAdd = selectedStudentIds.filter(
          (sid) => !currentStudentIds.includes(sid)
        );
        for (const studentId of studentsToAdd) {
          await api.studentPrograms.create({
            studentId,
            programId: id,
            joinDate: new Date().toISOString(),
          });
        }
      } else {
        // Create new program
        const newProgram = await api.programs.create(programDto);
        programId = newProgram.id;

        // Enroll selected students
        for (const studentId of selectedStudentIds) {
          await api.studentPrograms.create({
            studentId,
            programId: newProgram.id,
            joinDate: new Date().toISOString(),
          });
        }
      }

      navigate(`/programs/${programId}`); // Redirect to program details page
    } catch (err) {
      console.error('Failed to save program:', err);
      setError('فشل في حفظ البرنامج. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleChange = (
    field: keyof CreateProgramDto,
    value: string | ProgramTypeEnum | ProgramStatus | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudentIds((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

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
                  handleChange('type', e.target.value as ProgramTypeEnum)
                }
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200'
              >
                {Object.values(ProgramTypeEnum).map((type) => (
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

            {/* اختيار المرشد */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                المرشد
              </label>
              <select
                value={selectedAdvisorId}
                onChange={(e) => setSelectedAdvisorId(e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200'
              >
                <option value=''>اختر مرشداً (اختياري)</option>
                {advisors.map((advisor) => (
                  <option key={advisor.id} value={advisor.id}>
                    {advisor.name} - {advisor.email}
                  </option>
                ))}
              </select>
              <p className='mt-1 text-sm text-gray-500'>
                يمكنك اختيار مرشد للبرنامج أو تركه فارغاً
              </p>
            </div>

            {/* اختيار الطلاب */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                الطلاب المسجلين
              </label>
              <div className='border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto bg-gray-50'>
                {students.length === 0 ? (
                  <p className='text-gray-500 text-center py-4'>
                    لا يوجد طلاب متاحين
                  </p>
                ) : (
                  <div className='space-y-2'>
                    {students.map((student) => (
                      <label
                        key={student.id}
                        className='flex items-center gap-3 p-3 hover:bg-white rounded-lg cursor-pointer transition-colors duration-200'
                      >
                        <input
                          type='checkbox'
                          checked={selectedStudentIds.includes(student.id)}
                          onChange={() => handleStudentToggle(student.id)}
                          className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                        />
                        <div className='flex-1'>
                          <div className='font-medium text-gray-900'>
                            {student.name}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {student.studentNumber} - {student.grade} /{' '}
                            {student.section}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <p className='mt-2 text-sm text-gray-500'>
                تم اختيار {selectedStudentIds.length} طالب/طالبة
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
