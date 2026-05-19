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

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import CreateComplaintScreen from '../screens/CreateComplaintScreen';
import ComplaintListScreen from '../screens/ComplaintListScreen';

import {
  getCurrentSession,
} from '../services/authService';

import {
  useAuthStore,
} from '../store/authStore';

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

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const session =
          await getCurrentSession();

        if (session) {
          setAuthenticated(true);
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
              name="Home"
              component={HomeScreen}
            />

            <Stack.Screen
              name="CreateComplaint"
              component={
                CreateComplaintScreen
              }
            />

            <Stack.Screen
              name="ComplaintList"
              component={
                ComplaintListScreen
              }
              options={{
                title: 'My Complaints',
              }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}