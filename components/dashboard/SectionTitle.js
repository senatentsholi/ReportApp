import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { appTheme } from '../../src/theme';

export function SectionTitle({ title, caption }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  caption: {
    color: appTheme.colors.textMuted,
    fontSize: 13,
  },
});
