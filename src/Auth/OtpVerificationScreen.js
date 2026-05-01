import { useRef, useState } from 'react';
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

const OTP_LENGTH = 4;
const topInset = Platform.OS === 'android' ? NativeStatusBar.currentHeight ?? 0 : 0;
const bottomInset = Platform.OS === 'android' ? 34 : 10;

export default function OtpVerificationScreen({ onContinue }) {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const inputRefs = useRef([]);

  function handleOtpChange(index, value) {
    const nextValue = value.replace(/[^0-9]/g, '').slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = nextValue;
    setOtp(nextOtp);

    if (error) {
      setError('');
    }

    if (message) {
      setMessage('');
    }

    if (nextValue && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(index, key) {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleContinue() {
    if (otp.some((digit) => !digit)) {
      setError('Please enter the full OTP.');
      setMessage('');
      return;
    }

    setError('');
    setMessage('');
    onContinue();
  }

  function handleResendOtp() {
    setOtp(Array(OTP_LENGTH).fill(''));
    setError('');
    setMessage('A new OTP has been sent to your email.');
    inputRefs.current[0]?.focus();
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
            <Text style={styles.title}>Verify Your OTP</Text>
            <Text style={styles.subtitle}>
              Enter the code sent to your email to verify your identity.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.otpRow}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  keyboardType="number-pad"
                  maxLength={1}
                  onChangeText={(value) => handleOtpChange(index, value)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  selectionColor="#69C97C"
                  style={styles.otpInput}
                  textAlign="center"
                  textContentType="oneTimeCode"
                  value={digit}
                />
              ))}
            </View>

            <View style={styles.feedbackArea}>
              {error ? <Text style={styles.error}>{error}</Text> : null}
              {message ? <Text style={styles.message}>{message}</Text> : null}
            </View>

            <Pressable
              onPress={handleContinue}
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            >
              <Text style={styles.buttonText}>CONTINUE</Text>
            </Pressable>

            <Pressable
              onPress={handleResendOtp}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.secondaryButtonText}>RESEND OTP</Text>
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
    marginTop: 40,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  otpInput: {
    backgroundColor: 'rgba(32,38,42,0.28)',
    borderColor: 'rgba(105,201,124,0.82)',
    borderRadius: 14,
    borderWidth: 2,
    color: '#F8FAFC',
    flex: 1,
    fontSize: 26,
    fontWeight: '700',
    height: 62,
  },
  feedbackArea: {
    minHeight: 38,
  },
  error: {
    color: '#FCA5A5',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 18,
    textAlign: 'center',
  },
  message: {
    color: '#BBF7D0',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 18,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#28C55F',
    borderRadius: 14,
    elevation: 3,
    marginTop: 56,
    paddingVertical: 15,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: '#69C97C',
    borderRadius: 14,
    borderWidth: 2,
    marginTop: 16,
    paddingVertical: 15,
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
  secondaryButtonText: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
