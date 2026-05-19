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
} from 'react-native';

import MapView, {
  Marker,
} from 'react-native-maps';

import {
  fetchComplaints,
} from '../services/complaintService';

export default function ComplaintMapScreen() {
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

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 17.385,
          longitude: 78.4867,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
      >
        {complaints.map((complaint) => {
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
              title={complaint.title}
              description={
                complaint.description
              }
            />
          );
        })}
      </MapView>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Civic Complaint Map
        </Text>
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

    backgroundColor: '#fff',
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
  },
});