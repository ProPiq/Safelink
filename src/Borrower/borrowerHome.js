import { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
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

const topInset = Platform.OS === 'android' ? NativeStatusBar.currentHeight ?? 0 : 0;
const bottomInset = Platform.OS === 'android' ? 34 : 10;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatCurrency(value) {
  return `P ${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function BottomTab({ icon, label, active, type = 'ionicon' }) {
  const color = active ? '#28C55F' : '#F8FAFC';

  return (
    <Pressable style={styles.navItem}>
      {type === 'material' ? (
        <MaterialCommunityIcons color={color} name={icon} size={24} />
      ) : (
        <Ionicons color={color} name={icon} size={24} />
      )}
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </Pressable>
  );
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
  const [trackWidth, setTrackWidth] = useState(0);
  const progress = max === min ? 0 : (value - min) / (max - min);

  function updateValue(locationX) {
    if (!trackWidth) {
      return;
    }

    const ratio = clamp(locationX / trackWidth, 0, 1);
    onChange(clamp(min + ratio * (max - min), min, max));
  }

  return (
    <View style={styles.sliderBlock}>
      <View style={styles.sliderHeader}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <Text style={styles.sliderValue}>{valueFormatter(value)}</Text>
      </View>

      <View
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
        onResponderGrant={(event) => updateValue(event.nativeEvent.locationX)}
        onResponderMove={(event) => updateValue(event.nativeEvent.locationX)}
        onStartShouldSetResponder={() => true}
        style={styles.sliderTrack}
      >
        <View style={[styles.sliderFill, { width: `${progress * 100}%` }]} />
        <View style={[styles.sliderThumb, { left: `${progress * 100}%` }]} />
      </View>

      <View style={styles.sliderFooter}>
        <Text style={styles.sliderFootText}>{leftLabel}</Text>
        <Text style={styles.sliderFootText}>{rightLabel}</Text>
      </View>
    </View>
  );
}

function ActivityChart() {
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIndex = new Date().getMonth();
  const chartData = monthLabels.slice(0, currentMonthIndex + 1).map((label, index) => ({
    label,
    amount: 900 + ((index * 347) % 1700) + (index % 2 === 0 ? 180 : 40),
  }));

  const chartWidth = chartSize.width || 1;
  const chartHeight = chartSize.height || 1;
  const horizontalPadding = 12;
  const usableWidth = Math.max(chartWidth - horizontalPadding * 2, 1);
  const usableHeight = Math.max(chartHeight - 12, 1);
  const maxAmount = Math.max(...chartData.map((item) => item.amount));
  const minAmount = Math.min(...chartData.map((item) => item.amount));
  const spread = Math.max(maxAmount - minAmount, 1);

  const points = chartData.map((item, index) => {
    const x =
      horizontalPadding +
      (chartData.length === 1 ? 0 : (index / (chartData.length - 1)) * usableWidth);
    const y = usableHeight - ((item.amount - minAmount) / spread) * usableHeight + 6;
    return { ...item, x, y };
  });

  const segments = points.slice(0, -1).map((point, index) => {
    const nextPoint = points[index + 1];
    const deltaX = nextPoint.x - point.x;
    const deltaY = nextPoint.y - point.y;
    const length = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    return {
      key: `${point.label}-${nextPoint.label}`,
      left: point.x,
      top: point.y,
      width: length,
      rotate: `${angle}deg`,
    };
  });

  return (
    <View style={styles.chartCard}>
      <View
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setChartSize({ width, height });
        }}
        style={styles.chartArea}
      >
        <View style={styles.chartGridLine} />
        <View style={[styles.chartGridLine, styles.chartGridMid]} />
        <View style={[styles.chartGridLine, styles.chartGridLow]} />

        {segments.map((segment) => (
          <View
            key={segment.key}
            style={[
              styles.chartSegment,
              {
                left: segment.left,
                top: segment.top,
                width: segment.width,
                transform: [{ rotate: segment.rotate }],
              },
            ]}
          />
        ))}

        {points.map((point) => (
          <View
            key={point.label}
            style={[
              styles.chartPoint,
              {
                left: point.x,
                top: point.y,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.monthRow}>
        {chartData.map((point) => (
          <Text key={point.label} style={styles.monthLabel}>
            {point.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

export default function BorrowerHome({ onSubmitRequest }) {
  const { height, width } = useWindowDimensions();
  const isShortScreen = height <= 760;
  const isVeryShortScreen = height <= 700;
  const isNarrowScreen = width <= 360;
  const currentMonthLabel = new Date().toLocaleString('en-US', { month: 'short' });
  const currentYear = new Date().getFullYear();
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
          <Pressable hitSlop={10} style={styles.iconButton}>
            <Ionicons color="#F8FAFC" name="menu" size={isNarrowScreen ? 24 : 28} />
          </Pressable>

          <Text style={[styles.brand, isNarrowScreen && styles.brandNarrow]}>
            Hello, Borrower
          </Text>

          <Pressable hitSlop={10} style={styles.iconButton}>
            <Ionicons
              color="#F8FAFC"
              name="notifications-outline"
              size={isNarrowScreen ? 24 : 27}
            />
          </Pressable>
        </View>

        <View style={styles.content}>
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

            <SliderRow
              label="Term"
              leftLabel="1 week"
              max={4}
              min={1}
              onChange={setTermWeeks}
              rightLabel="4 weeks"
              value={termWeeks}
              valueFormatter={(currentValue) => {
                const roundedValue = Math.round(currentValue * 10) / 10;
                return `${roundedValue.toFixed(1)} ${roundedValue === 1 ? 'Week' : 'Weeks'}`;
              }}
            />

            <SliderRow
              label="Rate"
              leftLabel="0%"
              max={25}
              min={0}
              onChange={setRatePercent}
              rightLabel="25%"
              value={ratePercent}
              valueFormatter={(currentValue) =>
                `${(Math.round(currentValue * 10) / 10).toFixed(1)}%`
              }
            />

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Interest</Text>
                <Text style={styles.summaryValue}>{formatCurrency(interest)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, styles.summaryLabelLast]}>Total Repayment</Text>
                <Text style={styles.summaryValue}>{formatCurrency(totalRepayment)}</Text>
              </View>
            </View>

            <Pressable
              onPress={handleSubmit}
              style={({ pressed }) => [styles.submitButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.submitButtonText}>Submit Request</Text>
            </Pressable>
          </View>

          <View style={styles.chartSection}>
            <Text style={styles.activityTitle}>
              Activity{' '}
              <Text style={styles.activityRange}>
                | Jan {currentYear} - {currentMonthLabel} {currentYear}
              </Text>
            </Text>
            <ActivityChart />
          </View>
        </View>
      </View>

      <View style={styles.bottomNav}>
        <BottomTab active icon="home-outline" label="Home" />
        <BottomTab icon="search-outline" label="Explore" />
        <BottomTab icon="handshake-outline" label="Loans" type="material" />
        <BottomTab icon="person-outline" label="Profile" />
        <BottomTab icon="wallet-outline" label="Wallet" type="material" />
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
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  heroRowShort: {
    marginBottom: 8,
  },
  heroTitle: {
    color: '#F4F4F5',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  heroTitleShort: {
    fontSize: 24,
  },
  heroTitleNarrow: {
    fontSize: 22,
  },
  formSection: {
    gap: 8,
  },
  sectionLabel: {
    color: '#E5E7EB',
    fontSize: 14,
    marginBottom: 2,
  },
  amountCard: {
    alignItems: 'center',
    backgroundColor: '#252A2F',
    borderRadius: 12,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  amountPrefix: {
    color: '#F8FAFC',
    fontSize: 18,
    marginRight: 8,
  },
  amountInput: {
    color: '#F8FAFC',
    flex: 1,
    fontSize: 26,
    paddingVertical: 8,
  },
  sliderBlock: {
    marginTop: 6,
  },
  sliderHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    marginTop: 6,
  },
  sliderFootText: {
    color: '#E5E7EB',
    fontSize: 12,
  },
  summaryCard: {
    backgroundColor: '#252A2F',
    borderRadius: 14,
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: '#E5E7EB',
    fontSize: 14,
    marginBottom: 12,
  },
  summaryLabelLast: {
    marginBottom: 0,
  },
  summaryValue: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#28C55F',
    borderRadius: 14,
    marginTop: 8,
    paddingVertical: 15,
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
    marginTop: 10,
  },
  activityTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  activityRange: {
    color: '#E5E7EB',
    fontWeight: '400',
  },
  chartCard: {
    backgroundColor: '#252A2F',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 14,
  },
  chartArea: {
    height: 96,
    marginBottom: 10,
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
  chartSegment: {
    backgroundColor: '#28C55F',
    borderRadius: 999,
    height: 2,
    position: 'absolute',
  },
  chartPoint: {
    backgroundColor: '#28C55F',
    borderRadius: 999,
    height: 8,
    marginLeft: -4,
    marginTop: -4,
    position: 'absolute',
    width: 8,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthLabel: {
    color: '#E5E7EB',
    fontSize: 12,
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
  navLabelActive: {
    color: '#28C55F',
    fontWeight: '700',
  },
});
