import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgramCard from '../components/ProgramCard';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { api } from '../lib/apiClient';
import type { Program } from '../types/program';
import { ProgramStatus, ProgramTypeEnum } from '../types/program';
import { getAllStatuses, getAllTypes } from '../config/programConfig';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | ProgramTypeEnum>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | ProgramStatus>(
    'all'
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get dropdown options
  const statusOptions = getAllStatuses();
  const typeOptions = getAllTypes();

  // Fetch programs from API
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.programs.list();
        setPrograms(data);
      } catch (err: any) {
        setError(err.message || 'فشل في تحميل البرامج');
        console.error('Error fetching programs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch =
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || program.type === filterType;
    const matchesStatus =
      filterStatus === 'all' || program.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleView = (id: string) => navigate(`/program/${id}`);
  const handleEdit = (id: string) => navigate(`/program/edit/${id}`);

  const handleDeleteClick = (id: string) => {
    setProgramToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!programToDelete) return;

    try {
      setIsDeleting(true);
      await api.programs.remove(programToDelete);
      setPrograms(programs.filter((p) => p.id !== programToDelete));
      setDeleteModalOpen(false);
      setProgramToDelete(null);
    } catch (err: any) {
      console.error('Error deleting program:', err);
      alert('فشل في حذف البرنامج. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddProgram = () => navigate('/program/new');

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600 text-lg'>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center'>
        <div className='bg-white rounded-xl shadow-lg p-8 max-w-md'>
          <div className='text-center'>
            <div className='text-red-500 text-5xl mb-4'>⚠️</div>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>حدث خطأ</h2>
            <p className='text-gray-600 mb-4'>{error}</p>
            <Button onClick={() => window.location.reload()} variant='primary'>
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
          <div>
            <h2 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1 py-2'>
              لوحة التحكم - البرامج اللامنهجية
            </h2>
            <p className='text-gray-600'>
              إدارة ومتابعة جميع البرامج اللامنهجية ({programs.length} برنامج)
            </p>
          </div>
          <Button onClick={handleAddProgram} variant='success'>
            + إضافة برنامج جديد
          </Button>
        </div>

        {/* Search & Filter */}
        <div className='bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8 backdrop-blur-sm bg-opacity-90'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>
            البحث والفلترة
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <Input
              label='البحث'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='ابحث عن برنامج...'
            />
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                نوع البرنامج
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value='all'>جميع الأنواع</option>
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                الحالة
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value='all'>جميع الحالات</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Summary */}
          {(searchTerm || filterType !== 'all' || filterStatus !== 'all') && (
            <div className='mt-4 pt-4 border-t border-gray-200 flex items-center justify-between'>
              <p className='text-sm text-gray-600'>
                عرض {filteredPrograms.length} من {programs.length} برنامج
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                  setFilterStatus('all');
                }}
                className='text-sm text-blue-600 hover:text-blue-700 font-medium'
              >
                إعادة تعيين الفلاتر
              </button>
            </div>
          )}
        </div>

        {/* Programs List */}
        {filteredPrograms.length === 0 ? (
          <div className='text-center py-16 bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300'>
            <div className='text-gray-400 text-6xl mb-4'>📋</div>
            <p className='text-gray-500 text-xl font-medium mb-2'>
              {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                ? 'لا توجد برامج مطابقة للبحث'
                : 'لا توجد برامج متاحة'}
            </p>
            <p className='text-gray-400 text-sm mb-6'>
              {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                ? 'جرب تغيير معايير البحث أو الفلترة'
                : 'ابدأ بإضافة برنامج جديد'}
            </p>
            {!searchTerm && filterType === 'all' && filterStatus === 'all' && (
              <Button onClick={handleAddProgram} variant='primary'>
                + إضافة برنامج جديد
              </Button>
            )}
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredPrograms.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}

        {/* Delete Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => !isDeleting && setDeleteModalOpen(false)}
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
                {isDeleting ? (
                  <span className='flex items-center gap-2'>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    جاري الحذف...
                  </span>
                ) : (
                  'حذف'
                )}
              </Button>
            </>
          }
        >
          <p className='text-gray-700'>
            هل أنت متأكد من حذف هذا البرنامج؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
