import React from 'react';
import { View } from 'react-native';
import { useAuth } from '../../src/providers/AuthProvider';
import { useAppData } from '../../hooks/useAppData';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { SectionTitle } from '../../components/dashboard/SectionTitle';
import { StatCard } from '../../components/dashboard/StatCard';
import { InfoCard } from '../../components/dashboard/InfoCard';
import { AnalyticsChart } from '../../components/charts/AnalyticsChart';
import {
  buildAttendanceChart,
  buildDashboardMetrics,
  getUnreadNotifications,
  getUserClassRecords,
  getVisibleAttendance,
  getVisibleNotifications,
  getVisibleRatings,
  getVisibleReports,
} from '../../utils/appSelectors';

export function StudentHomeScreen() {
  const { user } = useAuth();
  const { data, refresh } = useAppData();
  const { refreshing, onRefresh } = usePullToRefresh(refresh);

  const visibleReports = getVisibleReports(data.reports, data.classes, data.courses, user);
  const visibleAttendance = getVisibleAttendance(data.attendance, data.classes, user);
  const visibleRatings = getVisibleRatings(data.ratings, user);
  const visibleClasses = getUserClassRecords(data.classes, data.courses, user);
  const notifications = getVisibleNotifications(data.notifications, user.uid);
  const unread = getUnreadNotifications(data.notifications, user.uid);
  const metrics = buildDashboardMetrics({
    reports: visibleReports,
    attendance: visibleAttendance,
    ratings: visibleRatings,
    classes: visibleClasses,
    user,
  });
  const chart = buildAttendanceChart(visibleAttendance);

  return (
    <ScreenContainer refreshing={refreshing} onRefresh={onRefresh}>
      <ScreenHeader
        title={`Welcome, ${(user.fullName || user.name || 'User').split(' ')[0]}`}
        subtitle="Student dashboard"
        user={user}
        unreadCount={unread.length}
      />

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <StatCard label="Attendance" value={metrics.attendanceRate} />
        <StatCard label="Avg Rating" value={metrics.ratingAverage} colors={['rgba(155,92,255,0.34)', 'rgba(63,169,245,0.18)']} />
      </View>

      <SectionTitle title="Attendance Insight" caption="Weekly class participation trend" />
      <AnalyticsChart title="Attendance %" labels={chart.labels} data={chart.data} suffix="%" />

      <SectionTitle title="Recent Reports" caption="Latest lecturer reports visible to your class" />
      {visibleReports.slice(0, 3).map((report) => (
        <InfoCard
          key={report.id}
          title={`${report.courseCode} - ${report.courseName}`}
          meta={`${report.week} - ${report.date}`}
          description={`${report.topic}. Recommendation: ${report.recommendations}`}
        />
      ))}

      <SectionTitle title="Notifications" caption="Latest updates for your account" />
      {notifications.slice(0, 3).map((item) => (
        <InfoCard key={item.id} title={item.title} meta={item.read ? 'Read' : 'Unread'} description={item.message} />
      ))}
    </ScreenContainer>
  );
}
