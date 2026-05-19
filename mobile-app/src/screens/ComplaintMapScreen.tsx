import {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';

import MapView, {
  Marker,
} from 'react-native-maps';

import {
  fetchComplaints,
} from '../services/complaintService';

import {
  lightColors,
  darkColors,
} from '../theme/colors';

export default function ComplaintMapScreen() {
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

  useEffect(() => {
    loadComplaints();
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
    }
  }

  function getMarkerColor(
    status: string
  ) {
    switch (status) {
      case 'resolved':
        return 'green';

      case 'in_progress':
        return 'purple';

      default:
        return 'orange';
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
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 17.385,
          longitude: 78.4867,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
      >
        {complaints.map(
          (complaint) => {
            if (
              !complaint.latitude ||
              !complaint.longitude
            ) {
              return null;
            }

            return (
              <Marker
                key={complaint.id}
                coordinate={{
                  latitude:
                    complaint.latitude,
                  longitude:
                    complaint.longitude,
                }}
                title={
                  complaint.title
                }
                description={
                  complaint.description
                }
                pinColor={getMarkerColor(
                  complaint.status
                )}
              />
            );
          }
        )}
      </MapView>

      <View
        style={[
          styles.header,
          {
            backgroundColor:
              colors.card,
          },
        ]}
      >
        <Text
          style={[
            styles.headerTitle,
            {
              color:
                colors.text,
            },
          ]}
        >
          Civic Complaint Map
        </Text>

        <View style={styles.legend}>
          <View
            style={
              styles.legendItem
            }
          >
            <View
              style={[
                styles.legendDot,
                {
                  backgroundColor:
                    'orange',
                },
              ]}
            />

            <Text
              style={[
                styles.legendText,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Pending
            </Text>
          </View>

          <View
            style={
              styles.legendItem
            }
          >
            <View
              style={[
                styles.legendDot,
                {
                  backgroundColor:
                    'purple',
                },
              ]}
            />

            <Text
              style={[
                styles.legendText,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              In Progress
            </Text>
          </View>

          <View
            style={
              styles.legendItem
            }
          >
            <View
              style={[
                styles.legendDot,
                {
                  backgroundColor:
                    'green',
                },
              ]}
            />

            <Text
              style={[
                styles.legendText,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Resolved
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,

    padding: 16,
    borderRadius: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,

    elevation: 4,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },

  legend: {
    flexDirection: 'row',
    justifyContent:
      'space-around',
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },

  legendText: {
    fontSize: 12,
    fontWeight: '600',
  },
});