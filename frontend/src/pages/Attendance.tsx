import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../lib/apiClient';
import type { AttendanceRecord, Program, Student } from '../types/program';
import Button from '../components/common/Button';
import { FileDown, Calendar, ClipboardList } from 'lucide-react';
import { exportToXLSX, exportToPDF } from '../lib/exportUtils';
import { getAttendanceConfig } from '../config/programConfig';

const Attendance: React.FC = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterProgram, setFilterProgram] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [attData, progData, studData] = await Promise.all([
          api.attendanceRecords.list(),
          api.programs.list(),
          api.students.list(),
        ]);
        setAttendance(attData);
        setPrograms(progData);
        setStudents(studData);
      } catch (err: any) {
        setError(err.message || 'فشل في تحميل بيانات الحضور');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStudentName = (studentId: string) => students.find(s => s.id === studentId)?.name || 'غير معروف';
  const getProgramName = (programId: string) => programs.find(p => p.id === programId)?.name || 'غير معروف';

  const filteredAttendance = useMemo(() =>
    attendance.filter(record => {
      const matchesProgram = filterProgram === 'all' || record.programId === filterProgram;
      const matchesDate = !filterDate || record.date === filterDate;
      return matchesProgram && matchesDate;
    }), [attendance, filterProgram, filterDate]);

  const handleExportXLSX = () => {
    const dataToExport = filteredAttendance.map(r => ({
      'البرنامج': getProgramName(r.programId),
      'الطالب': getStudentName(r.studentId),
      'التاريخ': r.date,
      'الحالة': getAttendanceConfig(r.status).label,
      'ملاحظات': r.notes || '',
    }));
    exportToXLSX(dataToExport, 'Attendance', 'سجل الحضور');
  };

  const handleExportPDF = () => {
    const headers = ['البرنامج', 'الطالب', 'التاريخ', 'الحالة', 'ملاحظات'];
    const body = filteredAttendance.map(r => [
      getProgramName(r.programId),
      getStudentName(r.studentId),
      r.date,
      getAttendanceConfig(r.status).label,
      r.notes || '',
    ]);
    exportToPDF(headers, body, 'سجل الحضور');
  };

  if (loading) return <div className="p-6 text-center">جاري التحميل...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">سجل الحضور والغياب</h2>
        <div className="flex gap-2">
          <Button onClick={handleExportXLSX} variant="secondary" className="flex items-center gap-2">
            <FileDown size={18} />
            تصدير XLSX
          </Button>
          <Button onClick={handleExportPDF} variant="secondary" className="flex items-center gap-2">
            <FileDown size={18} />
            تصدير PDF
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">فلترة حسب البرنامج</label>
          <div className="relative">
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="all">كل البرامج</option>
              {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <ClipboardList size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">فلترة حسب التاريخ</label>
          <div className="relative">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Calendar size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <Button onClick={() => { setFilterProgram('all'); setFilterDate(''); }} variant="secondary">إعادة تعيين الفلاتر</Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
            <tr>
              <th className="p-4">البرنامج</th>
              <th className="p-4">الطالب</th>
              <th className="p-4">التاريخ</th>
              <th className="p-4">الحالة</th>
              <th className="p-4">ملاحظات</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredAttendance.map((record) => (
              <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-4 font-medium">{getProgramName(record.programId)}</td>
                <td className="p-4">{getStudentName(record.studentId)}</td>
                <td className="p-4">{record.date}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getAttendanceConfig(record.status).color}`}>
                    {getAttendanceConfig(record.status).label}
                  </span>
                </td>
                <td className="p-4">{record.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAttendance.length === 0 && (
          <div className="text-center p-8 text-gray-500">
            لا توجد سجلات حضور لعرضها.
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
