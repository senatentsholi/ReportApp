import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../providers/AuthProvider';
import { useAppData } from '../../hooks/useAppData';
import { useSearch } from '../../hooks/useSearch';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { SectionTitle } from '../../components/dashboard/SectionTitle';
import { StatCard } from '../../components/dashboard/StatCard';
import { EmptyState } from '../../components/common/EmptyState';
import { GlassCard } from '../../components/ui/GlassCard';
import { getUserClassRecords, getVisibleAttendance, getVisibleReports } from '../../utils/appSelectors';
import { appTheme } from '../../theme';

export function LecturerClassesScreen() {
  const { user } = useAuth();
  const { data } = useAppData();
  const [query, setQuery] = useState('');
  const classes = getUserClassRecords(data.classes, data.courses, user);
  const reports = getVisibleReports(data.reports, data.classes, data.courses, user);
  const attendance = getVisibleAttendance(data.attendance, classes, user);

  const filtered = useSearch(
    classes,
    query,
    (item) => `${item.className} ${item.courseCode} ${item.courseName} ${item.venue} ${item.lectureTime}`
  );

  const summary = useMemo(() => {
    const present = attendance.filter((item) => item.status === 'Present').length;
    const attendanceRate = attendance.length ? Math.round((present / attendance.length) * 100) : 0;
    return {
      classes: classes.length,
      reports: reports.length,
      attendanceRate: `${attendanceRate}%`,
    };
  }, [attendance, classes.length, reports.length]);

  return (
    <ScreenContainer scroll={false}>
      <ScreenHeader title="Classes" subtitle="Assigned classes and teaching schedule" user={user} />
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search class, course code, venue, or time" />

      <SectionTitle title="Teaching Snapshot" caption="Quick overview of your current teaching load" />
      <View style={styles.statsRow}>
        <StatCard compact label="Assigned Classes" value={String(summary.classes)} />
        <StatCard compact label="Attendance Rate" value={summary.attendanceRate} colors={['#EAFBF2', '#DDF6E8']} />
      </View>
      <View style={styles.statsRow}>
        <StatCard compact label="Reports Submitted" value={String(summary.reports)} colors={['#EEF5FF', '#E2EEFF']} />
      </View>

      <SectionTitle title="Class Grid" caption="Smaller teaching cards in a two-column layout" />
      {filtered.length ? (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <GlassCard style={styles.classCard}>
              <Text style={styles.classCode}>{item.courseCode}</Text>
              <Text style={styles.className}>{item.className}</Text>
              <Text style={styles.classMeta}>{item.lectureTime}</Text>
              <Text style={styles.classMeta}>{item.venue}</Text>
              <Text style={styles.classCount}>{item.totalRegisteredStudents} students</Text>
            </GlassCard>
          )}
        />
      ) : (
        <EmptyState title="No classes found" description="Try another search term to find a teaching slot." />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  listContent: {
    paddingBottom: 12,
  },
  columnWrapper: {
    gap: 12,
    marginBottom: 12,
  },
  classCard: {
    flex: 1,
    minHeight: 148,
    borderRadius: 14,
    padding: 14,
    justifyContent: 'space-between',
  },
  classCode: {
    color: appTheme.colors.primaryDeep,
    fontSize: 13,
    fontWeight: '800',
  },
  className: {
    color: appTheme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  classMeta: {
    color: appTheme.colors.textMuted,
    fontSize: 12,
  },
  classCount: {
    color: appTheme.colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
});

