import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { AppBackground } from '../../components/common/AppBackground';
import { AppLogo } from '../../components/common/AppLogo';
import { useAuth } from '../../src/providers/AuthProvider';
import { appTheme } from '../../src/theme';

export function SplashScreen() {
  const { setBootstrapped } = useAuth();
  const fade = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(lift, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      setBootstrapped(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, [fade, lift, setBootstrapped]);

  return (
    <AppBackground>
      <View style={styles.container}>
        <Animated.View style={{ opacity: fade, transform: [{ translateY: lift }] }}>
          <AppLogo size={88} />
        </Animated.View>
        <Text style={styles.tagline}>Faculty reporting, attendance tracking, and academic monitoring in one app</Text>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    padding: 24,
  },
  tagline: {
    color: appTheme.colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
});
