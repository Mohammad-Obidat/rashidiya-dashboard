import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import schoolLogo from '../../assets/schoolLogo.png';
import { useAuth } from '../../hooks/useAuth';
import {
  BookOpen,
  Backpack,
  User,
  Users,
  Calendar,
  ClipboardCheck,
  LogOut,
} from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  // Don't show header on auth page
  if (location.pathname === '/auth') {
    return null;
  }

  return (
    <header className='bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-lg'>
      <div className='px-2 py-2'>
        <div className='flex items-center'>
          <Link to='/programs' className='flex items-center gap-3 group'>
            <div className='bg-white backdrop-blur-sm p-2 rounded-xl group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110'>
              <img src={schoolLogo} alt='logo' />
            </div>
            <div>
              <h1 className='text-xl font-bold tracking-tight'>
                مدرسة الرشيدية | إدارة البرامج اللامنهجية
              </h1>
              <p className='text-sm text-blue-100 font-light'>
                Rashidya School | Programs Management System
              </p>
            </div>
          </Link>

          <div className='flex items-center gap-4'>
            <nav className='flex items-end gap-2 px-2'>
              <Link
                to='/programs'
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive('/programs')
                    ? 'bg-white text-blue-700 shadow-lg font-semibold'
                    : 'hover:bg-white/10 backdrop-blur-sm'
                }`}
              >
                <BookOpen className='w-5 h-5' />
                <span>البرامج</span>
              </Link>
              <Link
                to='/mentors'
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive('/mentors')
                    ? 'bg-white text-blue-700 shadow-lg font-semibold'
                    : 'hover:bg-white/10 backdrop-blur-sm'
                }`}
              >
                <User className='w-5 h-5' />
                <span>المرشدون</span>
              </Link>
              <Link
                to='/students'
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive('/students')
                    ? 'bg-white text-blue-700 shadow-lg font-semibold'
                    : 'hover:bg-white/10 backdrop-blur-sm'
                }`}
              >
                <Users className='w-5 h-5' />
                <span>الطلاب</span>
              </Link>
              <Link
                to='/reports'
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive('/reports')
                    ? 'bg-white text-blue-700 shadow-lg font-semibold'
                    : 'hover:bg-white/10 backdrop-blur-sm'
                }`}
              >
                <Backpack className='w-5 h-5' />
                <span>التقارير</span>
              </Link>
              <Link
                to='/schedule'
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive('/schedule')
                    ? 'bg-white text-blue-700 shadow-lg font-semibold'
                    : 'hover:bg-white/10 backdrop-blur-sm'
                }`}
              >
                <Calendar className='w-5 h-5' />
                <span>الجداول</span>
              </Link>
              <Link
                to='/attendance'
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive('/attendance')
                    ? 'bg-white text-blue-700 shadow-lg font-semibold'
                    : 'hover:bg-white/10 backdrop-blur-sm'
                }`}
              >
                <ClipboardCheck className='w-5 h-5' />
                <span>الحضور والغياب</span>
              </Link>
            </nav>
          </div>
          {isAuthenticated && (
            <div className='flex items-center justify-end mx-auto gap-3 pr-4 border-r border-white/20'>
              <div className='text-left'>
                <p className='text-sm font-medium'>
                  {user?.name || user?.email}
                </p>
                <p className='text-xs text-blue-100'>{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className='flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200'
                title='تسجيل الخروج'
              >
                <LogOut className='w-5 h-5' />
                <span>خروج</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
