import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProviders } from './src/providers/AppProviders';

export default function FrontendApp() {
  return (
    // Required by react-native-gesture-handler so touch interactions work correctly.
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProviders />
    </GestureHandlerRootView>
  );
}
