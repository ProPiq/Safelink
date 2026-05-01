import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const topInset = Platform.OS === 'android' ? NativeStatusBar.currentHeight ?? 0 : 0;
const offerInfoHeight = 80;
const fadeSteps = Array.from({ length: 36 }, (_, index) => {
  const progress = index / 35;
  return Number((0.9 * (1 - progress) ** 1.8).toFixed(3));
});

const offers = Array.from({ length: 12 }, (_, index) => {
  const names = [
    'Pseudonym',
    'Aliasname',
    'Nickname',
    'Moneyman',
    'Cashlane',
    'Lendmate',
    'Quickfund',
    'Trustline',
    'Bokamoso',
    'Naledi',
    'Kopano',
    'Thuso',
  ];
  const amounts = [8000, 900, 1000, 2400, 3500, 1250, 5000, 1750, 4200, 650, 2800, 1100];
  const rates = [29, 24, 20, 18, 22, 15, 26, 17, 21, 19, 23, 16];
  const terms = [4, 2, 4, 3, 4, 1, 4, 2, 3, 1, 4, 2];
  const avatarSeeds = ['sarah', 'leo', 'maya', 'neo', 'amo', 'tumi', 'kago', 'ona', 'kat', 'les', 'lor', 'kef'];

  return {
    id: `${index + 1}`,
    amount: amounts[index],
    avatar: `https://api.dicebear.com/9.x/adventurer/png?seed=${avatarSeeds[index]}&backgroundColor=5fa8ff`,
    name: names[index],
    rating: index % 3 === 0 ? '4.8' : '4.5',
    rate: rates[index],
    term: terms[index],
  };
});

