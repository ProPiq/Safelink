import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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

const walletActions = [
  { icon: 'cash-minus', label: 'Cashout', mode: 'cashout' },
  { icon: 'calendar-plus-outline', label: 'Deposit', mode: 'deposit' },
  { icon: 'history', label: 'History', mode: 'history' },
];

const transactions = [
  {
    id: '1',
    amount: 3500,
    avatar: 'https://api.dicebear.com/9.x/adventurer/png?seed=Ada&backgroundColor=5fa8ff',
    date: '06 Dec, 2025',
    direction: 'out',
    name: 'Pseudonym',
  },
  {
    id: '2',
    amount: 300,
    avatar: 'https://api.dicebear.com/9.x/adventurer/png?seed=Neo&backgroundColor=5fa8ff',
    date: '15 Nov, 2025',
    direction: 'in',
    name: 'Pseudonym',
  },
  {
    id: '3',
    amount: 1200,
    avatar: 'https://api.dicebear.com/9.x/adventurer/png?seed=Kago&backgroundColor=5fa8ff',
    date: '06 Oct, 2025',
    direction: 'in',
    name: 'Nickname',
  },
];

function formatPula(value) {
  return `P ${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function WalletAction({ icon, label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.actionItem, pressed && styles.buttonPressed]}
    >
      <View style={styles.actionIcon}>
        <MaterialCommunityIcons color="#28C55F" name={icon} size={21} />
      </View>
      <Text numberOfLines={1} style={styles.actionLabel}>
        {label}
      </Text>
    </Pressable>
  );
}

function TransactionRow({ item }) {
  const isIncoming = item.direction === 'in';
  const amountPrefix = isIncoming ? '+' : '-';

  return (
    <Pressable style={({ pressed }) => [styles.transactionCard, pressed && styles.buttonPressed]}>
      <Image source={{ uri: item.avatar }} style={styles.transactionAvatar} />

      <View style={styles.transactionDetails}>
        <View>
          <Text numberOfLines={1} style={styles.transactionName}>
            {item.name}
          </Text>
          <Text style={styles.transactionType}>{isIncoming ? 'Wallet deposit' : 'Cashout'}</Text>
        </View>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>

      <View style={styles.transactionAmountWrap}>
        <View style={[styles.directionBadge, !isIncoming && styles.directionBadgeOut]}>
          <Ionicons
            color={isIncoming ? '#20262A' : '#20262A'}
            name={isIncoming ? 'arrow-up' : 'arrow-down'}
            size={13}
          />
        </View>
        <Text
          adjustsFontSizeToFit
          minimumFontScale={0.78}
          numberOfLines={1}
          style={[styles.transactionAmount, !isIncoming && styles.transactionAmountOut]}
        >
          {amountPrefix} {formatPula(item.amount)}
        </Text>
      </View>
    </Pressable>
  );
}

export default function Wallet({ onOpenMenu, onOpenNotifications, onOpenTransact }) {
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isShortScreen = height <= 760;
  const isVeryShortScreen = height <= 700;
  const isNarrowScreen = width <= 360;
  const isWideScreen = width >= 768;
  const bottomInset = Platform.OS === 'android' ? insets.bottom : 0;
  const bottomNavClearance =
    (Platform.OS === 'ios' ? (isVeryShortScreen ? 96 : 104) : isVeryShortScreen ? 94 : 104) +
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

          <Text style={[styles.brand, isNarrowScreen && styles.brandNarrow]}>Wallet</Text>

          <Pressable hitSlop={10} onPress={onOpenNotifications} style={styles.iconButton}>
            <Ionicons
              color="#F8FAFC"
              name="notifications-outline"
              size={isNarrowScreen ? 24 : 27}
            />
          </Pressable>
        </View>

        <View style={styles.body}>
          <ScrollView
            contentContainerStyle={[
              styles.content,
              isWideScreen && styles.contentWide,
              { paddingBottom: bottomNavClearance + 22 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.balanceCard, isNarrowScreen && styles.balanceCardNarrow]}>
              <View style={styles.balanceCopy}>
                <View style={styles.balanceHeader}>
                  <Text style={styles.balanceLabel}>Total Balance</Text>
                  <View style={styles.balancePill}>
                    <Text style={styles.balancePillText}>Available</Text>
                  </View>
                </View>
                <Text
                  adjustsFontSizeToFit
                  minimumFontScale={0.76}
                  numberOfLines={1}
                  style={styles.balanceAmount}
                >
                  {formatPula(2530)}
                </Text>
              </View>

              <View style={styles.actionsRow}>
                {walletActions.map((action) => (
                  <WalletAction
                    key={action.label}
                    icon={action.icon}
                    label={action.label}
                    onPress={
                      action.mode === 'history' ? undefined : () => onOpenTransact?.(action.mode)
                    }
                  />
                ))}
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <Text style={styles.sectionCount}>{transactions.length} total</Text>
            </View>

            <View style={styles.transactionList}>
              {transactions.map((transaction) => (
                <TransactionRow key={transaction.id} item={transaction} />
              ))}
            </View>
          </ScrollView>

          <Pressable
            style={({ pressed }) => [
              styles.floatingAction,
              isWideScreen && styles.floatingActionWide,
              { bottom: bottomNavClearance + 14 },
              pressed && styles.buttonPressed,
            ]}
          >
            <MaterialCommunityIcons color="#FFFFFF" name="hand-coin-outline" size={31} />
          </Pressable>
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
  body: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flexGrow: 1,
  },
  contentWide: {
    alignSelf: 'center',
    maxWidth: 520,
    width: '100%',
  },
  balanceCard: {
    alignItems: 'stretch',
    backgroundColor: '#20262A',
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'space-between',
    minHeight: 130,
    paddingHorizontal: 19,
    paddingVertical: 18,
  },
  balanceCardNarrow: {
    paddingHorizontal: 16,
  },
  balanceCopy: {
    minWidth: 0,
  },
  balanceHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  balanceLabel: {
    color: '#28C55F',
    fontSize: 15,
    fontWeight: '800',
  },
  balancePill: {
    backgroundColor: 'rgba(40,197,95,0.14)',
    borderColor: 'rgba(40,197,95,0.45)',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  balancePillText: {
    color: '#56E886',
    fontSize: 10,
    fontWeight: '800',
  },
  balanceAmount: {
    color: '#F8FAFC',
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
  },
  actionsRow: {
    alignItems: 'center',
    backgroundColor: 'rgba(248,250,252,0.04)',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  actionItem: {
    alignItems: 'center',
    flex: 1,
    minHeight: 55,
  },
  actionIcon: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    height: 36,
    justifyContent: 'center',
    marginBottom: 5,
    width: 42,
  },
  actionLabel: {
    color: 'rgba(248,250,252,0.86)',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 12,
    maxWidth: 58,
    textAlign: 'center',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 11,
    marginTop: 25,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 19,
    fontWeight: '800',
  },
  sectionCount: {
    color: 'rgba(248,250,252,0.62)',
    fontSize: 12,
    fontWeight: '700',
  },
  transactionList: {
    gap: 9,
  },
  transactionCard: {
    alignItems: 'center',
    backgroundColor: '#20262A',
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 84,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  transactionAvatar: {
    backgroundColor: '#5FA8FF',
    borderRadius: 8,
    height: 60,
    width: 64,
  },
  transactionDetails: {
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 12,
    minHeight: 56,
    minWidth: 0,
  },
  transactionName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  transactionType: {
    color: 'rgba(248,250,252,0.55)',
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  transactionDate: {
    color: 'rgba(248,250,252,0.7)',
    fontSize: 11,
    lineHeight: 14,
  },
  transactionAmountWrap: {
    alignItems: 'flex-end',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginLeft: 10,
    maxWidth: 128,
  },
  directionBadge: {
    alignItems: 'center',
    backgroundColor: '#28C55F',
    borderRadius: 999,
    height: 17,
    justifyContent: 'center',
    width: 17,
  },
  directionBadgeOut: {
    backgroundColor: '#8B8D8F',
  },
  transactionAmount: {
    color: '#28C55F',
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 24,
    textAlign: 'right',
  },
  transactionAmountOut: {
    color: '#F8FAFC',
  },
  floatingAction: {
    alignItems: 'center',
    backgroundColor: '#28C55F',
    borderRadius: 999,
    elevation: 8,
    height: 68,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    shadowColor: '#000000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 9,
    width: 68,
  },
  floatingActionWide: {
    right: 0,
  },
  buttonPressed: {
    opacity: 0.92,
  },
});
