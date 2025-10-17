import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  Menu,
  X,
  Globe,
} from 'lucide-react';

// ---------------------------
// Language Selector Component
// ---------------------------
interface LanguageSelectorProps {
  i18n: any;
  t: (key: string) => string;
  languages: { code: string; name: string }[];
  isLangSelectorOpen: boolean;
  setIsLangSelectorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  changeLanguage: (lng: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  i18n,
  languages,
  isLangSelectorOpen,
  setIsLangSelectorOpen,
  changeLanguage,
}) => {
  const selectorRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(event.target as Node)
      ) {
        setIsLangSelectorOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectorRef, setIsLangSelectorOpen]);

  // Don't show on auth page
  if (location.pathname === '/auth') return null;

  return (
    <div className="relative" ref={selectorRef}>
      <button
        onClick={() => setIsLangSelectorOpen(!isLangSelectorOpen)}
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
      >
        <Globe className="w-5 h-5" />
      </button>

      <div
        className={`absolute top-full ltr:right-0 rtl:left-0 mt-2 w-40 bg-white rounded-lg shadow-xl transition-opacity duration-300 z-50 ${
          isLangSelectorOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <ul className="py-1">
          {languages.map((lang) => (
            <li key={lang.code}>
              <button
                onClick={() => changeLanguage(lang.code)}
                className={`w-full text-left px-4 py-2 text-sm ${
                  i18n.language === lang.code
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {lang.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// ---------------------------
// Main Header Component
// ---------------------------
const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangSelectorOpen, setIsLangSelectorOpen] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Disable scroll when menu open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen]);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangSelectorOpen(false);
  };

  const navLinks = [
    { path: '/programs', icon: BookOpen, label: t('programs') },
    { path: '/mentors', icon: User, label: t('mentors') },
    { path: '/students', icon: Users, label: t('students') },
    { path: '/reports', icon: Backpack, label: t('reports') },
    { path: '/schedule', icon: Calendar, label: t('schedule') },
    { path: '/attendance', icon: ClipboardCheck, label: t('attendance') },
  ];

  const languages = [
    { code: 'ar', name: t('language_arabic') },
    { code: 'en', name: t('language_english') },
    { code: 'he', name: t('language_hebrew') },
  ];

  // ✅ Return JSX properly
  return (
    <header
      className={`sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-lg transition-all duration-300 ${
        isScrolled ? 'shadow-xl' : ''
      }`}
    >
      <div className="container px-2 sm:px-4 lg:px-2">
        <div className="flex items-center justify-between py-2.5 sm:py-3 gap-2 sm:gap-4">
          {/* Logo Section */}
          <Link
            to="/programs"
            className="flex items-center gap-2 sm:gap-3 group flex-shrink-0 min-w-0"
          >
            <div className="bg-white backdrop-blur-sm p-1.5 sm:p-2 rounded-lg sm:rounded-xl group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110 flex-shrink-0">
              <img
                src={schoolLogo}
                alt="logo"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
            </div>
            <div className="hidden sm:block min-w-0">
              <h1 className="text-base sm:text-lg lg:text-xl font-bold tracking-tight truncate">
                {t('header_title')}
              </h1>
            </div>
            <div className="block sm:hidden">
              <h1 className="text-sm font-bold">{t('header_title')}</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex mx-auto items-center gap-1 xl:gap-2">
            {navLinks.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-4 py-2 xl:py-2.5 rounded-lg transition-all duration-200 text-sm xl:text-base whitespace-nowrap ${
                  isActive(path)
                    ? 'bg-white text-blue-700 shadow-lg font-semibold'
                    : 'hover:bg-white/10 backdrop-blur-sm'
                }`}
              >
                <Icon className="w-4 h-4 xl:w-5 xl:h-5 flex-shrink-0" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* User Info & Controls */}
          <div className="flex items-center gap-2 xl:gap-3">
            {isAuthenticated && (
              <div className="hidden lg:flex items-center gap-2 xl:gap-3 px-2 xl:px-4 border-r border-l border-white/20">
                <div className="text-right">
                  <p className="text-xs xl:text-sm font-medium truncate max-w-[120px] xl:max-w-[200px]">
                    {user?.name || user?.email}
                  </p>
                  <p className="text-xs text-blue-100">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-4 py-2 xl:py-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4 xl:w-5 xl:h-5" />
                  <span className="text-sm xl:text-base">{t('logout')}</span>
                </button>
              </div>
            )}

            {/* ✅ Language Selector (now working) */}
            <LanguageSelector
              i18n={i18n}
              t={t}
              languages={languages}
              isLangSelectorOpen={isLangSelectorOpen}
              setIsLangSelectorOpen={setIsLangSelectorOpen}
              changeLanguage={changeLanguage}
            />
          </div>

          {/* Mobile Menu Button */}
          {isAuthenticated && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
