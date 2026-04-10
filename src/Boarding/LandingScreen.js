import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
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
          </View>
          <Text style={styles.metricDetail}>{detail}</Text>
        </View>
        <MaterialCommunityIcons color={accent} name={chart} size={26} />
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
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable hitSlop={10} onPress={onContinue} style={styles.iconButton}>
            <Ionicons color="#F8FAFC" name="menu" size={28} />
          </Pressable>

          <Text style={styles.brand}>SAFELINK</Text>

          <Pressable hitSlop={10} onPress={onContinue} style={styles.iconButton}>
            <Ionicons color="#F8FAFC" name="person-circle-outline" size={27} />
          </Pressable>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroText}>Connecting lenders & borrowers, securely.</Text>
          <Ionicons color="#D59645" name="lock-closed" size={30} style={styles.lockIcon} />
        </View>

        <View style={styles.dashboardRow}>
          {stats.map((item) => (
            <DashboardCard key={item.title} {...item} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Opportunities</Text>

        <View style={styles.opportunityRow}>
          {opportunities.map((item) => (
            <OpportunityCard key={item.title} {...item} />
          ))}
        </View>

        <View style={styles.actions}>
          <Pressable onPress={onContinue} style={[styles.actionButton, styles.borrowButton]}>
            <Text style={styles.actionButtonText}>I want to borrow</Text>
          </Pressable>

          <Pressable onPress={onContinue} style={[styles.actionButton, styles.lendButton]}>
            <Text style={styles.actionButtonText}>I want to lend</Text>
          </Pressable>
        </View>
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
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: topInset + 8,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontSize: 18,
    fontWeight: '800',
  },
  hero: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 28,
    paddingRight: 24,
  },
  heroText: {
    color: '#F4F4F5',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 42,
  },
  lockIcon: {
    marginLeft: 4,
    marginTop: 16,
  },
  dashboardRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
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
    alignItems: 'flex-end',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  actionButton: {
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 17,
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
