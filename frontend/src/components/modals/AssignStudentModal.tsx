import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../common/Modal';
import Button from '../common/Button';
import type { Program } from '../../types/program';

interface AssignStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (programId: string) => Promise<void>;
  programs: Program[];
}

const AssignStudentModal: React.FC<AssignStudentModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  programs,
}) => {
  const { t } = useTranslation();
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
      console.error(error);
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
      title={t('assign_student_to_program_title')}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isAssigning}
          >
            {t('form_cancel')}
          </Button>
          <Button
            variant="primary"
            onClick={handleAssign}
            disabled={isAssigning || !selectedProgram}
          >
            {isAssigning ? t('assigning') : t('assign_button')}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('select_program')}
          </label>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t('select_program_option')}</option>
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

export default AssignStudentModal;
