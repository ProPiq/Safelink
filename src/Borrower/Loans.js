import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const topInset = Platform.OS === 'android' ? NativeStatusBar.currentHeight ?? 0 : 0;

const activeLoan = {
  amount: 8000,
  avatar: 'https://api.dicebear.com/9.x/adventurer/png?seed=sarah&backgroundColor=5fa8ff',
  dueDate: '11 Feb, 2026',
  name: 'Pseudonym',
  rate: 29,
  term: '4 weeks',
};

const previousLoans = [
  { id: '1', amount: 10000, date: '29 Jan 2026', name: 'Aliasname' },
  { id: '2', amount: 700, date: '27 Jun 2025', name: 'Fakename' },
  { id: '3', amount: 8000, date: '29 Jan 2026', name: 'Pseudonym' },
];

function formatAmount(value) {
  return `P ${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatCompactAmount(value) {
  return `BWP ${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function OlderLoanCard({ item }) {
  return (
    <Pressable style={({ pressed }) => [styles.previousCard, pressed && styles.buttonPressed]}>
      <View style={styles.previousIcon}>
        <Ionicons color="#28C55F" name="checkmark-circle-outline" size={22} />
      </View>

      <View style={styles.previousDetails}>
        <Text numberOfLines={1} style={styles.previousName}>
          {item.name}
        </Text>
        <Text style={styles.previousDate}>{item.date}</Text>
      </View>

      <Text
        adjustsFontSizeToFit
        minimumFontScale={0.78}
        numberOfLines={1}
        style={styles.previousAmount}
      >
        {formatCompactAmount(item.amount)}
      </Text>
    </Pressable>
  );
}

export default function Loans({ onOpenMenu, onOpenNotifications }) {
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isShortScreen = height <= 760;
  const isVeryShortScreen = height <= 700;
  const isNarrowScreen = width <= 360;
  const isWideScreen = width >= 768;
  const bottomInset = Platform.OS === 'android' ? insets.bottom : 0;
  const bottomNavClearance =
    (Platform.OS === 'ios' ? (isVeryShortScreen ? 64 : 72) : isVeryShortScreen ? 78 : 86) +
    bottomInset;

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
          <Pressable hitSlop={10} onPress={onOpenMenu} style={styles.iconButton}>
            <Ionicons color="#F8FAFC" name="menu" size={isNarrowScreen ? 24 : 28} />
          </Pressable>

          <Text style={[styles.brand, isNarrowScreen && styles.brandNarrow]}>My Loans</Text>

          <Pressable hitSlop={10} onPress={onOpenNotifications} style={styles.iconButton}>
            <Ionicons
              color="#F8FAFC"
              name="notifications-outline"
              size={isNarrowScreen ? 24 : 27}
            />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.content,
            isWideScreen && styles.contentWide,
            { paddingBottom: bottomNavClearance + 22 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.activeCard, isNarrowScreen && styles.activeCardNarrow]}>
            <View style={styles.activeInfoRow}>
              <Image source={{ uri: activeLoan.avatar }} style={styles.avatar} />

              <View style={styles.activeDetails}>
                <View style={styles.activeHeader}>
                  <Text numberOfLines={1} style={styles.activeName}>
                    {activeLoan.name}
                  </Text>
                  <View style={styles.statusPill}>
                    <Text style={styles.statusPillText}>Active</Text>
                  </View>
                </View>

                <View style={styles.metaGrid}>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Due</Text>
                    <Text numberOfLines={1} style={styles.metaValue}>
                      {activeLoan.dueDate}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Rate</Text>
                    <Text style={styles.metaValue}>{activeLoan.rate}%</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Term</Text>
                    <Text style={styles.metaValue}>{activeLoan.term}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={[styles.amountBanner, isNarrowScreen && styles.amountBannerNarrow]}>
              <View>
                <Text style={styles.activeLabel}>ACTIVE LOAN</Text>
                <Text style={styles.loanLabel}>Balance</Text>
              </View>

              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.75}
                numberOfLines={1}
                style={styles.activeAmount}
              >
                {formatAmount(activeLoan.amount)}
              </Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Older Loans</Text>
            <Text style={styles.sectionCount}>{previousLoans.length} paid</Text>
          </View>

          <View style={styles.previousList}>
            {previousLoans.map((loan) => (
              <OlderLoanCard key={loan.id} item={loan} />
            ))}
          </View>
        </ScrollView>
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
    paddingHorizontal: 24,
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
    marginBottom: 22,
  },
  topBarShort: {
    marginBottom: 16,
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
    flexGrow: 1,
  },
  contentWide: {
    alignSelf: 'center',
    maxWidth: 520,
    width: '100%',
  },
  activeCard: {
    backgroundColor: '#20262A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  activeCardNarrow: {
    paddingHorizontal: 14,
  },
  activeInfoRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  avatar: {
    backgroundColor: '#5FA8FF',
    borderRadius: 10,
    height: 70,
    width: 70,
  },
  activeDetails: {
    flex: 1,
    marginLeft: 14,
    minWidth: 0,
  },
  activeHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 11,
  },
  activeName: {
    color: '#FFFFFF',
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
  },
  statusPill: {
    backgroundColor: 'rgba(40,197,95,0.18)',
    borderColor: 'rgba(40,197,95,0.55)',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  statusPillText: {
    color: '#56E886',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  metaGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  metaItem: {
    flex: 1,
    minWidth: 0,
  },
  metaLabel: {
    color: 'rgba(248,250,252,0.58)',
    fontSize: 10,
    marginBottom: 3,
  },
  metaValue: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  amountBanner: {
    alignItems: 'center',
    backgroundColor: '#28C55F',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    minHeight: 58,
    paddingHorizontal: 18,
  },
  amountBannerNarrow: {
    paddingHorizontal: 14,
  },
  activeLabel: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  loanLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
  },
  activeAmount: {
    color: '#FFFFFF',
    flexShrink: 1,
    fontSize: 31,
    fontWeight: '800',
    marginLeft: 14,
    textAlign: 'right',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 26,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },
  sectionCount: {
    color: 'rgba(248,250,252,0.62)',
    fontSize: 12,
    fontWeight: '700',
  },
  previousList: {
    gap: 8,
  },
  previousCard: {
    alignItems: 'center',
    backgroundColor: '#20262A',
    borderRadius: 12,
    flexDirection: 'row',
    minHeight: 64,
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
  previousIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(40,197,95,0.12)',
    borderRadius: 999,
    height: 34,
    justifyContent: 'center',
    marginRight: 11,
    width: 34,
  },
  previousDetails: {
    flex: 1,
    minWidth: 0,
  },
  previousName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 7,
  },
  previousDate: {
    color: 'rgba(248,250,252,0.66)',
    fontSize: 11,
  },
  previousAmount: {
    color: '#FFFFFF',
    flexShrink: 1,
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 12,
    maxWidth: 116,
    textAlign: 'right',
  },
  buttonPressed: {
    opacity: 0.92,
  },
});
