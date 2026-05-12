import { useState } from 'react';

export function usePullToRefresh(onRefresh) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await onRefresh?.();
    } finally {
      setRefreshing(false);
    }
  };

  return {
    refreshing,
    onRefresh: handleRefresh,
  };
}

