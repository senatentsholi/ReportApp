import React, { useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useAuth } from '../../providers/AuthProvider';
import { useAppData } from '../../hooks/useAppData';
import { useSearch } from '../../hooks/useSearch';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { SectionTitle } from '../../components/dashboard/SectionTitle';
import { InfoCard } from '../../components/dashboard/InfoCard';
import { EmptyState } from '../../components/common/EmptyState';
import { appTheme } from '../../theme';

const inputTheme = {
  colors: {
    primary: appTheme.colors.primary,
    outline: appTheme.colors.border,
    onSurface: appTheme.colors.text,
  },
};

export function PlLecturersScreen() {
  const { user } = useAuth();
  const { data, updateProfile } = useAppData();
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    facultyName: '',
    department: '',
    streamName: '',
  });

  const lecturers = useMemo(
    () => data.users.filter((item) => item.role === 'lecturer'),
    [data.users]
  );
  const filteredLecturers = useSearch(
    lecturers,
    query,
    (item) =>
      `${item.fullName || item.name} ${item.email} ${item.facultyName} ${item.department} ${item.streamName}`
  );

  const resetForm = () => {
    setEditingId(null);
    setForm({
      fullName: '',
      facultyName: '',
      department: '',
      streamName: '',
    });
  };

  const beginEdit = (lecturer) => {
    setEditingId(lecturer.uid);
    setForm({
      fullName: lecturer.fullName || lecturer.name || '',
      facultyName: lecturer.facultyName || '',
      department: lecturer.department || '',
      streamName: lecturer.streamName || '',
    });
  };

  const handleSave = async () => {
    if (!editingId) {
      Alert.alert('Select a lecturer', 'Choose a lecturer from the list before saving updates.');
      return;
    }

    if (!form.fullName.trim() || !form.facultyName.trim() || !form.streamName.trim()) {
      Alert.alert('Missing details', 'Full name, faculty name, and stream are required.');
      return;
    }

    try {
      const payload = {
        fullName: form.fullName.trim(),
        name: form.fullName.trim(),
        facultyName: form.facultyName.trim(),
        department: form.department.trim(),
        streamName: form.streamName.trim(),
      };
      await updateProfile(editingId, payload);
      Alert.alert('Lecturer updated', 'The lecturer assignment details have been saved.');
      resetForm();
    } catch (error) {
      Alert.alert('Unable to update lecturer', error.message || 'Please try again.');
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Lecturers" subtitle="Manage lecturer assignments and stream ownership" user={user} />
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search lecturer, email, faculty, department, or stream" />
      <GlassCard>
        <SectionTitle title={editingId ? 'Update Lecturer' : 'Select Lecturer'} caption="Choose a lecturer from the list to update faculty and stream assignment" />
        <TextInput mode="outlined" label="Full Name" value={form.fullName} onChangeText={(value) => setForm((current) => ({ ...current, fullName: value }))} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Faculty Name" value={form.facultyName} onChangeText={(value) => setForm((current) => ({ ...current, facultyName: value }))} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Department" value={form.department} onChangeText={(value) => setForm((current) => ({ ...current, department: value }))} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Stream / Programme" value={form.streamName} onChangeText={(value) => setForm((current) => ({ ...current, streamName: value }))} style={{ marginTop: 12 }} theme={inputTheme} />
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
          <GradientButton label="Save Lecturer" onPress={handleSave} style={{ flex: 1 }} />
          <GradientButton label="Clear" onPress={resetForm} style={{ flex: 1 }} />
        </View>
      </GlassCard>

      <SectionTitle title="Lecturer Directory" caption="All lecturers registered in the system" />
      {filteredLecturers.length ? (
        filteredLecturers.map((item) => (
          <InfoCard
            key={item.uid}
            title={item.fullName || item.name || item.email}
            meta={item.email}
            description={`Faculty: ${item.facultyName || 'Not set'}. Department: ${item.department || 'Not set'}. Stream: ${item.streamName || 'Not set'}.`}
            rightNode={<GradientButton label="Edit" onPress={() => beginEdit(item)} />}
          />
        ))
      ) : (
        <EmptyState title="No lecturers found" description="Lecturers will appear here after they register." />
      )}
    </ScreenContainer>
  );
}

