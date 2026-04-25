import React from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppData } from '../../hooks/useAppData';
import { appTheme } from '../../src/theme';

const logoSource = require('../../assets/images/icon.png');

export function ScreenHeader({ title, subtitle, user, unreadCount = 0 }) {
  const { data, markNotificationRead } = useAppData();

  const openNotifications = async () => {
    const notifications = data.notifications
      .filter((item) => item.userId === user?.uid)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    if (!notifications.length) {
      Alert.alert('Notifications', 'You do not have any notifications yet.');
      return;
    }

    await Promise.all(
      notifications
        .filter((item) => !item.read)
        .map((item) => markNotificationRead(item.id))
    );

    const message = notifications
      .slice(0, 5)
      .map((item) => `${item.title}\n${item.message}`)
      .join('\n\n');

    Alert.alert('Notifications', message);
  };

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Image source={user?.avatarUrl ? { uri: user.avatarUrl } : logoSource} style={styles.avatar} />
        <View style={styles.copy}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle || user?.role}</Text>
        </View>
      </View>
      <Pressable style={styles.bellWrap} onPress={openNotifications}>
        <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
        {unreadCount ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  subtitle: {
    color: appTheme.colors.textMuted,
    fontSize: 13,
    textTransform: 'capitalize',
  },
  bellWrap: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: appTheme.colors.accent,
    borderRadius: 999,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
});
