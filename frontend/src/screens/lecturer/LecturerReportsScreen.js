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
import { exportReportsToExcel } from '../../utils/exportToExcel';
import { getUserClassRecords, getVisibleReports } from '../../utils/appSelectors';

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

export function LecturerReportsScreen() {
  const { user } = useAuth();
  const { data, saveReport, updateReport, deleteReport } = useAppData();
  const [query, setQuery] = useState('');
  const lecturerClasses = getUserClassRecords(data.classes, data.courses, user);
  const lecturerReports = getVisibleReports(data.reports, data.classes, data.courses, user);
  const [editingId, setEditingId] = useState(null);

  const buildInitialForm = () => {
    const firstClass = lecturerClasses[0];
    return {
      facultyName: firstClass?.facultyName || user.facultyName || '',
      streamName: firstClass?.streamName || user.streamName || '',
      classId: firstClass?.id || '',
      className: firstClass?.className || '',
      week: '',
      date: todayValue(),
      courseName: firstClass?.courseName || '',
      courseCode: firstClass?.courseCode || '',
      lecturerName: user.fullName || user.name || '',
      studentsPresent: '',
      totalStudents: firstClass ? String(firstClass.totalRegisteredStudents || '') : '',
      venue: firstClass?.venue || '',
      time: firstClass?.lectureTime || '',
      topic: '',
      learningOutcomes: '',
      recommendations: '',
    };
  };

  const [form, setForm] = useState(buildInitialForm);

  const filteredReports = useSearch(
    lecturerReports,
    query,
    (item) => `${item.courseCode} ${item.courseName} ${item.topic} ${item.week} ${item.lecturerName}`
  );
  const classOptions = useMemo(
    () =>
      lecturerClasses.map((item) => ({
        value: item.id,
        label: `${item.className} - ${item.courseCode}`,
      })),
    [lecturerClasses]
  );

  const selectedClass = useMemo(
    () => lecturerClasses.find((item) => item.id === form.classId) || lecturerClasses[0],
    [form.classId, lecturerClasses]
  );

  useEffect(() => {
    if (!editingId && !form.classId && lecturerClasses.length) {
      const firstClass = lecturerClasses[0];
      setForm({
        facultyName: firstClass?.facultyName || user.facultyName || '',
        streamName: firstClass?.streamName || user.streamName || '',
        classId: firstClass?.id || '',
        className: firstClass?.className || '',
        week: '',
        date: todayValue(),
        courseName: firstClass?.courseName || '',
        courseCode: firstClass?.courseCode || '',
        lecturerName: user.fullName || user.name || '',
        studentsPresent: '',
        totalStudents: firstClass ? String(firstClass.totalRegisteredStudents || '') : '',
        venue: firstClass?.venue || '',
        time: firstClass?.lectureTime || '',
        topic: '',
        learningOutcomes: '',
        recommendations: '',
      });
    }
  }, [editingId, form.classId, lecturerClasses, user.facultyName, user.fullName, user.name, user.streamName]);

  const updateField = (field, value) => {
    if (field === 'classId') {
      const nextClass = lecturerClasses.find((item) => item.id === value);
      setForm((current) => ({
        ...current,
        classId: value,
        className: nextClass?.className || '',
        courseName: nextClass?.courseName || '',
        courseCode: nextClass?.courseCode || '',
        facultyName: nextClass?.facultyName || user.facultyName || '',
        streamName: nextClass?.streamName || user.streamName || '',
        totalStudents: nextClass ? String(nextClass.totalRegisteredStudents || '') : '',
        venue: nextClass?.venue || '',
        time: nextClass?.lectureTime || '',
      }));
      return;
    }

    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(buildInitialForm());
  };

  const buildPayload = () => ({
    facultyName: form.facultyName.trim(),
    streamName: form.streamName.trim(),
    className: form.className.trim(),
    week: form.week.trim(),
    date: form.date.trim(),
    courseName: form.courseName.trim(),
    courseCode: form.courseCode.trim().toUpperCase(),
    lecturerName: form.lecturerName.trim(),
    studentsPresent: Number(form.studentsPresent || 0),
    totalStudents: Number(form.totalStudents || 0),
    venue: form.venue.trim(),
    time: form.time.trim(),
    topic: form.topic.trim(),
    learningOutcomes: form.learningOutcomes.trim(),
    recommendations: form.recommendations.trim(),
    lecturerId: user.uid,
    createdBy: user.uid,
    classId: form.classId || '',
  });

  const handleSave = async () => {
    try {
      const payload = buildPayload();

      if (editingId) {
        await updateReport(editingId, payload);
        Alert.alert('Report updated', 'The report has been updated successfully.');
      } else {
        await saveReport(payload);
        Alert.alert('Report submitted', 'Your report has been submitted.');
      }

      resetForm();
    } catch (error) {
      Alert.alert('Report not saved', error.message || 'Please check the form and try again.');
    }
  };

  const beginEdit = (report) => {
    setEditingId(report.id);
    setForm({
      facultyName: report.facultyName || '',
      streamName: report.streamName || '',
      classId: report.classId || '',
      className: report.className || '',
      week: report.week || '',
      date: report.date || '',
      courseName: report.courseName || '',
      courseCode: report.courseCode || '',
      lecturerName: report.lecturerName || '',
      studentsPresent: String(report.studentsPresent ?? ''),
      totalStudents: String(report.totalStudents ?? ''),
      venue: report.venue || '',
      time: report.time || '',
      topic: report.topic || '',
      learningOutcomes: report.learningOutcomes || '',
      recommendations: report.recommendations || '',
    });
  };

  const handleDelete = (report) => {
    Alert.alert('Delete report', `Delete the ${report.courseCode} report for ${report.date}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteReport(report.id);
          if (editingId === report.id) {
            resetForm();
          }
        },
      },
    ]);
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Lecturer Reports" subtitle="Capture and manage weekly lecture reports" user={user} />
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search report history by course, topic, or week" />

      <GlassCard>
        <SectionTitle title={editingId ? 'Edit Report' : 'Lecturer Reporting Form'} caption="All fields are validated before saving to Firestore" />
        <TextInput mode="outlined" label="Faculty Name" value={form.facultyName} onChangeText={(value) => updateField('facultyName', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <OptionSelectorField label="Class" options={classOptions} selectedValue={form.classId} onChange={(value) => updateField('classId', value)} />
        <TextInput mode="outlined" label="Class Name" value={form.className} onChangeText={(value) => updateField('className', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Week" value={form.week} onChangeText={(value) => updateField('week', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Date" value={form.date} onChangeText={(value) => updateField('date', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Course Name" value={form.courseName} onChangeText={(value) => updateField('courseName', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Course Code" value={form.courseCode} onChangeText={(value) => updateField('courseCode', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Lecturer Name" value={form.lecturerName} onChangeText={(value) => updateField('lecturerName', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Students Present" value={form.studentsPresent} onChangeText={(value) => updateField('studentsPresent', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Total Students" value={form.totalStudents} onChangeText={(value) => updateField('totalStudents', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Venue" value={form.venue} onChangeText={(value) => updateField('venue', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Time" value={form.time} onChangeText={(value) => updateField('time', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Topic" value={form.topic} onChangeText={(value) => updateField('topic', value)} style={{ marginTop: 12 }} theme={inputTheme} />
        <TextInput mode="outlined" label="Learning Outcomes" value={form.learningOutcomes} onChangeText={(value) => updateField('learningOutcomes', value)} style={{ marginTop: 12 }} multiline theme={inputTheme} />
        <TextInput mode="outlined" label="Recommendations" value={form.recommendations} onChangeText={(value) => updateField('recommendations', value)} style={{ marginTop: 12 }} multiline theme={inputTheme} />
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
          <GradientButton label={editingId ? 'Update Report' : 'Submit Report'} onPress={handleSave} style={{ flex: 1 }} />
          <GradientButton label="Clear Form" onPress={resetForm} style={{ flex: 1 }} />
        </View>
      </GlassCard>

      <GradientButton label="Export Reports to Excel" onPress={() => exportReportsToExcel(filteredReports)} />

      <SectionTitle title="Report History" caption={selectedClass ? `${selectedClass.className} - ${selectedClass.lectureTime}` : 'Saved lecturer reports'} />
      {filteredReports.length ? (
        filteredReports.map((report) => (
          <InfoCard
            key={report.id}
            title={`${report.courseCode} - ${report.courseName}`}
            meta={`${report.date} - ${report.week}`}
            description={`Topic: ${report.topic}. Recommendations: ${report.recommendations}`}
            rightNode={
              <View style={{ gap: 8 }}>
                <GradientButton label="Edit" onPress={() => beginEdit(report)} />
                <GradientButton label="Delete" onPress={() => handleDelete(report)} />
              </View>
            }
          />
        ))
      ) : (
        <EmptyState title="No reports found" description="Reports saved in Firestore will appear here automatically." />
      )}
    </ScreenContainer>
  );
}

