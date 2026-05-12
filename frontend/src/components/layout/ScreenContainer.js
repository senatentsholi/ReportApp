import React from 'react';
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppBackground } from '../common/AppBackground';

export function ScreenContainer({ children, scroll = true, refreshing, onRefresh, contentStyle, safeTop = 64 }) {
  const insets = useSafeAreaInsets();
  const keyboardVerticalOffset = safeTop + insets.top;

  if (!scroll) {
    return (
      <AppBackground>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <View style={[styles.content, { paddingTop: safeTop + insets.top, paddingBottom: 32 + insets.bottom }, contentStyle]}>
            {children}
          </View>
        </KeyboardAvoidingView>
      </AppBackground>
    );
  }

  return (
    <AppBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingTop: safeTop + insets.top, paddingBottom: 32 + insets.bottom + 28 },
            contentStyle,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          refreshControl={<RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor="#3FA9F5" />}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    gap: 16,
  },
});

