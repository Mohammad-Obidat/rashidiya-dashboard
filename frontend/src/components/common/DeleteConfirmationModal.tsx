import React from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import Button from './Button';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isDeleting && onClose()}
      title={t('delete_confirmation_title')}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
            {t('form_cancel')}
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {t('deleting')}
              </span>
            ) : (
              t('delete_button')
            )}
          </Button>
        </>
      }
    >
      <p className="text-gray-700">{t('delete_confirmation_message')}</p>
    </Modal>
  );
};

export default DeleteConfirmationModal;
