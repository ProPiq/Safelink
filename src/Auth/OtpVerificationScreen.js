import { useRef, useState } from 'react';
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
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Verify Your OTP</Text>
            <Text style={styles.subtitle}>
              Enter OTP sent to your email to verify your identity
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
                  style={styles.otpInput}
                  textAlign="center"
                  value={digit}
                />
              ))}
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
            {message ? <Text style={styles.message}>{message}</Text> : null}

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
    paddingBottom: bottomInset + 20,
    paddingHorizontal: 30,
    paddingTop: topInset + 44,
  },
  content: {
    flex: 1,
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
    marginTop: 32,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'space-between',
  },
  otpInput: {
    backgroundColor: '#5A5D60',
    borderColor: '#69C97C',
    borderRadius: 14,
    borderWidth: 2,
    color: '#F8FAFC',
    flex: 1,
    fontSize: 26,
    fontWeight: '700',
    height: 62,
  },
  error: {
    color: '#FCA5A5',
    fontSize: 14,
    marginTop: 18,
  },
  message: {
    color: '#BBF7D0',
    fontSize: 14,
    marginTop: 18,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#28C55F',
    borderRadius: 14,
    marginTop: 96,
    paddingVertical: 15,
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
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  secondaryButtonText: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});
