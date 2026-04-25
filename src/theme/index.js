import { MD3LightTheme } from 'react-native-paper';

export const appTheme = {
  colors: {
    primary: '#3FA9F5',
    primaryDeep: '#1565C0',
    primarySoft: '#EAF6FF',
    accent: '#9B5CFF',
    background: '#08111F',
    backgroundAlt: '#0F1C31',
    surface: '#13233D',
    surfaceSoft: 'rgba(255,255,255,0.08)',
    surfaceStrong: 'rgba(255,255,255,0.14)',
    white: '#FFFFFF',
    text: '#F8FBFF',
    textDark: '#1A1A1A',
    textMuted: '#9EB3CA',
    grey: '#7B7B7B',
    success: '#3DD598',
    warning: '#FFB648',
    error: '#FF5D73',
    border: 'rgba(255,255,255,0.14)',
    shadow: 'rgba(9, 24, 45, 0.36)',
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  radius: {
    md: 18,
    lg: 24,
    xl: 30,
    pill: 999,
  },
};

export const paperTheme = {
  ...MD3LightTheme,
  roundness: 24,
  colors: {
    ...MD3LightTheme.colors,
    primary: appTheme.colors.primary,
    secondary: appTheme.colors.accent,
    background: appTheme.colors.background,
    surface: appTheme.colors.surface,
    outline: appTheme.colors.border,
    onSurface: appTheme.colors.text,
    onBackground: appTheme.colors.text,
    error: appTheme.colors.error,
  },
};

export const roleOptions = [
  { label: 'Student', value: 'student', icon: 'school-outline' },
  { label: 'Lecturer', value: 'lecturer', icon: 'person-outline' },
  { label: 'PRL', value: 'prl', icon: 'layers-outline' },
  { label: 'PL', value: 'pl', icon: 'ribbon-outline' },
];
