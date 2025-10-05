import React from 'react';
import Button from './common/Button';

interface ErrorStateProps {
  error: string;
}

const onRetry = () => window.location.reload();

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center'>
      <div className='bg-white rounded-xl shadow-lg p-8 max-w-md'>
        <div className='text-center'>
          <div className='text-red-500 text-5xl mb-4'>⚠️</div>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>حدث خطأ</h2>
          <p className='text-gray-600 mb-4'>{error}</p>
          <Button onClick={onRetry} variant='primary'>
            إعادة المحاولة
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
