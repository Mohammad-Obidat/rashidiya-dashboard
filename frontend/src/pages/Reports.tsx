import React, { useEffect, useState, useMemo } from 'react';
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

const Reports: React.FC = () => {
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
        setError(err.message || 'فشل في تحميل بيانات التقارير');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      await exportToXLSX('PROGRAMS', {}, 'تقرير_البرامج.xlsx');
    } catch (err: any) {
      setError(err.message || 'فشل في تصدير الملف');
    }
  };

  const handleGeneralReportPDFExport = async () => {
    try {
      await exportToPDF('PROGRAMS', {}, 'تقرير_البرامج.pdf');
    } catch (err: any) {
      setError(err.message || 'فشل في تصدير الملف');
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-3xl font-bold text-gray-800'>
          التقارير والإحصائيات
        </h2>
        <div className='flex gap-2'>
          <Button
            onClick={handleGeneralReportExport}
            variant='secondary'
            className='flex items-center gap-2'
          >
            <FileDown size={18} />
            تصدير XLSX
          </Button>
          <Button
            onClick={handleGeneralReportPDFExport}
            variant='secondary'
            className='flex items-center gap-2'
          >
            <FileDown size={18} />
            تصدير PDF
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
        <div className='bg-white p-6 rounded-lg shadow-sm flex items-center gap-4'>
          <div className='p-3 bg-blue-100 rounded-full'>
            <Activity size={24} className='text-blue-600' />
          </div>
          <div>
            <div className='text-gray-500'>إجمالي البرامج</div>
            <div className='text-3xl font-bold'>{totalPrograms}</div>
          </div>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-sm flex items-center gap-4'>
          <div className='p-3 bg-green-100 rounded-full'>
            <Users size={24} className='text-green-600' />
          </div>
          <div>
            <div className='text-gray-500'>إجمالي الطلاب</div>
            <div className='text-3xl font-bold'>{totalStudents}</div>
          </div>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-sm flex items-center gap-4'>
          <div className='p-3 bg-purple-100 rounded-full'>
            <ClipboardCheck size={24} className='text-purple-600' />
          </div>
          <div>
            <div className='text-gray-500'>إجمالي الحضور</div>
            <div className='text-3xl font-bold'>{totalAttendance}</div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-white p-6 rounded-lg shadow-sm'>
          <h3 className='text-xl font-bold mb-4 flex items-center gap-2'>
            <PieChart /> توزيع البرامج حسب النوع
          </h3>
          <div className='space-y-2'>
            {programsByType.map(({ type, count }) => (
              <div key={type} className='flex justify-between items-center'>
                <span>{type}</span>
                <span className='font-bold'>{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-sm'>
          <h3 className='text-xl font-bold mb-4 flex items-center gap-2'>
            <BarChart /> توزيع الطلاب حسب الصف
          </h3>
          <div className='space-y-2'>
            {studentsByGrade.map(({ grade, count }) => (
              <div key={grade} className='flex justify-between items-center'>
                <span>الصف {grade}</span>
                <span className='font-bold'>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
