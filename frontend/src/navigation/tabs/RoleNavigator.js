import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../providers/AuthProvider';
import { appTheme } from '../../theme';
import { StudentHomeScreen } from '../../screens/student/StudentHomeScreen';
import { StudentAttendanceScreen } from '../../screens/student/StudentAttendanceScreen';
import { StudentMonitoringScreen } from '../../screens/student/StudentMonitoringScreen';
import { StudentRatingsScreen } from '../../screens/student/StudentRatingsScreen';
import { LecturerHomeScreen } from '../../screens/lecturer/LecturerHomeScreen';
import { LecturerClassesScreen } from '../../screens/lecturer/LecturerClassesScreen';
import { LecturerReportsScreen } from '../../screens/lecturer/LecturerReportsScreen';
import { LecturerAttendanceScreen } from '../../screens/lecturer/LecturerAttendanceScreen';
import { PrlHomeScreen } from '../../screens/prl/PrlHomeScreen';
import { PrlCoursesScreen } from '../../screens/prl/PrlCoursesScreen';
import { PrlReportsScreen } from '../../screens/prl/PrlReportsScreen';
import { PlHomeScreen } from '../../screens/pl/PlHomeScreen';
import { PlCoursesScreen } from '../../screens/pl/PlCoursesScreen';
import { PlReportsScreen } from '../../screens/pl/PlReportsScreen';
import { PlLecturersScreen } from '../../screens/pl/PlLecturersScreen';
import { PlAttendanceScreen } from '../../screens/pl/PlAttendanceScreen';
import { MonitoringScreen } from '../../screens/shared/MonitoringScreen';
import { RatingsOverviewScreen } from '../../screens/shared/RatingsOverviewScreen';
import { PrlClassesScreen } from '../../screens/prl/PrlClassesScreen';
import { PlClassesScreen } from '../../screens/pl/PlClassesScreen';
import { ProfileScreen } from '../../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const roleTabMap = {
  student: [
    { name: 'Home', icon: 'home-outline', component: StudentHomeScreen },
    { name: 'Monitoring', icon: 'pulse-outline', component: StudentMonitoringScreen, hidden: true },
    { name: 'Ratings', icon: 'star-outline', component: StudentRatingsScreen, hidden: true },
    { name: 'Attendance', icon: 'calendar-outline', component: StudentAttendanceScreen },
    { name: 'Profile', icon: 'person-outline', component: ProfileScreen },
  ],
  lecturer: [
    { name: 'Home', icon: 'home-outline', component: LecturerHomeScreen },
    { name: 'Classes', icon: 'library-outline', component: LecturerClassesScreen },
    { name: 'Reports', icon: 'document-text-outline', component: LecturerReportsScreen },
    { name: 'Monitoring', icon: 'analytics-outline', component: MonitoringScreen, hidden: true },
    { name: 'Ratings', icon: 'star-outline', component: RatingsOverviewScreen, hidden: true },
    { name: 'Attendance', icon: 'people-outline', component: LecturerAttendanceScreen },
    { name: 'Profile', icon: 'person-outline', component: ProfileScreen },
  ],
  prl: [
    { name: 'Home', icon: 'home-outline', component: PrlHomeScreen },
    { name: 'Courses', icon: 'book-outline', component: PrlCoursesScreen },
    { name: 'Reports', icon: 'documents-outline', component: PrlReportsScreen },
    { name: 'Monitoring', icon: 'analytics-outline', component: MonitoringScreen, hidden: true },
    { name: 'Ratings', icon: 'star-outline', component: RatingsOverviewScreen, hidden: true },
    { name: 'Classes', icon: 'layers-outline', component: PrlClassesScreen },
    { name: 'Profile', icon: 'person-outline', component: ProfileScreen },
  ],
  pl: [
    { name: 'Home', icon: 'home-outline', component: PlHomeScreen },
    { name: 'Courses', icon: 'briefcase-outline', component: PlCoursesScreen },
    { name: 'Classes', icon: 'layers-outline', component: PlClassesScreen },
    { name: 'Attendance', icon: 'calendar-outline', component: PlAttendanceScreen },
    { name: 'Lecturers', icon: 'people-outline', component: PlLecturersScreen },
    { name: 'Reports', icon: 'documents-outline', component: PlReportsScreen },
    { name: 'Monitoring', icon: 'analytics-outline', component: MonitoringScreen, hidden: true },
    { name: 'Ratings', icon: 'star-outline', component: RatingsOverviewScreen, hidden: true },
    { name: 'Profile', icon: 'person-outline', component: ProfileScreen },
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
            backgroundColor: appTheme.colors.surface,
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
          options={
            tab.hidden
              ? {
                  tabBarButton: () => null,
                  tabBarItemStyle: { display: 'none' },
                }
              : undefined
          }
        />
      ))}
    </Tab.Navigator>
  );
}

