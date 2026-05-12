import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../providers/AuthProvider';
import { useAppData } from '../../hooks/useAppData';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { StatCard } from '../../components/dashboard/StatCard';
import { SectionTitle } from '../../components/dashboard/SectionTitle';
import { InfoCard } from '../../components/dashboard/InfoCard';
import { getVisibleCourses, getVisibleReports } from '../../utils/appSelectors';

export function PlHomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const { data } = useAppData();
  const courses = getVisibleCourses(data.courses, user);
  const reports = getVisibleReports(data.reports, data.classes, data.courses, user);

  return (
    <ScreenContainer>
      <ScreenHeader title="Program Leader" user={user} />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <StatCard label="Courses" value={String(courses.length)} />
        <StatCard label="Reports" value={String(reports.length)} colors={['rgba(155,92,255,0.34)', 'rgba(63,169,245,0.18)']} />
      </View>
      <SectionTitle title="Quick Access" caption="Open monitoring and ratings from the dashboard" />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <StatCard compact label="Monitoring" value={String(data.monitoring.length)} onPress={() => navigation.navigate('Monitoring')} />
        <StatCard compact label="Ratings" value={String(data.ratings.length)} onPress={() => navigation.navigate('Ratings')} colors={['#FFF5E9', '#FFE7D1']} />
      </View>
      <SectionTitle title="Operational Snapshot" />
      {courses.slice(0, 3).map((item) => (
        <InfoCard
          key={item.id}
          title={`${item.courseCode} - ${item.courseName}`}
          meta={`Lecturer: ${item.assignedLecturerName}`}
          description={`Principal Lecturer: ${item.principalLecturerName}`}
        />
      ))}
    </ScreenContainer>
  );
}

