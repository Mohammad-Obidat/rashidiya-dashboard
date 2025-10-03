import { useEffect, useState } from 'react';
import { api } from '../lib/apiClient';
import type { SessionType, RecurrencePatternType } from '../lib/apiClient';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function SchedulePage() {
  const [sessions, setSessions] = useState<SessionType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSession, setEditingSession] = useState<SessionType | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const fetchedSessions = await api.sessions.list();
      setSessions(fetchedSessions);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
      setError('Failed to load sessions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const startAdd = () => {
    setEditingSession({
      id: '',
      programId: '', // This needs to be selected or passed somehow, for now, empty.
      date: new Date(),
      startTime: '16:00',
      endTime: '17:00',
      location: '',
      isRecurring: false,
      recurrencePattern: undefined,
      notes: '',
      createdAt: new Date(), // Dummy value, will be set by backend
      updatedAt: new Date(), // Dummy value, will be set by backend
    });
    setIsModalOpen(true);
  };

  const startEdit = (session: SessionType) => {
    setEditingSession(session);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingSession) return;

    try {
      if (editingSession.id) {
        // Update existing session
        await api.sessions.update(editingSession.id, {
          programId: editingSession.programId,
          date: editingSession.date.toISOString(),
          startTime: editingSession.startTime,
          endTime: editingSession.endTime,
          location: editingSession.location,
          isRecurring: editingSession.isRecurring,
          recurrencePattern: editingSession.recurrencePattern,
          notes: editingSession.notes,
        });
      } else {
        // Create new session
        await api.sessions.create({
          programId: editingSession.programId,
          date: editingSession.date.toISOString(),
          startTime: editingSession.startTime,
          endTime: editingSession.endTime,
          location: editingSession.location,
          isRecurring: editingSession.isRecurring,
          recurrencePattern: editingSession.recurrencePattern,
          notes: editingSession.notes,
        });
      }
      setIsModalOpen(false);
      setEditingSession(null);
      fetchSessions(); // Refresh the list
    } catch (err) {
      console.error('Failed to save session:', err);
      setError('فشل في حفظ الجلسة. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleDeleteClick = (id: string) => {
    setSessionToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!sessionToDelete) return;

    try {
      await api.sessions.remove(sessionToDelete);
      setDeleteModalOpen(false);
      setSessionToDelete(null);
      fetchSessions(); // Refresh the list
    } catch (err) {
      console.error('Failed to delete session:', err);
      setError('فشل في حذف الجلسة. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSession(null);
  };

  if (loading) {
    return <div className='text-center py-8'>جاري تحميل الجدول الزمني...</div>;
  }

  if (error) {
    return <div className='text-center py-8 text-red-600'>{error}</div>;
  }

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-semibold'>الجدول الزمني</h2>
        <Button
          onClick={startAdd}
          className='px-4 py-2 bg-indigo-600 text-white rounded'
        >
          إضافة جلسة
        </Button>
      </div>

      <div className='bg-white p-4 rounded shadow overflow-auto'>
        <table className='w-full text-right'>
          <thead className='bg-gray-50 text-gray-600'>
            <tr>
              <th className='p-2'>التاريخ</th>
              <th className='p-2'>البرنامج</th>
              <th className='p-2'>الوقت</th>
              <th className='p-2'>المكان</th>
              <th className='p-2'>التكرار</th>
              <th className='p-2'>ملاحظات</th>
              <th className='p-2'>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id} className='border-t'>
                <td className='p-2'>
                  {new Date(s.date).toLocaleDateString('ar-SA')}
                </td>
                <td className='p-2'>{s.programId}</td>{' '}
                {/* TODO: Display program name */}
                <td className='p-2'>
                  {s.startTime} - {s.endTime}
                </td>
                <td className='p-2'>{s.location}</td>
                <td className='p-2'>
                  {s.isRecurring
                    ? s.recurrencePattern || 'غير محدد'
                    : 'لا يوجد'}
                </td>
                <td className='p-2'>{s.notes || '-'}</td>
                <td className='p-2'>
                  <div className='flex gap-2 justify-end'>
                    <Button
                      onClick={() => startEdit(s)}
                      className='px-3 py-1 border rounded'
                    >
                      <Edit2 className='w-4 h-4' />
                    </Button>
                    <Button
                      onClick={() => handleDeleteClick(s.id)}
                      className='px-3 py-1 border rounded'
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && editingSession && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={editingSession.id ? 'تعديل جلسة' : 'إضافة جلسة'}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className='space-y-4'
          >
            {/* Program ID - For now, a simple input. Should be a dropdown of existing programs. */}
            <Input
              label='معرف البرنامج (Program ID)'
              value={editingSession.programId}
              onChange={(e) =>
                setEditingSession({
                  ...editingSession,
                  programId: e.target.value,
                })
              }
              placeholder='معرف البرنامج'
              required
            />
            <Input
              label='التاريخ'
              type='date'
              value={
                editingSession.date instanceof Date
                  ? editingSession.date.toISOString().slice(0, 10)
                  : new Date(editingSession.date).toISOString().slice(0, 10)
              }
              onChange={(e) =>
                setEditingSession({
                  ...editingSession,
                  date: new Date(e.target.value),
                })
              }
              required
            />
            <div className='grid grid-cols-2 gap-4'>
              <Input
                label='وقت البدء'
                type='time'
                value={editingSession.startTime}
                onChange={(e) =>
                  setEditingSession({
                    ...editingSession,
                    startTime: e.target.value,
                  })
                }
                required
              />
              <Input
                label='وقت الانتهاء'
                type='time'
                value={editingSession.endTime}
                onChange={(e) =>
                  setEditingSession({
                    ...editingSession,
                    endTime: e.target.value,
                  })
                }
                required
              />
            </div>
            <Input
              label='المكان'
              value={editingSession.location}
              onChange={(e) =>
                setEditingSession({
                  ...editingSession,
                  location: e.target.value,
                })
              }
              placeholder='المكان'
              required
            />
            <label className='block'>
              <span className='text-sm font-medium text-gray-700'>متكررة؟</span>
              <input
                type='checkbox'
                checked={editingSession.isRecurring}
                onChange={(e) =>
                  setEditingSession({
                    ...editingSession,
                    isRecurring: e.target.checked,
                  })
                }
                className='ml-2'
              />
            </label>
            {editingSession.isRecurring && (
              <label className='block'>
                <span className='text-sm font-medium text-gray-700'>
                  نمط التكرار
                </span>
                <select
                  value={editingSession.recurrencePattern || ''}
                  onChange={(e) =>
                    setEditingSession({
                      ...editingSession,
                      recurrencePattern: e.target
                        .value as RecurrencePatternType,
                    })
                  }
                  className='mt-1 w-full p-2 border rounded'
                >
                  <option value=''>اختر</option>
                  <option value='DAILY'>يومي</option>
                  <option value='WEEKLY'>أسبوعي</option>
                  <option value='MONTHLY'>شهري</option>
                </select>
              </label>
            )}
            <Input
              label='ملاحظات'
              value={editingSession.notes || ''}
              onChange={(e) =>
                setEditingSession({ ...editingSession, notes: e.target.value })
              }
              placeholder='ملاحظات إضافية'
            />
            <div className='flex justify-end gap-3 mt-4'>
              <Button
                type='button'
                variant='secondary'
                onClick={handleModalClose}
              >
                إلغاء
              </Button>
              <Button type='submit' variant='primary'>
                حفظ
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title='تأكيد الحذف'
      >
        <p className='text-gray-700 mb-4'>
          هل أنت متأكد أنك تريد حذف هذه الجلسة؟ لا يمكن التراجع عن هذا الإجراء.
        </p>
        <div className='flex justify-end gap-3'>
          <Button variant='secondary' onClick={() => setDeleteModalOpen(false)}>
            إلغاء
          </Button>
          <Button variant='danger' onClick={handleDeleteConfirm}>
            حذف
          </Button>
        </div>
      </Modal>
    </div>
  );
}
