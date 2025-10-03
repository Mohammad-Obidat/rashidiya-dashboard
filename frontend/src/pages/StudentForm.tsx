// src/pages/StudentForm.tsx
import { useEffect, useState } from 'react';
import { mockApi } from '../lib/mockApi';
import type { Student } from '../lib/mockApi';
import { useNavigate, useParams } from 'react-router-dom';

export default function StudentForm({
  mode = 'new',
}: {
  mode?: 'new' | 'edit';
}) {
  const { id } = useParams();
  const [student, setStudent] = useState<Student>({
    id: '',
    fullName: '',
    grade: '',
    section: '',
    studentNumber: '',
    birthDate: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (mode === 'edit' && id)
      mockApi.students.list().then((list) => {
        const s = list.find((x) => x.id === id);
        if (s) setStudent(s);
      });
  }, [mode, id]);

  const save = async () => {
    alert('تم الحفظ (محاكاة)');
    navigate('/students');
  };

  return (
    <div className='p-6 max-w-2xl'>
      <h2 className='text-xl font-semibold mb-4'>
        {mode === 'new' ? 'إضافة طالب' : 'تعديل طالب'}
      </h2>
      <div className='bg-white p-6 rounded shadow'>
        <label className='block mb-3'>
          <span className='text-sm'>الاسم الكامل</span>
          <input
            value={student.fullName}
            onChange={(e) =>
              setStudent({ ...student, fullName: e.target.value })
            }
            className='mt-1 w-full p-2 border rounded'
          />
        </label>
        <label className='block mb-3'>
          <span className='text-sm'>الصف والشعبة</span>
          <input
            value={`${student.grade}${
              student.section ? ' - ' + student.section : ''
            }`}
            onChange={(e) => {
              const parts = e.target.value.split('-').map((p) => p.trim());
              setStudent({
                ...student,
                grade: parts[0] || '',
                section: parts[1] || '',
              });
            }}
            className='mt-1 w-full p-2 border rounded'
          />
        </label>
        <label className='block mb-3'>
          <span className='text-sm'>رقم الطالب</span>
          <input
            value={student.studentNumber}
            onChange={(e) =>
              setStudent({ ...student, studentNumber: e.target.value })
            }
            className='mt-1 w-full p-2 border rounded'
          />
        </label>
        <label className='block mb-3'>
          <span className='text-sm'>تاريخ الميلاد</span>
          <input
            type='date'
            value={student.birthDate}
            onChange={(e) =>
              setStudent({ ...student, birthDate: e.target.value })
            }
            className='mt-1 w-full p-2 border rounded'
          />
        </label>
        <div className='flex gap-2 mt-4 justify-end'>
          <button
            onClick={() => navigate('/students')}
            className='px-4 py-2 rounded border'
          >
            إلغاء
          </button>
          <button
            onClick={save}
            className='px-4 py-2 rounded bg-indigo-600 text-white'
          >
            حفظ
          </button>
        </div>
      </div>
    </div>
  );
}
