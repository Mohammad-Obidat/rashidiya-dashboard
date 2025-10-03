// src/pages/Mentors.tsx
import { useEffect, useState } from 'react';
import { mockApi } from '../lib/mockApi';
import type { Mentor } from '../lib/mockApi';
import { useNavigate } from 'react-router-dom';

export default function Mentors() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    mockApi.mentors.list().then(setMentors);
  }, []);

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-semibold'>المرشدون</h2>
        <button
          onClick={() => navigate('/mentors/new')}
          className='px-4 py-2 bg-indigo-600 text-white rounded'
        >
          إضافة مرشد
        </button>
      </div>

      <div className='bg-white rounded shadow overflow-hidden'>
        <table className='w-full text-right'>
          <thead className='bg-gray-50 text-sm text-gray-600'>
            <tr>
              <th className='p-3'>الاسم</th>
              <th className='p-3'>الهاتف</th>
              <th className='p-3'>البريد</th>
              <th className='p-3'>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {mentors.map((m) => (
              <tr key={m.id} className='border-t'>
                <td className='p-3'>{m.name}</td>
                <td className='p-3'>{m.phone}</td>
                <td className='p-3'>{m.email}</td>
                <td className='p-3'>
                  <div className='flex gap-2 justify-end'>
                    <button
                      onClick={() => navigate(`/mentors/${m.id}`)}
                      className='px-3 py-1 border rounded'
                    >
                      عرض
                    </button>
                    <button
                      onClick={() => navigate(`/mentors/${m.id}/edit`)}
                      className='px-3 py-1 border rounded'
                    >
                      تعديل
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
