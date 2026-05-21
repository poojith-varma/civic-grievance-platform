import {
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import { Picker } from '@react-native-picker/picker';

import * as ImagePicker from 'expo-image-picker';

import {
  getProfile,
  updateProfile,
} from '../services/profileService';

import {
  uploadImageToCloudinary,
} from '../services/cloudinaryService';

export default function ProfileScreen() {
  const [profile, setProfile] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const colorScheme =
    useColorScheme();

  const isDark =
    colorScheme === 'dark';

  const colors = {
    background: isDark
      ? '#0f172a'
      : '#f4f7fb',

    card: isDark
      ? '#1e293b'
      : '#ffffff',

    text: isDark
      ? '#ffffff'
      : '#111111',

    secondaryText: isDark
      ? '#cbd5e1'
      : '#666666',

    input: isDark
      ? '#334155'
      : '#f5f7fb',

    disabledInput: isDark
      ? '#475569'
      : '#edf0f5',

    border: isDark
      ? '#475569'
      : '#e5e7eb',

    blueSoft: isDark
      ? '#1e3a5f'
      : '#eef5ff',
  };

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data =
        await getProfile();

      setProfile(data);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload() {
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
            ['images'],
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

      setProfile({
        ...profile,
        profile_image:
          uploadedImage,
      });
    } catch (error: any) {
      Alert.alert(
        'Upload Failed',
        error.message
      );
    }
  }

  async function handleSave() {
    try {
      await updateProfile({
        name: profile.name,

        age: Number(
          profile.age
        ),

        profile_image:
          profile.profile_image,

        area:
          profile.role ===
          'worker'
            ? profile.area
            : null,
      });

      Alert.alert(
        'Success',
        'Profile updated successfully'
      );
    } catch (error: any) {
      Alert.alert(
        'Update Failed',
        error.message
      );
    }
  }

  function getRoleColor() {
    switch (profile.role) {
      case 'admin':
        return '#dc3545';

      case 'worker':
        return '#fd7e14';

      default:
        return '#007bff';
    }
  }

  if (loading || !profile) {
    return (
      <SafeAreaView
        style={[
          styles.loadingContainer,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <Text
          style={[
            styles.loadingText,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          Loading Profile...
        </Text>
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
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text
            style={[
              styles.headerTitle,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Profile
          </Text>

          <Text
            style={[
              styles.headerSubtitle,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Manage your CivicLens
            account
          </Text>
        </View>

        {/* PROFILE CARD */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor:
                colors.card,
            },
          ]}
        >
          <View
            style={
              styles.imageWrapper
            }
          >
            {profile.profile_image ? (
              <Image
                source={{
                  uri:
                    profile.profile_image,
                }}
                style={
                  styles.profileImage
                }
              />
            ) : (
              <View
                style={
                  styles.placeholder
                }
              >
                <Text
                  style={
                    styles.placeholderText
                  }
                >
                  {profile.name
                    ? profile.name
                        .charAt(0)
                        .toUpperCase()
                    : 'U'}
                </Text>
              </View>
            )}
          </View>

          <Text
            style={[
              styles.name,
              {
                color:
                  colors.text,
              },
            ]}
          >
            {profile.name ||
              'CivicLens User'}
          </Text>

          <View
            style={[
              styles.roleBadge,
              {
                backgroundColor:
                  getRoleColor(),
              },
            ]}
          >
            <Text
              style={
                styles.roleBadgeText
              }
            >
              {profile.role?.toUpperCase()}
            </Text>
          </View>

          {profile.role ===
            'worker' && (
            <View
              style={[
                styles.areaBadge,
                {
                  backgroundColor:
                    colors.blueSoft,
                },
              ]}
            >
              <Text
                style={
                  styles.areaBadgeText
                }
              >
                📍 {profile.area}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={
              styles.uploadButton
            }
            onPress={
              handleImageUpload
            }
          >
            <Text
              style={
                styles.uploadButtonText
              }
            >
              Upload Profile Picture
            </Text>
          </TouchableOpacity>
        </View>

        {/* PERSONAL INFO */}
        <View
          style={[
            styles.section,
            {
              backgroundColor:
                colors.card,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Personal Information
          </Text>

          <Text
            style={[
              styles.label,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Full Name
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor:
                  colors.input,
                color:
                  colors.text,
              },
            ]}
            value={
              profile.name || ''
            }
            onChangeText={(
              text
            ) =>
              setProfile({
                ...profile,
                name: text,
              })
            }
            placeholder="Enter name"
            placeholderTextColor={
              colors.secondaryText
            }
          />

          <Text
            style={[
              styles.label,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Age
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor:
                  colors.input,
                color:
                  colors.text,
              },
            ]}
            value={
              profile.age
                ? String(
                    profile.age
                  )
                : ''
            }
            keyboardType="numeric"
            onChangeText={(
              text
            ) =>
              setProfile({
                ...profile,
                age: text,
              })
            }
            placeholder="Enter age"
            placeholderTextColor={
              colors.secondaryText
            }
          />

          <Text
            style={[
              styles.label,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Account Role
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor:
                  colors.disabledInput,
                color:
                  colors.text,
              },
            ]}
            value={profile.role}
            editable={false}
          />
        </View>

        {/* WORKER AREA */}
        {profile.role ===
          'worker' && (
          <View
            style={[
              styles.section,
              {
                backgroundColor:
                  colors.card,
              },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Work Assignment
            </Text>

            <Text
              style={[
                styles.label,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              Assigned Area
            </Text>

            <View
              style={[
                styles.pickerContainer,
                {
                  backgroundColor:
                    colors.input,
                },
              ]}
            >
              <Picker
                selectedValue={
                  profile.area ||
                  'Madhapur'
                }
                onValueChange={(
                  itemValue
                ) =>
                  setProfile({
                    ...profile,
                    area:
                      itemValue,
                  })
                }
              >
                <Picker.Item
                  label="Madhapur"
                  value="Madhapur"
                />

                <Picker.Item
                  label="Kukatpally"
                  value="Kukatpally"
                />

                <Picker.Item
                  label="Kompally"
                  value="Kompally"
                />

                <Picker.Item
                  label="Gachibowli"
                  value="Gachibowli"
                />

                <Picker.Item
                  label="Ameerpet"
                  value="Ameerpet"
                />

                <Picker.Item
                  label="Miyapur"
                  value="Miyapur"
                />

                <Picker.Item
                  label="Hitech City"
                  value="Hitech City"
                />
              </Picker>
            </View>
          </View>
        )}

        {/* SAVE BUTTON */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text
            style={
              styles.saveButtonText
            }
          >
            Save Profile
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
    },

    loadingContainer: {
      flex: 1,
      justifyContent:
        'center',
      alignItems: 'center',
    },

    loadingText: {
      fontSize: 16,
    },

    header: {
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 10,
    },

    headerTitle: {
      fontSize: 34,
      fontWeight: '800',
    },

    headerSubtitle: {
      marginTop: 6,
      fontSize: 15,
    },

    profileCard: {
      marginHorizontal: 20,
      marginTop: 10,
      borderRadius: 28,
      padding: 28,
      alignItems: 'center',

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },

      shadowOpacity: 0.08,
      shadowRadius: 10,

      elevation: 4,
    },

    imageWrapper: {
      marginBottom: 18,
    },

    profileImage: {
      width: 130,
      height: 130,
      borderRadius: 65,
      borderWidth: 4,
      borderColor: '#007bff',
    },

    placeholder: {
      width: 130,
      height: 130,
      borderRadius: 65,
      backgroundColor:
        '#007bff',

      justifyContent:
        'center',

      alignItems:
        'center',
    },

    placeholderText: {
      color: '#fff',
      fontSize: 44,
      fontWeight: '700',
    },

    name: {
      fontSize: 26,
      fontWeight: '700',
      marginBottom: 10,
    },

    roleBadge: {
      paddingHorizontal: 18,
      paddingVertical: 8,
      borderRadius: 30,
      marginBottom: 12,
    },

    roleBadgeText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 13,
      letterSpacing: 1,
    },

    areaBadge: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      marginBottom: 20,
    },

    areaBadgeText: {
      color: '#007bff',
      fontWeight: '600',
    },

    uploadButton: {
      backgroundColor:
        '#007bff',
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 16,
    },

    uploadButtonText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 14,
    },

    section: {
      marginHorizontal: 20,
      marginTop: 22,
      borderRadius: 24,
      padding: 22,

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },

      shadowOpacity: 0.06,
      shadowRadius: 8,

      elevation: 3,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 20,
    },

    label: {
      fontSize: 14,
      fontWeight: '700',
      marginBottom: 8,
    },

    input: {
      padding: 16,
      borderRadius: 16,
      marginBottom: 20,
      fontSize: 16,
    },

    pickerContainer: {
      borderRadius: 16,
      overflow: 'hidden',
    },

    saveButton: {
      backgroundColor:
        '#007bff',

      marginHorizontal: 20,

      marginTop: 28,

      paddingVertical: 18,

      borderRadius: 20,

      alignItems: 'center',

      shadowColor: '#007bff',
      shadowOffset: {
        width: 0,
        height: 4,
      },

      shadowOpacity: 0.3,
      shadowRadius: 8,

      elevation: 5,
    },

    saveButtonText: {
      color: '#fff',
      fontSize: 17,
      fontWeight: '700',
    },
  });