import React from 'react';
import Spinner from './common/Spinner';

const LoadingState: React.FC = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center'>
      <div className='text-center'>
        <Spinner size='lg' className='mx-auto mb-4' />
        <p className='text-gray-600 text-lg'>جاري التحميل...</p>
      </div>
    </div>
  );
};

export default LoadingState;
