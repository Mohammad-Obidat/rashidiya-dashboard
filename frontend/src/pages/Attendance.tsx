import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../lib/apiClient';
import type {
  AttendanceRecord,
  Program,
  Student,
  Session,
} from '../types/program';
import Button from '../components/common/Button';
import AttendanceFormModal from '../components/modals/AttendanceFormModal';
import { FileDown, Calendar, ClipboardList, PlusCircle } from 'lucide-react';
import { exportToXLSX, exportToPDF } from '../lib/exportUtils';
import { getAttendanceConfig } from '../config/programConfig';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useToast } from '../contexts/ToastContext';

const Attendance: React.FC = () => {
  const toast = useToast();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterProgram, setFilterProgram] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [attData, progData, studData, sessData] = await Promise.all([
          api.attendanceRecords.list(),
          api.programs.list(),
          api.students.list(),
          api.sessions.list(),
        ]);
        setAttendance(attData);
        setPrograms(progData);
        setStudents(studData);
        setSessions(sessData);
      } catch (err: any) {
        setError(err.message || 'فشل في تحميل بيانات الحضور');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStudentName = (studentId: string) =>
    students.find((s) => s.id === studentId)?.name || 'غير معروف';
  const getProgramName = (programId: string) =>
    programs.find((p) => p.id === programId)?.name || 'غير معروف';

  const filteredAttendance = useMemo(
    () =>
      attendance.filter((record) => {
        const matchesProgram =
          filterProgram === 'all' || record.programId === filterProgram;

        const recordDate = record.date
          ? new Date(record.date).toISOString().split('T')[0]
          : '';

        const matchesDate = !filterDate || recordDate === filterDate;

        return matchesProgram && matchesDate;
      }),
    [attendance, filterProgram, filterDate]
  );

  const handleExportXLSX = async () => {
    try {
      const filters: Record<string, any> = {};
      if (filterProgram !== 'all') {
        filters.programId = filterProgram;
      }
      if (filterDate) {
        filters.date = filterDate;
      }
      await exportToXLSX('ATTENDANCE', filters, 'سجل_الحضور.xlsx');
      toast.success('تم تصدير الملف بنجاح');
    } catch (err: any) {
      toast.error('فشل في تصدير الملف');
    }
  };

  const handleExportPDF = async () => {
    try {
      const filters: Record<string, any> = {};
      if (filterProgram !== 'all') {
        filters.programId = filterProgram;
      }
      if (filterDate) {
        filters.date = filterDate;
      }
      await exportToPDF('ATTENDANCE', filters, 'سجل_الحضور.pdf');
      toast.success('تم تصدير الملف بنجاح');
    } catch (err: any) {
      toast.error('فشل في تصدير الملف');
    }
  };

  const handleTakeAttendance = () => {
    setAttendanceModalOpen(true);
  };

  const handleLoadStudents = async (programId: string): Promise<string[]> => {
    const enrollments = await api.studentPrograms.byProgram(programId);
    return enrollments.map((e) => e.studentId);
  };

  const handleSaveAttendance = async (
    sessionId: string,
    records: Array<{ studentId: string; status: any; notes: string }>
  ) => {
    try {
      const session = sessions.find((s) => s.id === sessionId);
      if (!session) return;

      const attendanceRecords = records.map((record) => ({
        studentId: record.studentId,
        sessionId: sessionId,
        programId: session.programId,
        date: session.date,
        status: record.status,
        notes: record.notes || undefined,
      }));

      const created = await api.attendanceRecords.bulkCreate(attendanceRecords);
      setAttendance([...attendance, ...created]);
      toast.success('تم تسجيل الحضور بنجاح');
    } catch (err: any) {
      toast.error('فشل في تسجيل الحضور');
      throw err;
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-3xl font-bold text-gray-800'>سجل الحضور والغياب</h2>
        <div className='flex gap-2'>
          <Button
            onClick={handleTakeAttendance}
            variant='primary'
            className='flex items-center gap-2'
          >
            <PlusCircle size={20} />
            تسجيل حضور
          </Button>
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

      <div className='bg-white p-4 rounded-lg shadow-sm mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            فلترة حسب البرنامج
          </label>
          <div className='relative'>
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none'
            >
              <option value='all'>كل البرامج</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <ClipboardList
              size={20}
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
            />
          </div>
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            فلترة حسب التاريخ
          </label>
          <div className='relative'>
            <input
              type='date'
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <Calendar
              size={20}
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
            />
          </div>
        </div>
        <Button
          onClick={() => {
            setFilterProgram('all');
            setFilterDate('');
          }}
          variant='secondary'
        >
          إعادة تعيين الفلاتر
        </Button>
      </div>

      <div className='bg-white rounded-lg shadow overflow-x-auto'>
        <table className='w-full text-right'>
          <thead className='bg-gray-100 text-gray-600 uppercase text-sm'>
            <tr>
              <th className='p-4'>البرنامج</th>
              <th className='p-4'>الطالب</th>
              <th className='p-4'>التاريخ</th>
              <th className='p-4'>الحالة</th>
              <th className='p-4'>ملاحظات</th>
            </tr>
          </thead>
          <tbody className='text-gray-700'>
            {filteredAttendance.map((record) => (
              <tr
                key={record.id}
                className='border-b border-gray-200 hover:bg-gray-50'
              >
                <td className='p-4 font-medium'>
                  {getProgramName(record.programId)}
                </td>
                <td className='p-4'>{getStudentName(record.studentId)}</td>
                <td className='p-4'>
                  {record.date
                    ? new Date(record.date).toISOString().split('T')[0]
                    : ''}
                </td>
                <td className='p-4'>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      getAttendanceConfig(record.status).color
                    }`}
                  >
                    {getAttendanceConfig(record.status).label}
                  </span>
                </td>
                <td className='p-4'>{record.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAttendance.length === 0 && (
          <div className='text-center p-8 text-gray-500'>
            لا توجد سجلات حضور لعرضها.
          </div>
        )}
      </div>

      <AttendanceFormModal
        isOpen={attendanceModalOpen}
        onClose={() => setAttendanceModalOpen(false)}
        onSave={handleSaveAttendance}
        programs={programs}
        sessions={sessions}
        students={students}
        onLoadStudents={handleLoadStudents}
      />
    </div>
  );
};

export default Attendance;
