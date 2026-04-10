import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { loginUser } from '../APIs/authApi';

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
      <View style={styles.container}>
        <Text style={styles.brand}>SafeLink</Text>
        <Text style={styles.title}>Sign in to your portal</Text>
        <Text style={styles.subtitle}>
          Borrowers and lenders are redirected based on their role after login.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#6b7280"
            style={styles.input}
            value={email}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#6b7280"
            secureTextEntry
            style={styles.input}
            value={password}
          />

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
              <Text style={styles.buttonText}>Login</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>Demo accounts</Text>
          <Text style={styles.demoText}>Borrower: borrower@safelink.com / 123456</Text>
          <Text style={styles.demoText}>Lender: lender@safelink.com / 123456</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  brand: {
    color: '#0f766e',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    color: '#111827',
    fontSize: 30,
    fontWeight: '700',
  },
  subtitle: {
    color: '#4b5563',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  label: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderColor: '#d1d5db',
    borderRadius: 14,
    borderWidth: 1,
    color: '#111827',
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  error: {
    color: '#b91c1c',
    fontSize: 14,
    marginTop: 14,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#0f766e',
    borderRadius: 14,
    marginTop: 20,
    paddingVertical: 15,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  demoBox: {
    backgroundColor: '#e6fffb',
    borderRadius: 16,
    marginTop: 20,
    padding: 16,
  },
  demoTitle: {
    color: '#134e4a',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  demoText: {
    color: '#115e59',
    fontSize: 14,
    lineHeight: 21,
  },
});
