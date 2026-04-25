import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { appTheme, roleOptions } from '../../src/theme';

export function AuthRoleSelector({ value, onChange }) {
  return (
    <View style={styles.grid}>
      {roleOptions.map((role) => (
        <Pressable
          key={role.value}
          onPress={() => onChange(role.value)}
          style={[styles.card, value === role.value && styles.cardActive]}
        >
          <Ionicons name={role.icon} size={18} color={value === role.value ? '#FFFFFF' : appTheme.colors.primary} />
          <Text style={[styles.label, value === role.value && styles.labelActive]}>{role.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    flexGrow: 1,
    minWidth: 140,
    padding: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    gap: 8,
  },
  cardActive: {
    backgroundColor: appTheme.colors.accent,
    borderColor: 'rgba(255,255,255,0.24)',
  },
  label: {
    color: appTheme.colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  labelActive: {
    color: '#FFFFFF',
  },
});
