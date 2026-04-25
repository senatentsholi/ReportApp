import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../src/providers/AuthProvider';
import { appTheme } from '../../src/theme';
import { StudentHomeScreen } from '../../screens/student/StudentHomeScreen';
import { StudentAttendanceScreen } from '../../screens/student/StudentAttendanceScreen';
import { StudentMonitoringScreen } from '../../screens/student/StudentMonitoringScreen';
import { StudentRatingsScreen } from '../../screens/student/StudentRatingsScreen';
import { LecturerClassesScreen } from '../../screens/lecturer/LecturerClassesScreen';
import { LecturerReportsScreen } from '../../screens/lecturer/LecturerReportsScreen';
import { LecturerAttendanceScreen } from '../../screens/lecturer/LecturerAttendanceScreen';
import { PrlCoursesScreen } from '../../screens/prl/PrlCoursesScreen';
import { PrlReportsScreen } from '../../screens/prl/PrlReportsScreen';
import { PlCoursesScreen } from '../../screens/pl/PlCoursesScreen';
import { PlReportsScreen } from '../../screens/pl/PlReportsScreen';
import { MonitoringScreen } from '../../screens/shared/MonitoringScreen';
import { RatingsOverviewScreen } from '../../screens/shared/RatingsOverviewScreen';
import { PrlClassesScreen } from '../../screens/prl/PrlClassesScreen';
import { PlClassesScreen } from '../../screens/pl/PlClassesScreen';

const Tab = createBottomTabNavigator();

const roleTabMap = {
  student: [
    { name: 'Home', icon: 'home-outline', component: StudentHomeScreen },
    { name: 'Monitoring', icon: 'pulse-outline', component: StudentMonitoringScreen },
    { name: 'Ratings', icon: 'star-outline', component: StudentRatingsScreen },
    { name: 'Attendance', icon: 'calendar-outline', component: StudentAttendanceScreen },
  ],
  lecturer: [
    { name: 'Classes', icon: 'library-outline', component: LecturerClassesScreen },
    { name: 'Reports', icon: 'document-text-outline', component: LecturerReportsScreen },
    { name: 'Monitoring', icon: 'analytics-outline', component: MonitoringScreen },
    { name: 'Ratings', icon: 'star-outline', component: RatingsOverviewScreen },
    { name: 'Attendance', icon: 'people-outline', component: LecturerAttendanceScreen },
  ],
  prl: [
    { name: 'Courses', icon: 'book-outline', component: PrlCoursesScreen },
    { name: 'Reports', icon: 'documents-outline', component: PrlReportsScreen },
    { name: 'Monitoring', icon: 'analytics-outline', component: MonitoringScreen },
    { name: 'Ratings', icon: 'star-outline', component: RatingsOverviewScreen },
    { name: 'Classes', icon: 'layers-outline', component: PrlClassesScreen },
  ],
  pl: [
    { name: 'Courses', icon: 'briefcase-outline', component: PlCoursesScreen },
    { name: 'Classes', icon: 'layers-outline', component: PlClassesScreen },
    { name: 'Reports', icon: 'documents-outline', component: PlReportsScreen },
    { name: 'Monitoring', icon: 'analytics-outline', component: MonitoringScreen },
    { name: 'Ratings', icon: 'star-outline', component: RatingsOverviewScreen },
  ],
};

export function RoleNavigator() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const tabs = roleTabMap[user?.role] || roleTabMap.student;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const activeTab = tabs.find((tab) => tab.name === route.name);
        const bottomInset = Math.max(insets.bottom, 10);

        return {
          headerShown: false,
          tabBarActiveTintColor: appTheme.colors.primary,
          tabBarInactiveTintColor: appTheme.colors.textMuted,
          sceneStyle: {
            backgroundColor: appTheme.colors.background,
          },
          tabBarStyle: {
            backgroundColor: '#0E1C33',
            borderTopColor: appTheme.colors.border,
            height: 64 + bottomInset,
            paddingBottom: bottomInset,
            paddingTop: 8,
          },
          tabBarItemStyle: {
            paddingVertical: 4,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={activeTab?.icon || 'ellipse-outline'} size={size} color={color} />
          ),
        };
      }}
    >
      {tabs.map((tab, index) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          initialParams={{ tabName: tab.name, tabIndex: index }}
        />
      ))}
    </Tab.Navigator>
  );
}
