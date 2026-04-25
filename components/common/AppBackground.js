import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { appTheme } from '../../src/theme';

export function AppBackground({ children }) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#07111E', '#0E2240', '#15365F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0)', 'rgba(63,169,245,0.10)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.topWash}
      />
      <LinearGradient
        colors={['rgba(155,92,255,0.16)', 'rgba(63,169,245,0.04)', 'rgba(0,0,0,0)']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.bottomWash}
      />
      <View style={styles.gridLine} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appTheme.colors.background,
  },
  topWash: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
  bottomWash: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '42%',
  },
  gridLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '18%',
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
});
