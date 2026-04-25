import React, { useMemo, useState } from 'react';
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

const inputTheme = {
  colors: {
    primary: appTheme.colors.primary,
    outline: appTheme.colors.border,
    onSurface: '#FFFFFF',
    onSurfaceVariant: appTheme.colors.textMuted,
  },
};

export function PlClassesScreen() {
  const { user } = useAuth();
  const { data, saveClass, updateClass, deleteClass } = useAppData();
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState(null);

  const courses = useMemo(() => data.courses, [data.courses]);

  const buildInitialForm = () => ({
    className: '',
    courseId: courses[0]?.id || '',
    courseCode: courses[0]?.courseCode || '',
    courseName: courses[0]?.courseName || '',
    lecturerId: courses[0]?.assignedLecturerId || '',
    lecturerName: courses[0]?.assignedLecturerName || '',
    venue: '',
    lectureTime: '',
    totalRegisteredStudents: '',
  });

  const [form, setForm] = useState(buildInitialForm);

  const filtered = useSearch(
    data.classes,
    query,
    (item) => `${item.className} ${item.courseCode} ${item.courseName} ${item.lecturerName} ${item.venue}`
  );

  const updateField = (field, value) => {
    if (field === 'courseId') {
      const course = courses.find((item) => item.id === value);
      setForm((current) => ({
        ...current,
        courseId: value,
        courseCode: course?.courseCode || '',
        courseName: course?.courseName || '',
        lecturerId: course?.assignedLecturerId || '',
        lecturerName: course?.assignedLecturerName || '',
      }));
      return;
    }

    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(buildInitialForm());
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        totalRegisteredStudents: Number(form.totalRegisteredStudents || 0),
      };

      if (editingId) {
        await updateClass(editingId, payload);
        Alert.alert('Class updated', 'The class record has been updated.');
      } else {
        await saveClass(payload);
        Alert.alert('Class added', 'The new class has been added successfully.');
      }

      resetForm();
    } catch (error) {
      Alert.alert('Unable to save class', error.message || 'Please review the class form and try again.');
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      className: item.className || '',
      courseId: item.courseId || '',
      courseCode: item.courseCode || '',
      courseName: item.courseName || '',
      lecturerId: item.lecturerId || '',
      lecturerName: item.lecturerName || '',
      venue: item.venue || '',
      lectureTime: item.lectureTime || '',
      totalRegisteredStudents: String(item.totalRegisteredStudents || ''),
    });
  };

  const handleDelete = (item) => {
    Alert.alert('Delete class', `Remove ${item.courseCode} - ${item.className}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteClass(item.id);
          if (editingId === item.id) {
            resetForm();
          }
        },
      },
    ]);
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Classes" subtitle="Create and maintain class records" user={user} />
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search classes, venues, lecturers, or course codes" />

      <GlassCard>
        <SectionTitle title="Class Setup" caption="Create or update a class under the faculty schedule" />
        <TextInput mode="outlined" label="Class Name" value={form.className} onChangeText={(value) => updateField('className', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Course ID" value={form.courseId} onChangeText={(value) => updateField('courseId', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Course Code" value={form.courseCode} onChangeText={(value) => updateField('courseCode', value.toUpperCase())} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Course Name" value={form.courseName} onChangeText={(value) => updateField('courseName', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Lecturer UID" value={form.lecturerId} onChangeText={(value) => updateField('lecturerId', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Lecturer Name" value={form.lecturerName} onChangeText={(value) => updateField('lecturerName', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Venue" value={form.venue} onChangeText={(value) => updateField('venue', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Lecture Time" value={form.lectureTime} onChangeText={(value) => updateField('lectureTime', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Registered Students" value={form.totalRegisteredStudents} onChangeText={(value) => updateField('totalRegisteredStudents', value)} style={{ marginTop: 12 }} theme={inputTheme} />

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
          <GradientButton label={editingId ? 'Update Class' : 'Add Class'} onPress={handleSave} style={{ flex: 1 }} />
          <GradientButton label="Clear" onPress={resetForm} style={{ flex: 1 }} />
        </View>
      </GlassCard>

      <SectionTitle title="Scheduled Classes" caption="Current class records across the faculty" />
      {filtered.length ? (
        filtered.map((item) => (
          <InfoCard
            key={item.id}
            title={`${item.courseCode} - ${item.className}`}
            meta={`${item.lectureTime} - ${item.venue}`}
            description={`Lecturer: ${item.lecturerName || 'Not assigned'}. Registered students: ${item.totalRegisteredStudents}.`}
            rightNode={
              <View style={{ gap: 8 }}>
                <GradientButton label="Edit" onPress={() => startEdit(item)} />
                <GradientButton label="Delete" onPress={() => handleDelete(item)} />
              </View>
            }
          />
        ))
      ) : (
        <EmptyState title="No classes found" description="Add a class to populate the class schedule." />
      )}
    </ScreenContainer>
  );
}
