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
import { getVisibleMonitoring, getVisibleReports } from '../../utils/appSelectors';

export function StudentMonitoringScreen() {
  const { user } = useAuth();
  const { data } = useAppData();
  const [query, setQuery] = useState('');
  const reports = getVisibleReports(data.reports, data.classes, data.courses, user);
  const monitoring = getVisibleMonitoring(data.monitoring, user);
  const filteredReports = useSearch(
    reports,
    query,
    (item) => `${item.courseCode} ${item.courseName} ${item.topic} ${item.feedback}`
  );
  const filteredMonitoring = useSearch(
    monitoring,
    query,
    (item) => `${item.title} ${item.progress} ${item.action} ${item.riskLevel}`
  );

  return (
    <ScreenContainer>
      <ScreenHeader title="Monitoring" user={user} />
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search monitoring" />
      <SectionTitle title="Monitoring" />
      {filteredMonitoring.length ? (
        filteredMonitoring.map((item) => (
          <InfoCard
            key={item.id}
            title={item.title}
            meta={item.riskLevel}
            description={`${item.progress} ${item.action}`}
          />
        ))
      ) : (
        <EmptyState title="No monitoring yet" />
      )}
      <SectionTitle title="Reports" />
      {filteredReports.length ? (
        filteredReports.map((report) => (
          <InfoCard
            key={report.id}
            title={`${report.courseCode} - ${report.topic}`}
            meta={`${report.date} - ${report.week}`}
            description={`Learning outcomes: ${report.learningOutcomes}. Feedback: ${report.feedback || 'Not yet added'}`}
          />
        ))
      ) : (
        <EmptyState title="No reports yet" />
      )}
    </ScreenContainer>
  );
}

