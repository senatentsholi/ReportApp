import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function SectionTitle({ title, caption }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 4,
  },
  title: {
    color: '#16324F',
    fontSize: 18,
    fontWeight: '800',
  },
});

