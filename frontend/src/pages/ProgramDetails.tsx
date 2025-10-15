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
    <p className='text-sm sm:text-base leading-relaxed'>{program?.description}</p>
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t'>
      <div className='text-sm sm:text-base'>
        <span className='font-semibold'>المرشد الحالي:</span>{' '}
        {advisor?.name || 'غير محدد'}
      </div>
      <div className='text-sm sm:text-base'>
        <span className='font-semibold'>تاريخ الإنشاء:</span>{' '}
        {program && new Date(program.createdDate).toLocaleDateString('ar-EG')}
      </div>
    </div>
  </div>
);

const ProgramStudentsTab: React.FC<ProgramTabProps> = ({ students }) => (
  <div className='overflow-x-auto -mx-6 sm:mx-0'>
    <div className='inline-block min-w-full align-middle'>
      <div className='overflow-hidden'>
        {/* Desktop Table View */}
        <table className='hidden sm:table w-full text-right'>
          <thead className='bg-gray-100 text-gray-600 uppercase text-sm'>
            <tr>
              <th className='p-3 lg:p-4'>الاسم</th>
              <th className='p-3 lg:p-4'>الرقم الأكاديمي</th>
              <th className='p-3 lg:p-4'>الصف/الشعبة</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className='border-b hover:bg-gray-50'>
                <td className='p-3 lg:p-4'>{s.name}</td>
                <td className='p-3 lg:p-4'>{s.studentNumber}</td>
                <td className='p-3 lg:p-4'>
                  {s.grade} / {s.section}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Card View */}
        <div className='sm:hidden space-y-3 px-6'>
          {students.map((s) => (
            <div key={s.id} className='bg-gray-50 rounded-lg p-4 space-y-2'>
              <div className='font-semibold text-base'>{s.name}</div>
              <div className='text-sm text-gray-600'>
                <span className='font-medium'>الرقم الأكاديمي:</span> {s.studentNumber}
              </div>
              <div className='text-sm text-gray-600'>
                <span className='font-medium'>الصف/الشعبة:</span> {s.grade} / {s.section}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ProgramScheduleTab: React.FC<ProgramTabProps> = ({ sessions }) => (
  <div className='overflow-x-auto -mx-6 sm:mx-0'>
    <div className='inline-block min-w-full align-middle'>
      <div className='overflow-hidden'>
        {/* Desktop Table View */}
        <table className='hidden sm:table w-full text-right'>
          <thead className='bg-gray-100 text-gray-600 uppercase text-sm'>
            <tr>
              <th className='p-3 lg:p-4'>التاريخ</th>
              <th className='p-3 lg:p-4'>الوقت</th>
              <th className='p-3 lg:p-4'>الموقع</th>
              <th className='p-3 lg:p-4'>ملاحظات</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id} className='border-b hover:bg-gray-50'>
                <td className='p-3 lg:p-4'>
                  {new Date(s.date).toLocaleDateString('ar-EG')}
                </td>
                <td className='p-3 lg:p-4'>
                  {s.startTime} - {s.endTime}
                </td>
                <td className='p-3 lg:p-4'>{s.location}</td>
                <td className='p-3 lg:p-4'>{s.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Card View */}
        <div className='sm:hidden space-y-3 px-6'>
          {sessions.map((s) => (
            <div key={s.id} className='bg-gray-50 rounded-lg p-4 space-y-2'>
              <div className='font-semibold text-base'>
                {new Date(s.date).toLocaleDateString('ar-EG')}
              </div>
              <div className='text-sm text-gray-600'>
                <span className='font-medium'>الوقت:</span> {s.startTime} - {s.endTime}
              </div>
              <div className='text-sm text-gray-600'>
                <span className='font-medium'>الموقع:</span> {s.location}
              </div>
              {s.notes && (
                <div className='text-sm text-gray-600'>
                  <span className='font-medium'>ملاحظات:</span> {s.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ProgramAttendanceTab: React.FC<ProgramTabProps> = ({
  attendance,
  students,
}) => (
  <div className='overflow-x-auto -mx-6 sm:mx-0'>
    <div className='inline-block min-w-full align-middle'>
      <div className='overflow-hidden'>
        {/* Desktop Table View */}
        <table className='hidden sm:table w-full text-right'>
          <thead className='bg-gray-100 text-gray-600 uppercase text-sm'>
            <tr>
              <th className='p-3 lg:p-4'>الطالب</th>
              <th className='p-3 lg:p-4'>التاريخ</th>
              <th className='p-3 lg:p-4'>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((a) => (
              <tr key={a.id} className='border-b hover:bg-gray-50'>
                <td className='p-3 lg:p-4'>
                  {students.find((s) => s.id === a.studentId)?.name}
                </td>
                <td className='p-3 lg:p-4'>
                  {new Date(a.date).toLocaleDateString('ar-EG')}
                </td>
                <td className='p-3 lg:p-4'>
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

        {/* Mobile Card View */}
        <div className='sm:hidden space-y-3 px-6'>
          {attendance.map((a) => (
            <div key={a.id} className='bg-gray-50 rounded-lg p-4 space-y-2'>
              <div className='font-semibold text-base'>
                {students.find((s) => s.id === a.studentId)?.name}
              </div>
              <div className='text-sm text-gray-600'>
                <span className='font-medium'>التاريخ:</span>{' '}
                {new Date(a.date).toLocaleDateString('ar-EG')}
              </div>
              <div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    getAttendanceConfig(a.status).color
                  }`}
                >
                  {getAttendanceConfig(a.status).label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
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
    return <div className='p-4 sm:p-6 text-center'>لم يتم العثور على البرنامج.</div>;

  return (
    <div className='p-4 sm:p-6 bg-gray-50 min-h-screen'>
      <div className='flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6'>
        <Button
          onClick={() => navigate('/programs')}
          variant='secondary'
          className='h-9 w-9 sm:h-10 sm:w-10 p-0 flex items-center justify-center flex-shrink-0'
        >
          <ArrowRight size={18} className='sm:w-5 sm:h-5' />
        </Button>
        <div className='flex-1 min-w-0'>
          <h2 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 break-words'>
            {program.name}
          </h2>
          <div className='flex flex-wrap items-center gap-2 sm:gap-4 mt-2'>
            <span
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${programType?.color}`}
            >
              {programType?.label}
            </span>
            <span
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${programStatus?.badge}`}
            >
              {programStatus?.label}
            </span>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <div className='border-b border-gray-200 overflow-x-auto'>
          <nav className='flex gap-2 sm:gap-6 px-4 sm:px-6 min-w-max sm:min-w-0'>
            <button
              onClick={() => setActiveTab('info')}
              className={`py-3 sm:py-4 px-1 border-b-2 cursor-pointer whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'info'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Info size={16} className='sm:w-[18px] sm:h-[18px] inline-block ml-1 sm:ml-2' /> 
              <span className='hidden xs:inline'>تفاصيل</span>
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`py-3 sm:py-4 px-1 border-b-2 cursor-pointer whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'students'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users size={16} className='sm:w-[18px] sm:h-[18px] inline-block ml-1 sm:ml-2' /> 
              <span className='hidden xs:inline'>الطلاب</span>
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`py-3 sm:py-4 px-1 border-b-2 cursor-pointer whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'schedule'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar size={16} className='sm:w-[18px] sm:h-[18px] inline-block ml-1 sm:ml-2' /> 
              <span className='hidden xs:inline'>الجدول الزمني</span>
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`py-3 sm:py-4 px-1 border-b-2 cursor-pointer whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'attendance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ClipboardCheck size={16} className='sm:w-[18px] sm:h-[18px] inline-block ml-1 sm:ml-2' /> 
              <span className='hidden xs:inline'>الحضور</span>
            </button>
          </nav>
        </div>
        <div className='p-4 sm:p-6'>
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