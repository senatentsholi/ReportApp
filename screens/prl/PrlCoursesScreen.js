import React, { useState } from 'react';
import { useAuth } from '../../src/providers/AuthProvider';
import { useAppData } from '../../hooks/useAppData';
import { useSearch } from '../../hooks/useSearch';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { SectionTitle } from '../../components/dashboard/SectionTitle';
import { InfoCard } from '../../components/dashboard/InfoCard';
import { getVisibleCourses } from '../../utils/appSelectors';

export function PrlCoursesScreen() {
  const { user } = useAuth();
  const { data } = useAppData();
  const [query, setQuery] = useState('');
  const courses = getVisibleCourses(data.courses, user);
  const filtered = useSearch(
    courses,
    query,
    (item) => `${item.courseCode} ${item.courseName} ${item.assignedLecturerName} ${item.principalLecturerName}`
  );

  return (
    <ScreenContainer>
      <ScreenHeader title="Courses" subtitle="Courses and lecturers under your stream" user={user} />
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search course code, title, or lecturer" />
      <SectionTitle title="Stream Courses" />
      {filtered.map((item) => (
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
