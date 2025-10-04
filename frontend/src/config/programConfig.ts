import {
  ProgramStatus,
  ProgramTypeEnum,
  AttendanceStatus,
  Gender,
  RecurrencePattern,
} from '../types/program';

// ========================
// STATUS CONFIG
// ========================
export const statusConfig = {
  [ProgramStatus.ACTIVE]: {
    label: 'نشط',
    bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
    text: 'text-green-700',
    badge: 'bg-green-100 text-green-800 border border-green-200',
    dot: 'bg-green-500',
    icon: '✓',
  },
  [ProgramStatus.INACTIVE]: {
    label: 'غير نشط',
    bg: 'bg-gradient-to-r from-gray-50 to-slate-50',
    text: 'text-gray-700',
    badge: 'bg-gray-100 text-gray-800 border border-gray-200',
    dot: 'bg-gray-500',
    icon: '○',
  },
  [ProgramStatus.ARCHIVED]: {
    label: 'مؤرشف',
    bg: 'bg-gradient-to-r from-yellow-50 to-amber-50',
    text: 'text-yellow-700',
    badge: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    dot: 'bg-yellow-500',
    icon: '📦',
  },
} as const;

export type StatusConfigKey = keyof typeof statusConfig;

// ========================
// TYPE CONFIG
// ========================
export const typeConfig = {
  [ProgramTypeEnum.SPORTS]: {
    label: 'رياضية',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '⚽',
    gradient: 'from-blue-500 to-cyan-500',
  },
  [ProgramTypeEnum.CULTURAL]: {
    label: 'ثقافية',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: '📚',
    gradient: 'from-purple-500 to-pink-500',
  },
  [ProgramTypeEnum.SCIENTIFIC]: {
    label: 'علمية',
    color: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    icon: '🔬',
    gradient: 'from-cyan-500 to-blue-500',
  },
  [ProgramTypeEnum.ARTISTIC]: {
    label: 'فنية',
    color: 'bg-pink-100 text-pink-800 border-pink-200',
    icon: '🎨',
    gradient: 'from-pink-500 to-rose-500',
  },
  [ProgramTypeEnum.SOCIAL]: {
    label: 'اجتماعية',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '🤝',
    gradient: 'from-green-500 to-emerald-500',
  },
  [ProgramTypeEnum.RELIGIOUS]: {
    label: 'دينية',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: '🕌',
    gradient: 'from-indigo-500 to-purple-500',
  },
  [ProgramTypeEnum.OTHER]: {
    label: 'أخرى',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: '📋',
    gradient: 'from-gray-500 to-slate-500',
  },
} as const;

export type TypeConfigKey = keyof typeof typeConfig;

// ========================
// ATTENDANCE STATUS CONFIG
// ========================
export const attendanceConfig = {
  [AttendanceStatus.PRESENT]: {
    label: 'حاضر',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '✓',
    dot: 'bg-green-500',
  },
  [AttendanceStatus.ABSENT]: {
    label: 'غائب',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: '✗',
    dot: 'bg-red-500',
  },
  [AttendanceStatus.EXCUSED]: {
    label: 'غياب بعذر',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '📝',
    dot: 'bg-blue-500',
  },
  [AttendanceStatus.LATE]: {
    label: 'متأخر',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: '⏰',
    dot: 'bg-yellow-500',
  },
} as const;

export type AttendanceConfigKey = keyof typeof attendanceConfig;

// ========================
// GENDER CONFIG
// ========================
export const genderConfig = {
  [Gender.MALE]: {
    label: 'ذكر',
    icon: '👨',
    color: 'bg-blue-100 text-blue-800',
  },
  [Gender.FEMALE]: {
    label: 'أنثى',
    icon: '👩',
    color: 'bg-pink-100 text-pink-800',
  },
} as const;

export type GenderConfigKey = keyof typeof genderConfig;

// ========================
// RECURRENCE PATTERN CONFIG
// ========================
export const recurrenceConfig = {
  [RecurrencePattern.DAILY]: {
    label: 'يومي',
    icon: '📅',
  },
  [RecurrencePattern.WEEKLY]: {
    label: 'أسبوعي',
    icon: '📆',
  },
  [RecurrencePattern.MONTHLY]: {
    label: 'شهري',
    icon: '🗓️',
  },
} as const;

export type RecurrenceConfigKey = keyof typeof recurrenceConfig;

// ========================
// HELPER FUNCTIONS
// ========================

export const getStatusConfig = (status: ProgramStatus) => {
  return statusConfig[status] || statusConfig[ProgramStatus.INACTIVE];
};

export const getTypeConfig = (type: ProgramTypeEnum) => {
  return typeConfig[type] || typeConfig[ProgramTypeEnum.OTHER];
};

export const getAttendanceConfig = (status: AttendanceStatus) => {
  return attendanceConfig[status] || attendanceConfig[AttendanceStatus.ABSENT];
};

export const getGenderConfig = (gender: Gender) => {
  return genderConfig[gender];
};

export const getRecurrenceConfig = (pattern: RecurrencePattern) => {
  return recurrenceConfig[pattern];
};

// ========================
// DROPDOWN OPTIONS
// ========================

// Get all status options for dropdowns
export const getAllStatuses = () => {
  return Object.entries(statusConfig).map(([value, config]) => ({
    value: value as ProgramStatus,
    label: config.label,
    icon: config.icon,
  }));
};

// Get all type options for dropdowns
export const getAllTypes = () => {
  return Object.entries(typeConfig).map(([value, config]) => ({
    value: value as ProgramTypeEnum,
    label: config.label,
    icon: config.icon,
  }));
};

// Get all attendance status options for dropdowns
export const getAllAttendanceStatuses = () => {
  return Object.entries(attendanceConfig).map(([value, config]) => ({
    value: value as AttendanceStatus,
    label: config.label,
    icon: config.icon,
  }));
};

// Get all gender options for dropdowns
export const getAllGenders = () => {
  return Object.entries(genderConfig).map(([value, config]) => ({
    value: value as Gender,
    label: config.label,
    icon: config.icon,
  }));
};

// Get all recurrence pattern options for dropdowns
export const getAllRecurrencePatterns = () => {
  return Object.entries(recurrenceConfig).map(([value, config]) => ({
    value: value as RecurrencePattern,
    label: config.label,
    icon: config.icon,
  }));
};

// ========================
// GRADE OPTIONS
// ========================
export const gradeOptions = [
  { value: '9', label: 'الصف التاسع' },
  { value: '10', label: 'الصف العاشر' },
  { value: '11', label: 'الصف الحادي عشر' },
  { value: '12', label: 'الصف الثاني عشر' },
];

// ========================
// SECTION OPTIONS
// ========================
export const sectionOptions = [
  { value: 'أ', label: 'أ' },
  { value: 'ب', label: 'ب' },
  { value: 'ج', label: 'ج' },
  { value: 'د', label: 'د' },
  { value: 'ه', label: 'ه' },
  { value: 'و', label: 'و' },
  { value: 'ز', label: 'ز' },
];
