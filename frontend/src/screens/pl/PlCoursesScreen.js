import React, { useEffect, useMemo, useState } from 'react';
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
import { OptionSelectorField } from '../../components/forms/OptionSelectorField';
import { appTheme } from '../../theme';
import { getVisibleCourses } from '../../utils/appSelectors';

const inputTheme = {
  colors: {
    primary: appTheme.colors.primary,
    outline: appTheme.colors.border,
    onSurface: appTheme.colors.text,
  },
};

export function PlCoursesScreen() {
  const { user } = useAuth();
  const { data, saveCourse, updateCourse, deleteCourse } = useAppData();
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState(null);

  const lecturers = useMemo(() => data.users.filter((item) => item.role === 'lecturer'), [data.users]);
  const prls = useMemo(() => data.users.filter((item) => item.role === 'prl'), [data.users]);
  const lecturerOptions = useMemo(
    () =>
      lecturers.map((item) => ({
        value: item.uid,
        label: item.fullName || item.name || item.email,
      })),
    [lecturers]
  );
  const prlOptions = useMemo(
    () =>
      prls.map((item) => ({
        value: item.uid,
        label: item.fullName || item.name || item.email,
      })),
    [prls]
  );

  const buildInitialForm = () => ({
    courseName: '',
    courseCode: '',
    facultyName: '',
    streamName: user.streamName || '',
    assignedLecturerId: lecturers[0]?.uid || '',
    assignedLecturerName: lecturers[0]?.fullName || '',
    principalLecturerId: prls[0]?.uid || '',
    principalLecturerName: prls[0]?.fullName || '',
    classNames: [],
  });

  const [form, setForm] = useState(buildInitialForm);

  const courses = getVisibleCourses(data.courses, user);
  const filtered = useSearch(
    courses,
    query,
    (item) => `${item.courseCode} ${item.courseName} ${item.assignedLecturerName} ${item.principalLecturerName}`
  );

  useEffect(() => {
    if (!editingId && (!form.assignedLecturerId || !form.principalLecturerId) && (lecturers.length || prls.length)) {
      setForm({
        courseName: '',
        courseCode: '',
        facultyName: '',
        streamName: user.streamName || '',
        assignedLecturerId: lecturers[0]?.uid || '',
        assignedLecturerName: lecturers[0]?.fullName || '',
        principalLecturerId: prls[0]?.uid || '',
        principalLecturerName: prls[0]?.fullName || '',
        classNames: [],
      });
    }
  }, [editingId, form.assignedLecturerId, form.principalLecturerId, lecturers, prls, user.streamName]);

  const resetForm = () => {
    setEditingId(null);
    setForm(buildInitialForm());
  };

  const updateField = (field, value) => {
    if (field === 'assignedLecturerId') {
      const selectedLecturer = lecturers.find((item) => item.uid === value);
      setForm((current) => ({
        ...current,
        assignedLecturerId: value,
        assignedLecturerName: selectedLecturer?.fullName || selectedLecturer?.name || '',
      }));
      return;
    }

    if (field === 'principalLecturerId') {
      const selectedPrl = prls.find((item) => item.uid === value);
      setForm((current) => ({
        ...current,
        principalLecturerId: value,
        principalLecturerName: selectedPrl?.fullName || selectedPrl?.name || '',
      }));
      return;
    }

    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async () => {
    try {
      if (!form.assignedLecturerId || !form.assignedLecturerName) {
        Alert.alert('Lecturer required', 'Please choose the lecturer assigned to this course.');
        return;
      }

      if (!form.principalLecturerId || !form.principalLecturerName) {
        Alert.alert('PRL required', 'Please choose the principal lecturer for this course.');
        return;
      }

      const payload = {
        ...form,
        classNames: form.classNames
          .join(',')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      };

      if (editingId) {
        await updateCourse(editingId, payload);
        Alert.alert('Course updated', 'The course record has been updated.');
      } else {
        await saveCourse(payload);
        Alert.alert('Course added', 'The course has been added.');
      }

      resetForm();
    } catch (error) {
      Alert.alert('Course not saved', error.message || 'Please check the form and try again.');
    }
  };

  const beginEdit = (item) => {
    setEditingId(item.id);
    setForm({
      courseName: item.courseName || '',
      courseCode: item.courseCode || '',
      facultyName: item.facultyName || '',
      streamName: item.streamName || '',
      assignedLecturerId: item.assignedLecturerId || '',
      assignedLecturerName: item.assignedLecturerName || '',
      principalLecturerId: item.principalLecturerId || '',
      principalLecturerName: item.principalLecturerName || '',
      classNames: item.classNames || [],
    });
  };

  const handleDelete = (item) => {
    Alert.alert('Delete course', `Remove ${item.courseCode} - ${item.courseName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteCourse(item.id);
          if (editingId === item.id) {
            resetForm();
          }
        },
      },
    ]);
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Manage Courses" subtitle="Add, update, and assign lecturer modules" user={user} />
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search courses, lecturers, PRLs, or course codes" />
      <GlassCard>
        <SectionTitle title={editingId ? 'Update Course' : 'Add Course'} caption="Maintain the faculty course allocation list" />
        <TextInput mode="outlined" label="Course Name" value={form.courseName} onChangeText={(value) => updateField('courseName', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Course Code" value={form.courseCode} onChangeText={(value) => updateField('courseCode', value.toUpperCase())} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Faculty Name" value={form.facultyName} onChangeText={(value) => updateField('facultyName', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Stream / Programme" value={form.streamName} onChangeText={(value) => updateField('streamName', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <OptionSelectorField label="Assigned Lecturer" options={lecturerOptions} selectedValue={form.assignedLecturerId} onChange={(value) => updateField('assignedLecturerId', value)} />
        <TextInput mode="outlined" label="Lecturer Name" value={form.assignedLecturerName} onChangeText={(value) => updateField('assignedLecturerName', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <OptionSelectorField label="Principal Lecturer" options={prlOptions} selectedValue={form.principalLecturerId} onChange={(value) => updateField('principalLecturerId', value)} />
        <TextInput mode="outlined" label="PRL Name" value={form.principalLecturerName} onChangeText={(value) => updateField('principalLecturerName', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput
          mode="outlined"
          label="Class Names (comma separated)"
          value={form.classNames.join(', ')}
          onChangeText={(value) => updateField('classNames', value.split(','))}
          style={{ marginTop: 12 }}
          theme={inputTheme}
        />
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
          <GradientButton label={editingId ? 'Update Course' : 'Add Course'} onPress={handleSave} style={{ flex: 1 }} />
          <GradientButton label="Clear" onPress={resetForm} style={{ flex: 1 }} />
        </View>
      </GlassCard>

      <SectionTitle title="Registered Lecturers" caption="Use this list while assigning courses and classes" />
      {lecturers.length ? (
        lecturers.map((lecturer) => (
          <InfoCard
            key={lecturer.uid}
            title={lecturer.fullName || lecturer.name || lecturer.email}
            meta={lecturer.email || 'No email saved'}
            description={`Faculty: ${lecturer.facultyName || 'Not set'}. Department: ${lecturer.department || 'Not set'}. Stream: ${lecturer.streamName || 'Not set'}.`}
          />
        ))
      ) : (
        <EmptyState title="No lecturers registered" description="Registered lecturers will appear here and in the assignment picker." />
      )}

      <SectionTitle title="Course List" caption="Assigned lecturer and PRL for each course" />
      {filtered.length ? (
        filtered.map((item) => (
          <InfoCard
            key={item.id}
            title={`${item.courseCode} - ${item.courseName}`}
            meta={`Lecturer: ${item.assignedLecturerName || 'Not assigned'}`}
            description={`PRL: ${item.principalLecturerName || 'Not assigned'}. Stream: ${item.streamName || 'Not set'}. Classes: ${(item.classNames || []).join(', ') || 'Not yet linked'}.`}
            rightNode={
              <View style={{ gap: 8 }}>
                <GradientButton label="Edit" onPress={() => beginEdit(item)} />
                <GradientButton label="Delete" onPress={() => handleDelete(item)} />
              </View>
            }
          />
        ))
      ) : (
        <EmptyState title="No courses found" description="Add a course to populate the faculty course list." />
      )}
    </ScreenContainer>
  );
}

