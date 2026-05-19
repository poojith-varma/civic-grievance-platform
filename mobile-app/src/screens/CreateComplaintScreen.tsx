import { useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { createComplaint } from '../services/complaintService';

export default function CreateComplaintScreen() {
  const [title, setTitle] =
    useState('');

  const [
    description,
    setDescription,
  ] = useState('');

  const [loading, setLoading] =
    useState(false);

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
});