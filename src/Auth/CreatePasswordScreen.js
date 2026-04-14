import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const topInset = Platform.OS === 'android' ? NativeStatusBar.currentHeight ?? 0 : 0;
const bottomInset = Platform.OS === 'android' ? 34 : 10;

export default function CreatePasswordScreen({ onContinue }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleSubmit() {
    if (!newPassword || !confirmPassword) {
      setError('Please enter and confirm your new password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    onContinue();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create New Password</Text>
          <Text style={styles.subtitle}>
            Set a new strong password to enhance security and protect your account
          </Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.form}>
            <Text style={styles.label}>New password</Text>
            <View style={styles.inputRow}>
              <TextInput
                onChangeText={setNewPassword}
                placeholder="***************"
                placeholderTextColor="rgba(248,250,252,0.55)"
                secureTextEntry={!showNewPassword}
                style={styles.input}
                value={newPassword}
              />
              <Pressable
                hitSlop={10}
                onPress={() => setShowNewPassword((current) => !current)}
                style={styles.visibilityButton}
              >
                <Ionicons
                  color="#F8FAFC"
                  name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                />
              </Pressable>
            </View>

            <Text style={[styles.label, styles.passwordLabel]}>Confirm password</Text>
            <View style={styles.inputRow}>
              <TextInput
                onChangeText={setConfirmPassword}
                placeholder="***************"
                placeholderTextColor="rgba(248,250,252,0.55)"
                secureTextEntry={!showConfirmPassword}
                style={styles.input}
                value={confirmPassword}
              />
              <Pressable
                hitSlop={10}
                onPress={() => setShowConfirmPassword((current) => !current)}
                style={styles.visibilityButton}
              >
                <Ionicons
                  color="#F8FAFC"
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                />
              </Pressable>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>
        </View>

        <Pressable
          onPress={handleSubmit}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>CONTINUE</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#494B4D',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: bottomInset + 20,
    paddingHorizontal: 30,
    paddingTop: topInset + 44,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 32,
    fontWeight: '400',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtitle: {
    color: '#F4F4F5',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 18,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  formSection: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    color: '#F4F4F5',
    fontSize: 14,
    marginBottom: 10,
    textTransform: 'lowercase',
  },
  passwordLabel: {
    marginTop: 26,
  },
  inputRow: {
    alignItems: 'center',
    borderBottomColor: '#69C97C',
    borderBottomWidth: 3,
    flexDirection: 'row',
  },
  input: {
    color: '#F8FAFC',
    flex: 1,
    fontSize: 18,
    paddingBottom: 10,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  visibilityButton: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  error: {
    color: '#FCA5A5',
    fontSize: 14,
    marginTop: 18,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#28C55F',
    borderRadius: 14,
    paddingVertical: 15,
  },
  buttonPressed: {
    opacity: 0.92,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});
