import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import schoolLogo from "../../assets/schoolLogo.png";
import { useAuth } from "../../hooks/useAuth";
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
} from "lucide-react";

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for better mobile experience
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Don't show header on auth page
  if (location.pathname === "/auth") {
    return null;
  }

  const navLinks = [
    { path: "/programs", icon: BookOpen, label: t("programs") },
    { path: "/mentors", icon: User, label: t("mentors") },
    { path: "/students", icon: Users, label: t("students") },
    { path: "/reports", icon: Backpack, label: t("reports") },
    { path: "/schedule", icon: Calendar, label: t("schedule") },
    { path: "/attendance", icon: ClipboardCheck, label: t("attendance") },
  ];

  const languages = [
    { code: "ar", name: t("language_arabic") },
    { code: "en", name: t("language_english") },
    { code: "he", name: t("language_hebrew") },
  ];

  const LanguageSelector = () => (
    <div className="relative group">
      <button className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200">
        <Globe className="w-5 h-5" />
        <span className="hidden sm:inline text-sm">
          {t("language_selector_label")}
        </span>
      </button>
      <div className="absolute top-full ltr:right-0 rtl:left-0 mt-2 w-40 bg-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
        <ul className="py-1">
          {languages.map((lang) => (
            <li key={lang.code}>
              <button
                onClick={() => changeLanguage(lang.code)}
                className={`w-full text-left px-4 py-2 text-sm ${
                  i18n.language === lang.code
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
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

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-lg transition-all duration-300 ${
          isScrolled ? "shadow-xl" : ""
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
                  {t("header_title")}
                </h1>
              </div>
              <div className="block sm:hidden">
                <h1 className="text-sm font-bold">{t("header_title")}</h1>
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
                      ? "bg-white text-blue-700 shadow-lg font-semibold"
                      : "hover:bg-white/10 backdrop-blur-sm"
                  }`}
                >
                  <Icon className="w-4 h-4 xl:w-5 xl:h-5 flex-shrink-0" />
                  <span className="hidden xl:inline">{label}</span>
                  <span className="xl:hidden">{label.split(" ")[0]}</span>
                </Link>
              ))}
            </nav>

            {/* User Info, Language Selector & Logout */}
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
                    className="flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-4 py-2 xl:py-2.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
                    title={t("logout")}
                    aria-label={t("logout")}
                  >
                    <LogOut className="w-4 h-4 xl:w-5 xl:h-5" />
                    <span className="text-sm xl:text-base">{t("logout")}</span>
                  </button>
                </div>
              )}
              <LanguageSelector />
            </div>

            {/* Mobile Menu Button */}
            {isAuthenticated && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                aria-label={t("menu")}
                aria-expanded={isMobileMenuOpen}
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

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && isAuthenticated && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Mobile Menu */}
          <div className="fixed top-[60px] left-0 right-0 bottom-0 z-50 lg:hidden overflow-y-auto">
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 min-h-full shadow-2xl">
              {/* User Info Section */}
              <div className="bg-white/10 backdrop-blur-sm p-4 mb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-full">
                    <User className="w-6 h-6 text-black" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold truncate text-black">
                      {user?.name || user?.email}
                    </p>
                    <p className="text-sm text-white/70">{user?.role}</p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="px-4 py-2 space-y-1">
                {navLinks.map(({ path, icon: Icon, label }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                      isActive(path)
                        ? "bg-white text-black-700 shadow-lg font-semibold"
                        : "hover:bg-white/10 text-white backdrop-blur-sm active:bg-white/20"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-base">{label}</span>
                  </Link>
                ))}

                {/* Logout Button */}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/20 hover:bg-red-500/30 backdrop-blur-sm transition-all duration-200 mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-base font-medium">{t("logout")}</span>
                </button>
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
