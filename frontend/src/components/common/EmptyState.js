import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { appTheme } from '../../theme';

export function EmptyState({ icon = 'albums-outline', title, description }) {
  return (
    <View style={styles.wrap}>
      <Ionicons name={icon} size={28} color={appTheme.colors.accent} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    borderRadius: 24,
    backgroundColor: appTheme.colors.surface,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    gap: 10,
  },
  title: {
    color: appTheme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
});

