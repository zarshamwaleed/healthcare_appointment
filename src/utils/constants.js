export const USER_MODES = {
  STANDARD: 'standard',
  ELDERLY: 'elderly',
  VOICE: 'voice',
  ICON: 'icon'
};

export const DEPARTMENT_MAPPING = {
  headache: ['Neurology', 'General Physician'],
  fever: ['General Physician', 'Internal Medicine'],
  cough: ['Pulmonology', 'ENT', 'General Physician'],
  'stomach pain': ['Gastroenterology', 'General Physician'],
  'skin rash': ['Dermatology'],
  'chest pain': ['Cardiology', 'Emergency'],
  'back pain': ['Orthopedics', 'Physiotherapy'],
  dizziness: ['Neurology', 'General Physician'],
  fatigue: ['General Physician', 'Endocrinology'],
  'joint pain': ['Orthopedics', 'Rheumatology']
};

export const DOCTOR_TYPES = [
  {
    id: 'gp',
    name: 'General Physician',
    icon: '👨‍⚕️',
    description: 'For general health issues and initial diagnosis',
    avgWaitTime: '15-30 mins'
  },
  {
    id: 'cardio',
    name: 'Cardiologist',
    icon: '❤️',
    description: 'Heart and cardiovascular system specialists',
    avgWaitTime: '1-2 days'
  },
  {
    id: 'derma',
    name: 'Dermatologist',
    icon: '🦠',
    description: 'Skin, hair, and nail specialists',
    avgWaitTime: '2-3 days'
  },
  {
    id: 'ortho',
    name: 'Orthopedic',
    icon: '🦴',
    description: 'Bone, joint, and muscle specialists',
    avgWaitTime: '1-2 days'
  },
  {
    id: 'neuro',
    name: 'Neurologist',
    icon: '🧠',
    description: 'Brain and nervous system specialists',
    avgWaitTime: '3-4 days'
  },
  {
    id: 'ent',
    name: 'ENT Specialist',
    icon: '👂',
    description: 'Ear, nose, and throat specialists',
    avgWaitTime: '1-2 days'
  }
];

export const ACCESSIBILITY_SETTINGS = {
  FONT_SIZES: {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  },
  CONTRAST_MODES: {
    normal: 'normal',
    high: 'high',
    dark: 'dark'
  },
  SPEECH_RATES: {
    slow: 0.7,
    normal: 1.0,
    fast: 1.3
  }
};

export const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' }
];