import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/common/Button';
import { ArrowRight, Save, X } from 'lucide-react';
import { ProgramTypeEnum, ProgramStatus } from '../types/program';
import useProgramForm from '../hooks/useProgramForm';
import useProgramData from '../hooks/useProgramData';
import useProgramSubmission from '../hooks/useProgramSubmission';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

const AddEditProgram: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { loading, error, advisors, students, initialProgram } = useProgramData(
    id,
    !!id
  );
  const { formData, handleChange, errors, validateForm, isEditMode } =
    useProgramForm({ initialProgram });

  const [selectedAdvisorId, setSelectedAdvisorId] = useState<string>('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  useEffect(() => {
    if (initialProgram) {
      setSelectedAdvisorId(initialProgram.currentAdvisorId || '');
      if (initialProgram.students && initialProgram.students.length > 0) {
        setSelectedStudentIds(
          initialProgram.students.map((sp) => sp.studentId)
        );
      }
    }
  }, [initialProgram]);

  const { isSubmitting, submitProgram, submissionError } = useProgramSubmission(
    {
      formData,
      selectedAdvisorId,
      selectedStudentIds,
      isEditMode,
      programId: id,
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await submitProgram();
    }
  };

  const handleCancel = () => {
    navigate('/programs');
  };

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudentIds((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((sid) => sid !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  if (loading) return <LoadingState />;
  if (error || submissionError)
    return <ErrorState error={error || submissionError || ''} />;

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
      <div className='container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 max-w-7xl'>
        <div className='mb-4 sm:mb-6 md:mb-8'>
          <button
            onClick={handleCancel}
            className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 sm:mb-4 transition-colors duration-200 cursor-pointer touch-manipulation'
            aria-label='العودة إلى القائمة'
          >
            <ArrowRight className='w-4 h-4 sm:w-5 sm:h-5' />
            <span className='text-sm sm:text-base'>العودة إلى القائمة</span>
          </button>

          <div className='bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-100'>
            <h1 className='text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1 sm:mb-2 pb-1 sm:pb-2'>
              {isEditMode ? 'تعديل البرنامج' : 'إضافة برنامج جديد'}
            </h1>
            <p className='text-sm sm:text-base text-gray-600'>
              {isEditMode
                ? 'قم بتعديل معلومات البرنامج'
                : 'أدخل معلومات البرنامج الجديد'}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className='bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100'>
          <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-5 md:space-y-6'>
            {/* اسم البرنامج */}
            <div>
              <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2'>
                اسم البرنامج <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.name
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder='مثال: نادي الروبوت'
              />
              {errors.name && (
                <p className='mt-1 text-xs sm:text-sm text-red-600'>{errors.name}</p>
              )}
            </div>

            {/* نوع البرنامج */}
            <div>
              <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2'>
                نوع البرنامج <span className='text-red-500'>*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  handleChange('type', e.target.value as ProgramTypeEnum)
                }
                className='w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200'
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
              <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2'>
                وصف البرنامج <span className='text-red-500'>*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${
                  errors.description
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder='أدخل وصفاً مختصراً للبرنامج...'
              />
              {errors.description && (
                <p className='mt-1 text-xs sm:text-sm text-red-600'>
                  {errors.description}
                </p>
              )}
            </div>

            {/* حالة البرنامج */}
            <div>
              <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2'>
                حالة البرنامج <span className='text-red-500'>*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  handleChange('status', e.target.value as ProgramStatus)
                }
                className='w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200'
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
              <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2'>
                المرشد
              </label>
              <select
                value={selectedAdvisorId}
                onChange={(e) => setSelectedAdvisorId(e.target.value)}
                className='w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200'
              >
                <option value=''>اختر مرشداً (اختياري)</option>
                {advisors.map((advisor) => (
                  <option key={advisor.id} value={advisor.id}>
                    {advisor.name} - {advisor.email}
                  </option>
                ))}
              </select>
              <p className='mt-1 text-xs sm:text-sm text-gray-500'>
                يمكنك اختيار مرشد للبرنامج أو تركه فارغاً
              </p>
            </div>

            {/* اختيار الطلاب */}
            <div>
              <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2'>
                الطلاب المسجلين
              </label>
              <div className='border border-gray-300 rounded-lg p-3 sm:p-4 max-h-48 sm:max-h-56 md:max-h-64 overflow-y-auto bg-gray-50'>
                {students.length === 0 ? (
                  <p className='text-sm sm:text-base text-gray-500 text-center py-3 sm:py-4'>
                    لا يوجد طلاب متاحين
                  </p>
                ) : (
                  <div className='space-y-1.5 sm:space-y-2'>
                    {students.map((student) => (
                      <label
                        key={student.id}
                        className='flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-white rounded-lg cursor-pointer transition-colors duration-200 touch-manipulation'
                      >
                        <input
                          type='checkbox'
                          checked={selectedStudentIds.includes(student.id)}
                          onChange={() => handleStudentToggle(student.id)}
                          className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0'
                        />
                        <div className='flex-1 min-w-0'>
                          <div className='font-medium text-gray-900 text-sm sm:text-base truncate'>
                            {student.name}
                          </div>
                          <div className='text-xs sm:text-sm text-gray-500 truncate'>
                            {student.studentNumber} - {student.grade} /{' '}
                            {student.section}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <p className='mt-2 text-xs sm:text-sm text-gray-500'>
                تم اختيار {selectedStudentIds.length} طالب/طالبة
              </p>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200'>
              <Button
                type='submit'
                variant='primary'
                disabled={isSubmitting}
                className='w-full sm:flex-1 py-2.5 sm:py-3 text-sm sm:text-base font-semibold'
              >
                {isSubmitting ? (
                  <div className='flex items-center justify-center gap-2'>
                    <div className='w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    <span>جاري الحفظ...</span>
                  </div>
                ) : (
                  <div className='flex items-center justify-center gap-2'>
                    <Save className='w-4 h-4 sm:w-5 sm:h-5' />
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
                className='w-full sm:flex-1 py-2.5 sm:py-3 text-sm sm:text-base font-semibold'
              >
                <div className='flex items-center justify-center gap-2'>
                  <X className='w-4 h-4 sm:w-5 sm:h-5' />
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