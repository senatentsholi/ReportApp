import React, { useState } from 'react';
import { useAuth } from '../../src/providers/AuthProvider';
import { useAppData } from '../../hooks/useAppData';
import { useSearch } from '../../hooks/useSearch';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { SectionTitle } from '../../components/dashboard/SectionTitle';
import { InfoCard } from '../../components/dashboard/InfoCard';
import { EmptyState } from '../../components/common/EmptyState';
import { getUserClassRecords, getVisibleAttendance } from '../../utils/appSelectors';

export function PrlClassesScreen() {
  const { user } = useAuth();
  const { data } = useAppData();
  const [query, setQuery] = useState('');
  const classes = getUserClassRecords(data.classes, data.courses, user);
  const attendance = getVisibleAttendance(data.attendance, classes, user);
  const filtered = useSearch(
    classes,
    query,
    (item) => `${item.className} ${item.courseCode} ${item.courseName} ${item.lecturerName}`
  );

  return (
    <ScreenContainer>
      <ScreenHeader title="Classes" subtitle="Stream classes and lecturer coverage" user={user} />
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search class, lecturer, course, or venue" />
      <SectionTitle title="Class Oversight" caption="Use this view to monitor classes under your stream" />
      {filtered.length ? (
        filtered.map((item) => {
          const classAttendance = attendance.filter((entry) => entry.classId === item.id);
          const present = classAttendance.filter((entry) => entry.status === 'Present').length;
          const rate = classAttendance.length ? Math.round((present / classAttendance.length) * 100) : 0;

          return (
            <InfoCard
              key={item.id}
              title={`${item.courseCode} - ${item.className}`}
              meta={`Lecturer: ${item.lecturerName}`}
              description={`Venue: ${item.venue}. Time: ${item.lectureTime}. Attendance rate: ${rate}%.`}
            />
          );
        })
      ) : (
        <EmptyState title="No classes found" description="The class list will appear here for your stream." />
      )}
    </ScreenContainer>
  );
}
