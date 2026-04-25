import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useAuth } from '../../src/providers/AuthProvider';
import { useAppData } from '../../hooks/useAppData';
import { useSearch } from '../../hooks/useSearch';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { SectionTitle } from '../../components/dashboard/SectionTitle';
import { InfoCard } from '../../components/dashboard/InfoCard';
import { EmptyState } from '../../components/common/EmptyState';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { appTheme } from '../../src/theme';
import { getVisibleMonitoring } from '../../utils/appSelectors';

const inputTheme = {
  colors: {
    primary: appTheme.colors.primary,
    outline: appTheme.colors.border,
    onSurface: '#FFFFFF',
    onSurfaceVariant: appTheme.colors.textMuted,
  },
};

export function MonitoringScreen() {
  const { user } = useAuth();
  const { data, saveMonitoring, updateMonitoring, deleteMonitoring } = useAppData();
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    progress: '',
    action: '',
    riskLevel: 'Moderate',
  });

  const isEditableRole = user.role !== 'student';
  const visibleMonitoring = getVisibleMonitoring(data.monitoring, user);
  const filtered = useSearch(
    visibleMonitoring,
    query,
    (item) => `${item.title} ${item.progress} ${item.action} ${item.riskLevel} ${item.ownerRole}`
  );

  const resetForm = () => {
    setEditingId(null);
    setForm({
      title: '',
      progress: '',
      action: '',
      riskLevel: 'Moderate',
    });
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        ownerId: user.uid,
        ownerRole: user.role,
        facultyName: user.facultyName || user.department,
        streamName: user.streamName || '',
        className: user.className || '',
      };

      if (editingId) {
        await updateMonitoring(editingId, payload);
        Alert.alert('Monitoring updated', 'The monitoring note has been updated.');
      } else {
        await saveMonitoring(payload);
        Alert.alert('Monitoring saved', 'The monitoring note has been added.');
      }

      resetForm();
    } catch (error) {
      Alert.alert('Unable to save monitoring note', error.message || 'Please review the form and try again.');
    }
  };

  const beginEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      progress: item.progress,
      action: item.action,
      riskLevel: item.riskLevel,
    });
  };

  const handleDelete = (item) => {
    Alert.alert('Delete monitoring note', `Remove "${item.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteMonitoring(item.id);
          if (editingId === item.id) {
            resetForm();
          }
        },
      },
    ]);
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Monitoring" subtitle="Academic oversight and intervention notes" user={user} />
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search monitoring notes, actions, or risk levels" />

      {isEditableRole ? (
        <GlassCard>
          <SectionTitle
            title={editingId ? 'Update Monitoring Note' : 'Add Monitoring Note'}
            caption="Record intervention points and follow-up actions"
          />
          <TextInput mode="outlined" label="Title" value={form.title} onChangeText={(value) => setForm((current) => ({ ...current, title: value }))} style={{ marginTop: 12 }} theme={inputTheme} />
          <TextInput mode="outlined" label="Progress Summary" value={form.progress} onChangeText={(value) => setForm((current) => ({ ...current, progress: value }))} style={{ marginTop: 12 }} multiline theme={inputTheme} />
          <TextInput mode="outlined" label="Action Required" value={form.action} onChangeText={(value) => setForm((current) => ({ ...current, action: value }))} style={{ marginTop: 12 }} multiline theme={inputTheme} />
          <TextInput mode="outlined" label="Risk Level" value={form.riskLevel} onChangeText={(value) => setForm((current) => ({ ...current, riskLevel: value }))} style={{ marginTop: 12 }} theme={inputTheme} />
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
            <GradientButton label={editingId ? 'Update' : 'Save'} onPress={handleSave} style={{ flex: 1 }} />
            <GradientButton label="Clear" onPress={resetForm} style={{ flex: 1 }} />
          </View>
        </GlassCard>
      ) : null}

      <SectionTitle title="Monitoring Records" caption="Shared oversight updates across the faculty workflow" />
      {filtered.length ? (
        filtered.map((item) => {
          const canEdit = isEditableRole && (user.role === 'pl' || item.ownerId === user.uid);

          return (
            <InfoCard
              key={item.id}
              title={item.title}
              meta={`${item.riskLevel} risk - ${item.ownerRole}`}
              description={`${item.progress} Action: ${item.action}`}
              rightNode={
                canEdit ? (
                  <View style={{ gap: 8 }}>
                    <GradientButton label="Edit" onPress={() => beginEdit(item)} />
                    <GradientButton label="Delete" onPress={() => handleDelete(item)} />
                  </View>
                ) : null
              }
            />
          );
        })
      ) : (
        <EmptyState title="No monitoring items" description="Monitoring records will appear here as they are added." />
      )}
    </ScreenContainer>
  );
}
