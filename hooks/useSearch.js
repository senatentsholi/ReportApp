import { useMemo } from 'react';

export function useSearch(items, query, selector) {
  return useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return items;
    }

    return items.filter((item) => selector(item).toLowerCase().includes(normalized));
  }, [items, query, selector]);
}
