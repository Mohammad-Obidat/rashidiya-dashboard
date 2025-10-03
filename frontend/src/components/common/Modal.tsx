import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200'>
      {/* Overlay with backdrop blur */}
      <div
        className='fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity'
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className='relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200'>
        {/* Header with gradient */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'>
          <h3 className='text-2xl font-bold text-gray-900'>{title}</h3>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white/50 rounded-lg'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* Body with custom scrollbar */}
        <div className='p-6 overflow-y-auto max-h-[calc(90vh-180px)] custom-scrollbar'>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className='flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50'>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
