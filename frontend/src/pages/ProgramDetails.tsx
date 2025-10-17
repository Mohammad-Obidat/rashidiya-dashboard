/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  ArrowLeft,
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
  t: any;
  isRtl: boolean;
}

const ProgramInfoTab: React.FC<ProgramTabProps> = ({
  program,
  advisor,
  t,
  isRtl,
}) => (
  <div className="space-y-4">
    <h3 className={`text-xl font-bold ${isRtl ? 'text-right' : 'text-left'}`}>
      {t('program_description_label')}
    </h3>
    <p
      className={`text-sm sm:text-base leading-relaxed ${
        isRtl ? 'text-right' : 'text-left'
      }`}
    >
      {program?.description}
    </p>
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t ${
        isRtl ? 'text-right' : 'text-left'
      }`}
    >
      <div className="text-sm sm:text-base">
        <span className="font-semibold">{t('current_advisor')}:</span>{' '}
        {advisor?.name || t('not_assigned')}
      </div>
      <div className="text-sm sm:text-base">
        <span className="font-semibold">{t('creation_date')}:</span>{' '}
        {program && new Date(program.createdDate).toLocaleDateString('ar-EG')}
      </div>
    </div>
  </div>
);

const ProgramStudentsTab: React.FC<ProgramTabProps> = ({
  students,
  t,
  isRtl,
}) => (
  <div className="overflow-x-auto -mx-6 sm:mx-0">
    <div className="inline-block min-w-full align-middle">
      <div className="overflow-hidden">
        {/* Desktop Table View */}
        <table
          className={`hidden sm:table w-full ${
            isRtl ? 'text-right' : 'text-left'
          }`}
        >
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
            <tr>
              <th className="p-3 lg:p-4">{t('student_name')}</th>
              <th className="p-3 lg:p-4">{t('student_id')}</th>
              <th className="p-3 lg:p-4">{t('student_grade_section')}</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="p-3 lg:p-4">{s.name}</td>
                <td className="p-3 lg:p-4">{s.studentNumber}</td>
                <td className="p-3 lg:p-4">
                  {s.grade} / {s.section}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Card View */}
        <div
          className={`sm:hidden space-y-3 px-6 ${
            isRtl ? 'text-right' : 'text-left'
          }`}
        >
          {students.map((s) => (
            <div key={s.id} className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="font-semibold text-base">{s.name}</div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{t('student_id')}:</span>{' '}
                {s.studentNumber}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">
                  {t('student_grade_section')}:
                </span>{' '}
                {s.grade} / {s.section}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ProgramScheduleTab: React.FC<ProgramTabProps> = ({
  sessions,
  t,
  isRtl,
}) => (
  <div className="overflow-x-auto -mx-6 sm:mx-0">
    <div className="inline-block min-w-full align-middle">
      <div className="overflow-hidden">
        {/* Desktop Table View */}
        <table
          className={`hidden sm:table w-full ${
            isRtl ? 'text-right' : 'text-left'
          }`}
        >
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
            <tr>
              <th className="p-3 lg:p-4">{t('session_date')}</th>
              <th className="p-3 lg:p-4">{t('session_time')}</th>
              <th className="p-3 lg:p-4">{t('session_location')}</th>
              <th className="p-3 lg:p-4">{t('session_notes')}</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="p-3 lg:p-4">
                  {new Date(s.date).toLocaleDateString('ar-EG')}
                </td>
                <td className="p-3 lg:p-4">
                  {s.startTime} - {s.endTime}
                </td>
                <td className="p-3 lg:p-4">{s.location}</td>
                <td className="p-3 lg:p-4">{s.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Card View */}
        <div
          className={`sm:hidden space-y-3 px-6 ${
            isRtl ? 'text-right' : 'text-left'
          }`}
        >
          {sessions.map((s) => (
            <div key={s.id} className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="font-semibold text-base">
                {new Date(s.date).toLocaleDateString('ar-EG')}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{t('session_time')}:</span>{' '}
                {s.startTime} - {s.endTime}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{t('session_location')}:</span>{' '}
                {s.location}
              </div>
              {s.notes && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{t('session_notes')}:</span>{' '}
                  {s.notes}
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
  t,
  isRtl,
}) => (
  <div className="overflow-x-auto -mx-6 sm:mx-0">
    <div className="inline-block min-w-full align-middle">
      <div className="overflow-hidden">
        {/* Desktop Table View */}
        <table
          className={`hidden sm:table w-full ${
            isRtl ? 'text-right' : 'text-left'
          }`}
        >
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
            <tr>
              <th className="p-3 lg:p-4">{t('attendance_student')}</th>
              <th className="p-3 lg:p-4">{t('attendance_date')}</th>
              <th className="p-3 lg:p-4">{t('attendance_status')}</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((a) => (
              <tr key={a.id} className="border-b hover:bg-gray-50">
                <td className="p-3 lg:p-4">
                  {students.find((s) => s.id === a.studentId)?.name}
                </td>
                <td className="p-3 lg:p-4">
                  {new Date(a.date).toLocaleDateString('ar-EG')}
                </td>
                <td className="p-3 lg:p-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      getAttendanceConfig(a.status).color
                    }`}
                  >
                    {t(`attendanceType.${a.status}`)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Card View */}
        <div
          className={`sm:hidden space-y-3 px-6 ${
            isRtl ? 'text-right' : 'text-left'
          }`}
        >
          {attendance.map((a) => (
            <div key={a.id} className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="font-semibold text-base">
                {students.find((s) => s.id === a.studentId)?.name}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{t('attendance_date')}:</span>{' '}
                {new Date(a.date).toLocaleDateString('ar-EG')}
              </div>
              <div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    getAttendanceConfig(a.status).color
                  }`}
                >
                  {t(`attendanceType.${a.status}`)}
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
  const { i18n, t } = useTranslation();

  const { program, students, sessions, attendance, advisor, loading, error } =
    useProgramDetails(id);
  const [activeTab, setActiveTab] = useState('info');

  const programType = program ? getTypeConfig(program.type) : null;
  const programStatus = program ? getStatusConfig(program.status) : null;
  const isRtl = i18n.language === 'ar' || i18n.language === 'he';

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!program)
    return (
      <div
        className={`p-4 sm:p-6 text-center ${
          isRtl ? 'text-right' : 'text-left'
        }`}
      >
        {t('program_not_found')}
      </div>
    );

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div
        className={`flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6`}
      >
        <Button
          onClick={() => navigate('/programs')}
          variant="secondary"
          className="h-9 w-9 sm:h-10 sm:w-10 p-0 flex items-center justify-center flex-shrink-0"
        >
          {isRtl ? (
            <ArrowRight size={18} className="sm:w-5 sm:h-5" />
          ) : (
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          )}
        </Button>
        <div className="flex-1 min-w-0">
          <h2
            className={`text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 break-words ${
              isRtl ? 'text-right' : 'text-left'
            }`}
          >
            {program.name}
          </h2>
          <div
            className={`flex flex-wrap items-center gap-2 sm:gap-4 mt-2 ${
              isRtl ? 'flex-row-reverse justify-end' : ''
            }`}
          >
            <span
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${programType?.color}`}
            >
              {t(`type.${program.type}`)}
            </span>

            <span
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${programStatus?.badge}`}
            >
              {t(`status.${program.status}`)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav
            className={`flex gap-2 sm:gap-6 px-4 sm:px-6 min-w-max sm:min-w-0`}
          >
            <button
              onClick={() => setActiveTab('info')}
              className={`py-3 sm:py-4 px-1 border-b-2 cursor-pointer whitespace-nowrap text-sm sm:text-base flex items-center gap-1 sm:gap-2 ${
                activeTab === 'info'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ${isRtl ? 'flex-row-reverse' : ''}`}
            >
              <Info size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden xs:inline">{t('tab_info')}</span>
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`py-3 sm:py-4 px-1 border-b-2 cursor-pointer whitespace-nowrap text-sm sm:text-base flex items-center gap-1 sm:gap-2 ${
                activeTab === 'students'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ${isRtl ? 'flex-row-reverse' : ''}`}
            >
              <Users size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden xs:inline">{t('tab_students')}</span>
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`py-3 sm:py-4 px-1 border-b-2 cursor-pointer whitespace-nowrap text-sm sm:text-base flex items-center gap-1 sm:gap-2 ${
                activeTab === 'schedule'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ${isRtl ? 'flex-row-reverse' : ''}`}
            >
              <Calendar size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden xs:inline">{t('tab_schedule')}</span>
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`py-3 sm:py-4 px-1 border-b-2 cursor-pointer whitespace-nowrap text-sm sm:text-base flex items-center gap-1 sm:gap-2 ${
                activeTab === 'attendance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ${isRtl ? 'flex-row-reverse' : ''}`}
            >
              <ClipboardCheck size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden xs:inline">{t('tab_attendance')}</span>
            </button>
          </nav>
        </div>
        <div className="p-4 sm:p-6">
          {activeTab === 'info' && (
            <ProgramInfoTab
              program={program}
              students={students}
              sessions={sessions}
              attendance={attendance}
              advisor={advisor}
              t={t}
              isRtl={isRtl}
            />
          )}
          {activeTab === 'students' && (
            <ProgramStudentsTab
              program={program}
              students={students}
              sessions={sessions}
              attendance={attendance}
              advisor={advisor}
              t={t}
              isRtl={isRtl}
            />
          )}
          {activeTab === 'schedule' && (
            <ProgramScheduleTab
              program={program}
              students={students}
              sessions={sessions}
              attendance={attendance}
              advisor={advisor}
              t={t}
              isRtl={isRtl}
            />
          )}
          {activeTab === 'attendance' && (
            <ProgramAttendanceTab
              program={program}
              students={students}
              sessions={sessions}
              attendance={attendance}
              advisor={advisor}
              t={t}
              isRtl={isRtl}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramDetails;
