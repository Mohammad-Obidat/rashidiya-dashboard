import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import schoolLogo from '../../assets/schoolLogo.png';
import { useTranslation } from 'react-i18next';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { t } = useTranslation();
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
        err.response?.data?.message ||
        err.message ||
        t('auth_processing_error');
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="w-full max-w-md flex flex-col items-center justify-center p-6">
        {/* Logo and Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform duration-300">
            <img
              src={schoolLogo}
              alt="schoolLogo"
              className="w-14 h-14 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 py-2">
            {t('auth_system_title')}
          </h1>
          <p className="text-gray-600">{t('auth_school_name')}</p>
        </div>

        {/* Conditional Form */}
        <div className="w-full">
          {isLoginMode ? (
            <LoginForm onSubmit={handleAuth} error={error} />
          ) : (
            <RegisterForm onSubmit={handleAuth} error={error} />
          )}
        </div>

        {/* Switch Mode */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            {isLoginMode
              ? t('auth_login_mode_question')
              : t('auth_register_mode_question')}{' '}
            <button
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError('');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isLoginMode
                ? t('auth_create_account_button')
                : t('auth_login_button')}
            </button>
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-600">
          <p className="flex items-center justify-center gap-1">
            {t('auth_footer_rights')}
            <span>{`${new Date().getFullYear()} ${t(
              'auth_footer_year_symbol'
            )}`}</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Auth;
