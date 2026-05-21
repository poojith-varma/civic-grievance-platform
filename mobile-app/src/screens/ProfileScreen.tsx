import {
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
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

        // ✅ ONLY SAVE AREA FOR WORKERS
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

  if (loading || !profile) {
    return (
      <SafeAreaView
        style={styles.center}
      >
        <Text>
          Loading...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}
      >
        <View style={styles.card}>
          <View
            style={
              styles.imageContainer
            }
          >
            {profile.profile_image ? (
              <Image
                source={{
                  uri:
                    profile.profile_image,
                }}
                style={
                  styles.image
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
                  👤
                </Text>
              </View>
            )}

            <Button
              title="Upload Profile Picture"
              onPress={
                handleImageUpload
              }
            />
          </View>

          <Text style={styles.label}>
            Name
          </Text>

          <TextInput
            style={styles.input}
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
          />

          <Text style={styles.label}>
            Age
          </Text>

          <TextInput
            style={styles.input}
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
          />

          <Text style={styles.label}>
            Role
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor:
                  '#eee',
              },
            ]}
            value={profile.role}
            editable={false}
          />

          {/* ✅ AREA ONLY FOR WORKERS */}
          {profile.role ===
            'worker' && (
            <>
              <Text
                style={
                  styles.label
                }
              >
                Area
              </Text>

              <View
                style={
                  styles.pickerContainer
                }
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
            </>
          )}

          <View
            style={{
              marginTop: 20,
            }}
          >
            <Button
              title="Save Profile"
              onPress={
                handleSave
              }
            />
          </View>
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

    center: {
      flex: 1,
      justifyContent:
        'center',
      alignItems:
        'center',
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

    imageContainer: {
      alignItems: 'center',
      marginBottom: 24,
    },

    image: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 16,
    },

    placeholder: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor:
        '#ddd',

      justifyContent:
        'center',

      alignItems:
        'center',

      marginBottom: 16,
    },

    placeholderText: {
      fontSize: 42,
    },

    label: {
      fontSize: 14,
      fontWeight: '700',
      marginBottom: 8,
      color: '#666',
    },

    input: {
      backgroundColor:
        '#f1f3f5',

      padding: 16,

      borderRadius: 14,

      marginBottom: 20,

      fontSize: 16,
    },

    pickerContainer: {
      backgroundColor:
        '#f1f3f5',

      borderRadius: 14,

      marginBottom: 20,

      overflow: 'hidden',
    },
  });