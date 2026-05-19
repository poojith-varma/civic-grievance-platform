import { useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { createComplaint } from '../services/complaintService';

import { getCurrentLocation } from '../services/locationService';

import { pickImage } from '../services/imageService';

import { uploadImageToCloudinary } from '../services/cloudinaryService';

export default function CreateComplaintScreen() {
  const [title, setTitle] =
    useState('');

  const [
    description,
    setDescription,
  ] = useState('');

  const [loading, setLoading] =
    useState(false);

  const [locationText, setLocationText] =
    useState('Location not fetched');

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

        console.log(
          'Uploaded Image URL:',
          uploadedImageUrl
        );
      }

      await createComplaint({
        title,
        description,
      });

      Alert.alert(
        'Success',
        'Complaint submitted successfully'
      );

      setTitle('');
      setDescription('');
      setImageUri(null);
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
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>
          Create Complaint
        </Text>

        <TextInput
          placeholder="Complaint Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />

        <TextInput
          placeholder="Complaint Description"
          value={description}
          onChangeText={setDescription}
          style={[
            styles.input,
            styles.textArea,
          ]}
          multiline
        />

        <Text style={styles.locationText}>
          {locationText}
        </Text>

        <View style={styles.buttonSpacing}>
          <Button
            title="Select Image"
            onPress={handlePickImage}
          />
        </View>

        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={styles.previewImage}
          />
        )}

        {loading ? (
          <ActivityIndicator />
        ) : (
          <Button
            title="Submit Complaint"
            onPress={handleSubmit}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  form: {
    padding: 24,
    marginTop: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },

  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },

  locationText: {
    marginBottom: 20,
    color: '#444',
  },

  buttonSpacing: {
    marginBottom: 20,
  },

  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 20,
  },
});