import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import type { Program } from '../../types/program';

interface AssignAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (programId: string) => Promise<void>;
  programs: Program[];
}

const AssignAdvisorModal: React.FC<AssignAdvisorModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  programs,
}) => {
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssign = async () => {
    if (!selectedProgram) return;

    setIsAssigning(true);
    try {
      await onAssign(selectedProgram);
      setSelectedProgram('');
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsAssigning(false);
    }
  };

  const handleClose = () => {
    setSelectedProgram('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title='تعيين مشرف إلى برنامج'
      footer={
        <>
          <Button
            variant='secondary'
            onClick={handleClose}
            disabled={isAssigning}
          >
            إلغاء
          </Button>
          <Button
            variant='primary'
            onClick={handleAssign}
            disabled={isAssigning || !selectedProgram}
          >
            {isAssigning ? 'جاري التعيين...' : 'تعيين'}
          </Button>
        </>
      }
    >
      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            اختر البرنامج
          </label>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
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
      </div>
    </Modal>
  );
};

export default AssignAdvisorModal;
