import {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  fetchComplaints,
} from '../services/complaintService';

import { supabase } from '../services/supabase';

import {
  lightColors,
  darkColors,
} from '../theme/colors';

export default function ComplaintListScreen() {
  const navigation = useNavigation<any>();

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

  useEffect(() => {
    loadComplaints();

    const channel =
      supabase
        .channel('complaints-realtime')
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

  function formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

  function getStatusStyle(status: string) {
    switch (status) {
      case 'resolved':
        return {
          backgroundColor: '#d4edda',
          textColor: '#155724',
        };

      case 'in_progress':
        return {
          backgroundColor: '#cce5ff',
          textColor: '#004085',
        };

      default:
        return {
          backgroundColor: '#fff3cd',
          textColor: '#856404',
        };
    }
  }

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.center,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <ActivityIndicator size="large" />
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
      <Text
        style={[
          styles.screenTitle,
          {
            color: colors.text,
          },
        ]}
      >
        My Complaints
      </Text>

      <FlatList
        data={complaints}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={{
          padding: 20,
        }}
        renderItem={({ item }) => {
          const statusStyle =
            getStatusStyle(
              item.status
            );

          return (
            <TouchableOpacity
              activeOpacity={0.8}
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
                <View style={styles.cardHeader}>
                  <Text
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

                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          statusStyle.backgroundColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            statusStyle.textColor,
                        },
                      ]}
                    >
                      {item.status ||
                        'pending'}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.description,
                    {
                      color:
                        colors.subText,
                    },
                  ]}
                >
                  {item.description}
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
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text
            style={[
              styles.emptyText,
              {
                color:
                  colors.subText,
              },
            ]}
          >
            No complaints found
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 20,
    marginLeft: 20,
  },

  card: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,

    elevation: 3,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 10,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'capitalize',
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14,
  },

  date: {
    fontSize: 12,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 40,
  },
});