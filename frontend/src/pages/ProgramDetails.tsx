import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/apiClient';
import type {
  Program,
  Student,
  Session,
  AttendanceRecord,
  Advisor,
} from '../types/program';
import Button from '../components/common/Button';
import {
  getStatusConfig,
  getTypeConfig,
  getAttendanceConfig,
} from '../config/programConfig';
import {
  ArrowRight,
  Users,
  Calendar,
  ClipboardCheck,
  Info,
} from 'lucide-react';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

const ProgramDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [program, setProgram] = useState<Program | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [advisor, setAdvisor] = useState<Advisor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (!id || id === 'new') {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [progData, studData, sessData, attData] = await Promise.all([
          api.programs.get(id),
          api.students.list(),
          api.sessions.byProgram(id),
          api.attendanceRecords.byProgram(id),
        ]);

        setProgram(progData);
        setStudents(
          studData.filter((s) =>
            progData.students?.some((ps) => ps.studentId === s.id)
          )
        );
        setSessions(sessData);
        setAttendance(attData);
        if (progData.currentAdvisorId) {
          const advData = await api.advisors.get(progData.currentAdvisorId);
          setAdvisor(advData);
        }
      } catch (err: any) {
        setError(err.message || 'فشل في تحميل تفاصيل البرنامج');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const programType = program ? getTypeConfig(program.type) : null;
  const programStatus = program ? getStatusConfig(program.status) : null;

  const renderInfoTab = () => (
    <div className='space-y-4'>
      <h3 className='text-xl font-bold'>وصف البرنامج</h3>
      <p>{program?.description}</p>
      <div className='grid grid-cols-2 gap-4 pt-4 border-t'>
        <div>
          <span className='font-semibold'>المرشد الحالي:</span>{' '}
          {advisor?.name || 'غير محدد'}
        </div>
        <div>
          <span className='font-semibold'>تاريخ الإنشاء:</span>{' '}
          {program && new Date(program.createdDate).toLocaleDateString('ar-EG')}
        </div>
      </div>
    </div>
  );

  const renderStudentsTab = () => (
    <div>
      <table className='w-full text-right'>
        <thead className='bg-gray-100 text-gray-600 uppercase text-sm'>
          <tr>
            <th className='p-4'>الاسم</th>
            <th className='p-4'>الرقم الأكاديمي</th>
            <th className='p-4'>الصف/الشعبة</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id} className='border-b hover:bg-gray-50'>
              <td className='p-4'>{s.name}</td>
              <td className='p-4'>{s.studentNumber}</td>
              <td className='p-4'>
                {s.grade} / {s.section}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderScheduleTab = () => (
    <div>
      <table className='w-full text-right'>
        <thead className='bg-gray-100 text-gray-600 uppercase text-sm'>
          <tr>
            <th className='p-4'>التاريخ</th>
            <th className='p-4'>الوقت</th>
            <th className='p-4'>الموقع</th>
            <th className='p-4'>ملاحظات</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id} className='border-b hover:bg-gray-50'>
              <td className='p-4'>
                {new Date(s.date).toLocaleDateString('ar-EG')}
              </td>
              <td className='p-4'>
                {s.startTime} - {s.endTime}
              </td>
              <td className='p-4'>{s.location}</td>
              <td className='p-4'>{s.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAttendanceTab = () => (
    <div>
      <table className='w-full text-right'>
        <thead className='bg-gray-100 text-gray-600 uppercase text-sm'>
          <tr>
            <th className='p-4'>الطالب</th>
            <th className='p-4'>التاريخ</th>
            <th className='p-4'>الحالة</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((a) => (
            <tr key={a.id} className='border-b hover:bg-gray-50'>
              <td className='p-4'>
                {students.find((s) => s.id === a.studentId)?.name}
              </td>
              <td className='p-4'>
                {new Date(a.date).toLocaleDateString('ar-EG')}
              </td>
              <td className='p-4'>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    getAttendanceConfig(a.status).color
                  }`}
                >
                  {getAttendanceConfig(a.status).label}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!program)
    return <div className='p-6 text-center'>لم يتم العثور على البرنامج.</div>;

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div className='flex items-center gap-4 mb-6'>
        <Button
          onClick={() => navigate('/')}
          variant='secondary'
          className='h-10 w-10 p-0 flex items-center justify-center'
        >
          <ArrowRight size={20} />
        </Button>
        <div>
          <h2 className='text-3xl font-bold text-gray-800'>{program.name}</h2>
          <div className='flex items-center gap-4 mt-2'>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${programType?.color}`}
            >
              {programType?.label}
            </span>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${programStatus?.badge}`}
            >
              {programStatus?.label}
            </span>
          </div>
        </div>
      </div>

      <div className='bg-white p-6 rounded-lg shadow-md'>
        <div className='border-b border-gray-200'>
          <nav className='-mb-px flex gap-6'>
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 px-1 border-b-2 ${
                activeTab === 'info'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Info size={18} className='inline-block ml-2' /> تفاصيل
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`py-4 px-1 border-b-2 ${
                activeTab === 'students'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users size={18} className='inline-block ml-2' /> الطلاب
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`py-4 px-1 border-b-2 ${
                activeTab === 'schedule'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar size={18} className='inline-block ml-2' /> الجدول الزمني
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`py-4 px-1 border-b-2 ${
                activeTab === 'attendance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ClipboardCheck size={18} className='inline-block ml-2' /> الحضور
            </button>
          </nav>
        </div>
        <div className='pt-6'>
          {activeTab === 'info' && renderInfoTab()}
          {activeTab === 'students' && renderStudentsTab()}
          {activeTab === 'schedule' && renderScheduleTab()}
          {activeTab === 'attendance' && renderAttendanceTab()}
        </div>
      </div>
    </div>
  );
};

export default ProgramDetails;
