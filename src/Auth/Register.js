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

export default function Register({ onBack, onRegister }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState('borrower');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function clearError() {
    if (error) {
      setError('');
    }
  }

  function handleRegister() {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPhone || !password || !confirmPassword) {
      setError('Please complete all fields.');
      return;
    }

    if (!trimmedEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    onRegister?.({
      accountType,
      email: trimmedEmail,
      fullName: trimmedName,
      phone: trimmedPhone,
    });
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
              <Ionicons color="#F8FAFC" name="person-add-outline" size={28} />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Safelink and start connecting securely.</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Account type</Text>
            <View style={styles.segmentedControl}>
              {['borrower', 'lender'].map((type) => {
                const isActive = accountType === type;

                return (
                  <Pressable
                    key={type}
                    onPress={() => setAccountType(type)}
                    style={({ pressed }) => [
                      styles.segmentButton,
                      isActive && styles.segmentButtonActive,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Ionicons
                      color={isActive ? '#FFFFFF' : '#BBF7D0'}
                      name={type === 'borrower' ? 'cash-outline' : 'trending-up-outline'}
                      size={18}
                    />
                    <Text
                      style={[
                        styles.segmentButtonText,
                        isActive && styles.segmentButtonTextActive,
                      ]}
                    >
                      {type === 'borrower' ? 'Borrower' : 'Lender'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.label, styles.fieldLabel]}>Full name</Text>
            <View style={styles.inputRow}>
              <Ionicons color="#BBF7D0" name="person-outline" size={21} style={styles.inputIcon} />
              <TextInput
                autoCapitalize="words"
                autoComplete="name"
                onChangeText={(value) => {
                  setFullName(value);
                  clearError();
                }}
                placeholder="Jane Doe"
                placeholderTextColor="rgba(248,250,252,0.5)"
                returnKeyType="next"
                style={styles.input}
                textContentType="name"
                value={fullName}
              />
            </View>

            <Text style={[styles.label, styles.fieldLabel]}>Email</Text>
            <View style={styles.inputRow}>
              <Ionicons color="#BBF7D0" name="mail-outline" size={21} style={styles.inputIcon} />
              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onChangeText={(value) => {
                  setEmail(value);
                  clearError();
                }}
                placeholder="jdoe@user.co.bw"
                placeholderTextColor="rgba(248,250,252,0.5)"
                returnKeyType="next"
                style={styles.input}
                textContentType="emailAddress"
                value={email}
              />
            </View>

            <Text style={[styles.label, styles.fieldLabel]}>Phone number</Text>
            <View style={styles.inputRow}>
              <Ionicons color="#BBF7D0" name="call-outline" size={21} style={styles.inputIcon} />
              <TextInput
                autoComplete="tel"
                keyboardType="phone-pad"
                onChangeText={(value) => {
                  setPhone(value);
                  clearError();
                }}
                placeholder="+267 71 234 567"
                placeholderTextColor="rgba(248,250,252,0.5)"
                returnKeyType="next"
                style={styles.input}
                textContentType="telephoneNumber"
                value={phone}
              />
            </View>

            <Text style={[styles.label, styles.fieldLabel]}>Password</Text>
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
                  setPassword(value);
                  clearError();
                }}
                placeholder="Create a password"
                placeholderTextColor="rgba(248,250,252,0.5)"
                returnKeyType="next"
                secureTextEntry={!showPassword}
                style={styles.input}
                textContentType="newPassword"
                value={password}
              />
              <Pressable
                hitSlop={10}
                onPress={() => setShowPassword((current) => !current)}
                style={styles.visibilityButton}
              >
                <Ionicons
                  color="#F8FAFC"
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                />
              </Pressable>
            </View>

            <Text style={[styles.label, styles.fieldLabel]}>Confirm password</Text>
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
                  clearError();
                }}
                onSubmitEditing={handleRegister}
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

            <Pressable
              onPress={handleRegister}
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            >
              <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Pressable onPress={onBack} style={({ pressed }) => pressed && styles.buttonPressed}>
              <Text style={styles.backText}>Already have an account? Login</Text>
            </Pressable>
          </View>
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
  },
  label: {
    color: '#F4F4F5',
    fontSize: 14,
    marginBottom: 10,
    textTransform: 'lowercase',
  },
  fieldLabel: {
    marginTop: 22,
  },
  segmentedControl: {
    flexDirection: 'row',
    gap: 10,
  },
  segmentButton: {
    alignItems: 'center',
    borderColor: 'rgba(105,201,124,0.72)',
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 46,
  },
  segmentButtonActive: {
    backgroundColor: '#28C55F',
    borderColor: '#28C55F',
  },
  segmentButtonText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  segmentButtonTextActive: {
    color: '#FFFFFF',
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
    marginTop: 34,
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
  footer: {
    alignItems: 'center',
    marginTop: 28,
  },
  backText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
});
