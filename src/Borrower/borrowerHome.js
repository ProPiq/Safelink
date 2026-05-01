import { useMemo, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import {
  Platform,
  PanResponder,
  Pressable,
  SafeAreaView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const topInset = Platform.OS === 'android' ? NativeStatusBar.currentHeight ?? 0 : 0;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatCurrency(value) {
  return `P ${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function SliderRow({
  label,
  leftLabel,
  max,
  min,
  onChange,
  rightLabel,
  value,
  valueFormatter,
}) {
  const sliderTrackRef = useRef(null);
  const trackRef = useRef({ pageX: 0, width: 0 });
  const progress = max === min ? 0 : (value - min) / (max - min);

  function measureTrack() {
    sliderTrackRef.current?.measureInWindow((pageX, pageY, width) => {
      trackRef.current = { pageX, width };
    });
  }

  function updateValue(pageX) {
    const { pageX: trackPageX, width } = trackRef.current;

    if (!width) {
      return;
    }

    const locationX = pageX - trackPageX;
    const ratio = clamp(locationX / width, 0, 1);
    onChange(clamp(min + ratio * (max - min), min, max));
  }

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (event) => {
        measureTrack();
        updateValue(event.nativeEvent.pageX);
      },
      onPanResponderMove: (event) => updateValue(event.nativeEvent.pageX),
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
    }),
  ).current;

  return (
    <View style={styles.sliderBlock}>
      <View style={styles.sliderHeader}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <Text style={styles.sliderValue}>{valueFormatter(value)}</Text>
      </View>

      <View
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          trackRef.current = { ...trackRef.current, width };
          measureTrack();
        }}
        style={styles.sliderGestureArea}
        {...panResponder.panHandlers}
      >
        <View ref={sliderTrackRef} style={styles.sliderTrack}>
          <View style={[styles.sliderFill, { width: `${progress * 100}%` }]} />
          <View style={[styles.sliderThumb, { left: `${progress * 100}%` }]} />
        </View>
      </View>

      <View style={styles.sliderFooter}>
        <Text style={styles.sliderFootText}>{leftLabel}</Text>
        <Text style={styles.sliderFootText}>{rightLabel}</Text>
      </View>
    </View>
  );
}

function DropdownRow({ label, onSelect, options, selectedValue }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === selectedValue) ?? options[0];

  function handleSelect(value) {
    onSelect(value);
    setIsOpen(false);
  }

  return (
    <View style={styles.dropdownBlock}>
      <Text style={styles.sliderLabel}>{label}</Text>

      <View style={styles.dropdownAnchor}>
        <Pressable
          onPress={() => setIsOpen((current) => !current)}
          style={({ pressed }) => [styles.dropdownTrigger, pressed && styles.buttonPressed]}
        >
          <Text style={styles.dropdownValue}>{selectedOption.label}</Text>
          <Ionicons
            color="#F8FAFC"
            name={isOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={18}
          />
        </Pressable>

        {isOpen ? (
          <View style={styles.dropdownMenu}>
            {options.map((option) => {
              const isSelected = option.value === selectedValue;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => handleSelect(option.value)}
                  style={[styles.dropdownOption, isSelected && styles.dropdownOptionSelected]}
                >
                  <Text
                    style={[
                      styles.dropdownOptionText,
                      isSelected && styles.dropdownOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </View>
    </View>
  );
}

function ActivityChart({ compact }) {
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIndex = new Date().getMonth();
  const chartData = monthLabels.slice(0, currentMonthIndex + 1).map((label, index) => ({
    label,
    amount: 900 + ((index * 347) % 1700) + (index % 2 === 0 ? 180 : 40),
  }));

  const maxAmount = Math.max(...chartData.map((item) => item.amount));
  const minAmount = Math.min(...chartData.map((item) => item.amount));
  const spread = Math.max(maxAmount - minAmount, 1);

  const yAxisValues = Array.from({ length: 4 }, (_, index) => {
    const ratio = (3 - index) / 3;
    const value = minAmount + spread * ratio;
    return Math.round(value / 100) * 100;
  });

  return (
    <View style={styles.chartCard}>
      <View style={styles.chartFrame}>
        <View style={styles.yAxis}>
          {yAxisValues.map((value) => (
            <Text key={value} style={styles.yAxisLabel}>
              {value}
            </Text>
          ))}
        </View>

        <View style={styles.chartContent}>
          <View style={styles.chartArea}>
            <View style={styles.chartGridLine} />
            <View style={[styles.chartGridLine, styles.chartGridMid]} />
            <View style={[styles.chartGridLine, styles.chartGridLow]} />
            <View style={styles.barRow}>
              {chartData.map((point) => {
                const barRange = compact ? 52 : 72;
                const barHeight = 12 + ((point.amount - minAmount) / spread) * barRange;

                return (
                  <View key={point.label} style={styles.barColumn}>
                    <View style={[styles.chartBar, { height: barHeight }]} />
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.monthRow}>
            {chartData.map((point) => (
              <View key={point.label} style={styles.monthItem}>
                <Text style={styles.monthLabel}>{point.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

export default function BorrowerHome({
  onOpenMenu,
  onOpenNotifications,
  onSubmitRequest,
}) {
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isShortScreen = height <= 760;
  const isVeryShortScreen = height <= 700;
  const isNarrowScreen = width <= 360;
  const isWideScreen = width >= 768;
  const useCompactChart = isShortScreen || isNarrowScreen;
  const bottomInset = Platform.OS === 'android' ? insets.bottom : 0;
  const bottomNavClearance =
    (Platform.OS === 'ios' ? (isVeryShortScreen ? 64 : 72) : isVeryShortScreen ? 78 : 86) +
    bottomInset;
  const currentMonthLabel = new Date().toLocaleString('en-US', { month: 'short' });
  const currentYear = new Date().getFullYear();
  const termOptions = [
    { label: '1 Week', value: 1 },
    { label: '2 Weeks', value: 2 },
    { label: '3 Weeks', value: 3 },
    { label: '4 Weeks', value: 4 },
  ];
  const [amountText, setAmountText] = useState('2000');
  const [termWeeks, setTermWeeks] = useState(2);
  const [ratePercent, setRatePercent] = useState(10);

  const amount = Number(amountText) || 0;
  const roundedTermWeeks = useMemo(() => Math.round(termWeeks * 10) / 10, [termWeeks]);
  const roundedRatePercent = useMemo(() => Math.round(ratePercent * 10) / 10, [ratePercent]);
  const interest = (amount * roundedRatePercent) / 100;
  const totalRepayment = amount + interest;

  function handleAmountChange(text) {
    const digitsOnly = text.replace(/[^0-9.]/g, '');
    const parts = digitsOnly.split('.');
    const normalized =
      parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : digitsOnly;
    setAmountText(normalized);
  }

  function handleSubmit() {
    onSubmitRequest?.({
      amount,
      interest,
      ratePercent: roundedRatePercent,
      termWeeks: roundedTermWeeks,
      totalRepayment,
    });
  }

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

          <Text style={[styles.brand, isNarrowScreen && styles.brandNarrow]}>
            Hello, Borrower
          </Text>

          <Pressable hitSlop={10} onPress={onOpenNotifications} style={styles.iconButton}>
            <Ionicons
              color="#F8FAFC"
              name="notifications-outline"
              size={isNarrowScreen ? 24 : 27}
            />
          </Pressable>
        </View>

        <View
          style={[
            styles.content,
            isShortScreen && styles.contentShort,
            isVeryShortScreen && styles.contentVeryShort,
            { paddingBottom: bottomNavClearance },
          ]}
        >
          <View style={[styles.contentInner, isWideScreen && styles.contentInnerWide]}>
            <View style={[styles.heroRow, isShortScreen && styles.heroRowShort]}>
              <Text
                style={[
                  styles.heroTitle,
                  isShortScreen && styles.heroTitleShort,
                  isNarrowScreen && styles.heroTitleNarrow,
                ]}
              >
                O shorta ka bokae?
              </Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionLabel}>Amount</Text>
              <View style={styles.amountCard}>
                <Text style={styles.amountPrefix}>BWP</Text>
                <TextInput
                  keyboardType="decimal-pad"
                  onChangeText={handleAmountChange}
                  placeholder="0.00"
                  placeholderTextColor="rgba(248,250,252,0.5)"
                  style={styles.amountInput}
                  value={amountText}
                />
              </View>

              <DropdownRow
                label="Term"
                onSelect={setTermWeeks}
                options={termOptions}
                selectedValue={Math.round(termWeeks)}
              />

              <SliderRow
                label="Rate"
                leftLabel="0%"
                max={25}
                min={0}
                onChange={setRatePercent}
                rightLabel="25%"
                value={ratePercent}
                valueFormatter={(currentValue) => `${Math.round(currentValue)}%`}
              />

              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Interest</Text>
                  <Text numberOfLines={1} adjustsFontSizeToFit style={styles.summaryValue}>
                    {formatCurrency(interest)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, styles.summaryLabelLast]}>Total Repayment</Text>
                  <Text numberOfLines={1} adjustsFontSizeToFit style={styles.summaryValue}>
                    {formatCurrency(totalRepayment)}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={handleSubmit}
                style={({ pressed }) => [styles.submitButton, pressed && styles.buttonPressed]}
              >
                <Text style={styles.submitButtonText}>Submit Request</Text>
              </Pressable>
            </View>

            <View style={[styles.chartSection, Platform.OS === 'android' && styles.chartSectionAndroid]}>
              <Text style={styles.activityTitle}>
                Activity{' '}
                <Text style={styles.activityRange}>
                  | Jan {currentYear} - {currentMonthLabel} {currentYear}
                </Text>
              </Text>
              <ActivityChart compact={useCompactChart} />
            </View>
          </View>
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
    marginBottom: 16,
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
  content: {
    flex: 1,
  },
  contentInner: {
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'space-between',
    width: '100%',
  },
  contentInnerWide: {
    alignSelf: 'center',
    maxWidth: 620,
  },
  contentShort: {
    gap: 8,
  },
  contentVeryShort: {
    gap: 6,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  heroRowShort: {
    marginBottom: 8,
  },
  heroTitle: {
    color: '#F4F4F5',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0,
  },
  heroTitleShort: {
    fontSize: 24,
  },
  heroTitleNarrow: {
    fontSize: 22,
  },
  formSection: {
    gap: 8,
    zIndex: 2,
  },
  sectionLabel: {
    color: '#E5E7EB',
    fontSize: 14,
    marginBottom: 2,
  },
  amountCard: {
    alignItems: 'center',
    backgroundColor: '#252A2F',
    borderRadius: 10,
    flexDirection: 'row',
    minHeight: 52,
    paddingHorizontal: 16,
  },
  amountPrefix: {
    color: '#F8FAFC',
    fontSize: 18,
    marginRight: 8,
  },
  amountInput: {
    color: '#F8FAFC',
    flex: 1,
    fontSize: 24,
    minWidth: 0,
    paddingVertical: 6,
  },
  sliderBlock: {
    marginTop: 6,
  },
  dropdownBlock: {
    marginTop: 6,
    zIndex: 40,
  },
  dropdownAnchor: {
    position: 'relative',
    zIndex: 40,
  },
  sliderHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sliderLabel: {
    color: '#E5E7EB',
    fontSize: 14,
  },
  sliderValue: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  dropdownTrigger: {
    alignItems: 'center',
    backgroundColor: '#252A2F',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  dropdownValue: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '600',
  },
  dropdownMenu: {
    backgroundColor: '#252A2F',
    borderRadius: 10,
    elevation: 8,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: 52,
    zIndex: 30,
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownOptionSelected: {
    backgroundColor: 'rgba(40,197,95,0.16)',
  },
  dropdownOptionText: {
    color: '#E5E7EB',
    fontSize: 15,
  },
  dropdownOptionTextSelected: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
  sliderGestureArea: {
    justifyContent: 'center',
    paddingVertical: 7,
  },
  sliderTrack: {
    backgroundColor: '#8B8D8F',
    borderRadius: 999,
    height: 6,
    position: 'relative',
  },
  sliderFill: {
    backgroundColor: '#28C55F',
    borderRadius: 999,
    height: 6,
  },
  sliderThumb: {
    backgroundColor: '#F8FAFC',
    borderColor: '#D1D5DB',
    borderRadius: 999,
    borderWidth: 1,
    height: 18,
    marginLeft: -9,
    position: 'absolute',
    top: -6,
    width: 18,
  },
  sliderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sliderFootText: {
    color: '#E5E7EB',
    fontSize: 12,
  },
  summaryCard: {
    backgroundColor: '#252A2F',
    borderRadius: 12,
    marginTop: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  summaryRow: {
    alignItems: 'center',
    gap: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: '#E5E7EB',
    flexShrink: 1,
    fontSize: 14,
    marginBottom: 12,
  },
  summaryLabelLast: {
    marginBottom: 0,
  },
  summaryValue: {
    color: '#F8FAFC',
    flexShrink: 1,
    fontSize: 16,
    fontWeight: '600',
    minWidth: 96,
    textAlign: 'right',
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#28C55F',
    borderRadius: 12,
    marginTop: 6,
    paddingVertical: 13,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  buttonPressed: {
    opacity: 0.92,
  },
  chartSection: {
    marginTop: 12,
    zIndex: 1,
  },
  chartSectionAndroid: {
    marginTop: 6,
  },
  activityTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  activityRange: {
    color: '#E5E7EB',
    fontWeight: '400',
  },
  chartCard: {
    backgroundColor: '#252A2F',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  chartFrame: {
    flexDirection: 'row',
  },
  yAxis: {
    justifyContent: 'space-between',
    paddingBottom: 22,
    paddingRight: 8,
    paddingTop: 2,
    width: 38,
  },
  yAxisLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    textAlign: 'right',
  },
  chartContent: {
    flex: 1,
  },
  chartArea: {
    borderLeftColor: 'rgba(255,255,255,0.14)',
    borderLeftWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.14)',
    borderBottomWidth: 1,
    height: 92,
    marginBottom: 8,
    position: 'relative',
  },
  chartGridLine: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    height: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: '6%',
  },
  chartGridMid: {
    top: '45%',
  },
  chartGridLow: {
    top: '84%',
  },
  barRow: {
    alignItems: 'flex-end',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 6,
    paddingHorizontal: 8,
    paddingTop: 6,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  chartBar: {
    backgroundColor: '#28C55F',
    borderRadius: 6,
    maxWidth: 18,
    minHeight: 12,
    width: '58%',
  },
  monthRow: {
    flexDirection: 'row',
    paddingLeft: 8,
  },
  monthItem: {
    alignItems: 'center',
    flex: 1,
  },
  monthLabel: {
    color: '#E5E7EB',
    fontSize: 10,
  },
});
