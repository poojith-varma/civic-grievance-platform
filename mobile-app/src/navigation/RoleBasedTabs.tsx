import {
  useState,
  useCallback,
} from 'react';

import {
  TouchableOpacity,
  Image,
  View,
  Text,
  useColorScheme,
  Modal,
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
  getUnreadCount,
} from '../services/notificationService';

import {
  useAuthStore,
} from '../store/authStore';

import {
  useRoleStore,
} from '../store/roleStore';

import {
  lightColors,
  darkColors,
} from '../theme/colors';

const Tab =
  createBottomTabNavigator();

export default function RoleBasedTabs() {
  const role =
    useRoleStore(
      (state) => state.role
    );

  const navigation =
    useNavigation<any>();

  const colorScheme =
    useColorScheme();

  const colors =
    colorScheme === 'dark'
      ? darkColors
      : lightColors;

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

  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);

  const [
    profileMenuVisible,
    setProfileMenuVisible,
  ] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadProfileImage();
      loadUnreadCount();
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

  async function loadUnreadCount() {
    try {
      const count =
        await getUnreadCount();

      setUnreadCount(
        count || 0
      );
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
    setProfileMenuVisible(true);
  }

  const screenOptions = {
    headerShown: true,

    headerStyle: {
      backgroundColor:
        colors.card,

      elevation: 0,
      shadowOpacity: 0,

      borderBottomWidth: 0,
    },

    headerTitleStyle: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
    },

    headerShadowVisible: false,

    headerTransparent: false,

    headerRight: () => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 18,
        }}
      >
        {/* NOTIFICATION BELL */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              'Notifications'
            )
          }
          style={{
            marginRight: 18,
          }}
        >
          <View>
            <Ionicons
              name="notifications"
              size={28}
              color="#4F7CFF"
            />

            {unreadCount >
              0 && (
              <View
                style={{
                  position:
                    'absolute',

                  top: -6,
                  right: -8,

                  backgroundColor:
                    '#EF4444',

                  borderRadius: 20,

                  minWidth: 20,
                  height: 20,

                  justifyContent:
                    'center',

                  alignItems:
                    'center',

                  paddingHorizontal: 5,
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: '700',
                  }}
                >
                  {
                    unreadCount
                  }
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* PROFILE */}
        <TouchableOpacity
          onPress={
            openProfileMenu
          }
        >
          {profileImage ? (
            <Image
              source={{
                uri: profileImage,
              }}
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,

                borderWidth: 2,
                borderColor:
                  '#7BA7FF',
              }}
            />
          ) : (
            <Ionicons
              name="person-circle"
              size={40}
              color="#4F7CFF"
            />
          )}
        </TouchableOpacity>
      </View>
    ),

    tabBarActiveTintColor:
      '#4F7CFF',

    tabBarInactiveTintColor:
      '#94A3B8',

    tabBarShowLabel: true,

    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: '600',
      marginBottom: 4,
    },

    tabBarStyle: {
      position: 'absolute',

      left: 12,
      right: 12,
      bottom: 6,

      height: 68,

      borderRadius: 24,

      backgroundColor:
        colorScheme === 'dark'
          ? '#111827'
          : '#FFFFFF',

      borderTopWidth: 0,

      paddingTop: 6,
      paddingBottom: 6,

      shadowColor: '#000',

      shadowOffset: {
        width: 0,
        height: 6,
      },

      shadowOpacity: 0.1,
      shadowRadius: 14,

      elevation: 10,
    },

    tabBarItemStyle: {
      justifyContent: 'center',
      alignItems: 'center',
    },

    tabBarIconStyle: {
      marginTop: 2,
    },

    sceneStyle: {
      backgroundColor:
        colors.background,

      paddingBottom: 82,
    },
  };

  const ProfileMenuModal = () => (
    <Modal
      visible={profileMenuVisible}
      transparent
      animationType="fade"
      onRequestClose={() =>
        setProfileMenuVisible(
          false
        )
      }
    >
      <View
        style={{
          flex: 1,
          backgroundColor:
            'rgba(0,0,0,0.45)',

          justifyContent:
            'center',

          alignItems:
            'center',

          padding: 24,
        }}
      >
        <View
          style={{
            width: '100%',
            maxWidth: 340,

            backgroundColor:
              colorScheme === 'dark'
                ? '#1e293b'
                : '#fff',

            borderRadius: 28,

            padding: 24,

            shadowColor: '#000',

            shadowOffset: {
              width: 0,
              height: 6,
            },

            shadowOpacity: 0.2,
            shadowRadius: 12,

            elevation: 12,
          }}
        >
          {/* HEADER */}
          <View
            style={{
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            {profileImage ? (
              <Image
                source={{
                  uri: profileImage,
                }}
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: 42,
                  marginBottom: 14,
                  borderWidth: 3,
                  borderColor:
                    '#4F7CFF',
                }}
              />
            ) : (
              <Ionicons
                name="person-circle"
                size={86}
                color="#4F7CFF"
              />
            )}

            <Text
              style={{
                fontSize: 22,
                fontWeight: '700',
                color:
                  colors.text,
              }}
            >
              CivicLens Account
            </Text>

            <Text
              style={{
                marginTop: 4,
                color:
                  colorScheme ===
                  'dark'
                    ? '#CBD5E1'
                    : '#64748B',

                fontSize: 14,
              }}
            >
              Manage your account
            </Text>
          </View>

          {/* PROFILE */}
          <TouchableOpacity
            onPress={() => {
              setProfileMenuVisible(
                false
              );

              navigation.navigate(
                'Profile'
              );
            }}
            style={{
              backgroundColor:
                '#4F7CFF',

              paddingVertical: 16,

              borderRadius: 18,

              alignItems: 'center',

              marginBottom: 14,
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: '700',
              }}
            >
              👤 Your Profile
            </Text>
          </TouchableOpacity>

          {/* LOGOUT */}
          <TouchableOpacity
            onPress={() => {
              setProfileMenuVisible(
                false
              );

              handleLogout();
            }}
            style={{
              backgroundColor:
                '#EF4444',

              paddingVertical: 16,

              borderRadius: 18,

              alignItems: 'center',

              marginBottom: 14,
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: '700',
              }}
            >
              🔒 Logout
            </Text>
          </TouchableOpacity>

          {/* CANCEL */}
          <TouchableOpacity
            onPress={() =>
              setProfileMenuVisible(
                false
              )
            }
            style={{
              backgroundColor:
                colorScheme ===
                'dark'
                  ? '#334155'
                  : '#F1F5F9',

              paddingVertical: 16,

              borderRadius: 18,

              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color:
                  colors.text,
                fontSize: 16,
                fontWeight: '700',
              }}
            >
              ✖ Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // 👤 CITIZEN
  if (role === 'citizen') {
    return (
      <>
        <ProfileMenuModal />

        <Tab.Navigator
          screenOptions={
            screenOptions
          }
        >
          <Tab.Screen
            name="HomeTab"
            component={
              HomeScreen
            }
            options={{
              title: 'Home',

              tabBarIcon: ({
                color,
                focused,
              }) => (
                <Ionicons
                  name={
                    focused
                      ? 'home'
                      : 'home-outline'
                  }
                  size={26}
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
                focused,
              }) => (
                <Ionicons
                  name={
                    focused
                      ? 'add-circle'
                      : 'add-circle-outline'
                  }
                  size={28}
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
                focused,
              }) => (
                <Ionicons
                  name={
                    focused
                      ? 'document-text'
                      : 'document-text-outline'
                  }
                  size={26}
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
                focused,
              }) => (
                <Ionicons
                  name={
                    focused
                      ? 'map'
                      : 'map-outline'
                  }
                  size={26}
                  color={color}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </>
    );
  }

  // 🛠️ WORKER
  if (role === 'worker') {
    return (
      <>
        <ProfileMenuModal />

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
                focused,
              }) => (
                <Ionicons
                  name={
                    focused
                      ? 'construct'
                      : 'construct-outline'
                  }
                  size={26}
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
                focused,
              }) => (
                <Ionicons
                  name={
                    focused
                      ? 'map'
                      : 'map-outline'
                  }
                  size={26}
                  color={color}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </>
    );
  }

  // 👑 ADMIN
  return (
    <>
      <ProfileMenuModal />

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
              focused,
            }) => (
              <Ionicons
                name={
                  focused
                    ? 'stats-chart'
                    : 'stats-chart-outline'
                }
                size={26}
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
              focused,
            }) => (
              <Ionicons
                name={
                  focused
                    ? 'document-text'
                    : 'document-text-outline'
                }
                size={26}
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
              focused,
            }) => (
              <Ionicons
                name={
                  focused
                    ? 'map'
                    : 'map-outline'
                }
                size={26}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}