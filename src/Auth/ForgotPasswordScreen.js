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
              <Ionicons color="#F8FAFC" name="key-outline" size={28} />
            </View>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Enter your email and we'll send a reset link to help you regain access.
            </Text>
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
                onSubmitEditing={handleSubmit}
                placeholder="jdoe@user.co.bw"
                placeholderTextColor="rgba(248,250,252,0.5)"
                returnKeyType="send"
                style={styles.input}
                textContentType="emailAddress"
                value={email}
              />
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Pressable
              onPress={handleSubmit}
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            >
              <Text style={styles.buttonText}>SEND RESET LINK</Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Pressable onPress={onBack} style={({ pressed }) => pressed && styles.buttonPressed}>
              <Text style={styles.backText}>Back to login</Text>
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
  footer: {
    alignItems: 'center',
    marginTop: 34,
  },
  backText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
});
