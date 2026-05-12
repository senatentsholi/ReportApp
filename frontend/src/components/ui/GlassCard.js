import React from 'react';
import { StyleSheet, View } from 'react-native';
import { appTheme } from '../../theme';

export function GlassCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: appTheme.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: appTheme.colors.surfaceStrong,
    borderRadius: 20,
    padding: 20,
    shadowColor: appTheme.colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
});

