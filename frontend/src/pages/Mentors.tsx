import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/apiClient';
import type { Advisor } from '../types/program';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { PlusCircle, Search, FileDown, Trash2, Edit } from 'lucide-react';
import { exportToXLSX, exportToPDF } from '../lib/exportUtils';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

const Mentors: React.FC = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [mentorToDelete, setMentorToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.advisors.list();
        setMentors(data);
      } catch (err: any) {
        setError(err.message || 'فشل في تحميل المشرفين');
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, []);

  const filteredMentors = useMemo(
    () =>
      mentors.filter(
        (mentor) =>
          mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mentor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mentor.phone.includes(searchTerm)
      ),
    [mentors, searchTerm]
  );

  const handleDeleteClick = (id: string) => {
    setMentorToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!mentorToDelete) return;
    setIsDeleting(true);
    try {
      await api.advisors.remove(mentorToDelete);
      setMentors(mentors.filter((m) => m.id !== mentorToDelete));
      setDeleteModalOpen(false);
      setMentorToDelete(null);
    } catch (err: any) {
      setError('فشل في حذف المشرف');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportXLSX = async () => {
    try {
      await exportToXLSX('ADVISORS', {}, 'قائمة_المشرفين.xlsx');
    } catch (err: any) {
      setError(err.message || 'فشل في تصدير الملف');
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF('ADVISORS', {}, 'قائمة_المشرفين.pdf');
    } catch (err: any) {
      setError(err.message || 'فشل في تصدير الملف');
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-3xl font-bold text-gray-800'>قائمة المشرفين</h2>
        <Button
          onClick={() => navigate('/mentors/new')}
          variant='primary'
          className='flex items-center gap-2'
        >
          <PlusCircle size={20} />
          إضافة مشرف جديد
        </Button>
      </div>

      <div className='bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center'>
        <div className='relative w-full max-w-md'>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='ابحث بالاسم، البريد الإلكتروني، أو الهاتف...'
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
              <th className='p-4'>البريد الإلكتروني</th>
              <th className='p-4'>رقم الهاتف</th>
              <th className='p-4 text-center'>إجراءات</th>
            </tr>
          </thead>
          <tbody className='text-gray-700'>
            {filteredMentors.map((mentor) => (
              <tr
                key={mentor.id}
                className='border-b border-gray-200 hover:bg-gray-50'
              >
                <td className='p-4 font-medium'>{mentor.name}</td>
                <td className='p-4'>{mentor.email}</td>
                <td className='p-4'>{mentor.phone}</td>
                <td className='p-4 flex justify-center gap-2'>
                  <Button
                    onClick={() => navigate(`/mentors/edit/${mentor.id}`)}
                    variant='secondary'
                    className='h-8 w-8 p-0 flex items-center justify-center'
                  >
                    <div className='bg-white/10 backdrop-blur-sm p-2 rounded-xl group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110'>
                      <Edit size={16} />
                    </div>
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(mentor.id)}
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
        {filteredMentors.length === 0 && (
          <div className='text-center p-8 text-gray-500'>
            لا يوجد مشرفين لعرضهم.
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
        <p>هل أنت متأكد من حذف هذا المشرف؟ لا يمكن التراجع عن هذا الإجراء.</p>
      </Modal>
    </div>
  );
};

export default Mentors;
