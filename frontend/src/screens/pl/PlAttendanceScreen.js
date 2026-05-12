import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useAuth } from '../../providers/AuthProvider';
import { useAppData } from '../../hooks/useAppData';
import { useSearch } from '../../hooks/useSearch';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { SectionTitle } from '../../components/dashboard/SectionTitle';
import { StatCard } from '../../components/dashboard/StatCard';
import { InfoCard } from '../../components/dashboard/InfoCard';
import { EmptyState } from '../../components/common/EmptyState';
import { getVisibleAttendance } from '../../utils/appSelectors';

export function PlAttendanceScreen() {
  const { user } = useAuth();
  const { data } = useAppData();
  const [query, setQuery] = useState('');
  const attendance = getVisibleAttendance(data.attendance, data.classes, user);
  const filtered = useSearch(
    attendance,
    query,
    (item) =>
      `${item.studentName} ${item.studentNumber || ''} ${item.className} ${item.courseCode || ''} ${item.lecturerName || ''} ${item.status}`
  );

  const summary = useMemo(() => {
    const present = attendance.filter((item) => item.status === 'Present').length;
    const rate = attendance.length ? Math.round((present / attendance.length) * 100) : 0;

    return {
      total: attendance.length,
      rate: `${rate}%`,
    };
  }, [attendance]);

  return (
    <ScreenContainer>
      <ScreenHeader title="Student Attendance" subtitle="Faculty-wide attendance visibility" user={user} />
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search student, class, lecturer, course, or status" />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <StatCard label="Records" value={String(summary.total)} />
        <StatCard label="Present Rate" value={summary.rate} colors={['#EAFBF2', '#DDF6E8']} />
      </View>

      <SectionTitle title="Attendance Feed" caption="Attendance records across all lecturers and classes" />
      {filtered.length ? (
        filtered.map((item) => (
          <InfoCard
            key={item.id}
            title={`${item.studentName} - ${item.className}`}
            meta={`${item.status} - ${item.date}`}
            description={`Student number: ${item.studentNumber || 'Not set'}. Course: ${item.courseCode || 'Not set'}. Lecturer: ${item.lecturerName || 'Not set'}.`}
          />
        ))
      ) : (
        <EmptyState title="No attendance records found" description="Attendance submitted by lecturers will appear here." />
      )}
    </ScreenContainer>
  );
}

