import { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const topInset = Platform.OS === 'android' ? NativeStatusBar.currentHeight ?? 0 : 0;
const bottomInset = Platform.OS === 'android' ? 34 : 10;

const notifications = [
  {
    id: '1',
    title: 'Loan request received',
    body: 'Your BWP 2,000 request has been submitted successfully.',
    section: 'Today',
    status: 'unread',
    time: '08:12',
  },
  {
    id: '2',
    title: 'New lender matched',
    body: 'A lender is reviewing your application details.',
    section: 'Today',
    status: 'read',
    time: '10:45',
  },
  {
    id: '3',
    title: 'Profile verification reminder',
    body: 'Complete your KYC documents to speed up approvals.',
    section: 'Today',
    status: 'unread',
    time: '12:30',
  },
  {
    id: '4',
    title: 'Repayment due soon',
    body: 'Your next repayment is due in 2 days.',
    section: 'Yesterday',
    status: 'read',
    time: '17:20',
  },
  {
    id: '5',
    title: 'Wallet updated',
    body: 'Your wallet balance changed after a recent transaction.',
    section: 'Yesterday',
    status: 'read',
    time: '14:05',
  },
  {
    id: '6',
    title: 'Support replied',
    body: 'A support agent responded to your recent question.',
    section: 'Earlier',
    status: 'unread',
    time: '09 Apr, 09:10',
  },
  {
    id: '7',
    title: 'Terms updated',
    body: 'We updated our lending terms and policies.',
    section: 'Earlier',
    status: 'read',
    time: '05 Apr, 16:44',
  },
];

const tabs = ['all', 'read', 'unread'];

function TabButton({ active, label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.tabButton}
    >
      <Text style={[styles.tabText, active && styles.activeTabText]}>{label}</Text>
      <View style={[styles.tabUnderline, active && styles.activeTabUnderline]} />
    </Pressable>
  );
}

function NotificationCard({ item }) {
  return (
    <View style={[styles.card, item.status === 'unread' && styles.unreadCard]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <View style={[styles.statusDot, item.status === 'read' && styles.readDot]} />
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>
        <Text style={styles.cardTime}>{item.time}</Text>
      </View>
      <Text style={styles.cardBody}>{item.body}</Text>
    </View>
  );
}

export default function NotificationsScreen({ onBack }) {
  const [activeTab, setActiveTab] = useState('all');

  const groupedNotifications = useMemo(() => {
    const filtered = notifications.filter((item) => {
      if (activeTab === 'all') {
        return true;
      }

      return item.status === activeTab;
    });

    const sections = ['Today', 'Yesterday', 'Earlier'];
    return sections
      .map((section) => ({
        section,
        items: filtered.filter((item) => item.section === section),
      }))
      .filter((group) => group.items.length > 0);
  }, [activeTab]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable hitSlop={10} onPress={onBack} style={styles.iconButton}>
            <Ionicons color="#F8FAFC" name="arrow-back-outline" size={26} />
          </Pressable>

          <Text style={styles.headerTitle}>Notifications</Text>

          <View style={styles.iconButton} />
        </View>

        <View style={styles.tabsRow}>
          {tabs.map((tab) => (
            <TabButton
              key={tab}
              active={activeTab === tab}
              label={tab.charAt(0).toUpperCase() + tab.slice(1)}
              onPress={() => setActiveTab(tab)}
            />
          ))}
        </View>

        <ScrollView
          bounces={false}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {groupedNotifications.map((group) => (
            <View key={group.section} style={styles.section}>
              <Text style={styles.sectionTitle}>{group.section}</Text>
              {group.items.map((item) => (
                <NotificationCard key={item.id} item={item} />
              ))}
            </View>
          ))}
        </ScrollView>
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
    paddingBottom: bottomInset + 10,
    paddingHorizontal: 16,
    paddingTop: topInset + 8,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
  },
  tabsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
    paddingBottom: 10,
  },
  tabText: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tabUnderline: {
    backgroundColor: 'transparent',
    borderRadius: 999,
    height: 3,
    marginTop: 8,
    width: 64,
  },
  activeTabUnderline: {
    backgroundColor: '#28C55F',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#252A2F',
    borderRadius: 16,
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  unreadCard: {
    borderColor: 'rgba(40,197,95,0.28)',
    borderWidth: 1,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTitleRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginRight: 10,
  },
  statusDot: {
    backgroundColor: '#28C55F',
    borderRadius: 99,
    height: 8,
    marginRight: 10,
    width: 8,
  },
  readDot: {
    backgroundColor: '#6B7280',
  },
  cardTitle: {
    color: '#F8FAFC',
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
  cardTime: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  cardBody: {
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 20,
  },
});
