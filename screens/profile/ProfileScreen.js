import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../src/providers/AuthProvider';
import { useAppData } from '../../hooks/useAppData';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { useThemePreference } from '../../src/providers/ThemeProvider';
import { appTheme } from '../../src/theme';

const fallbackLogo = require('../../assets/images/limkokwing-logo.jpg');

function formatRole(role) {
  const normalizedRole = String(role || '').trim().toLowerCase();

  if (normalizedRole === 'prl') {
    return 'PRL';
  }

  if (normalizedRole === 'pl') {
    return 'PL';
  }

  return normalizedRole ? normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1) : '';
}

export function ProfileScreen() {
  const navigation = useNavigation();
  const { user, signOut, updateUserProfile } = useAuth();
  const { updateProfile, uploadProfilePhoto } = useAppData();
  const { isDarkMode, toggleDarkMode } = useThemePreference();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [facultyName, setFacultyName] = useState(user?.facultyName || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [streamName, setStreamName] = useState(user?.streamName || '');
  const [className, setClassName] = useState(user?.className || '');
  const [avatarUri, setAvatarUri] = useState(user?.avatarUrl || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const choosePhoto = async () => {
    try {
      setUploading(true);
      const nextPhoto = await uploadProfilePhoto();
      if (nextPhoto) {
        setAvatarUri(nextPhoto);
      }
    } catch (error) {
      Alert.alert('Unable to update photo', error.message || 'Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async () => {
    if (!fullName.trim()) {
      Alert.alert('Missing name', 'Please enter your full name before saving your profile.');
      return;
    }

    const payload = {
      name: fullName.trim(),
      fullName: fullName.trim(),
      avatarUrl: avatarUri,
      facultyName: facultyName.trim(),
      department: department.trim(),
      streamName: streamName.trim(),
      className: className.trim(),
      darkMode: isDarkMode,
    };

    try {
      setSaving(true);
      await updateProfile(user.uid, payload);
      updateUserProfile(payload);
      Alert.alert('Profile updated', 'Your profile changes have been saved.');
    } catch (error) {
      Alert.alert('Unable to save profile', error.message || 'Please review your profile details and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer>
      <Pressable onPress={() => navigation.goBack()} style={styles.backLink}>
        <Text style={styles.backText}>Back to dashboard</Text>
      </Pressable>
      <ScreenHeader title="Profile" subtitle="Manage account preferences" user={user} />
      <GlassCard>
        <View style={styles.avatarWrap}>
          <Image source={avatarUri ? { uri: avatarUri } : fallbackLogo} style={styles.avatar} />
          <Pressable onPress={choosePhoto}>
            <Text style={styles.link}>{uploading ? 'Opening photo library...' : 'Choose profile photo'}</Text>
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
          label="Email"
          value={user.email}
          disabled
          style={styles.input}
          theme={{ colors: { primary: appTheme.colors.primary, outline: appTheme.colors.border, onSurface: '#FFFFFF' } }}
        />
        <TextInput
          mode="outlined"
          label="Role"
          value={formatRole(user.role)}
          disabled
          style={styles.input}
          theme={{ colors: { primary: appTheme.colors.primary, outline: appTheme.colors.border, onSurface: '#FFFFFF' } }}
        />
        <TextInput
          mode="outlined"
          label="Faculty Name"
          value={facultyName}
          onChangeText={setFacultyName}
          style={styles.input}
          theme={{ colors: { primary: appTheme.colors.primary, outline: appTheme.colors.border, onSurface: '#FFFFFF' } }}
        />
        <TextInput
          mode="outlined"
          label="Department"
          value={department}
          onChangeText={setDepartment}
          style={styles.input}
          theme={{ colors: { primary: appTheme.colors.primary, outline: appTheme.colors.border, onSurface: '#FFFFFF' } }}
        />
        <TextInput
          mode="outlined"
          label="Stream / Programme"
          value={streamName}
          onChangeText={setStreamName}
          style={styles.input}
          theme={{ colors: { primary: appTheme.colors.primary, outline: appTheme.colors.border, onSurface: '#FFFFFF' } }}
        />
        <TextInput
          mode="outlined"
          label="Class Name"
          value={className}
          onChangeText={setClassName}
          style={styles.input}
          theme={{ colors: { primary: appTheme.colors.primary, outline: appTheme.colors.border, onSurface: '#FFFFFF' } }}
        />
        <View style={styles.row}>
          <Text style={styles.label}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        </View>
        <GradientButton label={saving ? 'Saving Profile...' : 'Save Profile'} onPress={saveProfile} />
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
  backLink: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  backText: {
    color: appTheme.colors.accent,
    fontWeight: '800',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: '#000000',
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
