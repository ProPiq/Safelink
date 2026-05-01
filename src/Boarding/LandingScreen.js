import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {
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

const stats = [
  {
    title: 'Active Lenders',
    value: '124',
    detail: 'online',
    backgroundColor: '#57A7B2',
    accent: '#BDE3E7',
    chart: 'chart-line-variant',
  },
  {
    title: 'Active Borrowers',
    value: '96',
    detail: 'requesting funds',
    backgroundColor: '#D59645',
    accent: '#F5D3A8',
    chart: 'chart-line',
  },
];

const opportunities = [
  {
    title: 'Borrower: BWP 3,000',
    subtitle: 'Repayment in 2 months',
    backgroundColor: '#CB7756',
  },
  {
    title: 'Borrower: BWP 1,000',
    subtitle: 'Near Gaborone',
    backgroundColor: '#6B9A70',
  },
];

const navItems = [
  { label: 'Home', icon: 'home-outline' },
  { label: 'Explore', icon: 'sparkles-outline' },
  { label: 'Offers', icon: 'basket-outline' },
  { label: 'My Loans', icon: 'cash-outline' },
  { label: 'Notifications', icon: 'chatbox-ellipses-outline' },
];

const topInset = Platform.OS === 'android' ? NativeStatusBar.currentHeight ?? 0 : 0;
const bottomInset = Platform.OS === 'android' ? 34 : 10;

function DashboardCard({ title, value, detail, backgroundColor, accent, chart }) {
  return (
    <View style={[styles.dashboardCard, { backgroundColor }]}>
      <View style={styles.cardHeader}>
        <Ionicons color="#F8FAFC" name="person-circle-outline" size={20} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.cardDivider} />
      <View style={styles.cardFooter}>
        <View>
          <View style={styles.metricRow}>
            <Ionicons color="#EAF5F7" name="person-circle-outline" size={20} />
            <Text style={styles.metricValue}>{value}</Text>
            <MaterialCommunityIcons color={accent} name={chart} size={26} style={styles.chartIcon} />
          </View>
          <Text style={styles.metricDetail}>{detail}</Text>
        </View>
      </View>
    </View>
  );
}

function OpportunityCard({ title, subtitle, backgroundColor }) {
  return (
    <View style={[styles.opportunityCard, { backgroundColor }]}>
      <Text style={styles.opportunityTitle}>{title}</Text>
      <Text style={styles.opportunitySubtitle}>{subtitle}</Text>
    </View>
  );
}

