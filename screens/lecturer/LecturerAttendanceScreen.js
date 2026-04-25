import React, { useEffect, useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useAuth } from '../../src/providers/AuthProvider';
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
import { appTheme } from '../../src/theme';
import { getUserClassRecords, getVisibleAttendance } from '../../utils/appSelectors';

const inputTheme = {
  colors: {
    primary: appTheme.colors.primary,
    outline: appTheme.colors.border,
    onSurface: '#FFFFFF',
  },
};

function todayValue() {
  return new Date().toISOString().slice(0, 10);
}

export function LecturerAttendanceScreen() {
  const { user } = useAuth();
  const { data, saveAttendance, updateAttendance, deleteAttendance } = useAppData();
  const [query, setQuery] = useState('');
  const classes = getUserClassRecords(data.classes, data.courses, user);
  const visibleAttendance = getVisibleAttendance(data.attendance, classes, user);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    studentId: '',
    studentName: '',
    classId: classes[0]?.id || '',
    className: classes[0]?.className || '',
    lecturerId: user.uid,
    date: todayValue(),
    status: 'Present',
  });

  const selectedClass = useMemo(() => classes.find((item) => item.id === form.classId), [classes, form.classId]);
  const filtered = useSearch(
    visibleAttendance,
    query,
    (item) => `${item.studentId} ${item.studentName} ${item.className} ${item.date} ${item.status}`
  );

  useEffect(() => {
    if (!editingId && !form.classId && classes.length) {
      setForm((current) => ({
        ...current,
        classId: classes[0]?.id || '',
        className: classes[0]?.className || '',
      }));
    }
  }, [classes, editingId, form.classId]);

  const updateField = (field, value) => {
    if (field === 'classId') {
      const nextClass = classes.find((item) => item.id === value);
      setForm((current) => ({
        ...current,
        classId: value,
        className: nextClass?.className || '',
      }));
      return;
    }

    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      studentId: '',
      studentName: '',
      classId: classes[0]?.id || '',
      className: classes[0]?.className || '',
      lecturerId: user.uid,
      date: todayValue(),
      status: 'Present',
    });
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateAttendance(editingId, form);
        Alert.alert('Attendance updated', 'Attendance has been updated for the selected class.');
      } else {
        await saveAttendance(form);
        Alert.alert('Attendance saved', 'Attendance has been recorded for the selected class.');
      }

      resetForm();
    } catch (error) {
      Alert.alert('Unable to save attendance', error.message || 'Please review the attendance form and try again.');
    }
  };

  const beginEdit = (item) => {
    setEditingId(item.id);
    setForm({
      studentId: item.studentId,
      studentName: item.studentName,
      classId: item.classId,
      className: item.className,
      lecturerId: item.lecturerId,
      date: item.date,
      status: item.status,
    });
  };

  const handleDelete = (item) => {
    Alert.alert('Delete attendance record', `Delete attendance for ${item.studentName} on ${item.date}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteAttendance(item.id);
          if (editingId === item.id) {
            resetForm();
          }
        },
      },
    ]);
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Attendance Register" subtitle="Capture student attendance" user={user} />
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search attendance by student, class, date, or status" />
      <GlassCard>
        <SectionTitle title={editingId ? 'Update Attendance' : 'Capture Attendance'} caption="Mark each student as present, late, or absent" />
        <TextInput mode="outlined" label="Student ID" value={form.studentId} onChangeText={(value) => updateField('studentId', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Student Name" value={form.studentName} onChangeText={(value) => updateField('studentName', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Class ID" value={form.classId} onChangeText={(value) => updateField('classId', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Class Name" value={form.className} onChangeText={(value) => updateField('className', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Date" value={form.date} onChangeText={(value) => updateField('date', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Status (Present/Late/Absent)" value={form.status} onChangeText={(value) => updateField('status', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
          <GradientButton label={editingId ? 'Update Attendance' : 'Save Attendance'} onPress={handleSave} style={{ flex: 1 }} />
          <GradientButton label="Clear" onPress={resetForm} style={{ flex: 1 }} />
        </View>
      </GlassCard>

      <SectionTitle title="Attendance History" caption={selectedClass ? `${selectedClass.className} - ${selectedClass.lectureTime}` : 'Recorded attendance feed'} />
      {filtered.length ? (
        filtered.map((item) => (
          <InfoCard
            key={item.id}
            title={`${item.studentName} - ${item.date}`}
            meta={`${item.status} - ${item.className}`}
            description={`Student ID: ${item.studentId}. Class ID: ${item.classId}.`}
            rightNode={
              <View style={{ gap: 8 }}>
                <GradientButton label="Edit" onPress={() => beginEdit(item)} />
                <GradientButton label="Delete" onPress={() => handleDelete(item)} />
              </View>
            }
          />
        ))
      ) : (
        <EmptyState title="No attendance records" description="Attendance records will appear here after you save them." />
      )}
    </ScreenContainer>
  );
}
