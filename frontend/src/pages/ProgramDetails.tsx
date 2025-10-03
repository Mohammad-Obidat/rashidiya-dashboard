import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import {
  ArrowRight,
  Edit2,
  User,
  Users,
  Calendar,
  ClipboardCheck,
  Phone,
  Mail,
  Plus,
  Trash2,
  Search,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import type { IProgram } from '../types/program';
import { ProgramType, ProgramStatus, AttendanceStatus } from '../types/program';

const ProgramDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<
    'advisor' | 'students' | 'attendance' | 'schedule'
  >('advisor');

  // بيانات تجريبية
  const [program] = useState<IProgram>({
    id: '1',
    name: 'نادي الروبوت',
    type: ProgramType.SCIENTIFIC,
    description:
      'برنامج تعليمي لتطوير مهارات البرمجة والروبوتات للطلاب المهتمين بالتكنولوجيا',
    status: ProgramStatus.ACTIVE,
    createdDate: new Date('2024-01-15'),
    currentAdvisor: {
      id: 'a1',
      name: 'أحمد محمد السعيد',
      phone: '0501234567',
      email: 'ahmed@school.edu.sa',
      assignedDate: new Date('2024-01-15'),
    },
    advisorHistory: [
      {
        id: 'a0',
        name: 'خالد عبدالله',
        phone: '0509876543',
        email: 'khaled@school.edu.sa',
        assignedDate: new Date('2023-09-01'),
      },
    ],
    students: [
      {
        id: 's1',
        name: 'محمد علي أحمد',
        studentNumber: '12345',
        grade: 'الثالث المتوسط',
        section: 'أ',
        joinDate: new Date('2024-02-01'),
      },
      {
        id: 's2',
        name: 'عبدالله سعد محمد',
        studentNumber: '12346',
        grade: 'الثاني المتوسط',
        section: 'ب',
        joinDate: new Date('2024-02-05'),
      },
      {
        id: 's3',
        name: 'فيصل خالد عبدالرحمن',
        studentNumber: '12347',
        grade: 'الثالث المتوسط',
        section: 'أ',
        joinDate: new Date('2024-02-10'),
      },
    ],
    sessions: [
      {
        id: 'sess1',
        programId: '1',
        date: new Date('2024-10-05'),
        startTime: '14:00',
        endTime: '16:00',
        location: 'مختبر الحاسب',
        isRecurring: true,
        recurrencePattern: 'weekly',
      },
      {
        id: 'sess2',
        programId: '1',
        date: new Date('2024-10-12'),
        startTime: '14:00',
        endTime: '16:00',
        location: 'مختبر الحاسب',
        isRecurring: true,
        recurrencePattern: 'weekly',
      },
    ],
    attendanceRecords: [
      {
        id: 'att1',
        studentId: 's1',
        sessionId: 'sess1',
        date: new Date('2024-10-05'),
        status: AttendanceStatus.PRESENT,
      },
      {
        id: 'att2',
        studentId: 's2',
        sessionId: 'sess1',
        date: new Date('2024-10-05'),
        status: AttendanceStatus.ABSENT,
      },
      {
        id: 'att3',
        studentId: 's3',
        sessionId: 'sess1',
        date: new Date('2024-10-05'),
        status: AttendanceStatus.LATE,
      },
    ],
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: string;
    id: string;
  } | null>(null);
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [addSessionModalOpen, setAddSessionModalOpen] = useState(false);

  const handleBack = () => {
    navigate('/');
  };

  const handleEdit = () => {
    navigate(`/program/edit/${id}`);
  };

  const handleDeleteClick = (type: string, id: string) => {
    setItemToDelete({ type, id });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log('حذف:', itemToDelete);
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  // حساب إحصائيات الحضور
  const calculateAttendanceStats = (studentId: string) => {
    const studentRecords =
      program.attendanceRecords?.filter((r) => r.studentId === studentId) || [];
    const total = studentRecords.length;
    const present = studentRecords.filter(
      (r) => r.status === AttendanceStatus.PRESENT
    ).length;
    const percentage = total > 0 ? (present / total) * 100 : 0;
    return { total, present, percentage: percentage.toFixed(0) };
  };

  const tabs = [
    { id: 'advisor', label: 'المرشد', icon: User },
    { id: 'students', label: 'الطلاب', icon: Users },
    { id: 'attendance', label: 'الحضور والغياب', icon: ClipboardCheck },
    { id: 'schedule', label: 'الجدول الزمني', icon: Calendar },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <button
            onClick={handleBack}
            className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200'
          >
            <ArrowRight className='w-5 h-5' />
            <span>العودة إلى القائمة</span>
          </button>

          <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-100'>
            <div className='flex items-start justify-between mb-4'>
              <div className='flex-1'>
                <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                  {program.name}
                </h1>
                <p className='text-gray-600 mb-4'>{program.description}</p>
                <div className='flex items-center gap-4'>
                  <span
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${
                      program.status === ProgramStatus.ACTIVE
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : 'bg-gray-100 text-gray-800 border-gray-200'
                    }`}
                  >
                    {program.status}
                  </span>
                  <span className='px-3 py-1.5 rounded-lg text-sm font-semibold border bg-blue-100 text-blue-800 border-blue-200'>
                    {program.type}
                  </span>
                </div>
              </div>
              <Button onClick={handleEdit} variant='primary'>
                <div className='flex items-center gap-2'>
                  <Edit2 className='w-4 h-4' />
                  <span>تعديل</span>
                </div>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200'>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                  <Users className='w-6 h-6 text-blue-600' />
                </div>
                <div>
                  <p className='text-sm text-gray-600'>عدد الطلاب</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {program.students?.length || 0}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                  <Calendar className='w-6 h-6 text-green-600' />
                </div>
                <div>
                  <p className='text-sm text-gray-600'>عدد الجلسات</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {program.sessions?.length || 0}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                  <ClipboardCheck className='w-6 h-6 text-purple-600' />
                </div>
                <div>
                  <p className='text-sm text-gray-600'>سجلات الحضور</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {program.attendanceRecords?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden'>
          <div className='border-b border-gray-200'>
            <div className='flex overflow-x-auto'>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setActiveTab(
                        tab.id as
                          | 'advisor'
                          | 'students'
                          | 'attendance'
                          | 'schedule'
                      )
                    }
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className='w-5 h-5' />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className='p-6'>
            {/* Advisor Tab */}
            {activeTab === 'advisor' && (
              <div className='space-y-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-xl font-bold text-gray-900'>
                    المرشد الحالي
                  </h2>
                  <Button variant='primary'>
                    <div className='flex items-center gap-2'>
                      <Edit2 className='w-4 h-4' />
                      <span>تغيير المرشد</span>
                    </div>
                  </Button>
                </div>

                {program.currentAdvisor ? (
                  <div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200'>
                    <div className='flex items-start gap-4'>
                      <div className='w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold'>
                        {program.currentAdvisor.name.charAt(0)}
                      </div>
                      <div className='flex-1'>
                        <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                          {program.currentAdvisor.name}
                        </h3>
                        <div className='space-y-2'>
                          <div className='flex items-center gap-2 text-gray-700'>
                            <Phone className='w-4 h-4 text-blue-600' />
                            <span>{program.currentAdvisor.phone}</span>
                          </div>
                          <div className='flex items-center gap-2 text-gray-700'>
                            <Mail className='w-4 h-4 text-blue-600' />
                            <span>{program.currentAdvisor.email}</span>
                          </div>
                          <div className='flex items-center gap-2 text-gray-700'>
                            <Calendar className='w-4 h-4 text-blue-600' />
                            <span>
                              تاريخ التعيين:{' '}
                              {new Date(
                                program.currentAdvisor.assignedDate!
                              ).toLocaleDateString('ar-SA')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300'>
                    <User className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                    <p className='text-gray-600 mb-4'>لم يتم تعيين مرشد بعد</p>
                    <Button variant='primary'>تعيين مرشد</Button>
                  </div>
                )}

                {/* Advisor History */}
                {program.advisorHistory &&
                  program.advisorHistory.length > 0 && (
                    <div className='mt-8'>
                      <h3 className='text-lg font-bold text-gray-900 mb-4'>
                        سجل المرشدين السابقين
                      </h3>
                      <div className='space-y-3'>
                        {program.advisorHistory.map((advisor) => (
                          <div
                            key={advisor.id}
                            className='bg-gray-50 rounded-lg p-4 border border-gray-200'
                          >
                            <div className='flex items-center justify-between'>
                              <div>
                                <p className='font-semibold text-gray-900'>
                                  {advisor.name}
                                </p>
                                <p className='text-sm text-gray-600'>
                                  {advisor.email}
                                </p>
                              </div>
                              <div className='text-sm text-gray-600'>
                                {new Date(
                                  advisor.assignedDate!
                                ).toLocaleDateString('ar-SA')}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div className='space-y-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-xl font-bold text-gray-900'>
                    قائمة الطلاب ({program.students?.length || 0})
                  </h2>
                  <Button
                    variant='success'
                    onClick={() => setAddStudentModalOpen(true)}
                  >
                    <div className='flex items-center gap-2'>
                      <Plus className='w-4 h-4' />
                      <span>إضافة طالب</span>
                    </div>
                  </Button>
                </div>

                {program.students && program.students.length > 0 ? (
                  <div className='grid grid-cols-1 gap-4'>
                    {program.students.map((student) => {
                      const stats = calculateAttendanceStats(student.id);
                      return (
                        <div
                          key={student.id}
                          className='bg-white rounded-lg p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200'
                        >
                          <div className='flex items-start justify-between'>
                            <div className='flex items-start gap-4 flex-1'>
                              <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-lg font-bold'>
                                {student.name.charAt(0)}
                              </div>
                              <div className='flex-1'>
                                <h3 className='text-lg font-bold text-gray-900 mb-1'>
                                  {student.name}
                                </h3>
                                <div className='grid grid-cols-2 md:grid-cols-4 gap-3 text-sm'>
                                  <div>
                                    <span className='text-gray-600'>
                                      رقم الطالب:
                                    </span>
                                    <span className='font-semibold text-gray-900 mr-1'>
                                      {student.studentNumber}
                                    </span>
                                  </div>
                                  <div>
                                    <span className='text-gray-600'>الصف:</span>
                                    <span className='font-semibold text-gray-900 mr-1'>
                                      {student.grade}
                                    </span>
                                  </div>
                                  <div>
                                    <span className='text-gray-600'>
                                      الشعبة:
                                    </span>
                                    <span className='font-semibold text-gray-900 mr-1'>
                                      {student.section}
                                    </span>
                                  </div>
                                  <div>
                                    <span className='text-gray-600'>
                                      تاريخ الانضمام:
                                    </span>
                                    <span className='font-semibold text-gray-900 mr-1'>
                                      {new Date(
                                        student.joinDate
                                      ).toLocaleDateString('ar-SA')}
                                    </span>
                                  </div>
                                </div>
                                <div className='mt-3 flex items-center gap-2'>
                                  <div className='flex-1 bg-gray-200 rounded-full h-2 overflow-hidden'>
                                    <div
                                      className='bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-300'
                                      style={{
                                        width: `${stats.percentage}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className='text-sm font-semibold text-gray-700'>
                                    {stats.percentage}%
                                  </span>
                                </div>
                                <p className='text-xs text-gray-600 mt-1'>
                                  الحضور: {stats.present} من {stats.total} جلسة
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                handleDeleteClick('student', student.id)
                              }
                              className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200'
                            >
                              <Trash2 className='w-5 h-5' />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className='text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300'>
                    <Users className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                    <p className='text-gray-600 mb-4'>
                      لا يوجد طلاب مسجلين في البرنامج
                    </p>
                    <Button
                      variant='primary'
                      onClick={() => setAddStudentModalOpen(true)}
                    >
                      إضافة طالب
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Attendance Tab */}
            {activeTab === 'attendance' && (
              <div className='space-y-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-xl font-bold text-gray-900'>
                    سجل الحضور والغياب
                  </h2>
                  <Button variant='success'>
                    <div className='flex items-center gap-2'>
                      <Plus className='w-4 h-4' />
                      <span>تسجيل حضور جديد</span>
                    </div>
                  </Button>
                </div>

                {/* Attendance Statistics */}
                <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
                  <div className='bg-gradient-to-br from-green-500 to-emerald-600 p-5 rounded-xl text-white'>
                    <div className='flex items-center justify-between mb-2'>
                      <CheckCircle className='w-8 h-8' />
                      <span className='text-3xl font-bold'>
                        {
                          program.attendanceRecords?.filter(
                            (r) => r.status === AttendanceStatus.PRESENT
                          ).length
                        }
                      </span>
                    </div>
                    <p className='text-green-100'>حاضر</p>
                  </div>
                  <div className='bg-gradient-to-br from-red-500 to-red-600 p-5 rounded-xl text-white'>
                    <div className='flex items-center justify-between mb-2'>
                      <XCircle className='w-8 h-8' />
                      <span className='text-3xl font-bold'>
                        {
                          program.attendanceRecords?.filter(
                            (r) => r.status === AttendanceStatus.ABSENT
                          ).length
                        }
                      </span>
                    </div>
                    <p className='text-red-100'>غائب</p>
                  </div>
                  <div className='bg-gradient-to-br from-yellow-500 to-orange-500 p-5 rounded-xl text-white'>
                    <div className='flex items-center justify-between mb-2'>
                      <Clock className='w-8 h-8' />
                      <span className='text-3xl font-bold'>
                        {
                          program.attendanceRecords?.filter(
                            (r) => r.status === AttendanceStatus.LATE
                          ).length
                        }
                      </span>
                    </div>
                    <p className='text-yellow-100'>متأخر</p>
                  </div>
                  <div className='bg-gradient-to-br from-blue-500 to-indigo-600 p-5 rounded-xl text-white'>
                    <div className='flex items-center justify-between mb-2'>
                      <AlertCircle className='w-8 h-8' />
                      <span className='text-3xl font-bold'>
                        {
                          program.attendanceRecords?.filter(
                            (r) => r.status === AttendanceStatus.EXCUSED
                          ).length
                        }
                      </span>
                    </div>
                    <p className='text-blue-100'>غياب بعذر</p>
                  </div>
                </div>

                {/* Attendance Table */}
                {program.attendanceRecords &&
                program.attendanceRecords.length > 0 ? (
                  <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
                    <div className='overflow-x-auto'>
                      <table className='w-full'>
                        <thead className='bg-gray-50 border-b border-gray-200'>
                          <tr>
                            <th className='px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase'>
                              الطالب
                            </th>
                            <th className='px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase'>
                              التاريخ
                            </th>
                            <th className='px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase'>
                              الحالة
                            </th>
                            <th className='px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase'>
                              ملاحظات
                            </th>
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-200'>
                          {program.attendanceRecords.map((record) => {
                            const student = program.students?.find(
                              (s) => s.id === record.studentId
                            );
                            const statusConfig = {
                              [AttendanceStatus.PRESENT]: {
                                bg: 'bg-green-100',
                                text: 'text-green-800',
                                border: 'border-green-200',
                              },
                              [AttendanceStatus.ABSENT]: {
                                bg: 'bg-red-100',
                                text: 'text-red-800',
                                border: 'border-red-200',
                              },
                              [AttendanceStatus.LATE]: {
                                bg: 'bg-yellow-100',
                                text: 'text-yellow-800',
                                border: 'border-yellow-200',
                              },
                              [AttendanceStatus.EXCUSED]: {
                                bg: 'bg-blue-100',
                                text: 'text-blue-800',
                                border: 'border-blue-200',
                              },
                            };
                            const config = statusConfig[record.status];
                            return (
                              <tr
                                key={record.id}
                                className='hover:bg-gray-50 transition-colors duration-150'
                              >
                                <td className='px-6 py-4'>
                                  <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold'>
                                      {student?.name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className='font-semibold text-gray-900'>
                                        {student?.name}
                                      </p>
                                      <p className='text-sm text-gray-600'>
                                        {student?.studentNumber}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className='px-6 py-4 text-gray-700'>
                                  {new Date(record.date).toLocaleDateString(
                                    'ar-SA'
                                  )}
                                </td>
                                <td className='px-6 py-4'>
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-semibold border ${config.bg} ${config.text} ${config.border}`}
                                  >
                                    {record.status}
                                  </span>
                                </td>
                                <td className='px-6 py-4 text-gray-600 text-sm'>
                                  {record.notes || '-'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className='text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300'>
                    <ClipboardCheck className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                    <p className='text-gray-600 mb-4'>لا توجد سجلات حضور بعد</p>
                    <Button variant='primary'>تسجيل حضور جديد</Button>
                  </div>
                )}
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div className='space-y-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-xl font-bold text-gray-900'>
                    الجدول الزمني ({program.sessions?.length || 0} جلسة)
                  </h2>
                  <Button
                    variant='success'
                    onClick={() => setAddSessionModalOpen(true)}
                  >
                    <div className='flex items-center gap-2'>
                      <Plus className='w-4 h-4' />
                      <span>إضافة جلسة</span>
                    </div>
                  </Button>
                </div>

                {program.sessions && program.sessions.length > 0 ? (
                  <div className='grid grid-cols-1 gap-4'>
                    {program.sessions.map((session) => (
                      <div
                        key={session.id}
                        className='bg-white rounded-lg p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200'
                      >
                        <div className='flex items-start justify-between'>
                          <div className='flex-1'>
                            <div className='flex items-center gap-3 mb-3'>
                              <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center'>
                                <Calendar className='w-6 h-6 text-white' />
                              </div>
                              <div>
                                <h3 className='text-lg font-bold text-gray-900'>
                                  {new Date(session.date).toLocaleDateString(
                                    'ar-SA',
                                    {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                    }
                                  )}
                                </h3>
                                {session.isRecurring && (
                                  <span className='text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full border border-purple-200'>
                                    جلسة دورية ({session.recurrencePattern})
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-3 text-sm'>
                              <div className='flex items-center gap-2 text-gray-700'>
                                <Clock className='w-4 h-4 text-blue-600' />
                                <span>
                                  {session.startTime} - {session.endTime}
                                </span>
                              </div>
                              <div className='flex items-center gap-2 text-gray-700'>
                                <MapPin className='w-4 h-4 text-red-600' />
                                <span>{session.location}</span>
                              </div>
                            </div>
                            {session.notes && (
                              <p className='mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg'>
                                {session.notes}
                              </p>
                            )}
                          </div>
                          <div className='flex gap-2'>
                            <button className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200'>
                              <Edit2 className='w-5 h-5' />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteClick('session', session.id)
                              }
                              className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200'
                            >
                              <Trash2 className='w-5 h-5' />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300'>
                    <Calendar className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                    <p className='text-gray-600 mb-4'>
                      لا توجد جلسات مجدولة بعد
                    </p>
                    <Button
                      variant='primary'
                      onClick={() => setAddSessionModalOpen(true)}
                    >
                      إضافة جلسة
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
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
            هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
        </Modal>

        {/* Add Student Modal */}
        <Modal
          isOpen={addStudentModalOpen}
          onClose={() => setAddStudentModalOpen(false)}
          title='إضافة طالب جديد'
          footer={
            <>
              <Button
                variant='secondary'
                onClick={() => setAddStudentModalOpen(false)}
              >
                إلغاء
              </Button>
              <Button variant='success'>إضافة</Button>
            </>
          }
        >
          <div className='space-y-4'>
            <div className='relative'>
              <Search className='absolute right-3 top-3 w-5 h-5 text-gray-400' />
              <input
                type='text'
                placeholder='ابحث عن طالب...'
                className='w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <p className='text-sm text-gray-600'>
              ابحث عن الطالب في قاعدة البيانات المدرسية وأضفه إلى البرنامج
            </p>
          </div>
        </Modal>

        {/* Add Session Modal */}
        <Modal
          isOpen={addSessionModalOpen}
          onClose={() => setAddSessionModalOpen(false)}
          title='إضافة جلسة جديدة'
          footer={
            <>
              <Button
                variant='secondary'
                onClick={() => setAddSessionModalOpen(false)}
              >
                إلغاء
              </Button>
              <Button variant='success'>إضافة</Button>
            </>
          }
        >
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                التاريخ
              </label>
              <input
                type='date'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  وقت البداية
                </label>
                <input
                  type='time'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  وقت النهاية
                </label>
                <input
                  type='time'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                المكان
              </label>
              <input
                type='text'
                placeholder='مثال: مختبر الحاسب'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='flex items-center gap-2'>
                <input type='checkbox' className='w-4 h-4 text-blue-600' />
                <span className='text-sm text-gray-700'>جلسة دورية</span>
              </label>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ProgramDetails;
