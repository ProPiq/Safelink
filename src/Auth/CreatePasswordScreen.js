import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoMark}>
              <Ionicons color="#F8FAFC" name="lock-closed-outline" size={28} />
            </View>
            <Text style={styles.title}>Create New Password</Text>
            <Text style={styles.subtitle}>
              Set a strong password to enhance security and protect your account.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>New password</Text>
            <View style={styles.inputRow}>
              <Ionicons
                color="#BBF7D0"
                name="lock-closed-outline"
                size={21}
                style={styles.inputIcon}
              />
              <TextInput
                autoComplete="new-password"
                onChangeText={(value) => {
                  setNewPassword(value);
                  if (error) setError('');
                }}
                placeholder="Enter your new password"
                placeholderTextColor="rgba(248,250,252,0.5)"
                returnKeyType="next"
                secureTextEntry={!showNewPassword}
                style={styles.input}
                textContentType="newPassword"
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
              <Ionicons
                color="#BBF7D0"
                name="shield-checkmark-outline"
                size={21}
                style={styles.inputIcon}
              />
              <TextInput
                autoComplete="new-password"
                onChangeText={(value) => {
                  setConfirmPassword(value);
                  if (error) setError('');
                }}
                onSubmitEditing={handleSubmit}
                placeholder="Confirm your password"
                placeholderTextColor="rgba(248,250,252,0.5)"
                returnKeyType="done"
                secureTextEntry={!showConfirmPassword}
                style={styles.input}
                textContentType="newPassword"
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

          <Pressable
            onPress={handleSubmit}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonText}>CONTINUE</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#494B4D',
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: bottomInset + 20,
    paddingHorizontal: 30,
    paddingTop: topInset + 34,
  },
  header: {
    alignItems: 'center',
  },
  logoMark: {
    alignItems: 'center',
    backgroundColor: 'rgba(40,197,95,0.16)',
    borderColor: 'rgba(105,201,124,0.36)',
    borderRadius: 22,
    borderWidth: 1,
    height: 56,
    justifyContent: 'center',
    marginBottom: 18,
    width: 56,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 31,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtitle: {
    color: '#DDE2E6',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
    textAlign: 'center',
  },
  form: {
    marginTop: 34,
    width: '100%',
  },
  label: {
    color: '#F4F4F5',
    fontSize: 14,
    marginBottom: 10,
    textTransform: 'lowercase',
  },
  passwordLabel: {
    marginTop: 24,
  },
  inputRow: {
    alignItems: 'center',
    borderBottomColor: '#69C97C',
    borderBottomWidth: 3,
    flexDirection: 'row',
    minHeight: 48,
    paddingBottom: 7,
  },
  input: {
    color: '#F8FAFC',
    flex: 1,
    fontSize: 18,
    paddingBottom: 0,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  inputIcon: {
    marginRight: 10,
  },
  visibilityButton: {
    alignItems: 'center',
    height: 34,
    justifyContent: 'center',
    marginLeft: 8,
    width: 34,
  },
  error: {
    color: '#FCA5A5',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 18,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#28C55F',
    borderRadius: 14,
    elevation: 3,
    marginTop: 42,
    paddingVertical: 15,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  buttonPressed: {
    opacity: 0.92,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
