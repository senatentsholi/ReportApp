import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { appTheme } from '../../src/theme';

const logoSource = require('../../assets/images/limkokwing-logo.jpg');

export function AppLogo({ size = 88, showText = true }) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.logoFrame, { width: size * 1.7, minHeight: size * 1.08, borderRadius: size * 0.22 }]}>
        <Image source={logoSource} style={styles.logo} />
      </View>
      {showText ? (
        <View style={styles.textWrap}>
          <Text style={styles.title}>Limkokwing University</Text>
          <Text style={styles.subtitle}>Faculty Reporting System</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 12,
    alignItems: 'flex-start',
  },
  logoFrame: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  textWrap: {
    gap: 4,
  },
  title: {
    color: appTheme.colors.white,
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    color: appTheme.colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
});
