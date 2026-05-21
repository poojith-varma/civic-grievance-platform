import React, {
  useEffect,
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

  // Generate marker data for Leaflet
  const validComplaints = complaints.filter(
    (c) => c.latitude && c.longitude
  );

  // HTML content for Leaflet Map
  const leafletHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        html, body, #map {
          height: 100%;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 6px;
        }
        .popup-title {
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 4px;
        }
        .popup-desc {
          font-size: 12px;
          color: #555;
          margin-bottom: 6px;
        }
        .popup-status {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: bold;
          text-transform: uppercase;
          color: #fff;
        }
        .status-resolved { background-color: #28a745; }
        .status-in_progress { background-color: #6f42c1; }
        .status-pending { background-color: #ff9800; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const map = L.map('map').setView([17.385, 78.4867], 12);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const complaints = ${JSON.stringify(validComplaints)};

        complaints.forEach(complaint => {
          let color = 'orange';
          let statusClass = 'status-pending';
          let statusText = 'Pending';
          if (complaint.status === 'resolved') {
            color = 'green';
            statusClass = 'status-resolved';
            statusText = 'Resolved';
          } else if (complaint.status === 'in_progress') {
            color = 'purple';
            statusClass = 'status-in_progress';
            statusText = 'In Progress';
          }

          // Colored pin style
          const markerHtmlStyles = \`
            background-color: \${color};
            width: 1.5rem;
            height: 1.5rem;
            display: block;
            left: -0.75rem;
            top: -0.75rem;
            position: relative;
            border-radius: 1.5rem 1.5rem 0;
            transform: rotate(45deg);
            border: 2px solid #FFFFFF;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          \`;

          const icon = L.divIcon({
            className: "my-custom-pin",
            iconAnchor: [0, 12],
            popupAnchor: [0, -20],
            html: \`<span style="\${markerHtmlStyles}" />\`
          });

          const popupContent = \`
            <div class="popup-title">\${complaint.title || 'Untitled'}</div>
            <div class="popup-desc">\${complaint.description || 'No description provided.'}</div>
            <span class="popup-status \${statusClass}">\${statusText}</span>
          \`;

          L.marker([complaint.latitude, complaint.longitude], {icon: icon})
            .bindPopup(popupContent)
            .addTo(map);
        });
      </script>
    </body>
    </html>
  `;

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
      <View style={styles.mapContainer}>
        {React.createElement('iframe', {
          srcDoc: leafletHTML,
          style: {
            width: '100%',
            height: '100%',
            border: 'none',
          },
          title: 'Complaint Map',
        })}
      </View>

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

  mapContainer: {
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
