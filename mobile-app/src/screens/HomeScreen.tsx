import {
  Alert,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { signOut } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  const setAuthenticated =
    useAuthStore(
      (state) =>
        state.setAuthenticated
    );

  async function handleLogout() {
    try {
      await signOut();

      setAuthenticated(false);
    } catch (error: any) {
      Alert.alert(
        'Logout Failed',
        error.message
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>
          Civic Grievance Platform
        </Text>

        <Text style={styles.subtitle}>
          Home Screen
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Create Complaint"
            onPress={() =>
              navigation.navigate(
                'CreateComplaint'
              )
            }
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="View Complaints"
            onPress={() =>
              navigation.navigate(
                'ComplaintList'
              )
            }
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Logout"
            onPress={handleLogout}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },

  buttonContainer: {
    marginTop: 20,
  },
});