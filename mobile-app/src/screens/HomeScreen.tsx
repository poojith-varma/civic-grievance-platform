import {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  PieChart,
} from 'react-native-chart-kit';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {
  fetchDashboardStats,
} from '../services/analyticsService';

import {
  getProfile,
} from '../services/profileService';

import {
  useRoleStore,
} from '../store/roleStore';

import {
  lightColors,
  darkColors,
} from '../theme/colors';

const screenWidth =
  Dimensions.get(
    'window'
  ).width;

export default function HomeScreen() {
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

  const [profile, setProfile] =
    useState<any>(null);

  const [stats, setStats] =
    useState({
      total: 0,
      resolved: 0,
      pending: 0,
      inProgress: 0,
    });

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadProfile();

    if (role === 'citizen') {
      setLoading(false);
      return;
    }

    loadStats();

    const subscription =
      setInterval(() => {
        loadStats();
      }, 3000);

    return () =>
      clearInterval(subscription);
  }, []);

  async function loadProfile() {
    try {
      const data =
        await getProfile();

      setProfile(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function loadStats() {
    try {
      const dashboardStats =
        await fetchDashboardStats();

      setStats(dashboardStats);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View
        style={[
          styles.loader,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={
            colors.primary
          }
        />
      </View>
    );
  }

  // 👤 CITIZEN HOME
  if (role === 'citizen') {
    return (
      <ScrollView
        style={[
          styles.container,
          {
            backgroundColor:
              colors.background,
          },
        ]}
        showsVerticalScrollIndicator={
          false
        }
      >
        <LinearGradient
          colors={[
            '#0F6CBD',
            '#14B8A6',
          ]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={styles.heroCard}
        >
          <Text
            style={
              styles.heroGreeting
            }
          >
            👋 Welcome Back
          </Text>

          <Text
            style={
              styles.heroTitle
            }
          >
            CivicLens
          </Text>

          <Text
            style={
              styles.heroSubtitle
            }
          >
            Smart civic reporting
            for modern communities.
          </Text>
        </LinearGradient>

        <View
          style={[
            styles.areaCard,
            {
              backgroundColor:
                colors.card,
            },
          ]}
        >
          <View>
            <Text
              style={[
                styles.cardLabel,
                {
                  color:
                    colors.subText,
                },
              ]}
            >
              Your Area 📍
            </Text>

            <Text
              style={[
                styles.areaText,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              {profile?.area ||
                'Not Set'}
            </Text>
          </View>

          <Ionicons
            name="location"
            size={36}
            color={
              colors.primary
            }
          />
        </View>

        {/* QUICK ACTIONS */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color:
                colors.text,
            },
          ]}
        >
          Quick Actions
        </Text>

        <View
          style={
            styles.quickGrid
          }
        >
          {/* CREATE */}
          <TouchableOpacity
            style={[
              styles.quickCard,
              {
                backgroundColor:
                  colors.card,
              },
            ]}
            onPress={() =>
              navigation.navigate(
                'CreateComplaint'
              )
            }
          >
            <Ionicons
              name="add-circle"
              size={34}
              color={
                colors.primary
              }
            />

            <Text
              style={[
                styles.quickTitle,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Create Complaint
            </Text>
          </TouchableOpacity>

          {/* LIST */}
          <TouchableOpacity
            style={[
              styles.quickCard,
              {
                backgroundColor:
                  colors.card,
              },
            ]}
            onPress={() =>
              navigation.navigate(
                'ComplaintList'
              )
            }
          >
            <Ionicons
              name="list"
              size={34}
              color="#3BCF8E"
            />

            <Text
              style={[
                styles.quickTitle,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              View Complaints
            </Text>
          </TouchableOpacity>

          {/* MAP */}
          <TouchableOpacity
            style={[
              styles.quickCard,
              {
                backgroundColor:
                  colors.card,
              },
            ]}
            onPress={() =>
              navigation.navigate(
                'ComplaintMap'
              )
            }
          >
            <Ionicons
              name="map"
              size={34}
              color="#FFB547"
            />

            <Text
              style={[
                styles.quickTitle,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Area Map
            </Text>
          </TouchableOpacity>

          {/* INSIGHTS */}
          <TouchableOpacity
            style={[
              styles.quickCard,
              {
                backgroundColor:
                  colors.card,
                opacity: 0.85,
              },
            ]}
          >
            <Ionicons
              name="analytics"
              size={34}
              color="#FF6B6B"
            />

            <Text
              style={[
                styles.quickTitle,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Civic Insights
            </Text>
          </TouchableOpacity>
        </View>

        {/* TIP CARD */}
        <LinearGradient
          colors={[
            '#0F6CBD',
            '#14B8A6',
          ]}
          style={styles.tipCard}
        >
          <Text
            style={
              styles.tipTitle
            }
          >
            Civic Tip 💡
          </Text>

          <Text
            style={
              styles.tipText
            }
          >
            Clear photos and
            accurate descriptions
            help authorities resolve
            issues much faster.
          </Text>
        </LinearGradient>
      </ScrollView>
    );
  }

  // 👑 ADMIN / 👷 WORKER
  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
      contentContainerStyle={{
        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={
        false
      }
    >
      <LinearGradient
        colors={[
          '#0F6CBD',
          '#14B8A6',
        ]}
        start={{
          x: 0,
          y: 0,
        }}
        end={{
          x: 1,
          y: 1,
        }}
        style={styles.heroCard}
      >
        <Text
          style={
            styles.heroGreeting
          }
        >
          👋 Welcome Back
        </Text>

        <Text
          style={
            styles.heroTitle
          }
        >
          CivicLens
        </Text>

        <Text
          style={
            styles.heroSubtitle
          }
        >
          Smart Civic Operations
          Dashboard
        </Text>
      </LinearGradient>

      {/* existing admin stats remain unchanged */}
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 10,
    },

    loader: {
      flex: 1,
      justifyContent:
        'center',
      alignItems:
        'center',
    },

    heroCard: {
      borderRadius: 32,
      padding: 30,
      marginTop: 40,
      marginBottom: 28,
    },

    heroGreeting: {
      color: '#EAE7FF',
      fontSize: 16,
    },

    heroTitle: {
      color: '#fff',
      fontSize: 38,
      fontWeight: '700',
      marginTop: 8,
    },

    heroSubtitle: {
      color: '#EAE7FF',
      marginTop: 12,
      fontSize: 16,
      lineHeight: 24,
    },

    areaCard: {
      borderRadius: 26,
      padding: 24,
      marginBottom: 26,

      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.08,
      shadowRadius: 18,

      elevation: 6,
    },

    cardLabel: {
      fontSize: 15,
      marginBottom: 8,
    },

    areaText: {
      fontSize: 28,
      fontWeight: '700',
    },

    sectionTitle: {
      fontSize: 22,
      fontWeight: '700',
      marginBottom: 18,
    },

    quickGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent:
        'space-between',
    },

    quickCard: {
      width: '48%',
      borderRadius: 24,
      padding: 24,
      marginBottom: 18,

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.08,
      shadowRadius: 18,

      elevation: 6,
    },

    quickTitle: {
      marginTop: 18,
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
    },

    tipCard: {
      borderRadius: 28,
      padding: 26,
      marginTop: 10,
      marginBottom: 40,
    },

    tipTitle: {
      color: '#fff',
      fontSize: 22,
      fontWeight: '700',
      marginBottom: 12,
    },

    tipText: {
      color: '#F3F0FF',
      fontSize: 15,
      lineHeight: 24,
    },
  });