import React, { useMemo, useState } from 'react';
import { useAuth } from '../../src/providers/AuthProvider';
import { useAppData } from '../../hooks/useAppData';
import { useSearch } from '../../hooks/useSearch';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { SectionTitle } from '../../components/dashboard/SectionTitle';
import { StatCard } from '../../components/dashboard/StatCard';
import { InfoCard } from '../../components/dashboard/InfoCard';
import { EmptyState } from '../../components/common/EmptyState';
import { getUserClassRecords, getVisibleAttendance, getVisibleReports } from '../../utils/appSelectors';

export function LecturerClassesScreen() {
  const { user } = useAuth();
  const { data } = useAppData();
  const [query, setQuery] = useState('');
  const classes = getUserClassRecords(data.classes, data.courses, user);
  const reports = getVisibleReports(data.reports, data.classes, data.courses, user);
  const attendance = getVisibleAttendance(data.attendance, classes, user);

  const filtered = useSearch(
    classes,
    query,
    (item) => `${item.className} ${item.courseCode} ${item.courseName} ${item.venue} ${item.lectureTime}`
  );

  const summary = useMemo(() => {
    const present = attendance.filter((item) => item.status === 'Present').length;
    const attendanceRate = attendance.length ? Math.round((present / attendance.length) * 100) : 0;
    return {
      classes: classes.length,
      reports: reports.length,
      attendanceRate: `${attendanceRate}%`,
    };
  }, [attendance, classes.length, reports.length]);

  return (
    <ScreenContainer>
      <ScreenHeader title="Classes" subtitle="Assigned classes and teaching schedule" user={user} />
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search class, course code, venue, or time" />

      <SectionTitle title="Teaching Snapshot" caption="Quick overview of your current teaching load" />
      <StatCard label="Assigned Classes" value={String(summary.classes)} />
      <StatCard
        label="Attendance Rate"
        value={summary.attendanceRate}
        colors={['rgba(63,169,245,0.28)', 'rgba(61,213,152,0.20)']}
      />
      <StatCard
        label="Reports Submitted"
        value={String(summary.reports)}
        colors={['rgba(155,92,255,0.34)', 'rgba(63,169,245,0.18)']}
      />

      <SectionTitle title="Class List" caption="Each assigned class with venue and registration details" />
      {filtered.length ? (
        filtered.map((item) => (
          <InfoCard
            key={item.id}
            title={`${item.courseCode} - ${item.className}`}
            meta={`${item.lectureTime} - ${item.venue}`}
            description={`Course: ${item.courseName}. Registered students: ${item.totalRegisteredStudents}.`}
          />
        ))
      ) : (
        <EmptyState title="No classes found" description="Try another search term to find a teaching slot." />
      )}
    </ScreenContainer>
  );
}
