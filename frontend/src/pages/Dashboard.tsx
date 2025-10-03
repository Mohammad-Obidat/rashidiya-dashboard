import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgramCard from '../components/ProgramCard';
import Button from '../components/common/Button.tsx';
import Input from '../components/common/Input.tsx';
import Modal from '../components/common/Modal.tsx';
import type { IProgram } from '../types/program.ts';
import { ProgramType, ProgramStatus } from '../types/program.ts';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<string | null>(null);

  // بيانات تجريبية للبرامج
  const [programs, setPrograms] = useState<IProgram[]>([
    {
      id: '1',
      name: 'نادي الروبوت',
      type: ProgramType.SCIENTIFIC,
      description:
        'برنامج تعليمي لتطوير مهارات البرمجة والروبوتات للطلاب المهتمين بالتكنولوجيا',
      status: ProgramStatus.ACTIVE,
      createdDate: new Date('2024-01-15'),
      currentAdvisor: {
        id: 'a1',
        name: 'أحمد محمد',
        phone: '0501234567',
        email: 'ahmed@school.edu.sa',
      },
      students: [
        {
          id: 's1',
          name: 'محمد علي',
          studentNumber: '12345',
          grade: 'الثالث المتوسط',
          section: 'أ',
          joinDate: new Date('2024-02-01'),
        },
      ],
    },
    {
      id: '2',
      name: 'فريق كرة القدم',
      type: ProgramType.SPORTS,
      description:
        'فريق كرة القدم المدرسي للمشاركة في البطولات المحلية والإقليمية',
      status: ProgramStatus.ACTIVE,
      createdDate: new Date('2023-09-01'),
      currentAdvisor: {
        id: 'a2',
        name: 'خالد السعيد',
        phone: '0509876543',
        email: 'khaled@school.edu.sa',
      },
      students: [
        {
          id: 's1',
          name: 'محمد علي',
          studentNumber: '12345',
          grade: 'الثالث المتوسط',
          section: 'أ',
          joinDate: new Date('2024-02-01'),
        },
        {
          id: 's3',
          name: 'محمد علي',
          studentNumber: '12345',
          grade: 'الثالث المتوسط',
          section: 'أ',
          joinDate: new Date('2024-02-01'),
        },
      ],
    },
    {
      id: '3',
      name: 'نادي الفنون',
      type: ProgramType.ARTISTIC,
      description: 'برنامج لتطوير المواهب الفنية في الرسم والخط والتصميم',
      status: ProgramStatus.INACTIVE,
      createdDate: new Date('2024-03-10'),
      currentAdvisor: {
        id: 'a2',
        name: 'خالد السعيد',
        phone: '0509876543',
        email: 'khaled@school.edu.sa',
      },
      students: [
        {
          id: 's1',
          name: 'محمد علي',
          studentNumber: '12345',
          grade: 'الثالث المتوسط',
          section: 'أ',
          joinDate: new Date('2024-02-01'),
        },
        {
          id: 's2',
          name: 'محمد علي',
          studentNumber: '12345',
          grade: 'الثالث المتوسط',
          section: 'أ',
          joinDate: new Date('2024-02-01'),
        },
        {
          id: 's22',
          name: 'محمد علي',
          studentNumber: '12345',
          grade: 'الثالث المتوسط',
          section: 'أ',
          joinDate: new Date('2024-02-01'),
        },
      ],
    },
  ]);

  // تصفية البرامج
  const filteredPrograms = programs.filter((program) => {
    const matchesSearch =
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || program.type === filterType;
    const matchesStatus =
      filterStatus === 'all' || program.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleView = (id: string) => {
    navigate(`/program/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/program/edit/${id}`);
  };

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

  const handleAddProgram = () => {
    navigate('/program/new');
  };

  return (
    <>
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
        <div className='container mx-auto px-4 py-8'>
          <div className='mb-8'>
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

            {/* إحصائيات سريعة */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
              <div className='bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-blue-100 text-sm font-medium mb-1'>
                      إجمالي البرامج
                    </p>
                    <p className='text-4xl font-bold text-white'>
                      {programs.length}
                    </p>
                  </div>
                  <div className='bg-white bg-opacity-20 p-3 rounded-lg'>
                    <svg
                      className='w-8 h-8 text-black'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className='bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-green-100 text-sm font-medium mb-1'>
                      البرامج النشطة
                    </p>
                    <p className='text-4xl font-bold text-white'>
                      {
                        programs.filter(
                          (p) => p.status === ProgramStatus.ACTIVE
                        ).length
                      }
                    </p>
                  </div>
                  <div className='bg-white bg-opacity-20 p-3 rounded-lg'>
                    <svg
                      className='w-8 h-8 text-black'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className='bg-gradient-to-br from-yellow-500 to-orange-500 p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-yellow-100 text-sm font-medium mb-1'>
                      إجمالي الطلاب
                    </p>
                    <p className='text-4xl font-bold text-white'>
                      {programs.reduce(
                        (sum, p) => sum + (p.students?.length || 0),
                        0
                      )}
                    </p>
                  </div>
                  <div className='bg-white bg-opacity-20 p-3 rounded-lg'>
                    <svg
                      className='w-8 h-8 text-black'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className='bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-purple-100 text-sm font-medium mb-1'>
                      المرشدين
                    </p>
                    <p className='text-4xl font-bold text-white'>
                      {programs.filter((p) => p.currentAdvisor).length}
                    </p>
                  </div>
                  <div className='bg-white bg-opacity-20 p-3 rounded-lg'>
                    <svg
                      className='w-8 h-8 text-black'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* البحث والفلترة */}
            <div className='bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8 backdrop-blur-sm bg-opacity-90'>
              <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                <svg
                  className='w-5 h-5 mr-2 text-blue-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
                  />
                </svg>
                البحث والفلترة
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <Input
                  label='البحث'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder='ابحث عن برنامج...'
                />

                <div className='mb-4'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    نوع البرنامج
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    <option value='all'>جميع الأنواع</option>
                    {Object.values(ProgramType).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='mb-4'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    الحالة
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
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
          </div>

          {/* قائمة البرامج */}
          {filteredPrograms.length === 0 ? (
            <div className='text-center py-16 bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300'>
              <svg
                className='mx-auto h-16 w-16 text-gray-400 mb-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
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

          {/* مودال تأكيد الحذف */}
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
    </>
  );
};

export default Dashboard;
