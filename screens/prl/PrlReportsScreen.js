import React, { useState } from 'react';
import { Alert } from 'react-native';
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
import { getVisibleReports } from '../../utils/appSelectors';

const inputTheme = {
  colors: {
    primary: appTheme.colors.primary,
    outline: appTheme.colors.border,
    onSurface: '#FFFFFF',
  },
};

export function PrlReportsScreen() {
  const { user } = useAuth();
  const { data, updateReport } = useAppData();
  const [query, setQuery] = useState('');
  const [feedback, setFeedback] = useState('Good progress. Add one more remedial exercise for students who missed the class.');
  const reports = getVisibleReports(data.reports, data.classes, data.courses, user);
  const filtered = useSearch(
    reports,
    query,
    (item) => `${item.courseCode} ${item.courseName} ${item.lecturerName} ${item.feedback}`
  );

  const addFeedback = async (reportId) => {
    try {
      await updateReport(reportId, {
        feedback,
        feedbackBy: user.fullName,
      });
      Alert.alert('Feedback added', 'The lecturer report has been reviewed and updated.');
    } catch (error) {
      Alert.alert('Unable to add feedback', error.message || 'Please try again.');
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Review Reports" subtitle="Add feedback before reports reach the program leader" user={user} />
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search lecturer, course, topic, or week" />
      <GlassCard>
        <SectionTitle title="Feedback Note" caption="Use one professional feedback note at a time" />
        <TextInput mode="outlined" label="Feedback" value={feedback} onChangeText={setFeedback} multiline style={{ marginTop: 12 }} theme={inputTheme} />
      </GlassCard>
      <SectionTitle title="Submitted Reports" caption="Reports from lecturers in your stream" />
      {filtered.length ? (
        filtered.map((item) => (
          <InfoCard
            key={item.id}
            title={`${item.lecturerName} - ${item.courseCode}`}
            meta={`${item.date} - ${item.week}`}
            description={`Topic: ${item.topic}. Current feedback: ${item.feedback || 'Not yet added'}`}
            rightNode={<GradientButton label="Add Feedback" onPress={() => addFeedback(item.id)} />}
          />
        ))
      ) : (
        <EmptyState title="No reports found" description="Reports will appear here when lecturers submit them." />
      )}
    </ScreenContainer>
  );
}
