/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import useProgramDetails from '../hooks/useProgramDetails';

// Sub-components for tabs
interface ProgramTabProps {
  program: any;
  students: any[];
  sessions: any[];
  attendance: any[];
  advisor: any;
}

const ProgramInfoTab: React.FC<ProgramTabProps> = ({ program, advisor }) => (
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

const ProgramStudentsTab: React.FC<ProgramTabProps> = ({ students }) => (
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

const ProgramScheduleTab: React.FC<ProgramTabProps> = ({ sessions }) => (
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

const ProgramAttendanceTab: React.FC<ProgramTabProps> = ({
  attendance,
  students,
}) => (
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

const ProgramDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { program, students, sessions, attendance, advisor, loading, error } =
    useProgramDetails(id);
  const [activeTab, setActiveTab] = useState('info');

  const programType = program ? getTypeConfig(program.type) : null;
  const programStatus = program ? getStatusConfig(program.status) : null;

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
              className={`py-4 px-1 border-b-2 cursor-pointer ${
                activeTab === 'info'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Info size={18} className='inline-block ml-2' /> تفاصيل
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`py-4 px-1 border-b-2 cursor-pointer ${
                activeTab === 'students'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users size={18} className='inline-block ml-2' /> الطلاب
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`py-4 px-1 border-b-2 cursor-pointer ${
                activeTab === 'schedule'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar size={18} className='inline-block ml-2' /> الجدول الزمني
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`py-4 px-1 border-b-2 cursor-pointer ${
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
          {activeTab === 'info' && (
            <ProgramInfoTab
              program={program}
              students={students}
              sessions={sessions}
              attendance={attendance}
              advisor={advisor}
            />
          )}
          {activeTab === 'students' && (
            <ProgramStudentsTab
              program={program}
              students={students}
              sessions={sessions}
              attendance={attendance}
              advisor={advisor}
            />
          )}
          {activeTab === 'schedule' && (
            <ProgramScheduleTab
              program={program}
              students={students}
              sessions={sessions}
              attendance={attendance}
              advisor={advisor}
            />
          )}
          {activeTab === 'attendance' && (
            <ProgramAttendanceTab
              program={program}
              students={students}
              sessions={sessions}
              attendance={attendance}
              advisor={advisor}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramDetails;
