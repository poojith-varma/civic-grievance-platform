import {
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  ActivityIndicator,
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
  PieChart,
} from 'react-native-chart-kit';

import { useNavigation } from '@react-navigation/native';

import { signOut } from '../services/authService';

import { useAuthStore } from '../store/authStore';

import {
  fetchDashboardStats,
} from '../services/analyticsService';

import {
  lightColors,
  darkColors,
} from '../theme/colors';

export default function HomeScreen() {
  const navigation = useNavigation<any>();

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
    loadStats();

    const subscription =
      setInterval(() => {
        loadStats();
      }, 3000);

    return () =>
      clearInterval(subscription);
  }, []);

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

  async function handleLogout() {
    try {
      await signOut();

      setAuthenticated(false);
    } catch (error: any) {
      Alert.alert(
        'Logout Failed',
        error.message
      );
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
        />
      </View>
    );
  }

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
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.welcome,
            {
              color:
                colors.subText,
            },
          ]}
        >
          👋 Welcome Back
        </Text>

        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          CivicLens Dashboard
        </Text>
      </View>

      {/* FIRST ROW */}
      <View style={styles.statsContainer}>
        <View
          style={[
            styles.statCard,
            {
              backgroundColor:
                colors.card,
            },
          ]}
        >
          <Ionicons
            name="document-text"
            size={30}
            color={colors.primary}
          />

          <Text
            style={[
              styles.statNumber,
              {
                color:
                  colors.text,
              },
            ]}
          >
            {stats.total}
          </Text>

          <Text
            style={[
              styles.statLabel,
              {
                color:
                  colors.subText,
              },
            ]}
          >
            Total Complaints
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            {
              backgroundColor:
                colors.card,
            },
          ]}
        >
          <Ionicons
            name="checkmark-circle"
            size={30}
            color="#28a745"
          />

          <Text
            style={[
              styles.statNumber,
              {
                color:
                  colors.text,
              },
            ]}
          >
            {stats.resolved}
          </Text>

          <Text
            style={[
              styles.statLabel,
              {
                color:
                  colors.subText,
              },
            ]}
          >
            Resolved
          </Text>
        </View>
      </View>

      {/* SECOND ROW */}
      <View style={styles.statsContainer}>
        <View
          style={[
            styles.statCard,
            {
              backgroundColor:
                colors.card,
            },
          ]}
        >
          <Ionicons
            name="time"
            size={30}
            color="#ff9800"
          />

          <Text
            style={[
              styles.statNumber,
              {
                color:
                  colors.text,
              },
            ]}
          >
            {stats.pending}
          </Text>

          <Text
            style={[
              styles.statLabel,
              {
                color:
                  colors.subText,
              },
            ]}
          >
            Pending
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            {
              backgroundColor:
                colors.card,
            },
          ]}
        >
          <Ionicons
            name="construct"
            size={30}
            color="#6f42c1"
          />

          <Text
            style={[
              styles.statNumber,
              {
                color:
                  colors.text,
              },
            ]}
          >
            {stats.inProgress}
          </Text>

          <Text
            style={[
              styles.statLabel,
              {
                color:
                  colors.subText,
              },
            ]}
          >
            In Progress
          </Text>
        </View>
      </View>
      
      <Text
  style={[
    styles.sectionTitle,
    {
      color: colors.text,
    },
  ]}
>
  Complaint Analytics
</Text>

<PieChart
  data={[
    {
      name: 'Pending',
      population: stats.pending,
      color: '#ff9800',
      legendFontColor:
        colors.text,
      legendFontSize: 14,
    },
    {
      name: 'In Progress',
      population:
        stats.inProgress,
      color: '#6f42c1',
      legendFontColor:
        colors.text,
      legendFontSize: 14,
    },
    {
      name: 'Resolved',
      population:
        stats.resolved,
      color: '#28a745',
      legendFontColor:
        colors.text,
      legendFontSize: 14,
    },
  ]}
  width={320}
  height={220}
  chartConfig={{
    color: () => colors.text,
  }}
  accessor="population"
  backgroundColor="transparent"
  paddingLeft="15"
  absolute
/>

      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.text,
          },
        ]}
      >
        Quick Actions
      </Text>

      <TouchableOpacity
        style={[
          styles.actionCard,
          {
            backgroundColor:
              colors.card,
          },
        ]}
        onPress={() =>
          navigation.navigate(
            'CreateTab'
          )
        }
      >
        <Ionicons
          name="add-circle"
          size={32}
          color={colors.primary}
        />

        <View style={styles.actionText}>
          <Text
            style={[
              styles.actionTitle,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Create Complaint
          </Text>

          <Text
            style={[
              styles.actionSubtitle,
              {
                color:
                  colors.subText,
              },
            ]}
          >
            Report civic issues instantly
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.actionCard,
          {
            backgroundColor:
              colors.card,
          },
        ]}
        onPress={() =>
          navigation.navigate(
            'ComplaintsTab'
          )
        }
      >
        <Ionicons
          name="list"
          size={32}
          color="#ff9800"
        />

        <View style={styles.actionText}>
          <Text
            style={[
              styles.actionTitle,
              {
                color:
                  colors.text,
              },
            ]}
          >
            View Complaints
          </Text>

          <Text
            style={[
              styles.actionSubtitle,
              {
                color:
                  colors.subText,
              },
            ]}
          >
            Track complaint progress
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.actionCard,
          {
            backgroundColor:
              colors.card,
          },
        ]}
        onPress={() =>
          navigation.navigate(
            'MapTab'
          )
        }
      >
        <Ionicons
          name="map"
          size={32}
          color="#28a745"
        />

        <View style={styles.actionText}>
          <Text
            style={[
              styles.actionTitle,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Smart City Map
          </Text>

          <Text
            style={[
              styles.actionSubtitle,
              {
                color:
                  colors.subText,
              },
            ]}
          >
            Visualize civic complaints
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons
          name="log-out-outline"
          size={22}
          color="#fff"
        />

        <Text style={styles.logoutText}>
          Logout
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    marginTop: 50,
    marginBottom: 30,
  },

  welcome: {
    fontSize: 18,
  },

  title: {
    fontSize: 34,
    fontWeight: '700',
    marginTop: 8,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    marginBottom: 20,
  },

  statCard: {
    width: '48%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,

    elevation: 3,
  },

  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 10,
  },

  statLabel: {
    marginTop: 6,
    textAlign: 'center',
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginVertical: 20,
  },

  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 18,
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

  actionText: {
    marginLeft: 16,
  },

  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  actionSubtitle: {
    marginTop: 4,
  },

  logoutButton: {
    marginTop: 20,
    backgroundColor: '#dc3545',
    padding: 18,
    borderRadius: 16,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
});