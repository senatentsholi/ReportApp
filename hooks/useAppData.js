import { useContext } from 'react';
import { DataContext } from '../src/providers/DataProvider';

export function useAppData() {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error('useAppData must be used inside DataProvider');
  }

  return context;
}
