// src/pages/Students.tsx
import { useEffect, useState } from 'react';
import { mockApi } from '../lib/mockApi';
import type { Student } from '../lib/mockApi';
import { useNavigate } from 'react-router-dom';

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    mockApi.students.list().then(setStudents);
  }, []);

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-semibold'>قائمة الطلاب</h2>
        <button
          onClick={() => navigate('/students/new')}
          className='px-4 py-2 bg-indigo-600 text-white rounded'
        >
          إضافة طالب
        </button>
      </div>

      <div className='bg-white rounded shadow overflow-hidden'>
        <table className='w-full text-right'>
          <thead className='bg-gray-50 text-gray-600 text-sm'>
            <tr>
              <th className='p-2'>الاسم</th>
              <th className='p-2'>الصف/الشعبة</th>
              <th className='p-2'>الرقم</th>
              <th className='p-2'>تاريخ الميلاد</th>
              <th className='p-2'>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className='border-t'>
                <td className='p-2'>{s.fullName}</td>
                <td className='p-2'>
                  {s.grade} {s.section}
                </td>
                <td className='p-2'>{s.studentNumber}</td>
                <td className='p-2'>{s.birthDate}</td>
                <td className='p-2'>
                  <div className='flex gap-2 justify-end'>
                    <button
                      onClick={() => navigate(`/students/${s.id}/edit`)}
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
