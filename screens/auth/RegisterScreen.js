import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { AppBackground } from '../../components/common/AppBackground';
import { AppLogo } from '../../components/common/AppLogo';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { AuthRoleSelector } from '../../components/forms/AuthRoleSelector';
import { useAuth } from '../../src/providers/AuthProvider';
import { appTheme } from '../../src/theme';

const inputTheme = {
  colors: {
    primary: appTheme.colors.primary,
    outline: appTheme.colors.border,
    onSurfaceVariant: appTheme.colors.textMuted,
    onSurface: appTheme.colors.text,
    background: 'rgba(255,255,255,0.03)',
  },
};

export function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleRegister = async () => {
    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      Alert.alert('Incomplete form', 'Please complete all required registration fields.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert('Password mismatch', 'Password and confirm password must match.');
      return;
    }

    try {
      setLoading(true);
      await register(form);
    } catch (error) {
      Alert.alert('Registration failed', error.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppBackground>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <AppLogo />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Register and store your role in Firebase Authentication and Firestore.</Text>
        </View>

        <GlassCard>
          <Text style={styles.sectionLabel}>Register As</Text>
          <AuthRoleSelector value={form.role} onChange={(value) => updateField('role', value)} />

          <View style={styles.form}>
            <TextInput mode="outlined" label="Full Name" value={form.fullName} onChangeText={(value) => updateField('fullName', value)} style={styles.input} theme={inputTheme} />
            <TextInput mode="outlined" label="Email" value={form.email} onChangeText={(value) => updateField('email', value)} autoCapitalize="none" keyboardType="email-address" style={styles.input} theme={inputTheme} />
            <TextInput mode="outlined" label="Password" value={form.password} onChangeText={(value) => updateField('password', value)} secureTextEntry style={styles.input} theme={inputTheme} />
            <TextInput mode="outlined" label="Confirm Password" value={form.confirmPassword} onChangeText={(value) => updateField('confirmPassword', value)} secureTextEntry style={styles.input} theme={inputTheme} />
          </View>

          <GradientButton label={loading ? 'Creating...' : 'Create Account'} onPress={handleRegister} />

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Text style={styles.footerLink} onPress={() => navigation.goBack()}>
              Login
            </Text>
          </View>
        </GlassCard>
      </ScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 64,
    paddingBottom: 32,
    gap: 18,
  },
  header: {
    gap: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
  },
  subtitle: {
    color: appTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  sectionLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
  },
  form: {
    gap: 14,
    marginTop: 18,
    marginBottom: 18,
  },
  input: {
    backgroundColor: 'transparent',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
  },
  footerText: {
    color: appTheme.colors.textMuted,
    fontWeight: '600',
  },
  footerLink: {
    color: appTheme.colors.accent,
    fontWeight: '800',
  },
});
