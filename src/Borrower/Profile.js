import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const topInset = Platform.OS === 'android' ? NativeStatusBar.currentHeight ?? 0 : 0;
const fadeSteps = Array.from({ length: 22 }, (_, index) => {
  const progress = index / 21;
  return Number((0.48 * (1 - progress) ** 1.7).toFixed(3));
});

const profileStats = [
  { label: 'Borrowed', value: '13K' },
  { label: 'Posts', value: '5' },
  { label: 'Lenders', value: '16' },
];

const personalDetails = [
  { label: 'UserName', value: 'Katt' },
  { label: 'Full Name', value: 'Katlego Mogolodi' },
  { label: 'Date of Birth', value: '12 Jan, 2000' },
  { label: 'Gender', value: 'Male' },
  { label: 'Source of Funds', value: 'Salary' },
  { label: 'Place of Residence', value: 'Phakalane' },
  { label: 'Next of Kin', value: 'Name Here' },
  { label: 'Relation', value: 'Sister' },
];

const accountDetails = [
  { label: 'Phone', value: '71 234 567' },
  { label: 'Email', value: 'kmog@demo.co.bw' },
  { label: 'Status', value: 'Verified' },
  { label: 'Password', value: '*************' },
];

const identificationDetails = [
  { label: 'ID Type', value: 'Omang' },
  { label: 'ID Number', value: '123456789' },
  { label: 'Expiry Date', value: '18 Aug, 2030' },
  { label: 'Verification', value: 'Approved' },
];

const bankDetails = [
  { label: 'Bank', value: 'FNB Botswana' },
  { label: 'Account Type', value: 'Savings' },
  { label: 'Branch', value: 'Main Mall' },
  { label: 'Account Number', value: '**** 4567' },
];

