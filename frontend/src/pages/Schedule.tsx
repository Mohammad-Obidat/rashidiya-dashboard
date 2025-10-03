// src/pages/Schedule.tsx
import { useEffect, useState } from 'react';
import { mockApi } from '../lib/mockApi';
import type { Session } from '../lib/mockApi';

export default function SchedulePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [editing, setEditing] = useState<Session | null>(null);

  useEffect(() => {
    mockApi.sessions.list().then(setSessions);
  }, []);

  const startAdd = () =>
    setEditing({
      id: '',
      title: '',
      date: new Date().toISOString().slice(0, 10),
      startTime: '16:00',
      endTime: '17:00',
      place: '',
      recurring: 'none',
    });
  const save = (s: Session) => {
    if (!s.id) s.id = `sess_${Date.now()}`;
    setSessions((prev) => prev.filter((x) => x.id !== s.id).concat(s));
    setEditing(null);
  };
  const del = (id: string) =>
    setSessions((prev) => prev.filter((s) => s.id !== id));

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-semibold'>الجدول الزمني</h2>
        <button
          onClick={startAdd}
          className='px-4 py-2 bg-indigo-600 text-white rounded'
        >
          إضافة جلسة
        </button>
      </div>

      <div className='bg-white p-4 rounded shadow overflow-auto'>
        <table className='w-full text-right'>
          <thead className='bg-gray-50 text-gray-600'>
            <tr>
              <th className='p-2'>التاريخ</th>
              <th className='p-2'>العنوان</th>
              <th className='p-2'>الوقت</th>
              <th className='p-2'>المكان</th>
              <th className='p-2'>التكرار</th>
              <th className='p-2'>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id} className='border-t'>
                <td className='p-2'>{s.date}</td>
                <td className='p-2'>{s.title}</td>
                <td className='p-2'>
                  {s.startTime} - {s.endTime}
                </td>
                <td className='p-2'>{s.place}</td>
                <td className='p-2'>{s.recurring}</td>
                <td className='p-2'>
                  <div className='flex gap-2 justify-end'>
                    <button
                      onClick={() => setEditing(s)}
                      className='px-3 py-1 border rounded'
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => del(s.id)}
                      className='px-3 py-1 border rounded'
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className='mt-4 bg-white p-4 rounded shadow max-w-2xl'>
          <h3 className='font-semibold mb-2'>
            {editing.id ? 'تعديل جلسة' : 'إضافة جلسة'}
          </h3>
          <label className='block mb-2'>
            <span className='text-sm'>العنوان</span>
            <input
              value={editing.title}
              onChange={(e) =>
                setEditing({ ...editing, title: e.target.value })
              }
              className='mt-1 w-full p-2 border rounded'
            />
          </label>
          <label className='block mb-2'>
            <span className='text-sm'>التاريخ</span>
            <input
              type='date'
              value={editing.date}
              onChange={(e) => setEditing({ ...editing, date: e.target.value })}
              className='mt-1 w-full p-2 border rounded'
            />
          </label>
          <div className='grid grid-cols-2 gap-2'>
            <label className='block'>
              <span className='text-sm'>بداية</span>
              <input
                value={editing.startTime}
                onChange={(e) =>
                  setEditing({ ...editing, startTime: e.target.value })
                }
                className='mt-1 w-full p-2 border rounded'
              />
            </label>
            <label className='block'>
              <span className='text-sm'>نهاية</span>
              <input
                value={editing.endTime}
                onChange={(e) =>
                  setEditing({ ...editing, endTime: e.target.value })
                }
                className='mt-1 w-full p-2 border rounded'
              />
            </label>
          </div>
          <label className='block mb-2'>
            <span className='text-sm'>المكان</span>
            <input
              value={editing.place}
              onChange={(e) =>
                setEditing({ ...editing, place: e.target.value })
              }
              className='mt-1 w-full p-2 border rounded'
            />
          </label>
          <label className='block mb-2'>
            <span className='text-sm'>التكرار</span>
            <select
              value={editing.recurring}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  recurring: e.target.value as Session['recurring'],
                })
              }
              className='mt-1 w-full p-2 border rounded'
            >
              <option value='none'>بدون</option>
              <option value='weekly'>أسبوعي</option>
              <option value='monthly'>شهري</option>
            </select>
          </label>
          <div className='flex gap-2 justify-end mt-3'>
            <button
              onClick={() => setEditing(null)}
              className='px-3 py-2 border rounded'
            >
              إلغاء
            </button>
            <button
              onClick={() => save(editing)}
              className='px-3 py-2 bg-indigo-600 text-white rounded'
            >
              حفظ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
