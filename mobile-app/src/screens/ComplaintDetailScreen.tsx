import {
  useState,
} from 'react';

import {
  Alert,
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import {
  updateComplaintStatus,
} from '../services/statusService';

import {
  uploadImageToCloudinary,
} from '../services/cloudinaryService';

import {
  useRoleStore,
} from '../store/roleStore';

type Props = {
  route: {
    params: {
      complaint: any;
    };
  };
};

export default function ComplaintDetailScreen({
  route,
}: Props) {
  const role =
    useRoleStore(
      (state) => state.role
    );

  const [complaint, setComplaint] =
    useState(
      route.params.complaint
    );

  async function handleStatusUpdate(
    status: string,
    imageUrl?: string
  ) {
    try {
      const updatedComplaint =
        await updateComplaintStatus(
          complaint.id,
          status,
          imageUrl
        );

      setComplaint(
        updatedComplaint
      );

      Alert.alert(
        'Success',
        `Complaint marked as ${status}`
      );
    } catch (error: any) {
      Alert.alert(
        'Update Failed',
        error.message
      );
    }
  }

  async function handleResolved() {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (
        !permission.granted
      ) {
        Alert.alert(
          'Permission required'
        );

        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes:
            ImagePicker.MediaTypeOptions.Images,

          quality: 0.7,
        });

      if (
        result.canceled
      ) {
        return;
      }

      const imageUri =
        result.assets[0].uri;

      const uploadedImage =
        await uploadImageToCloudinary(
          imageUri
        );

      await handleStatusUpdate(
        'verification_pending',
        uploadedImage
      );
    } catch (error: any) {
      Alert.alert(
        'Upload Failed',
        error.message
      );
    }
  }

  function formatDate(
    date: string
  ) {
    return new Date(
      date
    ).toLocaleString();
  }

  function getStatusStyle(
    status: string
  ) {
    switch (status) {
      case 'verification_pending':
        return {
          backgroundColor:
            '#ffeeba',
          textColor:
            '#856404f',
        };

      case 'in_progress':
        return {
          backgroundColor:
            '#cce5ff',
          textColor:
            '#004085',
        };

      default:
        return {
          backgroundColor:
            '#fff3cd',
          textColor:
            '#856404',
        };
    }
  }

  const statusStyle =
    getStatusStyle(
      complaint.status
    );

  const isResolved =
    complaint.status ===
    'resolved' ||
     complaint.status ===
    'verification_pending';

  return (
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 20,
        }}
      >
        <View style={styles.card}>
          <Text style={styles.title}>
            {complaint.title}
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
              {complaint.status}
            </Text>
          </View>

          {complaint.image_url && (
            <Image
              source={{
                uri:
                  complaint.image_url,
              }}
              style={styles.image}
            />
          )}

          {/* 👇 COMPLETION IMAGE */}
          {complaint.completion_image && (
            <>
              <Text
                style={styles.label}
              >
                Completion Proof
              </Text>

              <Image
                source={{
                  uri:
                    complaint.completion_image,
                }}
                style={styles.image}
              />
            </>
          )}

          <Text style={styles.label}>
            Description
          </Text>

          <Text
            style={
              styles.description
            }
          >
            {
              complaint.description
            }
          </Text>

          <Text style={styles.label}>
            Created At
          </Text>

          <Text style={styles.date}>
            {formatDate(
              complaint.created_at
            )}
          </Text>

          {/* 🛠️ WORKER */}
          {role === 'worker' &&
            !isResolved && (
              <>
                <View
                  style={
                    styles.button
                  }
                >
                  <Button
                    title="Mark In Progress"
                    onPress={() =>
                      handleStatusUpdate(
                        'in_progress'
                      )
                    }
                  />
                </View>

                <View
                  style={
                    styles.button
                  }
                >
                  <Button
                    title="Work Is Done"
                    onPress={
                      handleResolved
                    }
                  />
                </View>
              </>
            )}

          {/* 👑 ADMIN */}
          {role === 'admin' &&
            !isResolved && (
              <View
                style={styles.button}
              >
                <Button
                  title="Mark Resolved"
                  onPress={() =>
                    handleStatusUpdate(
                      'resolved'
                    )
                  }
                />
              </View>
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        '#f4f6f8',
    },

    card: {
      backgroundColor:
        '#fff',
      borderRadius: 18,
      padding: 24,

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.08,
      shadowRadius: 6,

      elevation: 3,
    },

    title: {
      fontSize: 28,
      fontWeight: '700',
      marginBottom: 20,
    },

    statusBadge: {
      alignSelf:
        'flex-start',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      marginBottom: 24,
    },

    statusText: {
      fontWeight: '600',
      textTransform:
        'capitalize',
    },

    image: {
      width: '100%',
      height: 240,
      borderRadius: 16,
      marginBottom: 24,
    },

    label: {
      fontSize: 14,
      fontWeight: '700',
      marginBottom: 8,
      color: '#666',
    },

    description: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 24,
      color: '#333',
    },

    date: {
      fontSize: 14,
      color: '#666',
      marginBottom: 24,
    },

    button: {
      marginBottom: 16,
    },
  });