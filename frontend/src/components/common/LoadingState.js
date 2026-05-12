import React from 'react';
import { StyleSheet, View } from 'react-native';
import { appTheme } from '../../theme';

export function LoadingState({ blocks = 3 }) {
  return (
    <View style={styles.wrap}>
      {Array.from({ length: blocks }).map((_, index) => (
        <View key={index} style={styles.block} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 12,
  },
  block: {
    height: 120,
    borderRadius: 24,
    backgroundColor: appTheme.colors.surface,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
  },
});

