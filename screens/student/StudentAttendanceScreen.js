import React from 'react';
import { useAuth } from '../../src/providers/AuthProvider';
import { useAppData } from '../../hooks/useAppData';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { SectionTitle } from '../../components/dashboard/SectionTitle';
import { InfoCard } from '../../components/dashboard/InfoCard';
import { AnalyticsChart } from '../../components/charts/AnalyticsChart';
import { buildAttendanceChart, getVisibleAttendance } from '../../utils/appSelectors';

export function StudentAttendanceScreen() {
  const { user } = useAuth();
  const { data } = useAppData();
  const attendance = getVisibleAttendance(data.attendance, data.classes, user);
  const chart = buildAttendanceChart(attendance);

  return (
    <ScreenContainer>
      <ScreenHeader title="Attendance" subtitle="Track your class participation" user={user} />
      <AnalyticsChart title="Attendance pattern" labels={chart.labels} data={chart.data} suffix="%" />
      <SectionTitle title="Attendance Records" caption="Every lecture attendance captured for your classes" />
      {attendance.map((item) => (
        <InfoCard key={item.id} title={item.date} meta={item.status} description={`Class ID: ${item.classId}`} />
      ))}
    </ScreenContainer>
  );
}