function ProfileSection({ defaultExpanded = false, items, onSave, title }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isEditing, setIsEditing] = useState(false);
  const [draftItems, setDraftItems] = useState(items);

  function handleEdit() {
    setDraftItems(items);
    setIsExpanded(true);
    setIsEditing(true);
  }

  function handleCancel() {
    setDraftItems(items);
    setIsEditing(false);
  }

  function handleSave() {
    onSave(draftItems);
    setIsEditing(false);
  }

  function updateDraft(label, value) {
    setDraftItems((currentItems) =>
      currentItems.map((item) => (item.label === label ? { ...item, value } : item)),
    );
  }

  const visibleItems = isEditing ? draftItems : items;

  return (
    <View style={[styles.detailCard, !isExpanded && styles.detailCardCollapsed]}>
      <View style={styles.sectionHeader}>
        <Pressable
          hitSlop={8}
          onPress={() => setIsExpanded((current) => !current)}
          style={({ pressed }) => [styles.sectionTitleButton, pressed && styles.buttonPressed]}
        >
          <View style={styles.sectionTitleWrap}>
            <View style={styles.sectionAccent} />
            <Text style={styles.cardTitle}>{title}</Text>
          </View>
        </Pressable>

        <View style={styles.sectionActions}>
          {isExpanded ? (
            isEditing ? (
              <>
                <Pressable
                  hitSlop={8}
                  onPress={handleCancel}
                  style={({ pressed }) => [styles.textAction, pressed && styles.buttonPressed]}
                >
                  <Text style={styles.textActionLabel}>Cancel</Text>
                </Pressable>
                <Pressable
                  hitSlop={8}
                  onPress={handleSave}
                  style={({ pressed }) => [styles.saveButton, pressed && styles.buttonPressed]}
                >
                  <Ionicons color="#20262A" name="checkmark" size={17} />
                </Pressable>
              </>
            ) : (
              <Pressable
                hitSlop={8}
                onPress={handleEdit}
                style={({ pressed }) => [styles.editButton, pressed && styles.buttonPressed]}
              >
                <Ionicons color="#28C55F" name="pencil" size={16} />
              </Pressable>
            )
          ) : null}
          <Pressable
            hitSlop={8}
            onPress={() => setIsExpanded((current) => !current)}
            style={({ pressed }) => [styles.chevronButton, pressed && styles.buttonPressed]}
          >
            <Ionicons
              color="#F8FAFC"
              name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
              size={22}
            />
          </Pressable>
        </View>
      </View>

      {isExpanded ? (
        <View style={styles.detailGrid}>
          {visibleItems.map((item) => (
            <View key={`${item.label}-${item.value}`} style={styles.detailItem}>
              <Text style={styles.detailLabel}>{item.label}</Text>
              {isEditing ? (
                <TextInput
                  onChangeText={(value) => updateDraft(item.label, value)}
                  placeholder={item.label}
                  placeholderTextColor="rgba(248,250,252,0.34)"
                  secureTextEntry={item.label === 'Password'}
                  style={styles.detailInput}
                  value={item.value}
                />
              ) : (
                <Text
                  adjustsFontSizeToFit
                  minimumFontScale={0.82}
                  numberOfLines={1}
                  style={styles.detailValue}
                >
                  {item.value}
                </Text>
              )}
            </View>
          ))}
        </View>
      ) : null}
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

export default function Profile({ onOpenMenu, onOpenNotifications }) {
  const [personalInfo, setPersonalInfo] = useState(personalDetails);
  const [accountInfo, setAccountInfo] = useState(accountDetails);
  const [identificationInfo, setIdentificationInfo] = useState(identificationDetails);
  const [bankInfo, setBankInfo] = useState(bankDetails);
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isShortScreen = height <= 760;
  const isVeryShortScreen = height <= 700;
  const isNarrowScreen = width <= 360;
  const isWideScreen = width >= 768;
  const bottomInset = Platform.OS === 'android' ? insets.bottom : 0;
  const bottomNavClearance =
    Platform.OS === 'ios'
      ? isVeryShortScreen
        ? 36
        : 44
      : (isVeryShortScreen ? 78 : 86) + bottomInset;
  const profileName =
    personalInfo.find((item) => item.label === 'Full Name')?.value || 'Katlego Mogolodi';
  const profileHandle = personalInfo.find((item) => item.label === 'UserName')?.value || 'Katt';

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

          <Text style={[styles.brand, isNarrowScreen && styles.brandNarrow]}>Profile</Text>

          <Pressable hitSlop={10} onPress={onOpenNotifications} style={styles.iconButton}>
            <Ionicons
              color="#F8FAFC"
              name="notifications-outline"
              size={isNarrowScreen ? 24 : 27}
            />
          </Pressable>
        </View>

        <View style={[styles.listFrame, { marginBottom: bottomNavClearance }]}>
          <ScrollView
            fadingEdgeLength={Platform.OS === 'android' ? 22 : 0}
            contentContainerStyle={[styles.content, isWideScreen && styles.contentWide]}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.profileHeader, isShortScreen && styles.profileHeaderShort]}>
              <View style={[styles.avatarFrame, isNarrowScreen && styles.avatarFrameNarrow]}>
                <Image
                  source={{
                    uri: 'https://api.dicebear.com/9.x/notionists/png?seed=Katlego&backgroundColor=5fa8ff',
                  }}
                  style={styles.avatar}
                />
                <View style={styles.editBadge}>
                  <Ionicons color="#FFFFFF" name="person" size={16} />
                  <Ionicons color="#FFFFFF" name="pencil" size={10} style={styles.badgePencil} />
                </View>
              </View>

              <Text numberOfLines={1} style={styles.profileName}>
                {profileName}
              </Text>
              <Text style={styles.profileHandle}>@{profileHandle}</Text>

              <View style={styles.statsRow}>
                {profileStats.map((stat) => (
                  <View key={stat.label} style={styles.statItem}>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.sections}>
              <ProfileSection
                defaultExpanded
                items={personalInfo}
                onSave={setPersonalInfo}
                title="Personal"
              />
              <ProfileSection
                defaultExpanded
                items={accountInfo}
                onSave={setAccountInfo}
                title="Account"
              />
              <ProfileSection
                items={identificationInfo}
                onSave={setIdentificationInfo}
                title="Identification"
              />
              <ProfileSection items={bankInfo} onSave={setBankInfo} title="Bank Details" />
            </View>
          </ScrollView>

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
  listFrame: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
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
  content: {
    flexGrow: 1,
    paddingBottom: 22,
    paddingTop: 4,
  },
  contentWide: {
    alignSelf: 'center',
    maxWidth: 520,
    width: '100%',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileHeaderShort: {
    marginBottom: 17,
  },
  avatarFrame: {
    alignItems: 'center',
    backgroundColor: '#5198EA',
    borderRadius: 86,
    borderColor: 'rgba(255,255,255,0.12)',
    borderWidth: 3,
    height: 172,
    justifyContent: 'flex-end',
    overflow: 'visible',
    width: 172,
  },
  avatarFrameNarrow: {
    borderRadius: 76,
    height: 152,
    width: 152,
  },
  avatar: {
    borderRadius: 86,
    height: '100%',
    width: '100%',
  },
  editBadge: {
    alignItems: 'center',
    backgroundColor: '#28C55F',
    borderColor: '#494B4D',
    borderWidth: 3,
    borderRadius: 999,
    height: 36,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 3,
    width: 36,
  },
  badgePencil: {
    marginLeft: 11,
    marginTop: -8,
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 25,
    marginTop: 14,
    maxWidth: '92%',
  },
  profileHandle: {
    color: 'rgba(248,250,252,0.68)',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 1,
  },
  statsRow: {
    alignItems: 'center',
    backgroundColor: 'rgba(32,38,42,0.64)',
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 82,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
    lineHeight: 32,
  },
  statLabel: {
    color: 'rgba(248,250,252,0.72)',
    fontSize: 12,
    lineHeight: 18,
  },
  sections: {
    gap: 11,
  },
  detailCard: {
    backgroundColor: '#20262A',
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingBottom: 19,
    paddingTop: 16,
  },
  detailCardCollapsed: {
    justifyContent: 'center',
    minHeight: 56,
    paddingBottom: 0,
    paddingTop: 0,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 24,
  },
  sectionTitleButton: {
    flex: 1,
    minWidth: 0,
  },
  sectionTitleWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
  },
  sectionAccent: {
    backgroundColor: '#28C55F',
    borderRadius: 999,
    height: 18,
    width: 4,
  },
  cardTitle: {
    color: '#28C55F',
    fontSize: 15,
    fontWeight: '800',
  },
  sectionActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginLeft: 10,
  },
  chevronButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(248,250,252,0.06)',
    borderRadius: 999,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  editButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(40,197,95,0.12)',
    borderColor: 'rgba(40,197,95,0.36)',
    borderRadius: 999,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: '#28C55F',
    borderRadius: 999,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  textAction: {
    justifyContent: 'center',
    minHeight: 32,
    paddingHorizontal: 2,
  },
  textActionLabel: {
    color: 'rgba(248,250,252,0.72)',
    fontSize: 12,
    fontWeight: '700',
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
    marginTop: 15,
  },
  detailItem: {
    backgroundColor: 'rgba(248,250,252,0.035)',
    borderRadius: 10,
    minWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 9,
    width: '48%',
  },
  detailLabel: {
    color: 'rgba(248,250,252,0.58)',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 14,
    marginBottom: 4,
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
  },
  detailInput: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 21,
    minHeight: 31,
    paddingHorizontal: 0,
    paddingVertical: 2,
  },
  buttonPressed: {
    opacity: 0.92,
  },
});
