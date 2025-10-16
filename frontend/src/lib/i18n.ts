import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Define the translation resources
const resources = {
  en: {
    translation: {
      language_selector_label: "Language",
      language_arabic: "Arabic",
      language_english: "English",
      language_hebrew: "Hebrew",
      header_title: "Rashidiya Dashboard",
      programs: "Programs",
      mentors: "Mentors",
      students: "Students",
      reports: "Reports",
      schedule: "Schedule",
      attendance: "Attendance",
      logout: "Logout",
      menu: "Menu",
    },
  },
  ar: {
    translation: {
      language_selector_label: "اللغة",
      language_arabic: "العربية",
      language_english: "الإنجليزية",
      language_hebrew: "العبرية",
      header_title: "لوحة تحكم الرشيدية",
      programs: "البرامج",
      mentors: "المرشدون",
      students: "الطلاب",
      reports: "التقارير",
      schedule: "الجدول",
      attendance: "الحضور والغياب",
      logout: "تسجيل الخروج",
      menu: "القائمة",
    },
  },
  he: {
    translation: {
      language_selector_label: "שפה",
      language_arabic: "ערבית",
      language_english: "אנגלית",
      language_hebrew: "עברית",
      header_title: "לוח מחוונים רשידיה",
      programs: "תוכניות",
      mentors: "מנטורים",
      students: "סטודנטים",
      reports: "דוחות",
      schedule: "לוח זמנים",
      attendance: "נוכחות",
      logout: "התנתק",
      menu: "תפריט",
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "ar", // default language is Arabic
    fallbackLng: "en", // use English if a translation is not found for the current language

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    // Set up detection for language direction (RTL/LTR)
    // This is a simple setup, more complex setups might use a dedicated library
    // or context provider to manage RTL/LTR globally.
    // For now, we'll handle it in the component.
  });

export default i18n;

// Utility function to get the direction of the current language
export const getLanguageDirection = (lng: string): "ltr" | "rtl" => {
  return lng === "ar" || lng === "he" ? "rtl" : "ltr";
};
