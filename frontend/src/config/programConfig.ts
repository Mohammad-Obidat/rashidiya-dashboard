import i18n from '../lib/i18n';
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
    label: i18n.t('status.ACTIVE'),
    bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
    text: 'text-green-700',
    badge: 'bg-green-100 text-green-800 border border-green-200',
    dot: 'bg-green-500',
    icon: '✓',
  },
  [ProgramStatus.INACTIVE]: {
    label: i18n.t('status.INACTIVE'),
    bg: 'bg-gradient-to-r from-gray-50 to-slate-50',
    text: 'text-gray-700',
    badge: 'bg-gray-100 text-gray-800 border border-gray-200',
    dot: 'bg-gray-500',
    icon: '○',
  },
  [ProgramStatus.ARCHIVED]: {
    label: i18n.t('status.ARCHIVED'),
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
    label: i18n.t('type.SPORTS'),
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '⚽',
    gradient: 'from-blue-500 to-cyan-500',
  },
  [ProgramTypeEnum.CULTURAL]: {
    label: i18n.t('type.CULTURAL'),
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: '📚',
    gradient: 'from-purple-500 to-pink-500',
  },
  [ProgramTypeEnum.SCIENTIFIC]: {
    label: i18n.t('type.SCIENTIFIC'),
    color: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    icon: '🔬',
    gradient: 'from-cyan-500 to-blue-500',
  },
  [ProgramTypeEnum.ARTISTIC]: {
    label: i18n.t('type.ARTISTIC'),
    color: 'bg-pink-100 text-pink-800 border-pink-200',
    icon: '🎨',
    gradient: 'from-pink-500 to-rose-500',
  },
  [ProgramTypeEnum.SOCIAL]: {
    label: i18n.t('type.SOCIAL'),
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '🤝',
    gradient: 'from-green-500 to-emerald-500',
  },
  [ProgramTypeEnum.RELIGIOUS]: {
    label: i18n.t('type.RELIGIOUS'),
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: '🕌',
    gradient: 'from-indigo-500 to-purple-500',
  },
  [ProgramTypeEnum.OTHER]: {
    label: i18n.t('type.OTHER'),
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
    label: i18n.t('attendance.PRESENT'),
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '✓',
    dot: 'bg-green-500',
  },
  [AttendanceStatus.ABSENT]: {
    label: i18n.t('attendance.ABSENT'),
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: '✗',
    dot: 'bg-red-500',
  },
  [AttendanceStatus.EXCUSED]: {
    label: i18n.t('attendance.EXCUSED'),
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '📝',
    dot: 'bg-blue-500',
  },
  [AttendanceStatus.LATE]: {
    label: i18n.t('attendance.LATE'),
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
    label: i18n.t('gender.MALE'),
    icon: '👨',
    color: 'bg-blue-100 text-blue-800',
  },
  [Gender.FEMALE]: {
    label: i18n.t('gender.FEMALE'),
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
    label: i18n.t('recurrence.DAILY'),
    icon: '📅',
  },
  [RecurrencePattern.WEEKLY]: {
    label: i18n.t('recurrence.WEEKLY'),
    icon: '📆',
  },
  [RecurrencePattern.MONTHLY]: {
    label: i18n.t('recurrence.MONTHLY'),
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
  { value: '9', label: i18n.t('grade.9') },
  { value: '10', label: i18n.t('grade.10') },
  { value: '11', label: i18n.t('grade.11') },
  { value: '12', label: i18n.t('grade.12') },
];

// ========================
// SECTION OPTIONS
// ========================
export const sectionOptions = [
  { value: 'A', label: i18n.t('section.A') },
  { value: 'B', label: i18n.t('section.B') },
  { value: 'C', label: i18n.t('section.C') },
  { value: 'D', label: i18n.t('section.D') },
  { value: 'E', label: i18n.t('section.E') },
  { value: 'F', label: i18n.t('section.F') },
  { value: 'G', label: i18n.t('section.G') },
];
