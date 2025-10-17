import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/apiClient';
import type {
  AttendanceRecord,
  Program,
  Student,
  Session,
  AttendanceStatus,
} from '../types/program';
import Button from '../components/common/Button';
import AttendanceFormModal from '../components/modals/AttendanceFormModal';
import {
  FileDown,
  Calendar,
  ClipboardList,
  PlusCircle,
  Edit,
  Trash2,
} from 'lucide-react';
import { exportToXLSX, exportToPDF } from '../lib/exportUtils';
import { getAttendanceConfig } from '../config/programConfig';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useToast } from '../contexts/ToastContext';

const Attendance: React.FC = () => {
  const { t } = useTranslation();
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
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(
    null
  );

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
        setError(err.message || t('dashboard_error'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t]);

  const getStudentName = (studentId: string) =>
    students.find((s) => s.id === studentId)?.name || t('not_assigned');
  const getProgramName = (programId: string) =>
    programs.find((p) => p.id === programId)?.name || t('not_assigned');

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
      if (filterProgram !== 'all') filters.programId = filterProgram;
      if (filterDate) filters.date = filterDate;
      await exportToXLSX('ATTENDANCE', filters, t('export_attendance_xlsx'));
      toast.success(t('export_success'));
    } catch {
      toast.error(t('export_failed'));
    }
  };

  const handleExportPDF = async () => {
    try {
      const filters: Record<string, any> = {};
      if (filterProgram !== 'all') filters.programId = filterProgram;
      if (filterDate) filters.date = filterDate;
      await exportToPDF('ATTENDANCE', filters, t('export_attendance_pdf'));
      toast.success(t('export_success'));
    } catch {
      toast.error(t('export_failed'));
    }
  };

  const handleTakeAttendance = () => {
    setEditingRecord(null);
    setAttendanceModalOpen(true);
  };

  const handleLoadStudents = async (programId: string): Promise<string[]> => {
    try {
      const enrollments = await api.studentPrograms.byProgram(programId);
      return enrollments.map((e) => e.studentId);
    } catch (err: any) {
      toast.error(t('load_students_failed'));
      console.error('Error loading students:', err);
      return [];
    }
  };

  const handleSaveAttendance = async (
    sessionId: string,
    records: Array<{
      studentId: string;
      status: AttendanceStatus;
      notes: string | null;
    }>,
    isBulk: boolean,
    recordId?: string
  ) => {
    try {
      if (isBulk) {
        // Bulk save mode
        const session = sessions.find((s) => s.id === sessionId);
        if (!session) {
          throw new Error('Session not found');
        }

        const attendanceRecords = records.map((record) => ({
          studentId: record.studentId,
          sessionId,
          programId: session.programId,
          date: session.date,
          status: record.status,
          notes: record.notes || '',
        }));

        const created = await api.attendanceRecords.bulkCreate(
          attendanceRecords
        );
        setAttendance([...attendance, ...created]);
        toast.success(t('attendance_saved_success'));
      } else if (recordId) {
        // Edit mode
        const record = records[0];
        const session = sessions.find((s) => s.id === sessionId);
        if (!session) {
          throw new Error('Session not found');
        }

        const updated = await api.attendanceRecords.update(recordId, {
          status: record.status,
          notes: record.notes || '',
          date: session.date,
        });

        setAttendance((prev) =>
          prev.map((r) => (r.id === recordId ? updated : r))
        );
        toast.success(t('attendance_updated_success'));
      }

      setAttendanceModalOpen(false);
      setEditingRecord(null);
    } catch (err: any) {
      toast.error(t('attendance_save_error'));
      console.error('Error saving attendance:', err);
      throw err;
    }
  };

  const handleEditAttendance = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setAttendanceModalOpen(true);
  };

  const handleDeleteAttendance = async (id: string) => {
    if (!confirm(t('confirm_delete'))) return;

    try {
      await api.attendanceRecords.remove(id);
      setAttendance((prev) => prev.filter((r) => r.id !== id));
      toast.success(t('attendance_deleted_success'));
    } catch (err: any) {
      toast.error(t('attendance_delete_error'));
      console.error('Error deleting attendance:', err);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {t('attendance_title')}
        </h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            onClick={handleTakeAttendance}
            variant="primary"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2"
          >
            <PlusCircle size={20} />
            {t('take_attendance')}
          </Button>
          <Button
            onClick={handleExportXLSX}
            variant="secondary"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2"
          >
            <FileDown size={18} />
            XLSX
          </Button>
          <Button
            onClick={handleExportPDF}
            variant="secondary"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2"
          >
            <FileDown size={18} />
            PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('filter_by_program')}
          </label>
          <div className="relative">
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('all_programs')}</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <ClipboardList
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('filter_by_date')}
          </label>
          <div className="relative">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <Calendar
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
        <Button
          onClick={() => {
            setFilterProgram('all');
            setFilterDate('');
          }}
          variant="secondary"
        >
          {t('reset_filters')}
        </Button>
      </div>

      {/* Table for large screens */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-100 text-gray-600 text-center uppercase text-sm">
            <tr>
              <th className="p-4">{t('attendance_program')}</th>
              <th className="p-4">{t('attendance_student_name')}</th>
              <th className="p-4">{t('attendance_date')}</th>
              <th className="p-4">{t('attendance_status')}</th>
              <th className="p-4">{t('attendance_notes')}</th>
              <th className="p-4">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-center">
            {filteredAttendance.map((record) => (
              <tr
                key={record.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="p-4 font-medium">
                  {getProgramName(record.programId)}
                </td>
                <td className="p-4">{getStudentName(record.studentId)}</td>
                <td className="p-4">
                  {record.date
                    ? new Date(record.date).toISOString().split('T')[0]
                    : ''}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      getAttendanceConfig(record.status).color
                    }`}
                  >
                    <span>{t(`attendanceType.${record.status}`)}</span>
                  </span>
                </td>
                <td className="p-4">{record.notes || '-'}</td>
                <td className="p-4 text-center space-x-2">
                  <button
                    onClick={() => handleEditAttendance(record)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteAttendance(record.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAttendance.length === 0 && (
          <div className="text-center p-8 text-gray-500">
            {t('no_attendance_records')}
          </div>
        )}
      </div>

      {/* Cards for small screens */}
      <div className="md:hidden space-y-4">
        {filteredAttendance.map((record) => (
          <div
            key={record.id}
            className="bg-white rounded-lg shadow p-4 border border-gray-100"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-gray-800">
                {getStudentName(record.studentId)}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  getAttendanceConfig(record.status).color
                }`}
              >
                {getAttendanceConfig(record.status).label}
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-3">
              <p>
                <strong>{t('attendance_program')}:</strong>{' '}
                {getProgramName(record.programId)}
              </p>
              <p>
                <strong>{t('attendance_date')}:</strong>{' '}
                {record.date
                  ? new Date(record.date).toISOString().split('T')[0]
                  : ''}
              </p>
              {record.notes && (
                <p>
                  <strong>{t('attendance_notes')}:</strong> {record.notes}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditAttendance(record)}
                className="flex-1 text-blue-600 hover:bg-blue-50 py-1 rounded text-sm font-medium"
              >
                {t('edit')}
              </button>
              <button
                onClick={() => handleDeleteAttendance(record.id)}
                className="flex-1 text-red-600 hover:bg-red-50 py-1 rounded text-sm font-medium"
              >
                {t('delete')}
              </button>
            </div>
          </div>
        ))}

        {filteredAttendance.length === 0 && (
          <div className="text-center p-6 text-gray-500 bg-white rounded-lg shadow">
            {t('no_attendance_records')}
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
        editingRecord={editingRecord}
      />
    </div>
  );
};

export default Attendance;
