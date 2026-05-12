import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemMode = useColorScheme() || 'dark';
  const [themeMode, setThemeMode] = useState('system');

  useEffect(() => {
    AsyncStorage.getItem('luct-theme-mode').then((stored) => {
      if (stored) {
        setThemeMode(stored);
      }
    });
  }, []);

  const resolvedMode = themeMode === 'system' ? systemMode : themeMode;

  const value = useMemo(
    () => ({
      themeMode,
      resolvedMode,
      isDarkMode: resolvedMode === 'dark',
      async setMode(nextMode) {
        setThemeMode(nextMode);
        await AsyncStorage.setItem('luct-theme-mode', nextMode);
      },
      async toggleDarkMode() {
        const nextMode = resolvedMode === 'dark' ? 'light' : 'dark';
        setThemeMode(nextMode);
        await AsyncStorage.setItem('luct-theme-mode', nextMode);
      },
    }),
    [resolvedMode, themeMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemePreference() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemePreference must be used inside ThemeProvider');
  }

  return context;
}

