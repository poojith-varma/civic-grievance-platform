import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import MapView, {
  Marker,
} from 'react-native-maps';

import ClusteredMapView from 'react-native-map-clustering';

import {
  fetchComplaints,
} from '../services/complaintService';

import {
  lightColors,
  darkColors,
} from '../theme/colors';

type Props = {
  route?: {
    params?: {
      latitude?: number;
      longitude?: number;
    };
  };
};

export default function ComplaintMapScreen({
  route,
}: Props) {
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

  const mapRef =
    useRef<MapView | null>(
      null
    );

  const focusedLatitude =
    route?.params?.latitude;

  const focusedLongitude =
    route?.params?.longitude;

  useEffect(() => {
    loadComplaints();
  }, []);

  useEffect(() => {
    if (
      focusedLatitude &&
      focusedLongitude &&
      mapRef.current
    ) {
      mapRef.current.animateToRegion(
        {
          latitude:
            focusedLatitude,

          longitude:
            focusedLongitude,

          latitudeDelta:
            0.008,

          longitudeDelta:
            0.008,
        },
        1000
      );
    }
  }, [
    focusedLatitude,
    focusedLongitude,
  ]);

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

  const initialRegion = {
    latitude:
      focusedLatitude || 17.385,

    longitude:
      focusedLongitude || 78.4867,

    latitudeDelta:
      focusedLatitude
        ? 0.008
        : 0.08,

    longitudeDelta:
      focusedLongitude
        ? 0.008
        : 0.08,
  };

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
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={
          initialRegion
        }
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

        {/* FOCUSED MARKER */}
        {focusedLatitude &&
          focusedLongitude && (
            <Marker
              coordinate={{
                latitude:
                  focusedLatitude,
                longitude:
                  focusedLongitude,
              }}
              title="Selected Complaint"
              pinColor="#4F7CFF"
            />
          )}
      </MapView>

      {/* PREMIUM HEADER */}
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
          🗺️ Civic Complaint Map
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

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
    },

    map: {
      flex: 1,
    },

    center: {
      flex: 1,
      justifyContent:
        'center',
      alignItems:
        'center',
    },

    header: {
      position: 'absolute',
      top: 60,
      left: 20,
      right: 20,

      padding: 18,
      borderRadius: 24,

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 6,
      },

      shadowOpacity: 0.12,
      shadowRadius: 12,

      elevation: 8,
    },

    headerTitle: {
      fontSize: 22,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 14,
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