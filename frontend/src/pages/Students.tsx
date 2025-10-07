import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/apiClient';
import type { Student } from '../types/program';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { PlusCircle, Search, FileDown, Trash2, Edit } from 'lucide-react';
import { exportToXLSX, exportToPDF } from '../lib/exportUtils';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

const Students: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.students.list();
        setStudents(data);
      } catch (err: any) {
        setError(err.message || 'فشل في تحميل الطلاب');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
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
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    setIsDeleting(true);
    try {
      await api.students.remove(studentToDelete);
      setStudents(students.filter((s) => s.id !== studentToDelete));
      setDeleteModalOpen(false);
      setStudentToDelete(null);
    } catch (err: any) {
      setError('فشل في حذف الطالب');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportXLSX = async () => {
    try {
      await exportToXLSX('STUDENTS', {}, 'قائمة_الطلاب.xlsx');
    } catch (err: any) {
      setError(err.message || 'فشل في تصدير الملف');
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF('STUDENTS', {}, 'قائمة_الطلاب.pdf');
    } catch (err: any) {
      setError(err.message || 'فشل في تصدير الملف');
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-3xl font-bold text-gray-800'>قائمة الطلاب</h2>
        <Button
          onClick={() => navigate('/students/new')}
          variant='primary'
          className='flex items-center gap-2'
        >
          <PlusCircle size={20} />
          إضافة طالب جديد
        </Button>
      </div>

      <div className='bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center'>
        <div className='relative w-full max-w-md'>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='ابحث بالاسم أو الرقم الأكاديمي...'
            className='pl-10'
          />
          <Search
            size={20}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
          />
        </div>
        <div className='flex gap-2'>
          <Button
            onClick={handleExportXLSX}
            variant='secondary'
            className='flex items-center gap-2'
          >
            <FileDown size={18} />
            تصدير XLSX
          </Button>
          <Button
            onClick={handleExportPDF}
            variant='secondary'
            className='flex items-center gap-2'
          >
            <FileDown size={18} />
            تصدير PDF
          </Button>
        </div>
      </div>

      <div className='bg-white rounded-lg shadow overflow-x-auto'>
        <table className='w-full text-right'>
          <thead className='bg-gray-100 text-gray-600 uppercase text-sm'>
            <tr>
              <th className='p-4'>الاسم</th>
              <th className='p-4'>الرقم الأكاديمي</th>
              <th className='p-4'>الصف/الشعبة</th>
              <th className='p-4'>الجنس</th>
              <th className='p-4'>تاريخ الميلاد</th>
              <th className='p-4 text-center'>إجراءات</th>
            </tr>
          </thead>
          <tbody className='text-gray-700'>
            {filteredStudents.map((student) => (
              <tr
                key={student.id}
                className='border-b border-gray-200 hover:bg-gray-50'
              >
                <td className='p-4 font-medium'>{student.name}</td>
                <td className='p-4'>{student.studentNumber}</td>
                <td className='p-4'>
                  {student.grade} / {student.section}
                </td>
                <td className='p-4'>
                  {student.gender === 'MALE' ? 'ذكر' : 'أنثى'}
                </td>
                <td className='p-4'>{student.birthDate}</td>
                <td className='p-4 flex justify-center gap-2'>
                  <Button
                    onClick={() => navigate(`/students/edit/${student.id}`)}
                    variant='secondary'
                    className='h-8 w-8 p-0 flex items-center justify-center'
                  >
                    <div className='bg-white/10 backdrop-blur-sm p-2 rounded-xl group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110'>
                      <Edit size={16} />
                    </div>
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(student.id)}
                    variant='danger'
                    className='h-8 w-8 p-0 flex items-center justify-center'
                  >
                    <div className='bg-white/10 backdrop-blur-sm p-2 rounded-xl group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110'>
                      <Trash2 size={16} />
                    </div>
                  </Button>
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
            >
              إلغاء
            </Button>
            <Button
              variant='danger'
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'جاري الحذف...' : 'حذف'}
            </Button>
          </>
        }
      >
        <p>هل أنت متأكد من حذف هذا الطالب؟ لا يمكن التراجع عن هذا الإجراء.</p>
      </Modal>
    </div>
  );
};

export default Students;
