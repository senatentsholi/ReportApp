import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { appTheme } from '../../theme';

const logoSource = require('../../../../assets/images/limkokwing-logo.jpg');

export function AppLogo({ size = 88, showText = true }) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.logoFrame, { width: size * 1.7, minHeight: size * 1.08, borderRadius: size * 0.22 }]}>
        <Image source={logoSource} style={styles.logo} />
      </View>
      {showText ? (
        <View style={styles.textWrap}>
          <Text style={styles.title}>Limkokwing University</Text>
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: appTheme.colors.border,
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
    color: appTheme.colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
});

