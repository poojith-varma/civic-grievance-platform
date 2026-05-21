import {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {
  fetchComplaints,
} from '../services/complaintService';

import {
  getUserRole,
} from '../services/roleService';

import { supabase } from '../services/supabase';

import {
  lightColors,
  darkColors,
} from '../theme/colors';

export default function ComplaintListScreen() {
  const navigation =
    useNavigation<any>();

  const colorScheme =
    useColorScheme();

  const colors =
    colorScheme === 'dark'
      ? darkColors
      : lightColors;

  const [complaints, setComplaints] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [role, setRole] =
    useState('');

  useEffect(() => {
    initialize();

    const channel =
      supabase
        .channel(
          'complaints-realtime'
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'complaints',
          },
          () => {
            loadComplaints();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, []);

  async function initialize() {
    try {
      const currentRole =
        await getUserRole();

      setRole(currentRole || '');

      await loadComplaints();
    } catch (error) {
      console.log(error);
    }
  }

  async function loadComplaints() {
    try {
      const data =
        await fetchComplaints();

      setComplaints(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);

    await loadComplaints();
  }

  function formatDate(
    date: string
  ) {
    return new Date(
      date
    ).toLocaleString();
  }

  function getStatusData(
    status: string
  ) {
    switch (status) {
      case 'resolved':
        return {
          label: 'Resolved',
          backgroundColor:
            '#DCFCE7',
          textColor: '#166534',
          icon:
            'checkmark-circle',
        };

      case 'assigned':
        return {
          label: 'Assigned',
          backgroundColor:
            '#E0E7FF',
          textColor: '#4338CA',
          icon: 'people',
        };

      case 'in_progress':
        return {
          label: 'In Progress',
          backgroundColor:
            '#DBEAFE',
          textColor: '#1D4ED8',
          icon: 'construct',
        };

      case 'verification_pending':
        return {
          label:
            'Verification',
          backgroundColor:
            '#FEF3C7',
          textColor: '#92400E',
          icon:
            'shield-checkmark',
        };

      case 'rejected':
        return {
          label: 'Rejected',
          backgroundColor:
            '#FEE2E2',
          textColor: '#DC2626',
          icon:
            'close-circle',
        };

      default:
        return {
          label: 'Pending',
          backgroundColor:
            '#FEF3C7',
          textColor: '#92400E',
          icon:
            'alert-circle',
        };
    }
  }

  function getCardAccent(
    status: string
  ) {
    switch (status) {
      case 'resolved':
        return [
          '#22C55E',
          '#4ADE80',
        ];

      case 'assigned':
        return [
          '#6366F1',
          '#818CF8',
        ];

      case 'in_progress':
        return [
          '#3B82F6',
          '#60A5FA',
        ];

      case 'verification_pending':
        return [
          '#F59E0B',
          '#FBBF24',
        ];

      case 'rejected':
        return [
          '#EF4444',
          '#F87171',
        ];

      default:
        return [
          '#4F7CFF',
          '#7BA7FF',
        ];
    }
  }

  function getCardIcon(
    status: string
  ) {
    switch (status) {
      case 'resolved':
        return 'checkmark-done';

      case 'assigned':
        return 'people';

      case 'in_progress':
        return 'construct';

      case 'verification_pending':
        return 'shield-checkmark';

      case 'rejected':
        return 'close-circle';

      default:
        return 'alert-circle';
    }
  }

  function renderComplaintCard(
    item: any
  ) {
    const statusData =
      getStatusData(
        item.status
      );

    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.92}
        onPress={() =>
          navigation.navigate(
            'ComplaintDetail',
            {
              complaint: item,
            }
          )
        }
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor:
                colors.card,
            },
          ]}
        >
          <LinearGradient
            colors={getCardAccent(
              item.status
            )}
            start={{
              x: 0,
              y: 0,
            }}
            end={{
              x: 1,
              y: 1,
            }}
            style={
              styles.topAccent
            }
          />

          <View
            style={
              styles.cardTop
            }
          >
            <LinearGradient
              colors={getCardAccent(
                item.status
              )}
              style={
                styles.iconContainer
              }
            >
              <Ionicons
                name={
                  getCardIcon(
                    item.status
                  ) as any
                }
                size={24}
                color="#fff"
              />
            </LinearGradient>

            <View
              style={{
                flex: 1,
                marginLeft: 14,
              }}
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.title,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {item.title}
              </Text>

              <Text
                style={[
                  styles.date,
                  {
                    color:
                      colors.subText,
                  },
                ]}
              >
                {formatDate(
                  item.created_at
                )}
              </Text>

              {item.area && (
                <Text
                  style={
                    styles.areaText
                  }
                >
                  📍 {item.area}
                </Text>
              )}

              {role ===
                'admin' &&
                item.profiles
                  ?.name && (
                  <Text
                    style={
                      styles.reportedBy
                    }
                  >
                    👤 Reported by:{' '}
                    {
                      item
                        .profiles
                        .name
                    }
                  </Text>
                )}
            </View>

            <Ionicons
              name="chevron-forward"
              size={22}
              color="#94A3B8"
            />
          </View>

          <Text
            numberOfLines={3}
            style={[
              styles.description,
              {
                color:
                  colors.subText,
              },
            ]}
          >
            {
              item.description
            }
          </Text>

          <View
            style={
              styles.footerRow
            }
          >
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    statusData.backgroundColor,
                },
              ]}
            >
              <Ionicons
                name={
                  statusData.icon as any
                }
                size={14}
                color={
                  statusData.textColor
                }
              />

              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      statusData.textColor,
                  },
                ]}
              >
                {
                  statusData.label
                }
              </Text>
            </View>

            <View
              style={
                styles.viewMoreRow
              }
            >
              <Text
                style={
                  styles.viewMoreText
                }
              >
                View Details
              </Text>

              <Ionicons
                name="arrow-forward"
                size={14}
                color="#4F7CFF"
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function renderSection(
    title: string,
    data: any[],
    icon: string
  ) {
    if (data.length === 0) {
      return null;
    }

    return (
      <View
        style={
          styles.sectionContainer
        }
      >
        <View
          style={
            styles.sectionHeader
          }
        >
          <Ionicons
            name={icon as any}
            size={22}
            color="#4F7CFF"
          />

          <Text
            style={[
              styles.sectionTitle,
              {
                color:
                  colors.text,
              },
            ]}
          >
            {title} (
            {data.length})
          </Text>
        </View>

        {data.map((item) =>
          renderComplaintCard(
            item
          )
        )}
      </View>
    );
  }

  const assignedComplaints =
    complaints.filter(
      (item) =>
        item.status ===
        'assigned'
    );

  const inProgressComplaints =
    complaints.filter(
      (item) =>
        item.status ===
        'in_progress'
    );

  const verificationComplaints =
    complaints.filter(
      (item) =>
        item.status ===
        'verification_pending'
    );

  const resolvedComplaints =
    complaints.filter(
      (item) =>
        item.status ===
        'resolved'
    );

  const rejectedComplaints =
    complaints.filter(
      (item) =>
        item.status ===
        'rejected'
    );

  const activeComplaints =
    complaints.filter(
      (item) =>
        item.status ===
          'assigned' ||
        item.status ===
          'in_progress'
    );

  if (loading) {
    return (
      <SafeAreaView
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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={{
          paddingBottom: 140,
          paddingHorizontal: 20,
        }}
      >
        {/* HERO */}
        <LinearGradient
          colors={[
            '#4F7CFF',
            '#7BA7FF',
          ]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={
            styles.heroCard
          }
        >
          <Text
            style={
              styles.heroGreeting
            }
          >
            📋 Civic Reports
          </Text>

          <Text
            style={
              styles.heroTitle
            }
          >
            {role === 'admin'
              ? 'All Complaints'
              : role === 'worker'
              ? 'Worker Queue'
              : 'Your Complaints'}
          </Text>

          <Text
            style={
              styles.heroSubtitle
            }
          >
            Track complaint
            progress and civic
            issue updates in
            real time.
          </Text>

          <View
            style={
              styles.statsRow
            }
          >
            {/* TOTAL */}
            <View
              style={
                styles.statsCard
              }
            >
              <Text
                style={
                  styles.statsNumber
                }
              >
                {
                  complaints.length
                }
              </Text>

              <Text
                style={
                  styles.statsLabel
                }
              >
                Total
              </Text>
            </View>

            {/* ACTIVE */}
            <View
              style={
                styles.statsCard
              }
            >
              <Text
                style={
                  styles.statsNumber
                }
              >
                {
                  activeComplaints.length
                }
              </Text>

              <Text
                style={
                  styles.statsLabel
                }
              >
                Active
              </Text>
            </View>

            {/* RESOLVED */}
            <View
              style={
                styles.statsCard
              }
            >
              <Text
                style={
                  styles.statsNumber
                }
              >
                {
                  resolvedComplaints.length
                }
              </Text>

              <Text
                style={
                  styles.statsLabel
                }
              >
                Resolved
              </Text>
            </View>

            {/* REJECTED */}
            <View
              style={
                styles.statsCard
              }
            >
              <Text
                style={
                  styles.statsNumber
                }
              >
                {
                  rejectedComplaints.length
                }
              </Text>

              <Text
                style={
                  styles.statsLabel
                }
              >
                Rejected
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* WORKER QUEUES */}
        {role ===
        'worker' ? (
          <>
            {renderSection(
              'Assigned Tasks',
              assignedComplaints,
              'people'
            )}

            {renderSection(
              'In Progress',
              inProgressComplaints,
              'construct'
            )}

            {renderSection(
              'Verification Pending',
              verificationComplaints,
              'shield-checkmark'
            )}

            {renderSection(
              'Completed',
              resolvedComplaints,
              'checkmark-circle'
            )}
          </>
        ) : (
          <>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Recent Complaints
            </Text>

            {complaints.map(
              (item) =>
                renderComplaintCard(
                  item
                )
            )}
          </>
        )}

        {complaints.length ===
          0 && (
          <View
            style={
              styles.emptyContainer
            }
          >
            <Ionicons
              name="document-text-outline"
              size={70}
              color="#CBD5E1"
            />

            <Text
              style={[
                styles.emptyTitle,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              No Complaints Yet
            </Text>

            <Text
              style={[
                styles.emptySubtitle,
                {
                  color:
                    colors.subText,
                },
              ]}
            >
              Your submitted civic
              complaints will appear
              here.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
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
      marginTop: 20,
      marginBottom: 28,
    },

    heroGreeting: {
      color: '#EAF1FF',
      fontSize: 16,
    },

    heroTitle: {
      color: '#fff',
      fontSize: 34,
      fontWeight: '700',
      marginTop: 8,
    },

    heroSubtitle: {
      color: '#EAF1FF',
      marginTop: 12,
      fontSize: 15,
      lineHeight: 24,
    },

    statsRow: {
      flexDirection: 'row',
      marginTop: 24,
      flexWrap: 'wrap',
    },

    statsCard: {
      backgroundColor:
        'rgba(255,255,255,0.18)',
      borderRadius: 20,
      paddingVertical: 18,
      paddingHorizontal: 20,
      marginRight: 10,
      marginBottom: 10,
      minWidth: 90,
    },

    statsNumber: {
      color: '#fff',
      fontSize: 22,
      fontWeight: '700',
    },

    statsLabel: {
      color: '#EAF1FF',
      marginTop: 4,
      fontSize: 13,
    },

    sectionContainer: {
      marginBottom: 10,
    },

    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },

    sectionTitle: {
      fontSize: 22,
      fontWeight: '700',
      marginLeft: 10,
      marginBottom: 18,
    },

    card: {
      borderRadius: 30,
      padding: 24,
      marginBottom: 22,

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 10,
      },

      shadowOpacity: 0.12,
      shadowRadius: 18,

      elevation: 8,

      overflow: 'hidden',
    },

    topAccent: {
      height: 6,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,

      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },

    cardTop: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 18,
      marginTop: 6,
    },

    iconContainer: {
      width: 60,
      height: 60,
      borderRadius: 22,

      justifyContent:
        'center',

      alignItems: 'center',

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 6,
      },

      shadowOpacity: 0.15,
      shadowRadius: 10,

      elevation: 8,
    },

    title: {
      fontSize: 19,
      fontWeight: '700',
      marginBottom: 4,
    },

    date: {
      fontSize: 13,
    },

    areaText: {
      marginTop: 6,
      fontSize: 13,
      fontWeight: '600',
      color: '#4F7CFF',
    },

    reportedBy: {
      marginTop: 6,
      fontSize: 13,
      fontWeight: '600',
      color: '#7C3AED',
    },

    description: {
      fontSize: 15,
      lineHeight: 25,
      marginBottom: 18,
    },

    footerRow: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
    },

    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',

      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 30,
    },

    statusText: {
      fontSize: 13,
      fontWeight: '700',
      marginLeft: 6,
    },

    viewMoreRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    viewMoreText: {
      color: '#4F7CFF',
      fontWeight: '700',
      marginRight: 6,
    },

    emptyContainer: {
      alignItems: 'center',
      justifyContent:
        'center',
      marginTop: 80,
    },

    emptyTitle: {
      fontSize: 24,
      fontWeight: '700',
      marginTop: 20,
    },

    emptySubtitle: {
      fontSize: 15,
      textAlign: 'center',
      marginTop: 10,
      lineHeight: 24,
      paddingHorizontal: 30,
    },
  });