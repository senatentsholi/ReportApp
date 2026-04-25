import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useAuth } from '../../src/providers/AuthProvider';
import { useAppData } from '../../hooks/useAppData';
import { useSearch } from '../../hooks/useSearch';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { SectionTitle } from '../../components/dashboard/SectionTitle';
import { StatCard } from '../../components/dashboard/StatCard';
import { InfoCard } from '../../components/dashboard/InfoCard';
import { EmptyState } from '../../components/common/EmptyState';
import { getVisibleRatings } from '../../utils/appSelectors';

export function RatingsOverviewScreen() {
  const { user } = useAuth();
  const { data } = useAppData();
  const [query, setQuery] = useState('');
  const ratings = getVisibleRatings(data.ratings, user);
  const filtered = useSearch(
    ratings,
    query,
    (item) => `${item.lecturerName} ${item.courseCode} ${item.comment} ${item.stars}`
  );

  const summary = useMemo(() => {
    const average = ratings.length
      ? (ratings.reduce((sum, item) => sum + Number(item.stars || 0), 0) / ratings.length).toFixed(1)
      : '0.0';

    return {
      total: ratings.length,
      average,
    };
  }, [ratings]);

  return (
    <ScreenContainer>
      <ScreenHeader title="Ratings" subtitle="Lecturer evaluation visibility" user={user} />
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search by lecturer, course code, or comment" />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <StatCard label="Ratings" value={String(summary.total)} />
        <StatCard label="Average" value={summary.average} colors={['rgba(255,182,72,0.28)', 'rgba(155,92,255,0.20)']} />
      </View>
      <SectionTitle title="Rating Records" caption="Performance feedback feed" />
      {filtered.length ? (
        filtered.map((item) => (
          <InfoCard
            key={item.id}
            title={`${item.lecturerName} - ${item.courseCode}`}
            meta={`${item.stars} stars`}
            description={item.comment}
          />
        ))
      ) : (
        <EmptyState title="No ratings available" description="Ratings will show up here as students submit them." />
      )}
    </ScreenContainer>
  );
}
