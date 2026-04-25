import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { AuthProvider } from './AuthProvider';
import { DataProvider } from './DataProvider';
import { ThemeProvider } from './ThemeProvider';
import { RootNavigator } from '../../navigation/RootNavigator';
import { appTheme, paperTheme } from '../theme';

const navigationTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    background: appTheme.colors.background,
    card: appTheme.colors.surface,
    primary: appTheme.colors.primary,
    text: appTheme.colors.text,
    border: appTheme.colors.border,
  },
};

export function AppProviders() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PaperProvider theme={paperTheme}>
          <AuthProvider>
            <DataProvider>
              <NavigationContainer theme={navigationTheme}>
                <StatusBar style="light" />
                <RootNavigator />
              </NavigationContainer>
            </DataProvider>
          </AuthProvider>
        </PaperProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
