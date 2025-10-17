import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/apiClient';
import type { Session, Program } from '../types/program';
import Button from '../components/common/Button';
import ScheduleFormModal, {
  type ScheduleFormData,
} from '../components/modals/ScheduleFormModal';
import { FileDown, Clock, MapPin, PlusCircle, Edit } from 'lucide-react';
import { exportToXLSX, exportToPDF } from '../lib/exportUtils';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useToast } from '../contexts/ToastContext';

const Schedule: React.FC = () => {
  const { t, i18n } = useTranslation();
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
        setError(err.message || t('dashboard_error'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t]);

  const getProgramName = (programId: string) =>
    programs.find((p) => p.id === programId)?.name || t('not_assigned');

  const sessionsByDate = useMemo(() => {
    return sessions.reduce((acc, session) => {
      const date = new Date(session.date).toDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(session);
      return acc;
    }, {} as Record<string, Session[]>);
  }, [sessions]);

  const handleExportXLSX = async () => {
    try {
      await exportToXLSX('SESSIONS', {}, t('export_schedules_xlsx'));
      toast.success(t('export_success'));
    } catch {
      toast.error(t('export_failed'));
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF('SESSIONS', {}, t('export_schedules_pdf'));
      toast.success(t('export_success'));
    } catch {
      toast.error(t('export_failed'));
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
        toast.success(t('schedule_updated_success'));
      } else {
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
        toast.success(t('schedule_added_success'));
      }
    } catch {
      toast.error(t('schedule_save_failed'));
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {t('schedule_title')}
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            onClick={handleAddSchedule}
            variant="primary"
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <PlusCircle size={20} />
            {t('add_new_schedule')}
          </Button>
          <Button
            onClick={handleExportXLSX}
            variant="secondary"
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <FileDown size={18} />
            {t('export_report_xlsx')}
          </Button>
          <Button
            onClick={handleExportPDF}
            variant="secondary"
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <FileDown size={18} />
            {t('export_report_pdf')}
          </Button>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        {Object.entries(sessionsByDate).length > 0 ? (
          Object.entries(sessionsByDate).map(([date, dateSessions]) => (
            <div key={date} className="mb-8">
              <h3 className="text-lg sm:text-xl font-bold mb-4 border-b pb-2 text-gray-800">
                {new Date(date).toLocaleDateString(
                  i18n.language === 'ar'
                    ? 'ar-EG'
                    : i18n.language === 'he'
                    ? 'he-IL'
                    : 'en-US',
                  {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                )}
              </h3>

              <div className="space-y-4">
                {dateSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col-2 sm:flex-row justify-between sm:items-start gap-3 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-l">
                        <h4 className="font-bold text-base sm:text-lg text-gray-800 break-words">
                          {getProgramName(session.programId)}
                        </h4>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-gray-600 mt-2 text-sm sm:text-base">
                          <div className="flex items-center gap-2">
                            <Clock size={16} /> {session.startTime} -{' '}
                            {session.endTime}
                          </div>
                          <div className="flex items-center gap-2 mt-1 sm:mt-0">
                            <MapPin size={16} /> {session.location}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleEditSchedule(session)}
                      variant="secondary"
                      className="h-9 w-9 flex items-center justify-center"
                    >
                      <Edit size={20} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-8 text-gray-500">
            {t('no_attendance_records')}
          </div>
        )}
      </div>

      {/* Modal */}
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
