// src/pages/Attendance.tsx
import { useEffect, useMemo, useState } from 'react';
import type { AttendanceRecord, Student } from '../lib/mockApi';
import { mockApi } from '../lib/mockApi';

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  useEffect(() => {
    mockApi.students.list().then(setStudents);
    mockApi.sessions.list().then(setSessions);
    mockApi.attendance.list().then(setRecords);
  }, []);

  const togglePresent = (studentId: string) => {
    setRecords((prev) => {
      const exists = prev.find(
        (r) =>
          r.studentId === studentId &&
          r.date === date &&
          r.sessionId === (selectedSession ?? '')
      );
      if (exists) {
        // cycle: present -> absent -> late -> remove
        const nextStatus =
          exists.status === 'present'
            ? 'absent'
            : exists.status === 'absent'
            ? 'late'
            : 'present';
        return prev.map((r) =>
          r === exists ? { ...r, status: nextStatus } : r
        );
      } else {
        const newRec: AttendanceRecord = {
          id: `a_${Date.now()}`,
          studentId,
          sessionId: selectedSession ?? '',
          date,
          status: 'present',
        };
        return [...prev, newRec];
      }
    });
  };

  const saveAll = async () => {
    await mockApi.attendance.saveMany(records);
    alert('تم حفظ الحضور (محاكاة)');
  };

  const stats = useMemo(() => {
    const totalDays = new Set(records.map((r) => r.date)).size || 1;
    const perStudent = students.map((s) => {
      const sRecs = records.filter((r) => r.studentId === s.id);
      const presentCount = sRecs.filter((r) => r.status === 'present').length;
      return {
        student: s,
        presentCount,
        percent: Math.round((presentCount / totalDays) * 100),
      };
    });
    const avg = perStudent.length
      ? Math.round(
          perStudent.reduce((a, b) => a + b.percent, 0) / perStudent.length
        )
      : 0;
    return { perStudent, avg };
  }, [records, students]);

  return (
    <div className='p-6'>
      <h2 className='text-xl font-semibold mb-4'>الحضور والغياب</h2>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='col-span-2 bg-white p-4 rounded shadow'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex gap-2'>
              <select
                value={selectedSession ?? ''}
                onChange={(e) => setSelectedSession(e.target.value || null)}
                className='p-2 border rounded'
              >
                <option value=''>-- اختر الجلسة --</option>
                {sessions.map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {s.title ?? s.date}
                  </option>
                ))}
              </select>
              <input
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className='p-2 border rounded'
              />
            </div>
            <div className='flex gap-2'>
              <button onClick={saveAll} className='px-3 py-2 border rounded'>
                حفظ الكل
              </button>
            </div>
          </div>

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
                    r.date === date &&
                    r.sessionId === (selectedSession ?? '')
                );
                return (
                  <tr key={s.id} className='border-t'>
                    <td className='p-2'>{s.fullName}</td>
                    <td className='p-2'>
                      <div className='flex gap-2 justify-end'>
                        <button
                          onClick={() => togglePresent(s.id)}
                          className='px-3 py-1 border rounded'
                        >
                          {rec ? rec.status : 'لم يسجل'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className='bg-white p-4 rounded shadow'>
          <h3 className='font-medium mb-2'>إحصائيات</h3>
          <div className='text-sm text-gray-600 mb-4'>
            معدل الحضور العام:{' '}
            <span className='font-semibold'>{stats.avg}%</span>
          </div>
          <div className='space-y-2 max-h-64 overflow-auto'>
            {stats.perStudent.map((p) => (
              <div
                key={p.student.id}
                className='flex justify-between items-center'
              >
                <div className='text-sm'>{p.student.fullName}</div>
                <div className='text-sm font-medium'>{p.percent}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
