import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/apiClient';
import type { Program, Student, AttendanceRecord } from '../types/program';
import Button from '../components/common/Button';
import {
  FileDown,
  PieChart,
  BarChart,
  Users,
  Activity,
  ClipboardCheck,
} from 'lucide-react';
import { exportToXLSX, exportToPDF } from '../lib/exportUtils';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useToast } from '../contexts/ToastContext';

const Reports: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [progData, studData, attData] = await Promise.all([
          api.programs.list(),
          api.students.list(),
          api.attendanceRecords.list(),
        ]);
        setPrograms(progData);
        setStudents(studData);
        setAttendance(attData);
      } catch (err: any) {
        setError(err.message || t('dashboard_error'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t]);

  const totalPrograms = programs.length;
  const totalStudents = students.length;
  const totalAttendance = attendance.length;

  const programsByType = useMemo(() => {
    const counts = programs.reduce((acc, prog) => {
      acc[prog.type] = (acc[prog.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([type, count]) => ({ type, count }));
  }, [programs]);

  const studentsByGrade = useMemo(() => {
    const counts = students.reduce((acc, stud) => {
      acc[stud.grade] = (acc[stud.grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([grade, count]) => ({ grade, count }));
  }, [students]);

  const handleGeneralReportExport = async () => {
    try {
      await exportToXLSX('PROGRAMS', {}, t('programs_report_xlsx'));
      toast.success(t('export_success'));
    } catch (err: any) {
      toast.error(t('export_failed'));
      setError(err.message || t('export_failed'));
    }
  };

  const handleGeneralReportPDFExport = async () => {
    try {
      await exportToPDF('PROGRAMS', {}, t('programs_report_pdf'));
      toast.success(t('export_success'));
    } catch (err: any) {
      toast.error(t('export_failed'));
      setError(err.message || t('export_failed'));
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {t('reports_title')}
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            onClick={handleGeneralReportExport}
            variant="secondary"
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <FileDown size={18} />
            {t('export_report_xlsx')}
          </Button>
          <Button
            onClick={handleGeneralReportPDFExport}
            variant="secondary"
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <FileDown size={18} />
            {t('export_report_pdf')}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Activity size={24} className="text-blue-600" />
          </div>
          <div>
            <div className="text-gray-500 text-sm sm:text-base">
              {t('total_programs_label')}
            </div>
            <div className="text-2xl sm:text-3xl font-bold">
              {totalPrograms}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-full">
            <Users size={24} className="text-green-600" />
          </div>
          <div>
            <div className="text-gray-500 text-sm sm:text-base">
              {t('total_students_label')}
            </div>
            <div className="text-2xl sm:text-3xl font-bold">
              {totalStudents}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <ClipboardCheck size={24} className="text-purple-600" />
          </div>
          <div>
            <div className="text-gray-500 text-sm sm:text-base">
              {t('total_attendance_label')}
            </div>
            <div className="text-2xl sm:text-3xl font-bold">
              {totalAttendance}
            </div>
          </div>
        </div>
      </div>

      {/* Charts / Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
            <PieChart className="text-blue-600" /> {t('programs_by_type')}
          </h3>
          <div className="space-y-2">
            {programsByType.map(({ type, count }) => (
              <div
                key={type}
                className="flex justify-between items-center text-sm sm:text-base"
              >
                <span className="truncate">{type}</span>
                <span className="font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
            <BarChart className="text-green-600" /> {t('students_by_grade')}
          </h3>
          <div className="space-y-2">
            {studentsByGrade.map(({ grade, count }) => (
              <div
                key={grade}
                className="flex justify-between items-center text-sm sm:text-base"
              >
                <span>
                  {t('grade_prefix')} {grade}
                </span>
                <span className="font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
