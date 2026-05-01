import {
  DrawerContentScrollView,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import BottomTabNavigator from './BottomTabNavigator';

const Drawer = createDrawerNavigator();

const portalConfig = {
  borrower: {
    drawerId: 'BorrowerDrawer',
    roleLabel: 'Borrower',
    switchLabel: 'Switch to Lender',
    tabRouteName: 'BorrowerTabs',
    drawerItems: [
      { icon: 'home-outline', label: 'Home', screen: 'Home' },
      { icon: 'search-outline', label: 'Explore', screen: 'Explore' },
      { icon: 'handshake-outline', label: 'My Loans', screen: 'Loans', type: 'material' },
      { icon: 'person-outline', label: 'Profile', screen: 'Profile' },
      { icon: 'wallet-outline', label: 'Wallet', screen: 'Wallet', type: 'material' },
      { icon: 'newspaper-outline', label: 'My Posts' },
      { icon: 'notifications-outline', label: 'Notifications', action: 'notifications' },
      { icon: 'help-circle-outline', label: 'Support' },
      { icon: 'settings-outline', label: 'Settings' },
      { icon: 'card-account-details-outline', label: 'KYC', type: 'material' },
      { icon: 'information-circle-outline', label: 'About' },
      { icon: 'document-text-outline', label: 'Terms & Conditions/Policies' },
    ],
  },
  lender: {
    drawerId: 'LenderDrawer',
    roleLabel: 'Lender',
    switchLabel: 'Switch to Borrower',
    tabRouteName: 'LenderTabs',
    drawerItems: [
      { icon: 'speedometer-outline', label: 'Dashboard', screen: 'Dashboard' },
      { icon: 'document-text-outline', label: 'Requests', screen: 'Requests' },
      { icon: 'chart-line', label: 'Portfolio', screen: 'Portfolio', type: 'material' },
      { icon: 'wallet-outline', label: 'Wallet', screen: 'Wallet', type: 'material' },
      { icon: 'person-outline', label: 'Profile', screen: 'Profile' },
      { icon: 'notifications-outline', label: 'Notifications', action: 'notifications' },
      { icon: 'help-circle-outline', label: 'Support' },
      { icon: 'settings-outline', label: 'Settings' },
      { icon: 'card-account-details-outline', label: 'KYC', type: 'material' },
      { icon: 'information-circle-outline', label: 'About' },
      { icon: 'document-text-outline', label: 'Terms & Conditions/Policies' },
    ],
  },
};

function DrawerIcon({ active, icon, type }) {
  const color = active ? '#28C55F' : '#F3F4F6';

  if (type === 'material') {
    return <MaterialCommunityIcons color={color} name={icon} size={24} />;
  }

  return <Ionicons color={color} name={icon} size={22} />;
}

function getActiveTab(state, fallbackScreen) {
  const drawerRoute = state.routes[state.index];
  const tabState = drawerRoute?.state;

  if (!tabState) {
    return fallbackScreen;
  }

  return tabState.routes[tabState.index]?.name ?? fallbackScreen;
}

function CustomDrawerContent({
  config,
  navigation,
  onLogout,
  onOpenNotifications,
  onSwitchPortal,
  state,
  user,
}) {
  const firstScreen = config.drawerItems.find((item) => item.screen)?.screen;
  const activeTab = getActiveTab(state, firstScreen);
  const userName = user?.name ?? 'Katlego Mogolodi';
  const userInitials = userName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  function handleItemPress(item) {
    if (item.screen) {
      navigation.navigate(config.tabRouteName, { screen: item.screen });
      return;
    }

    if (item.action === 'notifications') {
      navigation.closeDrawer();
      onOpenNotifications();
    }
  }

  return (
    <View style={styles.drawer}>
      <DrawerContentScrollView
        bounces={false}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.menuHeader}>
          <View style={styles.menuAvatar}>
            <Text style={styles.menuAvatarText}>{userInitials}</Text>
          </View>

          <View style={styles.menuHeaderText}>
            <Text style={styles.menuName}>{userName}</Text>
            <Text style={styles.menuRole}>{config.roleLabel}</Text>
          </View>
        </View>

        <View style={styles.menuItems}>
          {config.drawerItems.map((item) => {
            const active = item.screen === activeTab;

            return (
              <Pressable
                key={item.label}
                onPress={() => handleItemPress(item)}
                style={styles.menuItem}
              >
                <DrawerIcon active={active} icon={item.icon} type={item.type} />
                <Text style={[styles.menuItemLabel, active && styles.menuItemLabelActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </DrawerContentScrollView>

      <View style={styles.menuActions}>
        <Pressable
          onPress={() => {
            navigation.closeDrawer();
            onSwitchPortal?.();
          }}
          style={[styles.menuActionButton, styles.switchButton]}
        >
          <Text style={styles.menuActionText}>{config.switchLabel}</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            navigation.closeDrawer();
            onLogout();
          }}
          style={[styles.menuActionButton, styles.logoutButton]}
        >
          <Text style={styles.menuActionText}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function DrawerNavigator({
  onLogout,
  onOpenNotifications,
  onSubmitRequest,
  onSwitchPortal,
  portal = 'borrower',
  user,
}) {
  const config = portalConfig[portal] ?? portalConfig.borrower;

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent
          {...props}
          config={config}
          onLogout={onLogout}
          onOpenNotifications={onOpenNotifications}
          onSwitchPortal={onSwitchPortal}
          user={user}
        />
      )}
      id={config.drawerId}
      screenOptions={{
        drawerStyle: styles.drawerStyle,
        headerShown: false,
        overlayColor: 'rgba(0,0,0,0.42)',
        sceneStyle: styles.scene,
        swipeEdgeWidth: 80,
      }}
    >
      <Drawer.Screen name={config.tabRouteName}>
        {() => (
          <BottomTabNavigator
            drawerId={config.drawerId}
            onOpenNotifications={onOpenNotifications}
            onSubmitRequest={onSubmitRequest}
            portal={portal}
            user={user}
          />
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  scene: {
    backgroundColor: '#494B4D',
  },
  drawerStyle: {
    backgroundColor: '#2A2F34',
    width: 290,
  },
  drawer: {
    backgroundColor: '#2A2F34',
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 22,
  },
  menuHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 26,
  },
  menuAvatar: {
    alignItems: 'center',
    backgroundColor: '#4895EF',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  menuAvatarText: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
  },
  menuHeaderText: {
    marginLeft: 12,
  },
  menuName: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '700',
  },
  menuRole: {
    color: '#BFC5CD',
    fontSize: 14,
    marginTop: 2,
  },
  menuItems: {
    gap: 4,
  },
  menuItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    paddingVertical: 10,
  },
  menuItemLabel: {
    color: '#F3F4F6',
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  menuItemLabelActive: {
    color: '#28C55F',
    fontWeight: '700',
  },
  menuActions: {
    paddingBottom: 30,
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  menuActionButton: {
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
    paddingVertical: 14,
  },
  switchButton: {
    backgroundColor: '#28C55F',
  },
  logoutButton: {
    backgroundColor: '#F84444',
  },
  menuActionText: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
});
