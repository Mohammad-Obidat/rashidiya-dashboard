import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center'>
      <div className='text-center'>
        <div className='w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
        <p className='text-gray-600 text-lg'>جاري التحميل...</p>
      </div>
    </div>
  );
};

export default LoadingState;
