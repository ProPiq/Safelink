import { useState } from 'react';
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

export default function ForgotPasswordScreen({ onBack, onContinue }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  function handleSubmit() {
    if (!email.trim()) {
      setError('Please enter your email address.');
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
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter email to receive reset link and regain access to your account
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="jdoe@user.co.bw"
            placeholderTextColor="rgba(248,250,252,0.55)"
            style={styles.input}
            value={email}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable
            onPress={handleSubmit}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonText}>SEND RESET LINK</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Pressable onPress={onBack}>
            <Text style={styles.backText}>Back to login</Text>
          </Pressable>
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
  },
  subtitle: {
    color: '#F4F4F5',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 18,
    textAlign: 'center',
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
  input: {
    borderBottomColor: '#69C97C',
    borderBottomWidth: 3,
    color: '#F8FAFC',
    fontSize: 18,
    paddingBottom: 10,
    paddingHorizontal: 0,
    paddingTop: 0,
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
  backText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
});
