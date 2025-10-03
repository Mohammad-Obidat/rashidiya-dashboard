import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/apiClient';
import type {
  AttendanceRecordType,
  StudentType,
  SessionType,
} from '../lib/apiClient';
import { AttendanceStatus } from '../types/program';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function AttendancePage() {
  const [students, setStudents] = useState<StudentType[]>([]);
  const [sessions, setSessions] = useState<SessionType[]>([]);
  const [records, setRecords] = useState<AttendanceRecordType[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [fetchedStudents, fetchedSessions, fetchedRecords] =
        await Promise.all([
          api.students.list(),
          api.sessions.list(),
          api.attendanceRecords.list(),
        ]);
      setStudents(fetchedStudents);
      setSessions(fetchedSessions);
      setRecords(fetchedRecords);
    } catch (err) {
      console.error('Failed to fetch initial attendance data:', err);
      setError('Failed to load attendance data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const toggleAttendanceStatus = async (studentId: string) => {
    if (!selectedSessionId) {
      alert('الرجاء اختيار جلسة أولاً.');
      return;
    }

    const currentRecord = records.find(
      (r) =>
        r.studentId === studentId &&
        r.sessionId === selectedSessionId &&
        new Date(r.date).toISOString().slice(0, 10) === date
    );

    let newStatus: AttendanceStatus;
    let updatedRecord: AttendanceRecordType | undefined;

    try {
      if (currentRecord) {
        // Cycle through statuses: PRESENT -> ABSENT -> EXCUSED -> LATE -> PRESENT
        switch (currentRecord.status) {
          case AttendanceStatus.PRESENT:
            newStatus = AttendanceStatus.ABSENT;
            break;
          case AttendanceStatus.ABSENT:
            newStatus = AttendanceStatus.EXCUSED;
            break;
          case AttendanceStatus.EXCUSED:
            newStatus = AttendanceStatus.LATE;
            break;
          case AttendanceStatus.LATE:
            newStatus = AttendanceStatus.PRESENT;
            break;
          default:
            newStatus = AttendanceStatus.PRESENT;
        }
        updatedRecord = await api.attendanceRecords.update(currentRecord.id, {
          status: newStatus,
        });
      } else {
        // Create new record as PRESENT
        newStatus = AttendanceStatus.PRESENT;
        updatedRecord = await api.attendanceRecords.create({
          studentId,
          sessionId: selectedSessionId,
          programId:
            sessions.find((s) => s.id === selectedSessionId)?.programId || '', // Assuming programId can be derived from session
          date: new Date(date).toISOString(),
          status: newStatus,
        });
      }

      if (updatedRecord) {
        setRecords((prev) => {
          const existingIndex = prev.findIndex(
            (r) => r.id === updatedRecord?.id
          );
          if (existingIndex > -1) {
            const newRecords = [...prev];
            newRecords[existingIndex] = updatedRecord;
            return newRecords;
          } else {
            return [...prev, updatedRecord];
          }
        });
      }
    } catch (err) {
      console.error('Failed to update attendance record:', err);
      setError('فشل في تحديث سجل الحضور. يرجى المحاولة مرة أخرى.');
    }
  };

  const stats = useMemo(() => {
    const relevantRecords = records.filter(
      (r) =>
        new Date(r.date).toISOString().slice(0, 10) === date &&
        r.sessionId === selectedSessionId
    );
    const totalStudents = students.length;
    const presentCount = relevantRecords.filter(
      (r) => r.status === AttendanceStatus.PRESENT
    ).length;
    const absentCount = relevantRecords.filter(
      (r) => r.status === AttendanceStatus.ABSENT
    ).length;
    const excusedCount = relevantRecords.filter(
      (r) => r.status === AttendanceStatus.EXCUSED
    ).length;
    const lateCount = relevantRecords.filter(
      (r) => r.status === AttendanceStatus.LATE
    ).length;

    return {
      totalStudents,
      presentCount,
      absentCount,
      excusedCount,
      lateCount,
      notRecorded:
        totalStudents - (presentCount + absentCount + excusedCount + lateCount),
    };
  }, [records, students, selectedSessionId, date]);

  if (loading) {
    return <div className='text-center py-8'>جاري تحميل بيانات الحضور...</div>;
  }

  if (error) {
    return <div className='text-center py-8 text-red-600'>{error}</div>;
  }

  return (
    <div className='p-6'>
      <h2 className='text-xl font-semibold mb-4'>الحضور والغياب</h2>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='col-span-2 bg-white p-4 rounded shadow'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex gap-2'>
              <select
                value={selectedSessionId ?? ''}
                onChange={(e) => setSelectedSessionId(e.target.value || null)}
                className='p-2 border rounded'
              >
                <option value=''>-- اختر الجلسة --</option>
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.location} -{' '}
                    {new Date(s.date).toLocaleDateString('ar-SA')}
                  </option>
                ))}
              </select>
              <Input
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                label='التاريخ'
              />
            </div>
          </div>

          {selectedSessionId && (
            <table className='w-full text-right'>
              <thead className='bg-gray-50 text-sm text-gray-600'>
                <tr>
                  <th className='p-2'>الطالب</th>
                  <th className='p-2'>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const rec = records.find(
                    (r) =>
                      r.studentId === s.id &&
                      r.sessionId === selectedSessionId &&
                      new Date(r.date).toISOString().slice(0, 10) === date
                  );
                  return (
                    <tr key={s.id} className='border-t'>
                      <td className='p-2'>{s.name}</td>
                      <td className='p-2'>
                        <div className='flex gap-2 justify-end'>
                          <Button
                            onClick={() => toggleAttendanceStatus(s.id)}
                            variant={
                              rec?.status === AttendanceStatus.PRESENT
                                ? 'success'
                                : rec?.status === AttendanceStatus.ABSENT
                                ? 'danger'
                                : rec?.status === AttendanceStatus.EXCUSED
                                ? 'warning'
                                : rec?.status === AttendanceStatus.LATE
                                ? 'info'
                                : 'secondary'
                            }
                          >
                            {rec ? rec.status : 'لم يسجل'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {!selectedSessionId && (
            <div className='text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300'>
              <p className='text-gray-600 mb-4'>
                الرجاء اختيار جلسة لعرض أو تسجيل الحضور.
              </p>
            </div>
          )}
        </div>

        <div className='bg-white p-4 rounded shadow'>
          <h3 className='font-medium mb-2'>إحصائيات الجلسة المحددة</h3>
          <div className='space-y-2 text-sm text-gray-600'>
            <p>
              إجمالي الطلاب:{' '}
              <span className='font-semibold'>{stats.totalStudents}</span>
            </p>
            <p>
              حاضر:{' '}
              <span className='font-semibold text-green-600'>
                {stats.presentCount}
              </span>
            </p>
            <p>
              غائب:{' '}
              <span className='font-semibold text-red-600'>
                {stats.absentCount}
              </span>
            </p>
            <p>
              غياب بعذر:{' '}
              <span className='font-semibold text-yellow-600'>
                {stats.excusedCount}
              </span>
            </p>
            <p>
              متأخر:{' '}
              <span className='font-semibold text-blue-600'>
                {stats.lateCount}
              </span>
            </p>
            <p>
              لم يسجل:{' '}
              <span className='font-semibold text-gray-600'>
                {stats.notRecorded}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
