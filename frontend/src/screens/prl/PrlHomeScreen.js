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

export function PrlHomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const { data } = useAppData();
  const courses = getVisibleCourses(data.courses, user);
  const reports = getVisibleReports(data.reports, data.classes, data.courses, user);

  return (
    <ScreenContainer>
      <ScreenHeader title="Principal Lecturer" subtitle="Stream oversight dashboard" user={user} />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <StatCard label="Courses" value={String(courses.length)} />
        <StatCard label="Reports" value={String(reports.length)} colors={['rgba(155,92,255,0.34)', 'rgba(63,169,245,0.18)']} />
      </View>

      <SectionTitle title="Quick Access" caption="Monitoring and rating reviews live here now" />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <StatCard compact label="Monitoring" value={String(data.monitoring.filter((item) => item.streamName === user.streamName).length)} onPress={() => navigation.navigate('Monitoring')} />
        <StatCard compact label="Ratings" value={String(data.ratings.filter((item) => item.streamName === user.streamName).length)} onPress={() => navigation.navigate('Ratings')} colors={['#FFF5E9', '#FFE7D1']} />
      </View>

      <SectionTitle title="Needs Review" caption="Latest reports awaiting PRL action" />
      {reports.slice(0, 3).map((report) => (
        <InfoCard
          key={report.id}
          title={`${report.courseCode} - ${report.lecturerName}`}
          meta={report.week}
          description={`Date: ${report.date}. Topic: ${report.topic}`}
        />
      ))}
    </ScreenContainer>
  );
}

