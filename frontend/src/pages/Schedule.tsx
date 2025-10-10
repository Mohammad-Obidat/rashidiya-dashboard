import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../lib/apiClient';
import type { Session, Program } from '../types/program';
import Button from '../components/common/Button';
import ScheduleFormModal, {
  type ScheduleFormData,
} from '../components/modals/ScheduleFormModal';
import {
  FileDown,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  PlusCircle,
  Edit,
} from 'lucide-react';
import { exportToXLSX, exportToPDF } from '../lib/exportUtils';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useToast } from '../contexts/ToastContext';

const Schedule: React.FC = () => {
  const toast = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [sessData, progData] = await Promise.all([
          api.sessions.list(),
          api.programs.list(),
        ]);
        setSessions(sessData);
        setPrograms(progData);
      } catch (err: any) {
        setError(err.message || 'فشل في تحميل الجدول الزمني');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getProgramName = (programId: string) =>
    programs.find((p) => p.id === programId)?.name || 'غير معروف';

  const sessionsByDate = useMemo(() => {
    return sessions.reduce((acc, session) => {
      const date = new Date(session.date).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(session);
      return acc;
    }, {} as Record<string, Session[]>);
  }, [sessions]);

  const handleExportXLSX = async () => {
    try {
      await exportToXLSX('SESSIONS', {}, 'الجدول_الزمني.xlsx');
      toast.success('تم تصدير الملف بنجاح');
    } catch (err: any) {
      toast.error('فشل في تصدير الملف');
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF('SESSIONS', {}, 'الجدول_الزمني.pdf');
      toast.success('تم تصدير الملف بنجاح');
    } catch (err: any) {
      toast.error('فشل في تصدير الملف');
    }
  };

  const handleAddSchedule = () => {
    setEditingSession(null);
    setScheduleModalOpen(true);
  };

  const handleEditSchedule = (session: Session) => {
    setEditingSession(session);
    setScheduleModalOpen(true);
  };

  const handleSaveSchedule = async (formData: ScheduleFormData) => {
    try {
      if (editingSession) {
        // Update existing session
        const updated = await api.sessions.update(editingSession.id, {
          programId: formData.programId,
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          location: formData.location,
          isRecurring: formData.isRecurring,
          recurrencePattern: formData.recurrencePattern || undefined,
          notes: formData.notes || undefined,
        });
        setSessions(
          sessions.map((s) => (s.id === editingSession.id ? updated : s))
        );
        toast.success('تم تحديث الجدول الزمني بنجاح');
      } else {
        // Create new session
        const created = await api.sessions.create({
          programId: formData.programId,
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          location: formData.location,
          isRecurring: formData.isRecurring,
          recurrencePattern: formData.recurrencePattern || undefined,
          notes: formData.notes || undefined,
        });
        setSessions([...sessions, created]);
        toast.success('تم إضافة الجدول الزمني بنجاح');
      }
    } catch (err: any) {
      toast.error('فشل في حفظ الجدول الزمني');
      throw err;
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-3xl font-bold text-gray-800'>
          الجدول الزمني للبرامج
        </h2>
        <div className='flex gap-2'>
          <Button
            onClick={handleAddSchedule}
            variant='primary'
            className='flex items-center gap-2'
          >
            <PlusCircle size={20} />
            إضافة جدول جديد
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

      {/* For simplicity, a list view is implemented. A full calendar view would require a library like FullCalendar. */}
      <div className='bg-white p-6 rounded-lg shadow-sm'>
        {Object.entries(sessionsByDate).map(([date, dateSessions]) => (
          <div key={date} className='mb-8'>
            <h3 className='text-xl font-bold mb-4 border-b pb-2'>
              {new Date(date).toLocaleDateString('ar-EG', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h3>
            <div className='space-y-4'>
              {dateSessions.map((session) => (
                <div
                  key={session.id}
                  className='p-4 border rounded-lg hover:bg-gray-50 flex justify-between items-start'
                >
                  <div>
                    <h4 className='font-bold text-lg'>
                      {getProgramName(session.programId)}
                    </h4>
                    <div className='flex items-center gap-4 text-gray-600 mt-2'>
                      <div className='flex items-center gap-2'>
                        <Clock size={16} /> {session.startTime} -{' '}
                        {session.endTime}
                      </div>
                      <div className='flex items-center gap-2'>
                        <MapPin size={16} /> {session.location}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleEditSchedule(session)}
                    variant='secondary'
                    className='h-8 w-8 p-0 flex items-center justify-center'
                    title='تعديل الجدول'
                  >
                    <Edit size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ScheduleFormModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onSave={handleSaveSchedule}
        programs={programs}
        editingSession={editingSession}
      />
    </div>
  );
};

export default Schedule;
