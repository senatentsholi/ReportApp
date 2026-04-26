import React, { useState } from 'react';
import { useAuth } from '../../src/providers/AuthProvider';
import { useAppData } from '../../hooks/useAppData';
import { useSearch } from '../../hooks/useSearch';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { SectionTitle } from '../../components/dashboard/SectionTitle';
import { InfoCard } from '../../components/dashboard/InfoCard';
import { AnalyticsChart } from '../../components/charts/AnalyticsChart';
import { EmptyState } from '../../components/common/EmptyState';
import { buildAttendanceChart, getVisibleAttendance } from '../../utils/appSelectors';

export function StudentAttendanceScreen() {
  const { user } = useAuth();
  const { data } = useAppData();
  const [query, setQuery] = useState('');
  const attendance = getVisibleAttendance(data.attendance, data.classes, user);
  const filtered = useSearch(
    attendance,
    query,
    (item) => `${item.date} ${item.status} ${item.className} ${item.courseCode || ''}`
  );
  const chart = buildAttendanceChart(attendance);

  return (
    <ScreenContainer>
      <ScreenHeader title="Attendance" user={user} />
      <AnalyticsChart title="Attendance pattern" labels={chart.labels} data={chart.data} suffix="%" />
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search attendance" />
      <SectionTitle title="Attendance Records" />
      {filtered.length ? (
        filtered.map((item) => (
          <InfoCard key={item.id} title={item.date} meta={item.status} description={item.className || item.classId} />
        ))
      ) : (
        <EmptyState title="No attendance records" />
      )}
    </ScreenContainer>
  );
}
