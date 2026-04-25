import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function StatCard({ label, value, colors }) {
  return (
    <LinearGradient colors={colors || ['rgba(63,169,245,0.32)', 'rgba(21,101,192,0.24)']} style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 116,
    borderRadius: 24,
    padding: 16,
    justifyContent: 'space-between',
  },
  value: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
  },
  label: {
    color: '#DCEBFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
