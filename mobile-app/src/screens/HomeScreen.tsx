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
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';

import { signOut } from '../services/authService';

import { useAuthStore } from '../store/authStore';

import {
  fetchDashboardStats,
} from '../services/analyticsService';

export default function HomeScreen() {
  const navigation = useNavigation<any>();

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
      <View style={styles.loader}>
        <ActivityIndicator
          size="large"
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 40,
      }}
    >
      <View style={styles.header}>
        <Text style={styles.welcome}>
          👋 Welcome Back
        </Text>

        <Text style={styles.title}>
          CivicLens Dashboard
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons
            name="document-text"
            size={30}
            color="#007bff"
          />

          <Text style={styles.statNumber}>
            {stats.total}
          </Text>

          <Text style={styles.statLabel}>
            Total Complaints
          </Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons
            name="checkmark-circle"
            size={30}
            color="#28a745"
          />

          <Text style={styles.statNumber}>
            {stats.resolved}
          </Text>

          <Text style={styles.statLabel}>
            Resolved
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons
            name="time"
            size={30}
            color="#ff9800"
          />

          <Text style={styles.statNumber}>
            {stats.pending}
          </Text>

          <Text style={styles.statLabel}>
            Pending
          </Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons
            name="construct"
            size={30}
            color="#6f42c1"
          />

          <Text style={styles.statNumber}>
            {stats.inProgress}
          </Text>

          <Text style={styles.statLabel}>
            In Progress
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Quick Actions
      </Text>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() =>
          navigation.navigate(
            'CreateTab'
          )
        }
      >
        <Ionicons
          name="add-circle"
          size={32}
          color="#007bff"
        />

        <View style={styles.actionText}>
          <Text style={styles.actionTitle}>
            Create Complaint
          </Text>

          <Text
            style={
              styles.actionSubtitle
            }
          >
            Report civic issues instantly
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionCard}
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
          <Text style={styles.actionTitle}>
            View Complaints
          </Text>

          <Text
            style={
              styles.actionSubtitle
            }
          >
            Track complaint progress
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionCard}
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
          <Text style={styles.actionTitle}>
            Smart City Map
          </Text>

          <Text
            style={
              styles.actionSubtitle
            }
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
    backgroundColor: '#f4f6f8',
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
    color: '#666',
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
    backgroundColor: '#fff',
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
    color: '#666',
    textAlign: 'center',
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginVertical: 20,
  },

  actionCard: {
    backgroundColor: '#fff',
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
    color: '#666',
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