import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppBackground } from '../common/AppBackground';

export function ScreenContainer({ children, scroll = true, refreshing, onRefresh, contentStyle, safeTop = 64 }) {
  const insets = useSafeAreaInsets();

  if (!scroll) {
    return (
      <AppBackground>
        <View style={[styles.content, { paddingTop: safeTop + insets.top, paddingBottom: 32 + insets.bottom }, contentStyle]}>
          {children}
        </View>
      </AppBackground>
    );
  }

  return (
    <AppBackground>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: safeTop + insets.top, paddingBottom: 32 + insets.bottom + 28 },
          contentStyle,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor="#FFFFFF" />}
      >
        {children}
      </ScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    gap: 16,
  },
});
