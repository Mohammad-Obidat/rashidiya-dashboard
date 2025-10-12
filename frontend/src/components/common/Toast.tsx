import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast, type Toast as ToastType } from '../../contexts/ToastContext';

interface ToastItemProps {
  toast: ToastType;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast }) => {
  const { removeToast } = useToast();

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className='w-5 h-5' />;
      case 'error':
        return <XCircle className='w-5 h-5' />;
      case 'warning':
        return <AlertTriangle className='w-5 h-5' />;
      case 'info':
        return <Info className='w-5 h-5' />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-500 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-500 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-500 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-500 text-blue-800';
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border-r-4 shadow-lg mb-3 animate-slide-in ${getStyles()}`}
      style={{
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <div className='flex-shrink-0 mt-0.5'>{getIcon()}</div>
      <div className='flex-1 text-sm font-medium'>{toast.message}</div>
      <button
        onClick={() => removeToast(toast.id)}
        className='flex-shrink-0 hover:opacity-70 transition-opacity'
        aria-label='إغلاق'
      >
        <X className='w-4 h-4' />
      </button>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className='fixed top-4 left-4 z-50 w-full max-w-md pointer-events-none'>
      <div className='pointer-events-auto'>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
