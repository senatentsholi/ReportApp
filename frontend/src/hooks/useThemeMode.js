import { useColorScheme } from 'react-native';

export function useThemeMode() {
  const systemMode = useColorScheme();

  return {
    systemMode: systemMode || 'dark',
    isDarkMode: (systemMode || 'dark') === 'dark',
  };
}

