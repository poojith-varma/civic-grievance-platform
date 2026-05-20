import {
  useEffect,
  useState,
} from 'react';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';

import ComplaintDetailScreen from '../screens/ComplaintDetailScreen';

import ProfileScreen from '../screens/ProfileScreen';

import RoleBasedTabs from './RoleBasedTabs';

import {
  getCurrentSession,
} from '../services/authService';

import {
  getUserRole,
} from '../services/roleService';

import {
  useAuthStore,
} from '../store/authStore';

import {
  useRoleStore,
} from '../store/roleStore';

const Stack =
  createNativeStackNavigator();

export default function AppNavigator() {
  const isAuthenticated =
    useAuthStore(
      (state) =>
        state.isAuthenticated
    );

  const setAuthenticated =
    useAuthStore(
      (state) =>
        state.setAuthenticated
    );

  const setRole =
    useRoleStore(
      (state) => state.setRole
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const session =
          await getCurrentSession();

        if (session) {
          setAuthenticated(true);

          const role =
            await getUserRole();

          // SAFE FALLBACK
          setRole(
            role || 'citizen'
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name="MainTabs"
              component={
                RoleBasedTabs
              }
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="ComplaintDetail"
              component={
                ComplaintDetailScreen
              }
              options={{
                title:
                  'Complaint Details',
              }}
            />

            <Stack.Screen
              name="Profile"
              component={
                ProfileScreen
              }
              options={{
                title: 'Your Profile',
              }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}