import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { appTheme } from '../../src/theme';

export function EmptyState({ icon = 'albums-outline', title, description }) {
  return (
    <View style={styles.wrap}>
      <Ionicons name={icon} size={28} color={appTheme.colors.accent} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    gap: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  description: {
    color: appTheme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
