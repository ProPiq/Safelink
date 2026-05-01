import { Ionicons } from '@expo/vector-icons';
import {
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const topInset = Platform.OS === 'android' ? NativeStatusBar.currentHeight ?? 0 : 0;

export default function LenderPortal({ onOpenMenu, onOpenNotifications, user }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable hitSlop={10} onPress={onOpenMenu} style={styles.iconButton}>
            <Ionicons color="#F8FAFC" name="menu" size={28} />
          </Pressable>

          <Text style={styles.headerTitle}>Lender Dashboard</Text>

          <Pressable hitSlop={10} onPress={onOpenNotifications} style={styles.iconButton}>
            <Ionicons color="#F8FAFC" name="notifications-outline" size={27} />
          </Pressable>
        </View>

        <Text style={styles.badge}>Lender Portal</Text>
        <Text style={styles.title}>Welcome, {user.name}</Text>
        <Text style={styles.subtitle}>
          This is the lender dashboard where funding decisions, portfolio
          insights, and borrower reviews can live.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Lender actions</Text>
          <Text style={styles.cardText}>Review borrower applications</Text>
          <Text style={styles.cardText}>Approve or decline requests</Text>
          <Text style={styles.cardText}>Monitor active loans</Text>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>18</Text>
            <Text style={styles.metricLabel}>Open requests</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>P 42k</Text>
            <Text style={styles.metricLabel}>Active loans</Text>
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
    padding: 24,
    paddingTop: topInset + 8,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 34,
  },
  iconButton: {
    alignItems: 'center',
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(40,197,95,0.16)',
    borderRadius: 999,
    color: '#86EFAC',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 30,
    fontWeight: '700',
  },
  subtitle: {
    color: '#D1D5DB',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#252A2F',
    borderRadius: 16,
    padding: 20,
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  cardText: {
    color: '#D1D5DB',
    fontSize: 15,
    lineHeight: 24,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 20,
  },
  metricCard: {
    backgroundColor: '#252A2F',
    borderRadius: 16,
    flex: 1,
    padding: 18,
  },
  metricValue: {
    color: '#28C55F',
    fontSize: 24,
    fontWeight: '800',
  },
  metricLabel: {
    color: '#D1D5DB',
    fontSize: 13,
    marginTop: 6,
  },
});
