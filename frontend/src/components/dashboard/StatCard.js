import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { appTheme } from '../../theme';

export function StatCard({ label, value, colors, onPress, compact = false }) {
  const card = (
    <LinearGradient
      colors={colors || ['#F4FAFF', '#E8F2FF']}
      style={[styles.card, compact && styles.compactCard]}
    >
      <Text style={[styles.value, compact && styles.compactValue]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </LinearGradient>
  );

  return onPress ? <Pressable style={{ flex: 1 }} onPress={onPress}>{card}</Pressable> : card;
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 116,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: appTheme.colors.border,
  },
  compactCard: {
    minHeight: 92,
  },
  value: {
    color: appTheme.colors.text,
    fontSize: 26,
    fontWeight: '900',
  },
  compactValue: {
    fontSize: 20,
  },
  label: {
    color: appTheme.colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
});

