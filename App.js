import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProviders } from './src/providers/AppProviders';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProviders />
    </GestureHandlerRootView>
  );
}
