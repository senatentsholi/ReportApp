import React from 'react';
import { useAuth } from '../../src/providers/AuthProvider';
import { useAppData } from '../../hooks/useAppData';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { AnalyticsChart } from '../../components/charts/AnalyticsChart';
import { SectionTitle } from '../../components/dashboard/SectionTitle';
import { buildAttendanceChart, buildParticipationChart, buildReportWeeklyChart, getVisibleAttendance, getVisibleReports } from '../../utils/appSelectors';

export function PlAnalyticsScreen() {
  const { user } = useAuth();
  const { data } = useAppData();
  const reports = getVisibleReports(data.reports, data.classes, data.courses, user);
  const attendance = getVisibleAttendance(data.attendance, data.classes, user);
  const attendanceChart = buildAttendanceChart(attendance);
  const reportChart = buildReportWeeklyChart(reports);
  const participationChart = buildParticipationChart(attendance);

  return (
    <ScreenContainer>
      <ScreenHeader title="Analytics" subtitle="Attendance, reports, and participation trends" user={user} />
      <SectionTitle title="Attendance %" />
      <AnalyticsChart title="Attendance Trend" labels={attendanceChart.labels} data={attendanceChart.data} suffix="%" />
      <SectionTitle title="Reports Submitted Weekly" />
      <AnalyticsChart title="Weekly Reports" labels={reportChart.labels} data={reportChart.data} />
      <SectionTitle title="Class Participation" />
      <AnalyticsChart title="Participation Trend" labels={participationChart.labels} data={participationChart.data} suffix="%" />
    </ScreenContainer>
  );
}
