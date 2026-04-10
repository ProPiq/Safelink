import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function BorrowerPortal({ user, onLogout }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.badge}>Borrower Portal</Text>
        <Text style={styles.title}>Welcome, {user.name}</Text>
        <Text style={styles.subtitle}>
          This is the borrower dashboard where loan requests, repayments, and
          application progress can live.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Borrower actions</Text>
          <Text style={styles.cardText}>Submit a new loan application</Text>
          <Text style={styles.cardText}>Track approval progress</Text>
          <Text style={styles.cardText}>View repayment schedule</Text>
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
    backgroundColor: '#eff6ff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#dbeafe',
    borderRadius: 999,
    color: '#1d4ed8',
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
    backgroundColor: '#1d4ed8',
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
