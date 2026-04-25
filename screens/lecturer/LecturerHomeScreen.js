import React from 'react';
import { View } from 'react-native';
import { useAuth } from '../../src/providers/AuthProvider';
import { useAppData } from '../../hooks/useAppData';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { StatCard } from '../../components/dashboard/StatCard';
import { SectionTitle } from '../../components/dashboard/SectionTitle';
import { InfoCard } from '../../components/dashboard/InfoCard';
import { buildDashboardMetrics, getUnreadNotifications, getUserClassRecords, getVisibleAttendance, getVisibleRatings, getVisibleReports } from '../../utils/appSelectors';

export function LecturerHomeScreen() {
  const { user } = useAuth();
  const { data } = useAppData();
  const classes = getUserClassRecords(data.classes, data.courses, user);
  const reports = getVisibleReports(data.reports, data.classes, data.courses, user);
  const attendance = getVisibleAttendance(data.attendance, classes, user);
  const ratings = getVisibleRatings(data.ratings, user);
  const unread = getUnreadNotifications(data.notifications, user.uid);
  const metrics = buildDashboardMetrics({ reports, attendance, ratings, classes, user });

  return (
    <ScreenContainer>
      <ScreenHeader title="Lecturer Dashboard" subtitle="Manage reports, attendance, and ratings" user={user} unreadCount={unread.length} />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <StatCard label="My Classes" value={String(metrics.classes)} />
        <StatCard label="Reports" value={String(metrics.reports)} colors={['rgba(155,92,255,0.34)', 'rgba(63,169,245,0.18)']} />
      </View>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <StatCard label="Attendance" value={metrics.attendanceRate} colors={['rgba(63,169,245,0.28)', 'rgba(61,213,152,0.20)']} />
        <StatCard label="Ratings" value={metrics.ratingAverage} colors={['rgba(255,182,72,0.28)', 'rgba(155,92,255,0.20)']} />
      </View>

      <SectionTitle title="Upcoming Class Focus" caption="What to watch in your next teaching session" />
      {classes.slice(0, 2).map((item) => {
        const course = data.courses.find((courseItem) => courseItem.id === item.courseId);
        return (
          <InfoCard
            key={item.id}
            title={`${course?.courseCode} • ${item.className}`}
            meta={`${item.lectureTime} • ${item.venue}`}
            description={`Registered students: ${item.totalRegisteredStudents}`}
          />
        );
      })}
    </ScreenContainer>
  );
}
