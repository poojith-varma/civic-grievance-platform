import {
  useState,
  useCallback,
} from 'react';

import {
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';

import {
  Ionicons,
} from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';

import CreateComplaintScreen from '../screens/CreateComplaintScreen';

import ComplaintListScreen from '../screens/ComplaintListScreen';

import ComplaintMapScreen from '../screens/ComplaintMapScreen';

import {
  signOut,
} from '../services/authService';

import {
  getProfile,
} from '../services/profileService';

import {
  useAuthStore,
} from '../store/authStore';

import {
  useRoleStore,
} from '../store/roleStore';

const Tab =
  createBottomTabNavigator();

export default function RoleBasedTabs() {
  const role =
    useRoleStore(
      (state) => state.role
    );

  const navigation =
    useNavigation<any>();

  const setAuthenticated =
    useAuthStore(
      (state) =>
        state.setAuthenticated
    );

  const [
    profileImage,
    setProfileImage,
  ] = useState<
    string | null
  >(null);

  // ✅ REFRESH IMAGE ON SCREEN FOCUS
  useFocusEffect(
    useCallback(() => {
      loadProfileImage();
    }, [])
  );

  async function loadProfileImage() {
    try {
      const profile =
        await getProfile();

      if (
        profile?.profile_image
      ) {
        setProfileImage(
          profile.profile_image
        );
      } else {
        setProfileImage(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleLogout() {
    try {
      await signOut();

      setAuthenticated(false);
    } catch (error) {
      console.log(error);
    }
  }

  function openProfileMenu() {
    Alert.alert(
      'Account',
      'Choose an option',
      [
        {
          text: 'Your Profile',
          onPress: () =>
            navigation.navigate(
              'Profile'
            ),
        },

        {
          text: 'Logout',
          style: 'destructive',
          onPress:
            handleLogout,
        },

        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  }

  const screenOptions = {
    headerShown: true,

    headerRight: () => (
      <TouchableOpacity
        onPress={
          openProfileMenu
        }
        style={{
          marginRight: 16,
        }}
      >
        {profileImage ? (
          <Image
            source={{
              uri: profileImage,
            }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
            }}
          />
        ) : (
          <Ionicons
            name="person-circle"
            size={34}
            color="#007bff"
          />
        )}
      </TouchableOpacity>
    ),

    tabBarStyle: {
      height: 65,
      paddingBottom: 8,
      paddingTop: 8,
    },

    tabBarLabelStyle: {
      fontSize: 11,
    },
  };

  // 👤 CITIZEN
  if (role === 'citizen') {
    return (
      <Tab.Navigator
        screenOptions={
          screenOptions
        }
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeScreen}
          options={{
            title: 'Home',

            tabBarIcon: ({
              color,
            }) => (
              <Ionicons
                name="home"
                size={24}
                color={color}
              />
            ),
          }}
        />

        <Tab.Screen
          name="CreateComplaint"
          component={
            CreateComplaintScreen
          }
          options={{
            title: 'Create',

            tabBarIcon: ({
              color,
            }) => (
              <Ionicons
                name="add-circle"
                size={24}
                color={color}
              />
            ),
          }}
        />

        <Tab.Screen
          name="ComplaintList"
          component={
            ComplaintListScreen
          }
          options={{
            title:
              'Complaints',

            tabBarIcon: ({
              color,
            }) => (
              <Ionicons
                name="list"
                size={24}
                color={color}
              />
            ),
          }}
        />

        <Tab.Screen
          name="ComplaintMap"
          component={
            ComplaintMapScreen
          }
          options={{
            title: 'Map',

            tabBarIcon: ({
              color,
            }) => (
              <Ionicons
                name="map"
                size={24}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  // 🛠️ WORKER
  if (role === 'worker') {
    return (
      <Tab.Navigator
        screenOptions={
          screenOptions
        }
      >
        <Tab.Screen
          name="WorkerTasks"
          component={
            ComplaintListScreen
          }
          options={{
            title:
              'Complaints',

            tabBarIcon: ({
              color,
            }) => (
              <Ionicons
                name="construct"
                size={24}
                color={color}
              />
            ),
          }}
        />

        <Tab.Screen
          name="WorkerMap"
          component={
            ComplaintMapScreen
          }
          options={{
            title: 'Map',

            tabBarIcon: ({
              color,
            }) => (
              <Ionicons
                name="map"
                size={24}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  // 👑 ADMIN
  return (
    <Tab.Navigator
      screenOptions={
        screenOptions
      }
    >
      <Tab.Screen
        name="AdminDashboard"
        component={HomeScreen}
        options={{
          title:
            'Dashboard',

          tabBarIcon: ({
            color,
          }) => (
            <Ionicons
              name="stats-chart"
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="AllComplaints"
        component={
          ComplaintListScreen
        }
        options={{
          title:
            'Complaints',

          tabBarIcon: ({
            color,
          }) => (
            <Ionicons
              name="list"
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="AdminMap"
        component={
          ComplaintMapScreen
        }
        options={{
          title: 'Map',

          tabBarIcon: ({
            color,
          }) => (
            <Ionicons
              name="map"
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}