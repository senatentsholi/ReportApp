import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../src/providers/AuthProvider';
import { SplashScreen } from '../screens/splash/SplashScreen';
import { AuthNavigator } from './stacks/AuthNavigator';
import { RoleNavigator } from './tabs/RoleNavigator';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const { bootstrapped, user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {!bootstrapped ? (
        <Stack.Screen name="Splash" component={SplashScreen} />
      ) : user ? (
        <Stack.Group>
          <Stack.Screen name="RoleApp" component={RoleNavigator} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Group>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
