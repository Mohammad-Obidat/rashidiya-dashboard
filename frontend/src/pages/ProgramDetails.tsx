import React, { useEffect, useState } from 'react';
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
import {
  IProgram,
  ProgramType,
  ProgramStatus,
  AttendanceStatus,
} from '../types/program';
import { api } from '../lib/apiClient';

const ProgramDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [program, setProgram] = useState<IProgram | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'advisor' | 'students' | 'attendance' | 'schedule'
  >('advisor');

  useEffect(() => {
    const fetchProgram = async () => {
      if (!id) {
        setError('Program ID is missing');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const fetchedProgram = await api.programs.get(id);
        setProgram(fetchedProgram);
      } catch (err) {
        console.error('Failed to fetch program:', err);
        setError('Failed to load program details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [id]);

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
    // TODO: Implement actual delete logic using apiClient
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  // حساب إحصائيات الحضور
  const calculateAttendanceStats = (studentId: string) => {
    const studentRecords =
      program?.attendanceRecords?.filter((r) => r.studentId === studentId) ||
      [];
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

  if (loading) {
    return (
      <div className='text-center py-8'>جاري تحميل بيانات البرنامج...</div>
    );
  }

  if (error) {
    return <div className='text-center py-8 text-red-600'>{error}</div>;
  }

  if (!program) {
    return <div className='text-center py-8'>لم يتم العثور على البرنامج.</div>;
  }

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
                          {/* assignedDate is now part of AdvisorAssignment, not Advisor directly */}
                          {/* <div className='flex items-center gap-2 text-gray-700'>
                            <Calendar className='w-4 h-4 text-blue-600' />
                            <span>
                              تاريخ التعيين:{' '}
                              {new Date(
                                program.currentAdvisor.assignedDate!
                              ).toLocaleDateString('ar-SA')}
                            </span>
                          </div> */}
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
                        {program.advisorHistory.map((assignment) => (
                          <div
                            key={assignment.id}
                            className='bg-gray-50 rounded-lg p-4 border border-gray-200'
                          >
                            <div className='flex items-center justify-between'>
                              <div>
                                <p className='font-semibold text-gray-900'>
                                  {assignment.advisor.name}
                                </p>
                                <p className='text-sm text-gray-600'>
                                  {assignment.advisor.email}
                                </p>
                              </div>
                              <div className='text-sm text-gray-600'>
                                {new Date(
                                  assignment.assignedDate
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
                    {program.students.map((studentProgram) => {
                      const student = studentProgram.student;
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
                                        studentProgram.joinDate
                                      ).toLocaleDateString('ar-SA')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='flex gap-2 mt-2 md:mt-0'>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() =>
                                  handleDeleteClick('student', student.id)
                                }
                              >
                                <Trash2 className='w-4 h-4' />
                              </Button>
                            </div>
                          </div>
                          <div className='mt-4 pt-4 border-t border-gray-100'>
                            <p className='text-sm font-semibold text-gray-700 mb-2'>
                              إحصائيات الحضور:
                            </p>
                            <div className='flex items-center gap-4 text-sm text-gray-600'>
                              <span className='flex items-center gap-1'>
                                <CheckCircle className='w-4 h-4 text-green-500' />
                                حاضر: {stats.present}
                              </span>
                              <span className='flex items-center gap-1'>
                                <AlertCircle className='w-4 h-4 text-yellow-500' />
                                إجمالي: {stats.total}
                              </span>
                              <span className='font-bold text-gray-800'>
                                ({stats.percentage}%) حضور
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className='text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300'>
                    <Users className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                    <p className='text-gray-600 mb-4'>لا يوجد طلاب مسجلين.</p>
                    <Button
                      variant='success'
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
                    سجلات الحضور ({program.attendanceRecords?.length || 0})
                  </h2>
                  <Button variant='success'>
                    <div className='flex items-center gap-2'>
                      <Plus className='w-4 h-4' />
                      <span>تسجيل حضور جديد</span>
                    </div>
                  </Button>
                </div>

                {program.attendanceRecords &&
                program.attendanceRecords.length > 0 ? (
                  <div className='bg-white rounded shadow overflow-hidden'>
                    <table className='w-full text-right'>
                      <thead className='bg-gray-50 text-gray-600 text-sm'>
                        <tr>
                          <th className='p-2'>الطالب</th>
                          <th className='p-2'>الجلسة</th>
                          <th className='p-2'>التاريخ</th>
                          <th className='p-2'>الحالة</th>
                          <th className='p-2'>ملاحظات</th>
                          <th className='p-2'>إجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {program.attendanceRecords.map((record) => (
                          <tr key={record.id} className='border-t'>
                            <td className='p-2'>
                              {record.student?.name || 'N/A'}
                            </td>
                            <td className='p-2'>
                              {record.session?.location || 'N/A'} (
                              {(record.session?.date
                                ? new Date(record.session.date)
                                : new Date()
                              ).toLocaleDateString('ar-SA')}
                              )
                            </td>
                            <td className='p-2'>
                              {new Date(record.date).toLocaleDateString(
                                'ar-SA'
                              )}
                            </td>
                            <td className='p-2'>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  record.status === AttendanceStatus.PRESENT
                                    ? 'bg-green-100 text-green-800'
                                    : record.status === AttendanceStatus.ABSENT
                                    ? 'bg-red-100 text-red-800'
                                    : record.status === AttendanceStatus.EXCUSED
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {record.status}
                              </span>
                            </td>
                            <td className='p-2'>{record.notes || '-'}</td>
                            <td className='p-2'>
                              <div className='flex gap-2 justify-end'>
                                <Button variant='outline' size='sm'>
                                  <Edit2 className='w-4 h-4' />
                                </Button>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() =>
                                    handleDeleteClick('attendance', record.id)
                                  }
                                >
                                  <Trash2 className='w-4 h-4' />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className='text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300'>
                    <ClipboardCheck className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                    <p className='text-gray-600 mb-4'>لا توجد سجلات حضور.</p>
                    <Button variant='success'>تسجيل حضور جديد</Button>
                  </div>
                )}
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div className='space-y-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-xl font-bold text-gray-900'>
                    الجدول الزمني ({program.sessions?.length || 0})
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
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {program.sessions.map((session) => (
                      <div
                        key={session.id}
                        className='bg-white rounded-lg p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200'
                      >
                        <div className='flex items-start justify-between mb-3'>
                          <h3 className='text-lg font-bold text-gray-900'>
                            {session.location} -{' '}
                            {new Date(session.date).toLocaleDateString('ar-SA')}
                          </h3>
                          <div className='flex gap-2'>
                            <Button variant='outline' size='sm'>
                              <Edit2 className='w-4 h-4' />
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() =>
                                handleDeleteClick('session', session.id)
                              }
                            >
                              <Trash2 className='w-4 h-4' />
                            </Button>
                          </div>
                        </div>
                        <div className='space-y-2 text-sm text-gray-700'>
                          <div className='flex items-center gap-2'>
                            <Clock className='w-4 h-4 text-blue-600' />
                            <span>
                              الوقت: {session.startTime} - {session.endTime}
                            </span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <MapPin className='w-4 h-4 text-blue-600' />
                            <span>الموقع: {session.location}</span>
                          </div>
                          {session.isRecurring && (
                            <div className='flex items-center gap-2'>
                              <Calendar className='w-4 h-4 text-blue-600' />
                              <span>
                                متكررة:{' '}
                                {session.recurrencePattern || 'غير محدد'}
                              </span>
                            </div>
                          )}
                          {session.notes && (
                            <div className='flex items-start gap-2'>
                              <ClipboardCheck className='w-4 h-4 text-blue-600 mt-1' />
                              <span>ملاحظات: {session.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300'>
                    <Calendar className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                    <p className='text-gray-600 mb-4'>لا توجد جلسات مجدولة.</p>
                    <Button
                      variant='success'
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
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title='تأكيد الحذف'
      >
        <p className='text-gray-700 mb-4'>
          هل أنت متأكد أنك تريد حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.
        </p>
        <div className='flex justify-end gap-3'>
          <Button variant='outline' onClick={() => setDeleteModalOpen(false)}>
            إلغاء
          </Button>
          <Button variant='danger' onClick={handleDeleteConfirm}>
            حذف
          </Button>
        </div>
      </Modal>

      {/* Add Student Modal (Placeholder) */}
      <Modal
        isOpen={addStudentModalOpen}
        onClose={() => setAddStudentModalOpen(false)}
        title='إضافة طالب للبرنامج'
      >
        <p className='text-gray-700'>نموذج إضافة طالب سيتم تطويره لاحقًا.</p>
        <div className='flex justify-end gap-3 mt-4'>
          <Button
            variant='outline'
            onClick={() => setAddStudentModalOpen(false)}
          >
            إلغاء
          </Button>
          <Button variant='primary'>حفظ</Button>
        </div>
      </Modal>

      {/* Add Session Modal (Placeholder) */}
      <Modal
        isOpen={addSessionModalOpen}
        onClose={() => setAddSessionModalOpen(false)}
        title='إضافة جلسة للبرنامج'
      >
        <p className='text-gray-700'>نموذج إضافة جلسة سيتم تطويره لاحقًا.</p>
        <div className='flex justify-end gap-3 mt-4'>
          <Button
            variant='outline'
            onClick={() => setAddSessionModalOpen(false)}
          >
            إلغاء
          </Button>
          <Button variant='primary'>حفظ</Button>
        </div>
      </Modal>
    </div>
  );
};

export default ProgramDetails;
