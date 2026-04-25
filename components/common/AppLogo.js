import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { appTheme } from '../../src/theme';

const logoSource = require('../../assets/images/icon.png');

export function AppLogo({ size = 72, showText = true }) {
  return (
    <View style={styles.row}>
      <Image source={logoSource} style={[styles.logo, { width: size, height: size, borderRadius: size / 4 }]} />
      {showText ? (
        <View style={styles.textWrap}>
          <Text style={styles.title}>LUCT Faculty</Text>
          <Text style={styles.subtitle}>Reporting System</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  logo: {
    resizeMode: 'cover',
  },
  textWrap: {
    gap: 3,
  },
  title: {
    color: appTheme.colors.white,
    fontSize: 21,
    fontWeight: '800',
  },
  subtitle: {
    color: appTheme.colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
});
