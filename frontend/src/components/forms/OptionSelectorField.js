import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { appTheme } from '../../theme';

export function OptionSelectorField({ label, options, selectedValue, onChange, helperText }) {
  if (!options?.length) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {options.map((option) => {
          const isActive = option.value === selectedValue;

          return (
            <Pressable
              key={option.value}
              style={[styles.chip, isActive && styles.activeChip]}
              onPress={() => onChange(option.value)}
            >
              <Text style={[styles.chipText, isActive && styles.activeChipText]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 12,
    gap: 8,
  },
  label: {
    color: appTheme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  helperText: {
    color: appTheme.colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  row: {
    gap: 10,
    paddingRight: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    backgroundColor: appTheme.colors.surface,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  activeChip: {
    backgroundColor: 'rgba(88,153,255,0.24)',
    borderColor: appTheme.colors.primary,
  },
  chipText: {
    color: appTheme.colors.text,
    fontWeight: '600',
  },
  activeChipText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});

