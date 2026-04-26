import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
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

export function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing details', 'Enter your email, password, and role to continue.');
      return;
    }

    try {
      setLoading(true);
      await signIn({ email, password, role });
    } catch (error) {
      Alert.alert('Login failed', error.message || 'Please check your role and credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppBackground>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        >
          <View style={styles.header}>
            <AppLogo />
            <Text style={styles.welcome}>Welcome Back</Text>
          </View>

          <GlassCard>
            <Text style={styles.sectionLabel}>Role</Text>
            <AuthRoleSelector value={role} onChange={setRole} />

            <View style={styles.form}>
              <TextInput
                mode="outlined"
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
                theme={inputTheme}
              />
              <TextInput
                mode="outlined"
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secure}
                style={styles.input}
                theme={inputTheme}
                right={<TextInput.Icon icon={secure ? 'eye-off' : 'eye'} onPress={() => setSecure((current) => !current)} />}
              />
            </View>

            <GradientButton label={loading ? 'Signing In...' : 'Login'} onPress={handleLogin} />

            <View style={styles.linkRow}>
              <Text style={styles.linkAccent} onPress={() => navigation.navigate('Register')}>
                Register
              </Text>
            </View>
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingTop: 72,
    paddingBottom: 32,
    gap: 18,
  },
  header: {
    gap: 10,
  },
  welcome: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
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
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 12,
  },
  linkAccent: {
    color: appTheme.colors.accent,
    fontWeight: '800',
  },
});
