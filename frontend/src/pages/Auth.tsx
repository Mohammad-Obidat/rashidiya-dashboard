import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { LogIn, Mail, Lock, School, UserPlus } from 'lucide-react';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLoginMode) {
        await login({ email, password });
      } else {
        await register({ email, password, name });
      }
      navigate('/programs');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'حدث خطأ أثناء المعالجة';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Logo and Title Section */}
        <div className='text-center mb-4'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform duration-300'>
            <School className='w-10 h-10 text-white' />
          </div>
          <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 py-2'>
            نظام إدارة البرامج اللامنهجية
          </h1>
          <p className='text-gray-600'>مدرسة الرشيدية</p>
        </div>

        {/* Auth Form */}
        <div className='bg-white rounded-2xl shadow-xl p-4 border border-gray-100'>
          <div className='mb-4'>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>
              {isLoginMode ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
            </h2>
            <p className='text-gray-600 text-sm'>
              {isLoginMode
                ? 'أدخل بياناتك للوصول إلى لوحة التحكم'
                : 'أدخل بياناتك لإنشاء حساب جديد'}
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
            {!isLoginMode && (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  الاسم (اختياري)
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                    <UserPlus className='h-5 w-5 text-gray-400' />
                  </div>
                  <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                    placeholder='الاسم الكامل'
                  />
                </div>
              </div>
            )}

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
              {!isLoginMode && (
                <p className='mt-1 text-xs text-gray-500'>
                  يجب أن تكون كلمة المرور 6 أحرف على الأقل
                </p>
              )}
            </div>

            {isLoginMode && (
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
                  className='text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer'
                >
                  نسيت كلمة المرور؟
                </a>
              </div>
            )}

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
                  {isLoginMode ? (
                    <>
                      <LogIn className='w-5 h-5 cursor-pointer' />
                      <span>تسجيل الدخول</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className='w-5 h-5 cursor-pointer' />
                      <span>إنشاء حساب</span>
                    </>
                  )}
                </div>
              )}
            </Button>
          </form>

          <div className='mt-6 pt-6 border-t border-gray-200'>
            <p className='text-center text-sm text-gray-600'>
              {isLoginMode ? 'لا تملك حساباً؟ ' : 'لديك حساب بالفعل؟ '}
              <button
                onClick={() => {
                  setIsLoginMode(!isLoginMode);
                  setError('');
                }}
                className='text-blue-600 hover:text-blue-700 font-medium cursor-pointer'
              >
                {isLoginMode ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className='mt-8 text-center text-sm text-gray-600'>
          <p className='flex items-center justify-center gap-2'>
            مدرسة الرشيدية. جميع الحقوق محفوظة.
            <span>{new Date().getFullYear()} ©</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
