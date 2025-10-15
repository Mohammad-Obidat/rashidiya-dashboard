import React, { useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import Button from '../../components/common/Button';

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => Promise<void>;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSubmit({ email, password });
    setIsLoading(false);
  };

  return (
    <div className='bg-white rounded-2xl shadow-xl p-4 border border-gray-100'>
      <div className='mb-4'>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>تسجيل الدخول</h2>
        <p className='text-gray-600 text-sm'>
          أدخل بياناتك للوصول إلى لوحة التحكم
        </p>
      </div>

      {error && (
        <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3'>
          <div className='flex-shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center'>
            <span className='text-red-600 text-xs'>!</span>
          </div>
          <p className='text-red-700 text-sm'>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-5'>
        {/* Email */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            البريد الإلكتروني
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
              <Mail className='h-5 w-5 text-gray-400' />
            </div>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
              placeholder='example@school.edu.sa'
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            كلمة المرور
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
              <Lock className='h-5 w-5 text-gray-400' />
            </div>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
              placeholder='••••••••'
              required
              minLength={6}
            />
          </div>
        </div>

        {/* Remember & Forgot */}
        <div className='flex items-center justify-between'>
          <label className='flex items-center'>
            <input
              type='checkbox'
              className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
            />
            <span className='mr-2 text-sm text-gray-600'>تذكرني</span>
          </label>
          <a
            href='#'
            className='text-sm text-blue-600 hover:text-blue-700 font-medium'
          >
            نسيت كلمة المرور؟
          </a>
        </div>

        {/* Submit Button */}
        <Button
          type='submit'
          variant='primary'
          disabled={isLoading}
          className='w-full py-3 text-base font-semibold'
        >
          {isLoading ? (
            <div className='flex items-center justify-center gap-2'>
              <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
              <span>جاري المعالجة...</span>
            </div>
          ) : (
            <div className='flex items-center justify-center gap-2'>
              <LogIn className='w-5 h-5 cursor-pointer' />
              <span>تسجيل الدخول</span>
            </div>
          )}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
