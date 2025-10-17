import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../common/Modal';
import Button from '../common/Button';
import type {
  Program,
  Session,
  Student,
  AttendanceStatus,
} from '../../types/program';

interface AttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
  notes: string;
}

interface AttendanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sessionId: string, records: AttendanceRecord[]) => Promise<void>;
  programs: Program[];
  sessions: Session[];
  students: Student[];
  onLoadStudents: (programId: string) => Promise<string[]>;
}

const AttendanceFormModal: React.FC<AttendanceFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  programs,
  sessions,
  students,
  onLoadStudents,
}) => {
  const { t, i18n } = useTranslation();
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setSelectedProgram('');
      setSelectedSession('');
      setAttendanceRecords([]);
      setValidationError('');
    }
  }, [isOpen]);

  const handleProgramChange = async (programId: string) => {
    setSelectedProgram(programId);
    setSelectedSession('');
    setAttendanceRecords([]);
    setValidationError('');
  };

  const handleSessionChange = async (sessionId: string) => {
    setSelectedSession(sessionId);
    setValidationError('');

    if (!sessionId) {
      setAttendanceRecords([]);
      return;
    }

    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;

    try {
      const studentIds = await onLoadStudents(session.programId);
      const programStudents = students.filter((s) => studentIds.includes(s.id));

      setAttendanceRecords(
        programStudents.map((student) => ({
          studentId: student.id,
          status: 'PRESENT' as AttendanceStatus,
          notes: '',
        }))
      );
    } catch (error) {
      setValidationError(t('load_students_failed'));
      console.error(error);
    }
  };

  const handleAttendanceChange = (
    studentId: string,
    field: 'status' | 'notes',
    value: string
  ) => {
    setAttendanceRecords(
      attendanceRecords.map((record) =>
        record.studentId === studentId ? { ...record, [field]: value } : record
      )
    );
  };

  const handleSave = async () => {
    if (!selectedSession || attendanceRecords.length === 0) {
      setValidationError(t('attendance_validation_error'));
      return;
    }

    setIsSaving(true);
    setValidationError('');
    try {
      await onSave(selectedSession, attendanceRecords);
      onClose();
    } catch (error) {
      // Error handling is done in parent component
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setSelectedProgram('');
    setSelectedSession('');
    setAttendanceRecords([]);
    setValidationError('');
    onClose();
  };

  const getStudentName = (studentId: string) => {
    return students.find((s) => s.id === studentId)?.name || t('not_assigned');
  };

  const filteredSessions = sessions.filter(
    (s) => s.programId === selectedProgram
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('record_attendance_title')}
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={isSaving}>
            {t('form_cancel')}
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving || attendanceRecords.length === 0}
          >
            {isSaving ? t('form_saving') : t('save')}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {validationError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {validationError}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('program_required')}
          </label>
          <select
            value={selectedProgram}
            onChange={(e) => handleProgramChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t('select_program_option')}</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
        </div>

        {selectedProgram && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('session_required')}
            </label>
            <select
              value={selectedSession}
              onChange={(e) => handleSessionChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t('select_session_option')}</option>
              {filteredSessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {new Date(session.date).toLocaleDateString(
                    i18n.language === 'ar'
                      ? 'ar-EG'
                      : i18n.language === 'he'
                      ? 'he-IL'
                      : 'en-US'
                  )}{' '}
                  - {session.startTime} {t('to')} {session.endTime}
                </option>
              ))}
            </select>
          </div>
        )}

        {attendanceRecords.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('students_list')}
            </label>
            <div className="max-h-96 overflow-y-auto border border-gray-300 rounded-md">
              <table className="w-full">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="p-2 text-right text-sm">
                      {t('student_name')}
                    </th>
                    <th className="p-2 text-right text-sm">
                      {t('attendance_status')}
                    </th>
                    <th className="p-2 text-right text-sm">
                      {t('attendance_notes')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record) => (
                    <tr key={record.studentId} className="border-b">
                      <td className="p-2 text-sm">
                        {getStudentName(record.studentId)}
                      </td>
                      <td className="p-2">
                        <select
                          value={record.status}
                          onChange={(e) =>
                            handleAttendanceChange(
                              record.studentId,
                              'status',
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="PRESENT">
                            {t('attendance_present')}
                          </option>
                          <option value="ABSENT">
                            {t('attendance_absent')}
                          </option>
                          <option value="EXCUSED">
                            {t('attendance_excused')}
                          </option>
                          <option value="LATE">{t('attendance_late')}</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={record.notes}
                          onChange={(e) =>
                            handleAttendanceChange(
                              record.studentId,
                              'notes',
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder={t('notes_placeholder')}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AttendanceFormModal;
