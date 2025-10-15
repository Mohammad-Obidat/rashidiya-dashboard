import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { School } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import schoolLogo from '../../assets/schoolLogo.png';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState('');

  const handleAuth = async (data: {
    email: string;
    password: string;
    name?: string;
  }) => {
    setError('');
    try {
      if (isLoginMode) {
        await login({ email: data.email, password: data.password });
      } else {
        await register({
          email: data.email,
          password: data.password,
          name: data.name,
        });
      }
      navigate('/programs');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'حدث خطأ أثناء المعالجة';
      setError(errorMessage);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Logo and Title Section */}
        <div className='text-center mb-4'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform duration-300'>
            <img src={schoolLogo} alt='schoolLogo' />
          </div>
          <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 py-2'>
            نظام إدارة البرامج اللامنهجية
          </h1>
          <div className='flex items-center justify-center gap-2'>
            <School className='w-10 h-10 text-black' />
            <p className='text-gray-600'>مدرسة الرشيدية</p>
          </div>
        </div>

        {/* Conditional Form */}
        {isLoginMode ? (
          <LoginForm onSubmit={handleAuth} error={error} />
        ) : (
          <RegisterForm onSubmit={handleAuth} error={error} />
        )}

        {/* Switch Mode */}
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
