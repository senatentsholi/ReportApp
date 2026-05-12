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
import {
  buildDashboardMetrics,
  getUnreadNotifications,
  getUserClassRecords,
  getVisibleAttendance,
  getVisibleRatings,
  getVisibleReports,
} from '../../utils/appSelectors';

export function LecturerHomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
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
        <StatCard label="Reports" value={String(metrics.reports)} colors={['#EEF5FF', '#E2EEFF']} />
      </View>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <StatCard label="Attendance" value={metrics.attendanceRate} colors={['#EAFBF2', '#DDF6E8']} />
        <StatCard label="Ratings" value={metrics.ratingAverage} colors={['#FFF5E9', '#FFE7D1']} />
      </View>

      <SectionTitle title="Quick Access" caption="Open the extra lecturer tools from the dashboard" />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <StatCard compact label="Monitoring" value={String(data.monitoring.filter((item) => item.ownerId === user.uid).length)} onPress={() => navigation.navigate('Monitoring')} />
        <StatCard compact label="Ratings" value={String(ratings.length)} onPress={() => navigation.navigate('Ratings')} colors={['#FFF5E9', '#FFE7D1']} />
      </View>

      <SectionTitle title="Upcoming Class Focus" caption="What to watch in your next teaching session" />
      {classes.slice(0, 2).map((item) => {
        const course = data.courses.find((courseItem) => courseItem.id === item.courseId);
        return (
          <InfoCard
            key={item.id}
            title={`${course?.courseCode} - ${item.className}`}
            meta={`${item.lectureTime} - ${item.venue}`}
            description={`Registered students: ${item.totalRegisteredStudents}`}
          />
        );
      })}

      <SectionTitle title="Faculty Report Feed" caption="Recent reports from your faculty and stream" />
      {reports.slice(0, 3).map((report) => (
        <InfoCard
          key={report.id}
          title={`${report.courseCode} - ${report.courseName}`}
          meta={`${report.lecturerName} - ${report.week}`}
          description={`Topic: ${report.topic}. Class: ${report.className}.`}
        />
      ))}
    </ScreenContainer>
  );
}

