import React from 'react';
import { StyleSheet, View } from 'react-native';
import { appTheme } from '../../src/theme';

export function GlassCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: appTheme.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: appTheme.colors.surfaceStrong,
    borderRadius: 28,
    padding: 20,
    shadowColor: appTheme.colors.shadow,
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
});
