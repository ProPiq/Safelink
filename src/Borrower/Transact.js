import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

const topInset = Platform.OS === 'android' ? NativeStatusBar.currentHeight ?? 0 : 0;

const banks = [
  {
    accent: '#0B5E9E',
    background: '#E9F3FB',
    id: 'stanbic',
    logo: 'S',
    name: 'Stanbic',
  },
  {
    accent: '#F37021',
    background: '#FFF0E6',
    id: 'access',
    logo: 'A',
    name: 'Access',
  },
  {
    accent: '#D71920',
    background: '#FDEBEC',
    id: 'absa',
    logo: 'a',
    name: 'Absa',
  },
  {
    accent: '#00AEEF',
    background: '#E7F8FE',
    id: 'fnb',
    logo: 'F',
    name: 'FNB',
  },
];

function BankOption({ bank }) {
  return (
    <Pressable style={({ pressed }) => [styles.bankCard, pressed && styles.buttonPressed]}>
      <View style={[styles.logoWrap, { backgroundColor: bank.background }]}>
        <View style={[styles.logoMark, { backgroundColor: bank.accent }]}>
          <Text style={styles.logoText}>{bank.logo}</Text>
        </View>
      </View>

      <View style={styles.bankDetails}>
        <Text style={styles.bankName}>{bank.name}</Text>
        <Text style={styles.bankMeta}>Use linked {bank.name} bank account</Text>
      </View>

      <Ionicons color="#F8FAFC" name="chevron-forward" size={22} />
    </Pressable>
  );
}

export default function Transact({ mode = 'cashout', onBack }) {
  const { height, width } = useWindowDimensions();
  const isShortScreen = height <= 760;
  const isVeryShortScreen = height <= 700;
  const isNarrowScreen = width <= 360;
  const isWideScreen = width >= 768;
  const title = mode === 'deposit' ? 'Deposit' : 'Cashout';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View
        style={[
          styles.container,
          isShortScreen && styles.containerShort,
          isVeryShortScreen && styles.containerVeryShort,
          isNarrowScreen && styles.containerNarrow,
        ]}
      >
        <View style={[styles.topBar, isShortScreen && styles.topBarShort]}>
          <Pressable hitSlop={10} onPress={onBack} style={styles.iconButton}>
            <Ionicons color="#F8FAFC" name="chevron-back" size={isNarrowScreen ? 25 : 28} />
          </Pressable>

          <Text style={[styles.brand, isNarrowScreen && styles.brandNarrow]}>{title}</Text>

          <View style={styles.iconButton} />
        </View>

        <View style={[styles.content, isWideScreen && styles.contentWide]}>
          <View style={styles.introCard}>
            <Text style={styles.introLabel}>Select Bank</Text>
            <Text style={styles.introText}>Choose the bank account you want to use.</Text>
          </View>

          <View style={styles.bankList}>
            {banks.map((bank) => (
              <BankOption bank={bank} key={bank.id} />
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#494B4D',
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 23,
    paddingTop: topInset + 8,
  },
  containerShort: {
    paddingTop: topInset + 4,
  },
  containerVeryShort: {
    paddingTop: topInset + 2,
  },
  containerNarrow: {
    paddingHorizontal: 18,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  topBarShort: {
    marginBottom: 18,
  },
  iconButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  brand: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
  },
  brandNarrow: {
    fontSize: 15,
  },
  content: {
    flex: 1,
  },
  contentWide: {
    alignSelf: 'center',
    maxWidth: 520,
    width: '100%',
  },
  introCard: {
    backgroundColor: '#20262A',
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  introLabel: {
    color: '#28C55F',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 7,
  },
  introText: {
    color: 'rgba(248,250,252,0.72)',
    fontSize: 14,
    lineHeight: 20,
  },
  bankList: {
    gap: 10,
  },
  bankCard: {
    alignItems: 'center',
    backgroundColor: '#20262A',
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 76,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  logoWrap: {
    alignItems: 'center',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    marginRight: 13,
    width: 58,
  },
  logoMark: {
    alignItems: 'center',
    borderRadius: 999,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  bankDetails: {
    flex: 1,
    minWidth: 0,
  },
  bankName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
  },
  bankMeta: {
    color: 'rgba(248,250,252,0.62)',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  buttonPressed: {
    opacity: 0.92,
  },
});
