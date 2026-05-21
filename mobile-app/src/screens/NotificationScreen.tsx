import {
  useEffect,
  useState,
} from 'react';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {
  fetchNotifications,
  markNotificationRead,
} from '../services/notificationService';

import {
  lightColors,
  darkColors,
} from '../theme/colors';

export default function NotificationScreen() {
  const colorScheme =
    useColorScheme();

  const colors =
    colorScheme === 'dark'
      ? darkColors
      : lightColors;

  const [
    notifications,
    setNotifications,
  ] = useState<any[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const data =
        await fetchNotifications();

      setNotifications(
        data || []
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function handleRead(
    id: string
  ) {
    try {
      await markNotificationRead(
        id
      );

      setNotifications(
        notifications.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  read: true,
                }
              : item
        )
      );
    } catch (error) {
      console.log(error);
    }
  }

  function formatDate(
    date: string
  ) {
    return new Date(
      date
    ).toLocaleString();
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
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}
      >
        <LinearGradient
          colors={[
            '#4F7CFF',
            '#7BA7FF',
          ]}
          style={
            styles.heroCard
          }
        >
          <Text
            style={
              styles.heroTitle
            }
          >
            🔔 Notifications
          </Text>

          <Text
            style={
              styles.heroSubtitle
            }
          >
            Stay updated with
            realtime civic
            activity.
          </Text>
        </LinearGradient>

        {notifications.map(
          (item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              onPress={() =>
                handleRead(
                  item.id
                )
              }
            >
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor:
                      colors.card,

                    borderLeftColor:
                      item.read
                        ? '#CBD5E1'
                        : '#4F7CFF',
                  },
                ]}
              >
                <View
                  style={
                    styles.cardTop
                  }
                >
                  <Ionicons
                    name="notifications"
                    size={24}
                    color="#4F7CFF"
                  />

                  {!item.read && (
                    <View
                      style={
                        styles.unreadDot
                      }
                    />
                  )}
                </View>

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

                <Text
                  style={[
                    styles.message,
                    {
                      color:
                        colors.subText,
                    },
                  ]}
                >
                  {
                    item.message
                  }
                </Text>

                <Text
                  style={
                    styles.date
                  }
                >
                  {formatDate(
                    item.created_at
                  )}
                </Text>
              </View>
            </TouchableOpacity>
          )
        )}

        {notifications.length ===
          0 && (
          <View
            style={
              styles.emptyContainer
            }
          >
            <Ionicons
              name="notifications-off"
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
              No Notifications
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

    heroCard: {
      borderRadius: 28,
      padding: 28,
      marginBottom: 28,
    },

    heroTitle: {
      color: '#fff',
      fontSize: 30,
      fontWeight: '700',
    },

    heroSubtitle: {
      color: '#EAF1FF',
      marginTop: 10,
      lineHeight: 24,
    },

    card: {
      borderRadius: 24,
      padding: 20,
      marginBottom: 18,
      borderLeftWidth: 6,

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 6,
      },

      shadowOpacity: 0.08,
      shadowRadius: 12,

      elevation: 6,
    },

    cardTop: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
    },

    unreadDot: {
      width: 12,
      height: 12,
      borderRadius: 20,
      backgroundColor:
        '#4F7CFF',
    },

    title: {
      fontSize: 18,
      fontWeight: '700',
      marginTop: 16,
    },

    message: {
      marginTop: 10,
      lineHeight: 24,
      fontSize: 15,
    },

    date: {
      marginTop: 16,
      color: '#94A3B8',
      fontSize: 13,
    },

    emptyContainer: {
      marginTop: 120,
      alignItems: 'center',
    },

    emptyTitle: {
      marginTop: 20,
      fontSize: 22,
      fontWeight: '700',
    },
  });