function formatMoney(value) {
  return `BWP ${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function OfferRow({ item, isLast }) {
  const repayment = item.amount + (item.amount * item.rate) / 100;

  return (
    <View style={[styles.offerItem, isLast && styles.offerItemLast]}>
      <View style={styles.offerTop}>
        <View>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.onlineDot} />
        </View>

        <View style={styles.offerDetails}>
          <View style={styles.offerHeader}>
            <Text numberOfLines={1} style={styles.offerName}>
              {item.name}
            </Text>
            <View style={styles.divider} />
            <View style={styles.verifiedWrap}>
              <Ionicons color="#39A7F5" name="checkmark-circle" size={14} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
            <View style={styles.ratingWrap}>
              <Ionicons color="#FACC15" name="star" size={15} />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <MaterialCommunityIcons color="#F8FAFC" name="cash" size={16} />
            <Text style={styles.metaText}>{formatMoney(item.amount)}</Text>
          </View>

          <View style={styles.metaRow}>
            <MaterialCommunityIcons color="#F8FAFC" name="percent" size={16} />
            <Text style={styles.metaText}>
              {item.rate}% ( {formatMoney(repayment)} )
            </Text>
          </View>

          <View style={[styles.metaRow, styles.metaRowLast]}>
            <MaterialCommunityIcons color="#F8FAFC" name="calendar-month-outline" size={16} />
            <Text style={styles.metaText}>
              {item.term} {item.term === 1 ? 'week' : 'weeks'}
            </Text>
          </View>
        </View>
      </View>

      <Pressable style={({ pressed }) => [styles.offerButton, pressed && styles.buttonPressed]}>
        <Text style={styles.offerButtonText}>View Offer</Text>
      </Pressable>
    </View>
  );
}

function ListFade({ position }) {
  const steps = position === 'top' ? fadeSteps : [...fadeSteps].reverse();

  return (
    <View
      pointerEvents="none"
      style={[styles.listFade, position === 'top' ? styles.listFadeTop : styles.listFadeBottom]}
    >
      {steps.map((opacity) => (
        <View
          key={opacity}
          style={[styles.fadeStep, { backgroundColor: `rgba(73,75,77,${opacity})` }]}
        />
      ))}
    </View>
  );
}

export default function Explore({ onOpenMenu, onOpenNotifications }) {
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isShortScreen = height <= 760;
  const isVeryShortScreen = height <= 700;
  const isNarrowScreen = width <= 360;
  const bottomInset = Platform.OS === 'android' ? insets.bottom : 0;
  const bottomNavClearance =
    Platform.OS === 'ios'
      ? isVeryShortScreen
        ? 36
        : 44
      : (isVeryShortScreen ? 78 : 86) + bottomInset;

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

          <Text style={[styles.brand, isNarrowScreen && styles.brandNarrow]}>Explore</Text>

          <Pressable hitSlop={10} onPress={onOpenNotifications} style={styles.iconButton}>
            <Ionicons
              color="#F8FAFC"
              name="notifications-outline"
              size={isNarrowScreen ? 24 : 27}
            />
          </Pressable>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons color="#F8FAFC" name="search-outline" size={26} />
            <TextInput
              placeholder="Name, Rate, Amount"
              placeholderTextColor="rgba(248,250,252,0.38)"
              style={styles.searchInput}
            />
          </View>

          <Pressable style={({ pressed }) => [styles.filterButton, pressed && styles.buttonPressed]}>
            <MaterialCommunityIcons color="#F8FAFC" name="filter-variant" size={28} />
          </Pressable>
        </View>

        <View style={[styles.listFrame, { marginBottom: bottomNavClearance }]}>
          <FlatList
            data={offers}
            fadingEdgeLength={Platform.OS === 'android' ? 36 : 0}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <OfferRow item={item} isLast={index === offers.length - 1} />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            style={styles.offerList}
          />

          {Platform.OS === 'ios' ? (
            <>
              <ListFade position="top" />
              <ListFade position="bottom" />
            </>
          ) : null}
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
  searchRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 8,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: '#252A2F',
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 51,
    paddingHorizontal: 18,
  },
  searchInput: {
    color: '#F8FAFC',
    flex: 1,
    fontSize: 14,
    paddingVertical: 12,
  },
  filterButton: {
    alignItems: 'center',
    backgroundColor: '#252A2F',
    borderRadius: 13,
    height: 51,
    justifyContent: 'center',
    width: 51,
  },
  listFrame: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  offerList: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 22,
    paddingTop: 4,
  },
  listFade: {
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 2,
  },
  listFadeTop: {
    top: 0,
  },
  listFadeBottom: {
    bottom: 0,
  },
  fadeStep: {
    height: 1,
  },
  offerItem: {
    borderBottomColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 1,
    marginHorizontal: 2,
    paddingBottom: 16,
    paddingTop: 16,
  },
  offerItemLast: {
    borderBottomWidth: 0,
  },
  offerTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  avatar: {
    backgroundColor: '#5FA8FF',
    borderRadius: 10,
    height: offerInfoHeight,
    width: offerInfoHeight,
  },
  onlineDot: {
    backgroundColor: '#39EF7A',
    borderRadius: 999,
    height: 10,
    position: 'absolute',
    right: -4,
    top: -2,
    width: 10,
  },
  offerDetails: {
    height: offerInfoHeight,
    flex: 1,
    marginLeft: 16,
    minWidth: 0,
  },
  offerHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 22,
    marginBottom: 4,
  },
  offerName: {
    color: '#F8FAFC',
    flex: 1,
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 22,
  },
  divider: {
    backgroundColor: '#F8FAFC',
    height: 30,
    marginHorizontal: 12,
    width: 1,
  },
  verifiedWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
    marginRight: 10,
  },
  verifiedText: {
    color: '#F8FAFC',
    fontSize: 7,
  },
  ratingWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
  },
  ratingText: {
    color: '#F8FAFC',
    fontSize: 8,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    height: 16,
    marginBottom: 5,
  },
  metaRowLast: {
    marginBottom: 0,
  },
  metaText: {
    color: '#F8FAFC',
    fontSize: 12,
    lineHeight: 16,
  },
  offerButton: {
    alignItems: 'center',
    backgroundColor: '#28C55F',
    borderRadius: 6,
    marginHorizontal: 16,
    marginTop: 14,
    paddingVertical: 13,
  },
  offerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  buttonPressed: {
    opacity: 0.92,
  },
});
