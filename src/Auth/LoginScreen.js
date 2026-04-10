import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { loginUser } from '../APIs/authApi';

const topInset = Platform.OS === 'android' ? NativeStatusBar.currentHeight ?? 0 : 0;
const bottomInset = Platform.OS === 'android' ? 34 : 10;

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const user = await loginUser({ email, password });
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
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>LOGIN</Text>
          <Text style={styles.subtitle}>Welcome, let's get started</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="jdoe@user.co.bw"
            placeholderTextColor="#D1D5DB"
            style={styles.input}
            value={email}
          />

          <Text style={[styles.label, styles.passwordLabel]}>Password</Text>
          <TextInput
            onChangeText={setPassword}
            placeholder="***************"
            placeholderTextColor="#D1D5DB"
            secureTextEntry
            style={styles.input}
            value={password}
          />

          <Pressable style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </Pressable>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            disabled={isLoading}
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
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
          <Text style={styles.signupText}>Don't have an account?, sign up here.</Text>
          <Text style={styles.demoText}>Demo: borrower@safelink.com / 123456</Text>
          <Text style={styles.demoText}>Demo: lender@safelink.com / 123456</Text>
        </View>
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
    paddingTop: topInset + 56,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 32,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#F4F4F5',
    fontSize: 15,
    marginTop: 26,
  },
  form: {
    marginTop: 0,
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
  input: {
    borderBottomColor: '#69C97C',
    borderBottomWidth: 3,
    color: '#F8FAFC',
    fontSize: 18,
    paddingBottom: 10,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 14,
  },
  forgotPasswordText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
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
    marginTop: 64,
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
  footer: {
    alignItems: 'center',
  },
  signupText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 24,
  },
  demoText: {
    color: '#D1D5DB',
    fontSize: 12,
    lineHeight: 18,
  },
});
