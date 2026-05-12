import { MD3LightTheme } from 'react-native-paper';

export const appTheme = {
  colors: {
    primary: '#3FA9F5',
    primaryDeep: '#1565C0',
    primarySoft: '#EAF6FF',
    accent: '#FF8A3D',
    background: '#F5F8FC',
    backgroundAlt: '#EAF1F8',
    surface: '#FFFFFF',
    surfaceSoft: '#FFFFFF',
    surfaceStrong: '#D8E2EE',
    white: '#FFFFFF',
    text: '#16324F',
    textDark: '#16324F',
    textMuted: '#6F88A2',
    grey: '#7B7B7B',
    success: '#3DD598',
    warning: '#FFB648',
    error: '#FF5D73',
    border: '#D6E2EE',
    shadow: 'rgba(22, 50, 79, 0.12)',
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
    onSurfaceVariant: appTheme.colors.textMuted,
    error: appTheme.colors.error,
  },
};

export const roleOptions = [
  { label: 'Student', value: 'student', icon: 'school-outline' },
  { label: 'Lecturer', value: 'lecturer', icon: 'person-outline' },
  { label: 'PRL', value: 'prl', icon: 'layers-outline' },
  { label: 'PL', value: 'pl', icon: 'ribbon-outline' },
];

