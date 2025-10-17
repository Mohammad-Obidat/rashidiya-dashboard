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

    if (isLangSelectorOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isLangSelectorOpen, setIsLangSelectorOpen]);

  return (
    <div className="relative" ref={selectorRef}>
      <button
        onClick={() => setIsLangSelectorOpen(!isLangSelectorOpen)}
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
        aria-label="Toggle language selector"
        aria-expanded={isLangSelectorOpen}
      >
        <Globe className="w-5 h-5 flex-shrink-0" />
      </button>

      {isLangSelectorOpen && (
        <div className="absolute top-full ltr:right-0 rtl:left-0 mt-2 w-40 bg-white rounded-lg shadow-xl z-50">
          <ul className="py-1">
            {languages.map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => {
                    changeLanguage(lang.code);
                    setIsLangSelectorOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
                    i18n.language === lang.code
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {lang.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
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
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Manage body overflow
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
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

  return (
    <header
      className={`sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-lg transition-all duration-300 ${
        isScrolled ? 'shadow-xl' : ''
      }`}
    >
      <div className="container mx-auto px-2 sm:px-4 lg:px-2">
        <div className="flex items-center justify-between py-2.5 sm:py-3 gap-2 sm:gap-4">
          {/* Logo + Title */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0">
            <div className="bg-white backdrop-blur-sm p-1.5 sm:p-2 rounded-lg sm:rounded-xl flex-shrink-0">
              <img
                src={schoolLogo}
                alt="School logo"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg lg:text-xl font-bold tracking-tight truncate">
                {t('header_title')}
              </h1>
            </div>
          </div>

          {/* Show this only if user is authenticated */}
          {isAuthenticated ? (
            <>
              {/* Desktop Nav */}
              <nav className="hidden lg:flex mx-auto items-center gap-1 xl:gap-2">
                {navLinks.map(({ path, icon: Icon, label }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-4 py-2 xl:py-2.5 rounded-lg transition-all duration-200 text-sm xl:text-base whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-white/30 ${
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

              {/* User Info + Lang Selector + Mobile Menu Button */}
              <div className="flex items-center gap-2 xl:gap-3">
                {/* Desktop User Info & Logout */}
                <div className="hidden lg:flex items-center gap-2 xl:gap-3 px-2 xl:px-4 border-r border-l border-white/20">
                  <div className="text-right">
                    <p className="text-xs xl:text-sm font-medium truncate max-w-[120px] xl:max-w-[200px]">
                      {user?.name || user?.email}
                    </p>
                    <p className="text-xs text-blue-100">{user?.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-4 py-2 xl:py-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
                  >
                    <LogOut className="w-4 h-4 xl:w-5 xl:h-5 flex-shrink-0" />
                    <span className="text-sm xl:text-base">{t('logout')}</span>
                  </button>
                </div>

                {/* Language Selector */}
                <LanguageSelector
                  i18n={i18n}
                  t={t}
                  languages={languages}
                  isLangSelectorOpen={isLangSelectorOpen}
                  setIsLangSelectorOpen={setIsLangSelectorOpen}
                  changeLanguage={changeLanguage}
                />

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
                  aria-label="Toggle mobile menu"
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            </>
          ) : (
            // Unauthenticated Header (Logo + Language only)
            <div className="flex items-center gap-2">
              <LanguageSelector
                i18n={i18n}
                t={t}
                languages={languages}
                isLangSelectorOpen={isLangSelectorOpen}
                setIsLangSelectorOpen={setIsLangSelectorOpen}
                changeLanguage={changeLanguage}
              />
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isAuthenticated && isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="lg:hidden fixed left-0 right-0 border-t border-white/20 bg-gradient-to-b from-blue-600 via-blue-700 to-indigo-700 pb-3 z-40"
          >
            <nav className="flex flex-col gap-1 pt-3 px-2">
              {navLinks.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                    isActive(path)
                      ? 'bg-white text-blue-700 shadow-lg'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>

            {/* Mobile User Info & Logout */}
            <div className="lg:hidden border-t border-white/20 mt-3 pt-3 px-4">
              <p className="text-sm font-medium mb-2">
                {user?.name || user?.email}
              </p>
              <p className="text-xs text-blue-100 mb-3">{user?.role}</p>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/10  hover:bg-blue-900 transition-all duration-200 text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('logout')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