function BottomNavItem({ icon, label, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.navItem}>
      <Ionicons color="#F8FAFC" name={icon} size={24} />
      <Text numberOfLines={1} style={styles.navLabel}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function LandingScreen({ onContinue }) {
  const { height, width } = useWindowDimensions();
  const isShortScreen = height <= 700;
  const isVeryShortScreen = height <= 640;
  const isNarrowScreen = width <= 360;

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
          <Pressable hitSlop={10} onPress={onContinue} style={styles.iconButton}>
            <Ionicons color="#F8FAFC" name="menu" size={isNarrowScreen ? 24 : 28} />
          </Pressable>

          <Text style={[styles.brand, isNarrowScreen && styles.brandNarrow]}>SAFELINK</Text>

          <Pressable hitSlop={10} onPress={onContinue} style={styles.iconButton}>
            <Ionicons
              color="#F8FAFC"
              name="person-circle-outline"
              size={isNarrowScreen ? 24 : 27}
            />
          </Pressable>
        </View>

        <ScrollView
          bounces={false}
          contentContainerStyle={[
            styles.scrollContent,
            isShortScreen && styles.scrollContentShort,
            isNarrowScreen && styles.scrollContentNarrow,
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.hero, isShortScreen && styles.heroShort]}>
            <Text
              style={[
                styles.heroText,
                isShortScreen && styles.heroTextShort,
                isVeryShortScreen && styles.heroTextVeryShort,
                isNarrowScreen && styles.heroTextNarrow,
              ]}
            >
              Connecting lenders & borrowers, securely.
              <Ionicons
                color="#D59645"
                name="lock-closed"
                size={isShortScreen ? 22 : 26}
                style={styles.inlineLockIcon}
              />
            </Text>
          </View>

          <View style={[styles.dashboardRow, isNarrowScreen && styles.compactRow]}>
            {stats.map((item) => (
              <DashboardCard key={item.title} {...item} />
            ))}
          </View>

          <Text style={[styles.sectionTitle, isShortScreen && styles.sectionTitleShort]}>
            Opportunities
          </Text>

          <View style={[styles.opportunityRow, isNarrowScreen && styles.compactRow]}>
            {opportunities.map((item) => (
              <OpportunityCard key={item.title} {...item} />
            ))}
          </View>

          <View style={[styles.actions, isShortScreen && styles.actionsShort]}>
            <Pressable
              onPress={onContinue}
              style={[
                styles.actionButton,
                styles.borrowButton,
                isShortScreen && styles.actionButtonShort,
              ]}
            >
              <Text
                style={[styles.actionButtonText, isNarrowScreen && styles.actionButtonTextNarrow]}
              >
                I want to borrow
              </Text>
            </Pressable>

            <Pressable
              onPress={onContinue}
              style={[
                styles.actionButton,
                styles.lendButton,
                isShortScreen && styles.actionButtonShort,
              ]}
            >
              <Text
                style={[styles.actionButtonText, isNarrowScreen && styles.actionButtonTextNarrow]}
              >
                I want to lend
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>

      <View style={styles.bottomNav}>
        {navItems.map((item) => (
          <BottomNavItem key={item.label} {...item} onPress={onContinue} />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#494B4D',
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollContentShort: {
    paddingBottom: 12,
  },
  scrollContentNarrow: {
    paddingBottom: 8,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: topInset + 8,
  },
  containerShort: {
    paddingTop: topInset + 4,
  },
  containerVeryShort: {
    paddingTop: topInset + 2,
  },
  containerNarrow: {
    paddingHorizontal: 12,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  topBarShort: {
    marginBottom: 12,
  },
  iconButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  brand: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
  },
  brandNarrow: {
    fontSize: 16,
  },
  hero: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 28,
    paddingRight: 24,
  },
  heroShort: {
    marginBottom: 18,
    paddingRight: 12,
  },
  heroText: {
    color: '#F4F4F5',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 42,
  },
  heroTextShort: {
    fontSize: 26,
    lineHeight: 36,
  },
  heroTextVeryShort: {
    fontSize: 24,
    lineHeight: 32,
  },
  heroTextNarrow: {
    fontSize: 22,
    lineHeight: 30,
  },
  inlineLockIcon: {
    marginLeft: 6,
  },
  dashboardRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  compactRow: {
    gap: 8,
    marginBottom: 20,
  },
  dashboardCard: {
    borderRadius: 16,
    flex: 1,
    minHeight: 124,
    paddingHorizontal: 14,
    paddingVertical: 16,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 5,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 6,
  },
  cardDivider: {
    backgroundColor: 'rgba(255,255,255,0.28)',
    height: 1,
    marginTop: 14,
  },
  cardFooter: {
    alignItems: 'flex-start',
    flex: 1,
    marginTop: 14,
  },
  metricRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginLeft: 4,
  },
  chartIcon: {
    marginLeft: 8,
  },
  metricDetail: {
    color: '#F8FAFC',
    fontSize: 14,
    marginLeft: 24,
    marginTop: 2,
    opacity: 0.95,
  },
  sectionTitle: {
    color: '#F4F4F5',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 16,
  },
  sectionTitleShort: {
    fontSize: 20,
    marginBottom: 12,
  },
  opportunityRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  opportunityCard: {
    borderRadius: 16,
    flex: 1,
    minHeight: 74,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  opportunityTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  opportunitySubtitle: {
    color: '#FFF7ED',
    fontSize: 13,
    opacity: 0.95,
  },
  actions: {
    gap: 18,
  },
  actionsShort: {
    gap: 12,
  },
  actionButton: {
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 17,
  },
  actionButtonShort: {
    paddingVertical: 14,
  },
  borrowButton: {
    backgroundColor: '#28C55F',
  },
  lendButton: {
    backgroundColor: '#3D842F',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  actionButtonTextNarrow: {
    fontSize: 16,
  },
  bottomNav: {
    backgroundColor: '#494B4D',
    borderTopColor: 'rgba(255,255,255,0.14)',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: bottomInset,
    paddingHorizontal: 8,
    paddingTop: 14,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
    gap: 6,
    justifyContent: 'center',
  },
  navLabel: {
    color: '#F8FAFC',
    fontSize: 10,
  },
});
