import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function LenderPortal({ user, onLogout }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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

        <Pressable onPress={onLogout} style={styles.button}>
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#dcfce7',
    borderRadius: 999,
    color: '#15803d',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  title: {
    color: '#0f172a',
    fontSize: 30,
    fontWeight: '700',
  },
  subtitle: {
    color: '#334155',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
  },
  cardTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  cardText: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 24,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#15803d',
    borderRadius: 14,
    marginTop: 20,
    paddingVertical: 15,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
