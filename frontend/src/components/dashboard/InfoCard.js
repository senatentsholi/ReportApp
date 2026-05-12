import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GlassCard } from '../ui/GlassCard';
import { appTheme } from '../../theme';

export function InfoCard({ title, meta, description, rightNode, onPress, style }) {
  const content = (
    <GlassCard style={[styles.card, style]}>
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

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return (
    content
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
    color: appTheme.colors.text,
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

