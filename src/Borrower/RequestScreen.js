import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import {
  Modal,
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

function formatCurrency(value) {
  return `BWP ${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatRepaymentCurrency(value) {
  return `P ${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatTerm(value) {
  const rounded = Math.round(Number(value || 0));
  return `${rounded} ${rounded === 1 ? 'week' : 'weeks'}`;
}

function SummaryField({ value }) {
  return (
    <View style={styles.summaryField}>
      <Text style={styles.summaryFieldText}>{value}</Text>
    </View>
  );
}

export default function RequestScreen({
  onBack,
  onGoToExplore,
  onOpenNotifications,
  requestData,
}) {
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const amount = requestData?.amount ?? 0;
  const termWeeks = requestData?.termWeeks ?? 1;
  const ratePercent = requestData?.ratePercent ?? 0;
  const interest = requestData?.interest ?? 0;
  const totalRepayment = requestData?.totalRepayment ?? 0;

  const termLabel = formatTerm(termWeeks);
  const amountLabel = formatCurrency(amount);
  const interestLabel = `${Math.round(ratePercent)}%`;
  const repaymentLabel = formatRepaymentCurrency(totalRepayment);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable hitSlop={10} onPress={onBack} style={styles.iconButton}>
            <Ionicons color="#F8FAFC" name="arrow-back-outline" size={26} />
          </Pressable>

          <Text style={styles.headerTitle}>Post Request</Text>

          <Pressable hitSlop={10} onPress={onOpenNotifications} style={styles.iconButton}>
            <Ionicons color="#F8FAFC" name="notifications-outline" size={24} />
          </Pressable>
        </View>

        <ScrollView
          bounces={false}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <SummaryField value={amountLabel} />
          <SummaryField value={termLabel} />
          <SummaryField value={interestLabel} />

          <View style={styles.termsCard}>
            <Pressable
              onPress={() => setAcceptedTerms((current) => !current)}
              style={styles.termsHeader}
            >
              <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                {acceptedTerms ? (
                  <Ionicons color="#F8FAFC" name="checkmark" size={14} />
                ) : null}
              </View>
              <Text style={styles.termsTitle}>Terms & Conditions</Text>
            </Pressable>

            <Text style={styles.termsIntro}>
              By submitting this loan request, you confirm that the details below are correct and
              understood.
            </Text>

            <View style={styles.termsHighlight}>
              <View style={styles.highlightRow}>
                <Text style={styles.highlightLabel}>Requested Amount</Text>
                <Text style={styles.highlightValue}>{amountLabel}</Text>
              </View>
              <View style={styles.highlightRow}>
                <Text style={styles.highlightLabel}>Repayment Term</Text>
                <Text style={styles.highlightValue}>{termLabel}</Text>
              </View>
              <View style={styles.highlightRow}>
                <Text style={styles.highlightLabel}>Interest Rate</Text>
                <Text style={styles.highlightValue}>{interestLabel}</Text>
              </View>
              <View style={styles.highlightRow}>
                <Text style={styles.highlightLabel}>Interest Amount</Text>
                <Text style={styles.highlightValue}>{formatRepaymentCurrency(interest)}</Text>
              </View>
              <View style={[styles.highlightRow, styles.highlightRowLast]}>
                <Text style={styles.highlightLabel}>Total Payable</Text>
                <Text style={styles.highlightValue}>{repaymentLabel}</Text>
              </View>
            </View>

            <View style={styles.termList}>
              <Text style={styles.termItem}>
                • You have read and agreed to our Terms & Conditions and Privacy Policy.
              </Text>
              <Text style={styles.termItem}>
                • You understand the loan amount, interest rate, repayment schedule, and total
                amount payable shown above.
              </Text>
              <Text style={styles.termItem}>
                • This loan carries a {interestLabel} flat interest rate for the full loan
                period of {termLabel}.
              </Text>
              <Text style={styles.termItem}>
                • You agree to repay {repaymentLabel} on or before the end of the stated due
                period.
              </Text>
              <Text style={styles.termItem}>
                • You understand that late or missed payments may result in penalties, restricted
                access to future loans, and/or recovery action as permitted by law.
              </Text>
              <Text style={styles.termItem}>
                • You confirm that all information provided in this request is true and accurate.
              </Text>
            </View>
          </View>
        </ScrollView>

        <Pressable
          disabled={!acceptedTerms}
          onPress={() => setIsSuccessModalVisible(true)}
          style={({ pressed }) => [
            styles.submitButton,
            !acceptedTerms && styles.submitButtonDisabled,
            pressed && acceptedTerms && styles.buttonPressed,
          ]}
        >
          <Text style={styles.submitButtonText}>SUBMIT</Text>
        </Pressable>
      </View>

      <Modal
        animationType="fade"
        visible={isSuccessModalVisible}
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <Ionicons color="#F8FAFC" name="checkmark" size={30} />
            </View>

            <Text style={styles.modalTitle}>Your request has been posted successfully</Text>

            <Pressable
              onPress={() => {
                setIsSuccessModalVisible(false);
                onGoToExplore?.();
              }}
              style={({ pressed }) => [
                styles.modalButton,
                styles.modalPrimaryButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.modalPrimaryButtonText}>Go to Explore</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setIsSuccessModalVisible(false);
                onBack?.();
              }}
              style={({ pressed }) => [
                styles.modalButton,
                styles.modalSecondaryButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.modalSecondaryButtonText}>Back</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    paddingBottom: bottomInset + 12,
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
  scrollContent: {
    paddingBottom: 18,
  },
  summaryField: {
    backgroundColor: '#252A2F',
    borderRadius: 12,
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  summaryFieldText: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '600',
  },
  termsCard: {
    backgroundColor: '#3E4144',
    borderRadius: 18,
    marginTop: 18,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  termsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 14,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: '#D1D5DB',
    borderRadius: 6,
    borderWidth: 2,
    height: 22,
    justifyContent: 'center',
    marginRight: 12,
    width: 22,
  },
  checkboxChecked: {
    backgroundColor: '#28C55F',
    borderColor: '#28C55F',
  },
  termsTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  termsIntro: {
    color: '#E5E7EB',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },
  termsHighlight: {
    backgroundColor: '#2D3136',
    borderRadius: 14,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  highlightRow: {
    borderBottomColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  highlightRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  highlightLabel: {
    color: '#D1D5DB',
    fontSize: 13,
  },
  highlightValue: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  termList: {
    gap: 10,
  },
  termItem: {
    color: '#F3F4F6',
    fontSize: 14,
    lineHeight: 21,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#28C55F',
    borderRadius: 14,
    marginTop: 12,
    paddingVertical: 15,
  },
  submitButtonDisabled: {
    backgroundColor: '#5F666C',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  buttonPressed: {
    opacity: 0.92,
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.48)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#2D3136',
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingVertical: 28,
    width: '100%',
  },
  modalIconWrap: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#28C55F',
    borderRadius: 999,
    height: 68,
    justifyContent: 'center',
    marginBottom: 18,
    width: 68,
  },
  modalTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    marginBottom: 22,
    textAlign: 'center',
  },
  modalButton: {
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 14,
  },
  modalPrimaryButton: {
    backgroundColor: '#28C55F',
    marginBottom: 10,
  },
  modalSecondaryButton: {
    backgroundColor: '#3E444A',
  },
  modalPrimaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalSecondaryButtonText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
});
