import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GlassCard } from '../ui/GlassCard';
import { appTheme } from '../../src/theme';

export function InfoCard({ title, meta, description, rightNode }) {
  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text style={styles.title}>{title}</Text>
          {meta ? <Text style={styles.meta}>{meta}</Text> : null}
        </View>
        {rightNode}
      </View>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  meta: {
    color: appTheme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  description: {
    color: appTheme.colors.textMuted,
    lineHeight: 20,
  },
});
