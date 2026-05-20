import {
  useState,
} from 'react';

import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';

import {
  signIn,
  signUp,
} from '../services/authService';

import {
  getUserRole,
} from '../services/roleService';

import {
  useAuthStore,
} from '../store/authStore';

import {
  useRoleStore,
} from '../store/roleStore';

export default function LoginScreen() {
  const setAuthenticated =
    useAuthStore(
      (state) =>
        state.setAuthenticated
    );

  const setRole =
    useRoleStore(
      (state) => state.setRole
    );

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [isSignup, setIsSignup] =
    useState(false);

  // 👇 PORTAL
  const [portalType, setPortalType] =
    useState<
      'citizen' | 'staff'
    >('citizen');

  // 👇 STAFF ROLE
  const [staffRole, setStaffRole] =
    useState<
      'admin' | 'worker'
    >('worker');

  // 👇 AREA
  const [area, setArea] =
    useState('Madhapur');

  async function handleAuth() {
    try {
      const selectedRole =
        portalType ===
        'citizen'
          ? 'citizen'
          : staffRole;

      // SIGNUP
      if (isSignup) {
        await signUp(
          email,
          password,
          selectedRole,
          area
        );

        Alert.alert(
          'Success',
          'Account created successfully. Please login.'
        );

        setIsSignup(false);

        return;
      }

      // LOGIN
      await signIn(
        email,
        password
      );

      const role =
        await getUserRole();

      setRole(
        role || 'citizen'
      );

      setAuthenticated(true);
    } catch (error: any) {
      Alert.alert(
        'Authentication Failed',
        error.message
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          CivicLens
        </Text>

        <Text style={styles.subtitle}>
          Smart Civic Platform
        </Text>

        {/* PORTAL SWITCHER */}
        <View style={styles.portalContainer}>
          <TouchableOpacity
            style={[
              styles.portalButton,
              portalType ===
                'citizen' &&
                styles.activePortal,
            ]}
            onPress={() =>
              setPortalType(
                'citizen'
              )
            }
          >
            <Text
              style={[
                styles.portalText,
                portalType ===
                  'citizen' &&
                  styles.activePortalText,
              ]}
            >
              Citizen Portal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.portalButton,
              portalType ===
                'staff' &&
                styles.activePortal,
            ]}
            onPress={() =>
              setPortalType(
                'staff'
              )
            }
          >
            <Text
              style={[
                styles.portalText,
                portalType ===
                  'staff' &&
                  styles.activePortalText,
              ]}
            >
              Staff Portal
            </Text>
          </TouchableOpacity>
        </View>

        {/* STAFF ROLE */}
        {portalType ===
          'staff' &&
          isSignup && (
            <View
              style={
                styles.roleContainer
              }
            >
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  staffRole ===
                    'worker' &&
                    styles.activeRole,
                ]}
                onPress={() =>
                  setStaffRole(
                    'worker'
                  )
                }
              >
                <Text
                  style={[
                    styles.roleText,
                    staffRole ===
                      'worker' &&
                      styles.activeRoleText,
                  ]}
                >
                  Worker
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleButton,
                  staffRole ===
                    'admin' &&
                    styles.activeRole,
                ]}
                onPress={() =>
                  setStaffRole(
                    'admin'
                  )
                }
              >
                <Text
                  style={[
                    styles.roleText,
                    staffRole ===
                      'admin' &&
                      styles.activeRoleText,
                  ]}
                >
                  Admin
                </Text>
              </TouchableOpacity>
            </View>
          )}

        {/* AREA PICKER */}
        {isSignup && (
          <>
            <Text
              style={
                styles.areaLabel
              }
            >
              Select Area
            </Text>

            <View
              style={
                styles.pickerContainer
              }
            >
              <Picker
                selectedValue={
                  area
                }
                onValueChange={(
                  itemValue
                ) =>
                  setArea(
                    itemValue
                  )
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

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={
            setPassword
          }
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleAuth}
        >
          <Text style={styles.buttonText}>
            {isSignup
              ? 'Create Account'
              : 'Login'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            setIsSignup(
              !isSignup
            )
          }
        >
          <Text style={styles.switchText}>
            {isSignup
              ? 'Already have an account? Login'
              : 'No account? Create one'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:
      'center',
    alignItems: 'center',
    backgroundColor: '#f4f6f8',
    padding: 20,
  },

  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,

    elevation: 4,
  },

  title: {
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'center',
  },

  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
    marginBottom: 30,
  },

  portalContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  portalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#f1f3f5',
    marginHorizontal: 4,
    alignItems: 'center',
  },

  activePortal: {
    backgroundColor: '#007bff',
  },

  portalText: {
    fontWeight: '600',
    color: '#333',
  },

  activePortalText: {
    color: '#fff',
  },

  roleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  roleButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#f1f3f5',
    marginHorizontal: 4,
    alignItems: 'center',
  },

  activeRole: {
    backgroundColor: '#28a745',
  },

  roleText: {
    fontWeight: '600',
    color: '#333',
  },

  activeRoleText: {
    color: '#fff',
  },

  areaLabel: {
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 4,
    color: '#444',
  },

  pickerContainer: {
    backgroundColor: '#f1f3f5',
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
  },

  input: {
    backgroundColor: '#f1f3f5',
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#007bff',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  switchText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#007bff',
    fontWeight: '600',
  },
});