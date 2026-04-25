import React from 'react';
import { View } from 'react-native';
import { useAuth } from '../../src/providers/AuthProvider';
import { useAppData } from '../../hooks/useAppData';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { StatCard } from '../../components/dashboard/StatCard';
import { SectionTitle } from '../../components/dashboard/SectionTitle';
import { InfoCard } from '../../components/dashboard/InfoCard';
import { getVisibleCourses, getVisibleReports } from '../../utils/appSelectors';

export function PlHomeScreen() {
  const { user } = useAuth();
  const { data } = useAppData();
  const courses = getVisibleCourses(data.courses, user);
  const reports = getVisibleReports(data.reports, data.classes, data.courses, user);

  return (
    <ScreenContainer>
      <ScreenHeader title="Program Leader" subtitle="Faculty management dashboard" user={user} />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <StatCard label="Courses" value={String(courses.length)} />
        <StatCard label="Reports" value={String(reports.length)} colors={['rgba(155,92,255,0.34)', 'rgba(63,169,245,0.18)']} />
      </View>
      <SectionTitle title="Operational Snapshot" caption="Recent faculty management activity" />
      {courses.slice(0, 3).map((item) => (
        <InfoCard
          key={item.id}
          title={`${item.courseCode} • ${item.courseName}`}
          meta={`Lecturer: ${item.assignedLecturerName}`}
          description={`Principal Lecturer: ${item.principalLecturerName}`}
        />
      ))}
    </ScreenContainer>
  );
}
