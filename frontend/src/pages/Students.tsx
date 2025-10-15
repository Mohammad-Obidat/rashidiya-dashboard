import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/apiClient';
import type { Student, Program } from '../types/program';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import AssignStudentModal from '../components/modals/AssignStudentModal';
import {
  PlusCircle,
  Search,
  FileDown,
  Trash2,
  Edit,
  UserPlus,
  MoreVertical,
} from 'lucide-react';
import { exportToXLSX, exportToPDF } from '../lib/exportUtils';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useToast } from '../contexts/ToastContext';

const Students: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [studentsData, programsData] = await Promise.all([
          api.students.list(),
          api.programs.list(),
        ]);
        setStudents(studentsData);
        setPrograms(programsData);
      } catch (err: any) {
        setError(err.message || 'فشل في تحميل الطلاب');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredStudents = useMemo(
    () =>
      students.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentNumber.includes(searchTerm)
      ),
    [students, searchTerm]
  );

  const handleDeleteClick = (id: string) => {
    setStudentToDelete(id);
    setDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    setIsDeleting(true);
    try {
      await api.students.remove(studentToDelete);
      setStudents(students.filter((s) => s.id !== studentToDelete));
      setDeleteModalOpen(false);
      setStudentToDelete(null);
      toast.success('تم حذف الطالب بنجاح');
    } catch (err: any) {
      toast.error('فشل في حذف الطالب');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAssignClick = (studentId: string) => {
    setSelectedStudent(studentId);
    setAssignModalOpen(true);
    setOpenMenuId(null);
  };

  const handleAssign = async (programId: string) => {
    if (!selectedStudent) return;

    try {
      await api.studentPrograms.create({
        studentId: selectedStudent,
        programId: programId,
        joinDate: new Date().toISOString(),
      });

      toast.success('تم تعيين الطالب للبرنامج بنجاح');
      setSelectedStudent(null);
    } catch (err: any) {
      toast.error('فشل في تعيين الطالب للبرنامج');
      throw err;
    }
  };

  const handleExportXLSX = async () => {
    try {
      await exportToXLSX('STUDENTS', {}, 'قائمة_الطلاب.xlsx');
      toast.success('تم تصدير الملف بنجاح');
    } catch (err: any) {
      toast.error('فشل في تصدير الملف');
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF('STUDENTS', {}, 'قائمة_الطلاب.pdf');
      toast.success('تم تصدير الملف بنجاح');
    } catch (err: any) {
      toast.error('فشل في تصدير الملف');
    }
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className='p-4 sm:p-6 bg-gray-50 min-h-screen'>
      {/* Header Section */}
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6'>
        <h2 className='text-2xl sm:text-3xl font-bold text-gray-800'>قائمة الطلاب</h2>
        <Button
          onClick={() => navigate('/students/new')}
          variant='primary'
          className='flex items-center justify-center gap-2 w-full sm:w-auto'
        >
          <PlusCircle size={18} className='sm:w-5 sm:h-5' />
          <span className='text-sm sm:text-base'>إضافة طالب جديد</span>
        </Button>
      </div>

      {/* Search and Export Section */}
      <div className='bg-white p-3 sm:p-4 rounded-lg shadow-sm mb-4 sm:mb-6 space-y-3 sm:space-y-0 sm:flex sm:justify-between sm:items-center'>
        <div className='relative w-full sm:max-w-md'>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='ابحث بالاسم أو الرقم الأكاديمي...'
            className='pl-10 text-sm sm:text-base'
          />
          <Search
            size={18}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:w-5 sm:h-5'
          />
        </div>
        <div className='flex gap-2'>
          <Button
            onClick={handleExportXLSX}
            variant='secondary'
            className='flex items-center justify-center gap-1 sm:gap-2 flex-1 sm:flex-initial text-xs sm:text-sm'
          >
            <FileDown size={16} className='sm:w-[18px] sm:h-[18px]' />
            <span className='hidden xs:inline'>تصدير</span> XLSX
          </Button>
          <Button
            onClick={handleExportPDF}
            variant='secondary'
            className='flex items-center justify-center gap-1 sm:gap-2 flex-1 sm:flex-initial text-xs sm:text-sm'
          >
            <FileDown size={16} className='sm:w-[18px] sm:h-[18px]' />
            <span className='hidden xs:inline'>تصدير</span> PDF
          </Button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className='hidden lg:block bg-white rounded-lg shadow overflow-x-auto'>
        <table className='w-full text-right'>
          <thead className='bg-gray-100 text-gray-600 uppercase text-sm'>
            <tr>
              <th className='p-3 lg:p-4'>الاسم</th>
              <th className='p-3 lg:p-4'>الرقم الأكاديمي</th>
              <th className='p-3 lg:p-4'>الصف/الشعبة</th>
              <th className='p-3 lg:p-4'>الجنس</th>
              <th className='p-3 lg:p-4'>تاريخ الميلاد</th>
              <th className='p-3 lg:p-4 text-center'>إجراءات</th>
            </tr>
          </thead>
          <tbody className='text-gray-700'>
            {filteredStudents.map((student) => (
              <tr
                key={student.id}
                className='border-b border-gray-200 hover:bg-gray-50'
              >
                <td className='p-3 lg:p-4 font-medium'>{student.name}</td>
                <td className='p-3 lg:p-4'>{student.studentNumber}</td>
                <td className='p-3 lg:p-4'>
                  {student.grade} / {student.section}
                </td>
                <td className='p-3 lg:p-4'>
                  {student.gender === 'MALE' ? 'ذكر' : 'أنثى'}
                </td>
                <td className='p-3 lg:p-4'>
                  {student.birthDate
                    ? new Date(student.birthDate).toISOString().split('T')[0]
                    : ''}
                </td>
                <td className='p-3 lg:p-4'>
                  <div className='flex justify-center gap-2'>
                    <Button
                      onClick={() => handleAssignClick(student.id)}
                      variant='primary'
                      className='h-8 w-8 p-0 flex items-center justify-center'
                      title='تعيين إلى برنامج'
                    >
                      <UserPlus size={16} />
                    </Button>
                    <Button
                      onClick={() => navigate(`/students/edit/${student.id}`)}
                      variant='secondary'
                      className='h-8 w-8 p-0 flex items-center justify-center'
                      title='تعديل'
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      onClick={() => handleDeleteClick(student.id)}
                      variant='danger'
                      className='h-8 w-8 p-0 flex items-center justify-center'
                      title='حذف'
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStudents.length === 0 && (
          <div className='text-center p-8 text-gray-500'>
            لا يوجد طلاب لعرضهم.
          </div>
        )}
      </div>

      {/* Mobile/Tablet Card View */}
      <div className='lg:hidden space-y-3'>
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className='bg-white rounded-lg shadow-sm p-4 space-y-3'
          >
            <div className='flex items-start justify-between'>
              <div className='flex-1 min-w-0'>
                <h3 className='font-semibold text-base text-gray-800'>
                  {student.name}
                </h3>
                <div className='mt-2 space-y-1.5'>
                  <p className='text-sm text-gray-600'>
                    <span className='font-medium'>الرقم الأكاديمي:</span>{' '}
                    {student.studentNumber}
                  </p>
                  <p className='text-sm text-gray-600'>
                    <span className='font-medium'>الصف/الشعبة:</span>{' '}
                    {student.grade} / {student.section}
                  </p>
                  <p className='text-sm text-gray-600'>
                    <span className='font-medium'>الجنس:</span>{' '}
                    {student.gender === 'MALE' ? 'ذكر' : 'أنثى'}
                  </p>
                  {student.birthDate && (
                    <p className='text-sm text-gray-600'>
                      <span className='font-medium'>تاريخ الميلاد:</span>{' '}
                      {new Date(student.birthDate).toISOString().split('T')[0]}
                    </p>
                  )}
                </div>
              </div>
              <div className='relative'>
                <button
                  onClick={() => toggleMenu(student.id)}
                  className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                >
                  <MoreVertical size={20} className='text-gray-600' />
                </button>
                {openMenuId === student.id && (
                  <>
                    <div
                      className='fixed inset-0 z-10'
                      onClick={() => setOpenMenuId(null)}
                    />
                    <div className='absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20'>
                      <button
                        onClick={() => handleAssignClick(student.id)}
                        className='w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2'
                      >
                        <UserPlus size={16} />
                        تعيين إلى برنامج
                      </button>
                      <button
                        onClick={() => {
                          navigate(`/students/edit/${student.id}`);
                          setOpenMenuId(null);
                        }}
                        className='w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2'
                      >
                        <Edit size={16} />
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDeleteClick(student.id)}
                        className='w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2'
                      >
                        <Trash2 size={16} />
                        حذف
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredStudents.length === 0 && (
          <div className='bg-white rounded-lg shadow-sm p-8 text-center text-gray-500'>
            لا يوجد طلاب لعرضهم.
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title='تأكيد الحذف'
        footer={
          <>
            <Button
              variant='secondary'
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
              className='text-sm sm:text-base'
            >
              إلغاء
            </Button>
            <Button
              variant='danger'
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className='text-sm sm:text-base'
            >
              {isDeleting ? 'جاري الحذف...' : 'حذف'}
            </Button>
          </>
        }
      >
        <p className='text-sm sm:text-base'>
          هل أنت متأكد من حذف هذا الطالب؟ لا يمكن التراجع عن هذا الإجراء.
        </p>
      </Modal>

      {/* Assign Student Modal */}
      <AssignStudentModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        onAssign={handleAssign}
        programs={programs}
      />
    </div>
  );
};

export default Students;