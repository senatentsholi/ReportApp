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
import { getStudentsForClass, getUserClassRecords, getVisibleAttendance } from '../../utils/appSelectors';

const inputTheme = {
  colors: {
    primary: appTheme.colors.primary,
    outline: appTheme.colors.border,
    onSurface: appTheme.colors.text,
    onSurfaceVariant: appTheme.colors.textMuted,
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
    studentNumber: '',
    classId: classes[0]?.id || '',
    className: classes[0]?.className || '',
    lecturerId: user.uid,
    date: todayValue(),
    status: 'Present',
  });

  const selectedClass = useMemo(() => classes.find((item) => item.id === form.classId), [classes, form.classId]);
  const availableStudents = useMemo(() => getStudentsForClass(data.users, selectedClass), [data.users, selectedClass]);
  const classOptions = useMemo(
    () =>
      classes.map((item) => ({
        value: item.id,
        label: `${item.className} - ${item.courseCode || 'Course'}`,
      })),
    [classes]
  );
  const studentOptions = useMemo(
    () =>
      availableStudents.map((item) => ({
        value: item.uid,
        label: `${item.studentNumber || item.uid} - ${item.fullName || item.name}`,
      })),
    [availableStudents]
  );
  const statusOptions = useMemo(
    () => ['Present', 'Late', 'Absent'].map((item) => ({ value: item, label: item })),
    []
  );
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
        studentId: '',
        studentName: '',
        studentNumber: '',
        classId: value,
        className: nextClass?.className || '',
      }));
      return;
    }

    if (field === 'studentId') {
      const selectedStudent = availableStudents.find((item) => item.uid === value);
      setForm((current) => ({
        ...current,
        studentId: value,
        studentName: selectedStudent?.fullName || selectedStudent?.name || '',
        studentNumber: selectedStudent?.studentNumber || selectedStudent?.uid || '',
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
      studentNumber: '',
      classId: classes[0]?.id || '',
      className: classes[0]?.className || '',
      lecturerId: user.uid,
      date: todayValue(),
      status: 'Present',
    });
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        studentId: form.studentId || form.studentNumber.trim(),
        studentName: form.studentName.trim(),
        studentNumber: form.studentNumber.trim(),
        className: form.className.trim(),
        date: form.date.trim(),
        lecturerId: user.uid,
        lecturerName: user.fullName || user.name || '',
        studentNumber: form.studentNumber.trim() || form.studentId,
        facultyName: selectedClass?.facultyName || '',
        streamName: selectedClass?.streamName || '',
        courseId: selectedClass?.courseId || '',
        courseCode: selectedClass?.courseCode || '',
        courseName: selectedClass?.courseName || '',
      };

      if (editingId) {
        await updateAttendance(editingId, payload);
        Alert.alert('Attendance updated', 'Attendance has been updated for the selected class.');
      } else {
        await saveAttendance(payload);
        Alert.alert('Attendance saved', 'Attendance has been recorded.');
      }

      resetForm();
    } catch (error) {
      Alert.alert('Attendance not saved', error.message || 'Please check the form and try again.');
    }
  };

  const beginEdit = (item) => {
    setEditingId(item.id);
    setForm({
      studentId: item.studentId,
      studentName: item.studentName,
      studentNumber: item.studentNumber || item.studentId,
      classId: item.classId,
      className: item.className,
      lecturerId: item.lecturerId || user.uid,
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
        <OptionSelectorField
          label="Select Class"
          helperText="Choose the class first so the linked course and stream data stay correct."
          options={classOptions}
          selectedValue={form.classId}
          onChange={(value) => updateField('classId', value)}
        />
        <OptionSelectorField
          label="Select Student"
          helperText="Students are pulled from registered student accounts in the same class or stream."
          options={studentOptions}
          selectedValue={form.studentId}
          onChange={(value) => updateField('studentId', value)}
        />
        <TextInput mode="outlined" label="Student Number" value={form.studentNumber} onChangeText={(value) => updateField('studentNumber', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Student Name" value={form.studentName} onChangeText={(value) => updateField('studentName', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Class Name" value={form.className} onChangeText={(value) => updateField('className', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Date" value={form.date} onChangeText={(value) => updateField('date', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <OptionSelectorField label="Attendance Status" options={statusOptions} selectedValue={form.status} onChange={(value) => updateField('status', value)} />
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
          <GradientButton label={editingId ? 'Update Attendance' : 'Save Attendance'} onPress={handleSave} style={{ flex: 1 }} />
          <GradientButton label="Clear" onPress={resetForm} style={{ flex: 1 }} />
        </View>
      </GlassCard>

      <SectionTitle
        title="Registered Students"
        caption={selectedClass ? `Students registered under ${selectedClass.className}` : 'Students linked to the selected class or stream'}
      />
      {availableStudents.length ? (
        availableStudents.map((student) => (
          <InfoCard
            key={student.uid}
            title={student.fullName || student.name || student.email}
            meta={student.studentNumber || student.uid}
            description={`Email: ${student.email || 'Not set'}. Class: ${student.className || 'Not set'}. Stream: ${student.streamName || 'Not set'}.`}
          />
        ))
      ) : (
        <EmptyState title="No registered students found" description="Students will appear here once they register under this class or stream." />
      )}

      <SectionTitle title="Attendance History" caption={selectedClass ? `${selectedClass.className} - ${selectedClass.lectureTime}` : 'Recorded attendance feed'} />
      {filtered.length ? (
        filtered.map((item) => (
          <InfoCard
            key={item.id}
            title={`${item.studentName} - ${item.date}`}
            meta={`${item.status} - ${item.className}`}
            description={`Student number: ${item.studentNumber || item.studentId}.`}
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

