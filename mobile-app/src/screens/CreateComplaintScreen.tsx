import { useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';

import { createComplaint } from '../services/complaintService';

import { getCurrentLocation } from '../services/locationService';

import { pickImage } from '../services/imageService';

import { uploadImageToCloudinary } from '../services/cloudinaryService';

import {
  lightColors,
  darkColors,
} from '../theme/colors';

export default function CreateComplaintScreen() {
  const colorScheme =
    useColorScheme();

  const colors =
    colorScheme === 'dark'
      ? darkColors
      : lightColors;

  const [title, setTitle] =
    useState('');

  const [
    description,
    setDescription,
  ] = useState('');

  const [loading, setLoading] =
    useState(false);

  const [locationText, setLocationText] =
    useState('Location will appear after submission');

  const [imageUri, setImageUri] =
    useState<string | null>(null);

  async function handlePickImage() {
    try {
      const uri = await pickImage();

      if (uri) {
        setImageUri(uri);
      }
    } catch (error: any) {
      Alert.alert(
        'Image Error',
        error.message
      );
    }
  }

  async function handleSubmit() {
    try {
      if (!title || !description) {
        Alert.alert(
          'Validation',
          'Please fill all fields'
        );

        return;
      }

      setLoading(true);

      const location =
        await getCurrentLocation();

      setLocationText(
        `Lat: ${location.latitude}, Lng: ${location.longitude}`
      );

      let uploadedImageUrl = null;

      if (imageUri) {
        uploadedImageUrl =
          await uploadImageToCloudinary(
            imageUri
          );
      }

      await createComplaint({
        title,
        description,
        image_url:
          uploadedImageUrl,

        latitude:
          location.latitude,

        longitude:
          location.longitude,
      });

      Alert.alert(
        'Success',
        'Complaint submitted successfully'
      );

      setTitle('');
      setDescription('');
      setImageUri(null);

      setLocationText(
        'Location will appear after submission'
      );
    } catch (error: any) {
      Alert.alert(
        'Submission Failed',
        error.message
      );
    } finally {
      setLoading(false);
    }
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
          paddingBottom: 40,
        }}
      >
        {/* HERO CARD */}
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
          style={styles.heroCard}
        >
          <Text
            style={
              styles.heroGreeting
            }
          >
            📢 Civic Reporting
          </Text>

          <Text
            style={
              styles.heroTitle
            }
          >
            Create Complaint
          </Text>

          <Text
            style={
              styles.heroSubtitle
            }
          >
            Report issues in your
            area and help improve
            your community faster.
          </Text>
        </LinearGradient>

        {/* TITLE INPUT */}
        <View
          style={[
            styles.card,
            {
              backgroundColor:
                colors.card,
            },
          ]}
        >
          <View
            style={styles.labelRow}
          >
            <Ionicons
              name="document-text"
              size={22}
              color={
                colors.primary
              }
            />

            <Text
              style={[
                styles.label,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Complaint Title
            </Text>
          </View>

          <TextInput
            placeholder="Enter complaint title"
            placeholderTextColor="#94A3B8"
            value={title}
            onChangeText={setTitle}
            style={[
              styles.input,
              {
                backgroundColor:
                  '#F8FAFC',
                color:
                  colors.text,
              },
            ]}
          />
        </View>

        {/* DESCRIPTION */}
        <View
          style={[
            styles.card,
            {
              backgroundColor:
                colors.card,
            },
          ]}
        >
          <View
            style={styles.labelRow}
          >
            <Ionicons
              name="create"
              size={22}
              color={
                colors.primary
              }
            />

            <Text
              style={[
                styles.label,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Description
            </Text>
          </View>

          <TextInput
            placeholder="Describe the civic issue in detail..."
            placeholderTextColor="#94A3B8"
            value={description}
            onChangeText={
              setDescription
            }
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor:
                  '#F8FAFC',
                color:
                  colors.text,
              },
            ]}
            multiline
          />
        </View>

        {/* LOCATION */}
        <View
          style={[
            styles.locationCard,
            {
              backgroundColor:
                colors.card,
            },
          ]}
        >
          <View
            style={styles.locationRow}
          >
            <Ionicons
              name="location"
              size={28}
              color={
                colors.primary
              }
            />

            <View
              style={{
                flex: 1,
                marginLeft: 14,
              }}
            >
              <Text
                style={[
                  styles.locationLabel,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                Device Location
              </Text>

              <Text
                style={[
                  styles.locationText,
                  {
                    color:
                      colors.subText,
                  },
                ]}
              >
                {locationText}
              </Text>
            </View>
          </View>
        </View>

        {/* IMAGE UPLOAD */}
        <View
          style={[
            styles.card,
            {
              backgroundColor:
                colors.card,
            },
          ]}
        >
          <View
            style={styles.labelRow}
          >
            <Ionicons
              name="image"
              size={22}
              color={
                colors.primary
              }
            />

            <Text
              style={[
                styles.label,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Upload Image
            </Text>
          </View>

          <TouchableOpacity
            style={
              styles.uploadButton
            }
            onPress={
              handlePickImage
            }
          >
            <Ionicons
              name="cloud-upload"
              size={28}
              color="#4F7CFF"
            />

            <Text
              style={
                styles.uploadText
              }
            >
              Select Complaint Image
            </Text>
          </TouchableOpacity>

          {imageUri && (
            <Image
              source={{
                uri: imageUri,
              }}
              style={
                styles.previewImage
              }
            />
          )}
        </View>

        {/* SUBMIT BUTTON */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleSubmit}
          disabled={loading}
        >
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
              styles.submitButton
            }
          >
            {loading ? (
              <ActivityIndicator
                color="#fff"
              />
            ) : (
              <>
                <Ionicons
                  name="send"
                  size={22}
                  color="#fff"
                />

                <Text
                  style={
                    styles.submitText
                  }
                >
                  Submit Complaint
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  heroCard: {
    borderRadius: 32,
    padding: 30,
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 24,
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

  card: {
    marginHorizontal: 20,
    marginBottom: 22,
    borderRadius: 28,
    padding: 22,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.08,
    shadowRadius: 18,

    elevation: 6,
  },

  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  label: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
  },

  input: {
    borderRadius: 18,
    padding: 18,
    fontSize: 16,
  },

  textArea: {
    height: 140,
    textAlignVertical: 'top',
  },

  locationCard: {
    marginHorizontal: 20,
    marginBottom: 22,
    borderRadius: 28,
    padding: 22,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.08,
    shadowRadius: 18,

    elevation: 6,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationLabel: {
    fontSize: 18,
    fontWeight: '700',
  },

  locationText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 22,
  },

  uploadButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#AFC8FF',
    borderRadius: 22,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FBFF',
  },

  uploadText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#4F7CFF',
  },

  previewImage: {
    width: '100%',
    height: 240,
    borderRadius: 22,
    marginTop: 20,
  },

  submitButton: {
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 24,
    paddingVertical: 20,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#4F7CFF',
    shadowOffset: {
      width: 0,
      height: 10,
    },

    shadowOpacity: 0.25,
    shadowRadius: 20,

    elevation: 8,
  },

  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  },
});