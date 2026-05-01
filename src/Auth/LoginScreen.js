import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
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
import { loginUser } from '../APIs/authApi';

const topInset = Platform.OS === 'android' ? NativeStatusBar.currentHeight ?? 0 : 0;
const bottomInset = Platform.OS === 'android' ? 34 : 10;

export default function LoginScreen({ onForgotPassword, onLogin, onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const user = await loginUser({ email: trimmedEmail, password });
      onLogin(user);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setIsLoading(false);
    }
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
              <Ionicons color="#F8FAFC" name="shield-checkmark-outline" size={28} />
            </View>
            <Text style={styles.title}>LOGIN</Text>
            <Text style={styles.subtitle}>Welcome back. Sign in to continue safely.</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputRow}>
              <Ionicons color="#BBF7D0" name="mail-outline" size={21} style={styles.inputIcon} />
              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onChangeText={(value) => {
                  setEmail(value);
                  if (error) setError('');
                }}
                placeholder="jdoe@user.co.bw"
                placeholderTextColor="rgba(248,250,252,0.5)"
                returnKeyType="next"
                style={styles.input}
                textContentType="emailAddress"
                value={email}
              />
            </View>

            <Text style={[styles.label, styles.passwordLabel]}>Password</Text>
            <View style={styles.inputRow}>
              <Ionicons
                color="#BBF7D0"
                name="lock-closed-outline"
                size={21}
                style={styles.inputIcon}
              />
              <TextInput
                autoComplete="password"
                onChangeText={(value) => {
                  setPassword(value);
                  if (error) setError('');
                }}
                onSubmitEditing={handleLogin}
                placeholder="Enter your password"
                placeholderTextColor="rgba(248,250,252,0.5)"
                returnKeyType="done"
                secureTextEntry={!showPassword}
                style={styles.input}
                textContentType="password"
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

            <View style={styles.formMeta}>
              {error ? <Text style={styles.error}>{error}</Text> : <View />}
              <Pressable onPress={onForgotPassword} style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </Pressable>
            </View>

            <Pressable
              disabled={isLoading}
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
                isLoading && styles.buttonDisabled,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>LOGIN</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Pressable onPress={onRegister} style={({ pressed }) => pressed && styles.buttonPressed}>
              <Text style={styles.signupText}>Don't have an account? Sign up here.</Text>
            </Pressable>
            <View style={styles.demoPanel}>
              <Text style={styles.demoLabel}>Demo accounts</Text>
              <Text style={styles.demoText}>borrower@safelink.com / 123456</Text>
              <Text style={styles.demoText}>lender@safelink.com / 123456</Text>
            </View>
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
    justifyContent: 'space-between',
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
  formMeta: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    minHeight: 24,
  },
  forgotPassword: {
    marginLeft: 12,
  },
  forgotPasswordText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  error: {
    color: '#FCA5A5',
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
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
  buttonDisabled: {
    opacity: 0.72,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
    marginTop: 34,
  },
  signupText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 18,
  },
  demoPanel: {
    alignItems: 'center',
    backgroundColor: 'rgba(32,38,42,0.28)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  demoLabel: {
    color: '#BBF7D0',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  demoText: {
    color: '#D1D5DB',
    fontSize: 12,
    lineHeight: 18,
  },
});
