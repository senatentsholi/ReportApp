import React, { useState } from 'react';
import { useAuth } from '../../src/providers/AuthProvider';
import { useAppData } from '../../hooks/useAppData';
import { useSearch } from '../../hooks/useSearch';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { SectionTitle } from '../../components/dashboard/SectionTitle';
import { InfoCard } from '../../components/dashboard/InfoCard';
import { EmptyState } from '../../components/common/EmptyState';
import { getVisibleReports } from '../../utils/appSelectors';

export function StudentMonitoringScreen() {
  const { user } = useAuth();
  const { data } = useAppData();
  const [query, setQuery] = useState('');
  const reports = getVisibleReports(data.reports, data.classes, data.courses, user);
  const filtered = useSearch(
    reports,
    query,
    (item) => `${item.courseCode} ${item.courseName} ${item.topic} ${item.feedback}`
  );

  return (
    <ScreenContainer>
      <ScreenHeader title="Monitoring" subtitle="View lecturer-submitted reports" user={user} />
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search reports, topics, or course code" />
      <SectionTitle title="Visible Reports" caption="Realtime academic reporting feed" />
      {filtered.length ? (
        filtered.map((report) => (
          <InfoCard
            key={report.id}
            title={`${report.courseCode} - ${report.topic}`}
            meta={`${report.date} - ${report.week}`}
            description={`Learning outcomes: ${report.learningOutcomes}. Feedback: ${report.feedback || 'Not yet added'}`}
          />
        ))
      ) : (
        <EmptyState title="No reports found" description="Try another search term to find class reports." />
      )}
    </ScreenContainer>
  );
}
