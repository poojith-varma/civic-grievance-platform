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
      rejected: 0,
      active: 0,
      pending: 0,
      inProgress: 0,
      verificationPending: 0,
      resolutionRate: 0,

      topArea: '',
      topAreaCount: 0,

      topWorkerCount: 0,
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
                  fontSize: 24,
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

          <TouchableOpacity
            style={[
              styles.quickCard,
              {
                backgroundColor:
                  colors.card,
                opacity: 0.9,
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

  // 👷 WORKER HOME
  if (role === 'worker') {
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
          style={styles.heroCard}
        >
          <Text
            style={
              styles.heroGreeting
            }
          >
            👷 Workforce Dashboard
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
            Manage assigned civic
            operations efficiently.
          </Text>
        </LinearGradient>

        <View
          style={
            styles.quickGrid
          }
        >
          <View
            style={[
              styles.quickCard,
              {
                backgroundColor:
                  colors.card,
              },
            ]}
          >
            <Ionicons
              name="construct"
              size={34}
              color="#4F7CFF"
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
              Active Tasks
            </Text>

            <Text
              style={{
                fontSize: 32,
                fontWeight: '700',
                marginTop: 10,
                color:
                  colors.text,
              }}
            >
              {
                stats.active
              }
            </Text>
          </View>

          <View
            style={[
              styles.quickCard,
              {
                backgroundColor:
                  colors.card,
              },
            ]}
          >
            <Ionicons
              name="shield-checkmark"
              size={34}
              color="#F59E0B"
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
              Verification
            </Text>

            <Text
              style={{
                fontSize: 32,
                fontWeight: '700',
                marginTop: 10,
                color:
                  colors.text,
              }}
            >
              {
                stats.verificationPending
              }
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  // 👑 ADMIN HOME
  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor:
            colorScheme === 'dark'
              ? '#07111F'
              : colors.background,
        },
      ]}
      contentContainerStyle={{
        paddingBottom: 50,
      }}
      showsVerticalScrollIndicator={
        false
      }
    >
      <LinearGradient
        colors={[
          '#0B63CE',
          '#14B8A6',
        ]}
        style={[
          styles.heroCard,
          {
            paddingVertical: 34,
          },
        ]}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent:
              'space-between',
            alignItems: 'center',
          }}
        >
          <View>
            <Text
              style={
                styles.heroGreeting
              }
            >
              👑 Admin Dashboard
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
              Analytics Center
            </Text>
          </View>

          <View
            style={{
              backgroundColor:
                'rgba(255,255,255,0.15)',

              width: 72,
              height: 72,

              borderRadius: 24,

              justifyContent:
                'center',

              alignItems:
                'center',

              position: 'absolute',
                right: 14,
                top: 5,
            }}
          >
            <Ionicons
              name="analytics"
              size={38}
              color="#fff"
            />
          </View>
        </View>
      </LinearGradient>

      {/* KPI GRID */}
      <View
        style={
          styles.quickGrid
        }
      >
        {[
          {
            title:
              'Total',
            value:
              stats.total,
            icon:
              'document-text',
            color:
              '#4F7CFF',
          },

          {
            title:
              'Resolved',
            value:
              stats.resolved,
            icon:
              'checkmark-circle',
            color:
              '#22C55E',
          },

          {
            title:
              'Active',
            value:
              stats.active,
            icon:
              'construct',
            color:
              '#F59E0B',
          },

          {
            title:
              'Rejected',
            value:
              stats.rejected,
            icon:
              'close-circle',
            color:
              '#EF4444',
          },
        ].map((item) => (
          <View
            key={item.title}
            style={[
              styles.quickCard,
              {
                backgroundColor:
                  colorScheme ===
                  'dark'
                    ? '#0B1727'
                    : colors.card,
              },
            ]}
          >
            <View
              style={{
                width: 58,
                height: 58,

                borderRadius: 18,

                backgroundColor:
                  `${item.color}20`,

                justifyContent:
                  'center',

                alignItems:
                  'center',
              }}
            >
              <Ionicons
                name={
                  item.icon as any
                }
                size={30}
                color={
                  item.color
                }
              />
            </View>

            <Text
              style={[
                styles.quickTitle,
                {
                  color:
                    colors.text,

                  marginTop: 16,
                },
              ]}
            >
              {item.title}
            </Text>

            <Text
              style={{
                fontSize: 32,
                fontWeight: '700',
                color:
                  colors.text,

                marginTop: 10,
              }}
            >
              {item.value}
            </Text>
          </View>
        ))}
      </View>

      {/* INSIGHT CARDS */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent:
            'space-between',

          marginBottom: 22,
        }}
      >
        <View
          style={[
            styles.areaCard,
            {
              width: '48%',

              backgroundColor:
                colorScheme ===
                'dark'
                  ? '#0B1727'
                  : colors.card,
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
              Resolution 📈
            </Text>

            <Text
              style={[
                styles.areaText,
                {
                  color:
                    '#22C55E',
                },
              ]}
            >
              {
                stats.resolutionRate
              }
              %
            </Text>
          </View>

          <Ionicons
            name="trending-up"
            size={34}
            color="#22C55E"
          />
        </View>

        <View
          style={[
            styles.areaCard,
            {
              width: '48%',

              backgroundColor:
                colorScheme ===
                'dark'
                  ? '#0B1727'
                  : colors.card,
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
              🔥 Top Area
            </Text>

            <Text
              style={[
                styles.areaText,
                {
                  color:
                    colors.text,

                  fontSize: 22,
                },
              ]}
              numberOfLines={1}
            >
              {stats.topArea ||
                'No Data'}
            </Text>
          </View>

          <Ionicons
            name="location"
            size={34}
            color="#EF4444"
          />
        </View>
      </View>

      {/* PREMIUM CHART */}
      <View
        style={[
          styles.areaCard,
          {
            backgroundColor:
              colorScheme ===
              'dark'
                ? '#0B1727'
                : colors.card,

            flexDirection:
              'column',

            alignItems:
              'center',
          },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            {
              color:
                colors.text,

              alignSelf:
                'flex-start',
            },
          ]}
        >
          📊 Complaint Breakdown
        </Text>

        <View
          style={{
            alignItems:
              'center',

            justifyContent:
              'center',
          }}
        >
          <PieChart
            data={[
              {
                name:
                  'Resolved',
                population:
                  stats.resolved,
                color:
                  '#22C55E',
                legendFontColor:
                  'transparent',
                legendFontSize: 0,
              },

              {
                name: 'Active',
                population:
                  stats.active,
                color:
                  '#F59E0B',
                legendFontColor:
                  'transparent',
                legendFontSize: 0,
              },

              {
                name:
                  'Rejected',
                population:
                  stats.rejected,
                color:
                  '#EF4444',
                legendFontColor:
                  'transparent',
                legendFontSize: 0,
              },

              {
                name:
                  'Pending',
                population:
                  stats.pending,
                color:
                  '#4F7CFF',
                legendFontColor:
                  'transparent',
                legendFontSize: 0,
              },
            ]}
            width={
              screenWidth - 80
            }
            height={220}
            chartConfig={{
              color: () =>
                '#000',
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="80"
            absolute
            hasLegend={false}
          />

          {/* LEGEND */}
          <View
            style={{
              width: '100%',
              marginTop: 10,
            }}
          >
            {[
              {
                label:
                  'Resolved',
                value:
                  stats.resolved,
                color:
                  '#22C55E',
              },

              {
                label:
                  'Active',
                value:
                  stats.active,
                color:
                  '#F59E0B',
              },

              {
                label:
                  'Rejected',
                value:
                  stats.rejected,
                color:
                  '#EF4444',
              },

              {
                label:
                  'Pending',
                value:
                  stats.pending,
                color:
                  '#4F7CFF',
              },
            ].map((item) => (
              <View
                key={
                  item.label
                }
                style={{
                  flexDirection:
                    'row',

                  alignItems:
                    'center',

                  justifyContent:
                    'space-between',

                  marginBottom: 16,
                }}
              >
                <View
                  style={{
                    flexDirection:
                      'row',

                    alignItems:
                      'center',
                  }}
                >
                  <View
                    style={{
                      width: 14,
                      height: 14,

                      borderRadius: 20,

                      backgroundColor:
                        item.color,

                      marginRight: 12,
                    }}
                  />

                  <Text
                    style={{
                      color:
                        colors.text,

                      fontSize: 15,

                      fontWeight:
                        '600',
                    }}
                  >
                    {item.label}
                  </Text>
                </View>

                <Text
                  style={{
                    color:
                      colors.text,

                    fontSize: 16,

                    fontWeight:
                      '700',
                  }}
                >
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
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
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 24,
    },

    quickGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent:
        'space-between',
    },

    quickCard: {
      width: '48%',
      borderRadius: 26,
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