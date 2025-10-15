import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import type { Program, Session, RecurrencePattern } from '../../types/program';

interface ScheduleFormData {
  programId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  isRecurring: boolean;
  recurrencePattern: RecurrencePattern | '';
  notes: string;
}

interface ScheduleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: ScheduleFormData) => Promise<void>;
  programs: Program[];
  editingSession?: Session | null;
}

const ScheduleFormModal: React.FC<ScheduleFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  programs,
  editingSession,
}) => {
  const [formData, setFormData] = useState<ScheduleFormData>({
    programId: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    isRecurring: false,
    recurrencePattern: '',
    notes: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (editingSession) {
        setFormData({
          programId: editingSession.programId,
          date: new Date(editingSession.date).toISOString().split('T')[0],
          startTime: editingSession.startTime,
          endTime: editingSession.endTime,
          location: editingSession.location,
          isRecurring: editingSession.isRecurring,
          recurrencePattern: editingSession.recurrencePattern || '',
          notes: editingSession.notes || '',
        });
      } else {
        setFormData({
          programId: '',
          date: '',
          startTime: '',
          endTime: '',
          location: '',
          isRecurring: false,
          recurrencePattern: '',
          notes: '',
        });
      }
      setValidationError('');
    }
  }, [isOpen, editingSession]);

  const handleSave = async () => {
    // Validation
    if (
      !formData.programId ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.location
    ) {
      setValidationError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSaving(true);
    setValidationError('');
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      // Error handling is done in parent component
      console.error(error)
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setFormData({
      programId: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      isRecurring: false,
      recurrencePattern: '',
      notes: '',
    });
    setValidationError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingSession ? 'تعديل الجدول الزمني' : 'إضافة جدول زمني جديد'}
      footer={
        <>
          <Button variant='secondary' onClick={handleClose} disabled={isSaving}>
            إلغاء
          </Button>
          <Button variant='primary' onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'جاري الحفظ...' : 'حفظ'}
          </Button>
        </>
      }
    >
      <div className='space-y-4'>
        {validationError && (
          <div className='p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm'>
            {validationError}
          </div>
        )}

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            البرنامج *
          </label>
          <select
            value={formData.programId}
            onChange={(e) =>
              setFormData({ ...formData, programId: e.target.value })
            }
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value=''>-- اختر برنامج --</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            التاريخ *
          </label>
          <input
            type='date'
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              وقت البدء *
            </label>
            <input
              type='time'
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              وقت الانتهاء *
            </label>
            <input
              type='time'
              value={formData.endTime}
              onChange={(e) =>
                setFormData({ ...formData, endTime: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            الموقع *
          </label>
          <input
            type='text'
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='أدخل الموقع'
          />
        </div>

        <div>
          <label className='flex items-center gap-2'>
            <input
              type='checkbox'
              checked={formData.isRecurring}
              onChange={(e) =>
                setFormData({ ...formData, isRecurring: e.target.checked })
              }
              className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
            />
            <span className='text-sm font-medium text-gray-700'>
              جدول متكرر
            </span>
          </label>
        </div>

        {formData.isRecurring && (
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              نمط التكرار
            </label>
            <select
              value={formData.recurrencePattern}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  recurrencePattern: e.target.value as RecurrencePattern,
                })
              }
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>-- اختر نمط التكرار --</option>
              <option value='DAILY'>يومي</option>
              <option value='WEEKLY'>أسبوعي</option>
              <option value='MONTHLY'>شهري</option>
            </select>
          </div>
        )}

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            ملاحظات
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            rows={3}
            placeholder='أدخل ملاحظات إضافية'
          />
        </div>
      </div>
    </Modal>
  );
};

export default ScheduleFormModal;
export type { ScheduleFormData };
