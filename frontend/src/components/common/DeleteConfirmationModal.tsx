import React from 'react';
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
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isDeleting && onClose()}
      title='تأكيد الحذف'
      footer={
        <>
          <Button variant='secondary' onClick={onClose} disabled={isDeleting}>
            إلغاء
          </Button>
          <Button variant='danger' onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? (
              <span className='flex items-center gap-2'>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                جاري الحذف...
              </span>
            ) : (
              'حذف'
            )}
          </Button>
        </>
      }
    >
      <p className='text-gray-700'>
        هل أنت متأكد من حذف هذا البرنامج؟ لا يمكن التراجع عن هذا الإجراء.
      </p>
    </Modal>
  );
};

export default DeleteConfirmationModal;
