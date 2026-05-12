import React, { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { useAppData } from '../../hooks/useAppData';
import { useSearch } from '../../hooks/useSearch';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { SectionTitle } from '../../components/dashboard/SectionTitle';
import { InfoCard } from '../../components/dashboard/InfoCard';
import { EmptyState } from '../../components/common/EmptyState';
import { exportReportsToExcel } from '../../utils/exportToExcel';
import { GradientButton } from '../../components/ui/GradientButton';
import { getLatestFeedbackForReport, getVisibleReports } from '../../utils/appSelectors';

export function PlReportsScreen() {
  const { user } = useAuth();
  const { data } = useAppData();
  const [query, setQuery] = useState('');
  const reports = getVisibleReports(data.reports, data.classes, data.courses, user);
  const filtered = useSearch(
    reports,
    query,
    (item) => `${item.courseCode} ${item.courseName} ${item.lecturerName} ${item.feedback}`
  );

  return (
    <ScreenContainer>
      <ScreenHeader title="Reports" subtitle="Faculty-level visibility on reviewed teaching reports" user={user} />
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search by course, lecturer, topic, or week" />
      <GradientButton label="Export Excel Report" onPress={() => exportReportsToExcel(filtered)} />
      <SectionTitle title="Reports Feed" caption="Reports already visible at program leader level" />
      {filtered.length ? (
        filtered.map((item) => {
          const latestFeedback = getLatestFeedbackForReport(data.feedback, item.id);

          return (
            <InfoCard
              key={item.id}
              title={`${item.courseCode} - ${item.courseName}`}
              meta={`${item.lecturerName} - ${item.week}`}
              description={`Class: ${item.className}. Topic: ${item.topic}. Feedback: ${latestFeedback?.feedback || item.feedback || 'Not yet added'}`}
            />
          );
        })
      ) : (
        <EmptyState title="No reports yet" />
      )}
    </ScreenContainer>
  );
}

