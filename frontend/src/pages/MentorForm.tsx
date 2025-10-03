// src/pages/MentorForm.tsx
import { useEffect, useState } from 'react';
import { mockApi } from '../lib/mockApi';
import type { Mentor } from '../lib/mockApi';

import { useNavigate, useParams } from 'react-router-dom';

export default function MentorForm({
  mode = 'new',
}: {
  mode?: 'new' | 'edit';
}) {
  const { id } = useParams();
  const [mentor, setMentor] = useState<Mentor>({
    id: '',
    name: '',
    phone: '',
    email: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (mode === 'edit' && id) {
      mockApi.mentors.list().then((list) => {
        const found = list.find((x) => x.id === id);
        if (found) setMentor(found);
      });
    }
  }, [mode, id]);

  const save = async () => {
    // هنا فقط محاكاة: يمكنك استبدالها بنداء API حقيقي لاحقاً
    alert('تم حفظ (محاكاة)');
    navigate('/mentors');
  };

  return (
    <div className='p-6 max-w-2xl'>
      <h2 className='text-xl font-semibold mb-4'>
        {mode === 'new' ? 'إضافة مرشد' : 'تعديل مرشد'}
      </h2>
      <div className='bg-white p-6 rounded shadow'>
        <label className='block mb-3'>
          <span className='text-sm'>اسم المرشد</span>
          <input
            value={mentor.name}
            onChange={(e) => setMentor({ ...mentor, name: e.target.value })}
            className='mt-1 w-full p-2 border rounded'
          />
        </label>
        <label className='block mb-3'>
          <span className='text-sm'>الهاتف</span>
          <input
            value={mentor.phone}
            onChange={(e) => setMentor({ ...mentor, phone: e.target.value })}
            className='mt-1 w-full p-2 border rounded'
          />
        </label>
        <label className='block mb-3'>
          <span className='text-sm'>البريد الإلكتروني</span>
          <input
            value={mentor.email}
            onChange={(e) => setMentor({ ...mentor, email: e.target.value })}
            className='mt-1 w-full p-2 border rounded'
          />
        </label>
        <div className='flex gap-2 mt-4 justify-end'>
          <button
            className='px-4 py-2 rounded border'
            onClick={() => navigate('/mentors')}
          >
            إلغاء
          </button>
          <button
            className='px-4 py-2 rounded bg-indigo-600 text-white'
            onClick={save}
          >
            حفظ
          </button>
        </div>
      </div>
    </div>
  );
}
