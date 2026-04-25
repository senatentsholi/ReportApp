import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function GradientButton({ label, onPress, style }) {
  return (
    <Pressable onPress={onPress} style={style}>
      <LinearGradient colors={['#9B5CFF', '#3FA9F5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.button}>
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
