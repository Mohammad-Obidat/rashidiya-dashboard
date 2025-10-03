import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgramCard from '../components/ProgramCard';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { api } from '../lib/apiClient';
import type { Program } from '../types/program';
import { ProgramStatus, ProgramTypeEnum } from '../types/program';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | ProgramTypeEnum>('all');
  const [filterStatus, setFilterStatus] = useState<
    'all' | (typeof ProgramStatus)[keyof typeof ProgramStatus]
  >('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<string | null>(null);

  // Fetch programs from API
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await api.programs.list();
        setPrograms(data);
      } catch (err: any) {
        console.error(err.message || 'Something went wrong');
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
  const handleDeleteConfirm = () => {
    if (programToDelete) {
      setPrograms(programs.filter((p) => p.id !== programToDelete));
      setDeleteModalOpen(false);
      setProgramToDelete(null);
    }
  };
  const handleAddProgram = () => navigate('/program/new');

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <div className='p-8'>
            <h2 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 pb-2'>
              لوحة التحكم - البرامج اللامنهجية
            </h2>
            <p className='text-gray-600'>
              إدارة ومتابعة جميع البرامج اللامنهجية
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
                {Object.values(ProgramTypeEnum).map((type) => (
                  <option key={type} value={type}>
                    {type}
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
                {Object.values(ProgramStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Programs List */}
        {filteredPrograms.length === 0 ? (
          <div className='text-center py-16 bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300'>
            <p className='text-gray-500 text-xl font-medium mb-2'>
              لا توجد برامج متاحة
            </p>
            <p className='text-gray-400 text-sm'>
              جرب تغيير معايير البحث أو الفلترة
            </p>
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
          onClose={() => setDeleteModalOpen(false)}
          title='تأكيد الحذف'
          footer={
            <>
              <Button
                variant='secondary'
                onClick={() => setDeleteModalOpen(false)}
              >
                إلغاء
              </Button>
              <Button variant='danger' onClick={handleDeleteConfirm}>
                حذف
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
