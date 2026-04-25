import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useAuth } from '../../src/providers/AuthProvider';
import { useAppData } from '../../hooks/useAppData';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { useThemePreference } from '../../src/providers/ThemeProvider';
import { appTheme } from '../../src/theme';

const fallbackLogo = require('../../assets/images/icon.png');

export function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { updateProfile, uploadProfilePhoto } = useAppData();
  const { isDarkMode, toggleDarkMode } = useThemePreference();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [avatarUri, setAvatarUri] = useState(user?.avatarUrl || '');

  const choosePhoto = async () => {
    const nextPhoto = await uploadProfilePhoto();
    if (nextPhoto) {
      setAvatarUri(nextPhoto);
    }
  };

  const saveProfile = async () => {
    await updateProfile(user.uid, {
      name: fullName,
      fullName,
      avatarUrl: avatarUri,
      darkMode: isDarkMode,
    });
    Alert.alert('Profile updated', 'Your profile changes have been saved.');
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Profile" subtitle="Manage account preferences" user={user} />
      <GlassCard>
        <View style={styles.avatarWrap}>
          <Image source={avatarUri ? { uri: avatarUri } : fallbackLogo} style={styles.avatar} />
          <Pressable onPress={choosePhoto}>
            <Text style={styles.link}>Choose profile photo</Text>
          </Pressable>
        </View>
        <TextInput
          mode="outlined"
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
          theme={{ colors: { primary: appTheme.colors.primary, outline: appTheme.colors.border, onSurface: '#FFFFFF' } }}
        />
        <TextInput
          mode="outlined"
          label="Role"
          value={user.role}
          disabled
          style={styles.input}
          theme={{ colors: { primary: appTheme.colors.primary, outline: appTheme.colors.border, onSurface: '#FFFFFF' } }}
        />
        <View style={styles.row}>
          <Text style={styles.label}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        </View>
        <GradientButton label="Save Profile" onPress={saveProfile} />
        <Pressable style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </GlassCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  avatarWrap: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 28,
  },
  link: {
    color: appTheme.colors.accent,
    fontWeight: '700',
  },
  input: {
    backgroundColor: 'transparent',
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  logoutButton: {
    marginTop: 12,
    minHeight: 48,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
