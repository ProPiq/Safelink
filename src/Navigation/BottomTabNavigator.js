import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BorrowerHome from '../Borrower/borrowerHome';
import Explore from '../Borrower/Explore';
import Loans from '../Borrower/Loans';
import LenderPortal from '../Lender/LenderPortal';

const BottomTab = createBottomTabNavigator();

const portalTabs = {
  borrower: {
    initialRouteName: 'Home',
    tabs: {
      Home: { icon: 'home-outline', label: 'Home' },
      Explore: { icon: 'search-outline', label: 'Explore' },
      Loans: { icon: 'handshake-outline', label: 'Loans', type: 'material' },
      Profile: { icon: 'person-outline', label: 'Profile' },
      Wallet: { icon: 'wallet-outline', label: 'Wallet', type: 'material' },
    },
  },
  lender: {
    initialRouteName: 'Dashboard',
    tabs: {
      Dashboard: { icon: 'speedometer-outline', label: 'Dashboard' },
      Requests: { icon: 'document-text-outline', label: 'Requests' },
      Portfolio: { icon: 'chart-line', label: 'Portfolio', type: 'material' },
      Wallet: { icon: 'wallet-outline', label: 'Wallet', type: 'material' },
      Profile: { icon: 'person-outline', label: 'Profile' },
    },
  },
};

function TabIcon({ color, focused, name, type }) {
  const size = focused ? 25 : 24;

  if (type === 'material') {
    return <MaterialCommunityIcons color={color} name={name} size={size} />;
  }

  return <Ionicons color={color} name={name} size={size} />;
}

function PlaceholderScreen({ drawerId, navigation, onOpenNotifications, title }) {
  return (
    <View style={styles.placeholder}>
      <View style={styles.header}>
        <Pressable
          hitSlop={10}
          onPress={() => navigation.getParent(drawerId)?.openDrawer()}
          style={styles.iconButton}
        >
          <Ionicons color="#F8FAFC" name="menu" size={28} />
        </Pressable>

        <Text style={styles.title}>{title}</Text>

        <Pressable hitSlop={10} onPress={onOpenNotifications} style={styles.iconButton}>
          <Ionicons color="#F8FAFC" name="notifications-outline" size={27} />
        </Pressable>
      </View>

      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptyText}>This section is ready for its screen content.</Text>
      </View>
    </View>
  );
}

export default function BottomTabNavigator({
  drawerId = 'BorrowerDrawer',
  onOpenNotifications,
  onSubmitRequest,
  portal = 'borrower',
  user,
}) {
  const config = portalTabs[portal] ?? portalTabs.borrower;
  const tabItems = config.tabs;
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'android' ? insets.bottom : 0;

  return (
    <BottomTab.Navigator
      initialRouteName={config.initialRouteName}
      screenOptions={({ route }) => {
        const tab = tabItems[route.name];

        return {
          headerShown: false,
          tabBarActiveTintColor: '#28C55F',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} name={tab.icon} type={tab.type} />
          ),
          tabBarInactiveTintColor: '#F8FAFC',
          tabBarItemStyle: styles.tabItem,
          tabBarLabel: tab.label,
          tabBarLabelStyle: styles.tabLabel,
          tabBarStyle: [
            styles.tabBar,
            {
              height: 86 + bottomInset,
              paddingBottom: 12 + bottomInset,
            },
          ],
        };
      }}
    >
      {portal === 'borrower' ? (
        <>
          <BottomTab.Screen name="Home">
            {({ navigation }) => (
              <BorrowerHome
                onOpenMenu={() => navigation.getParent(drawerId)?.openDrawer()}
                onOpenNotifications={onOpenNotifications}
                onSubmitRequest={onSubmitRequest}
              />
            )}
          </BottomTab.Screen>

          <BottomTab.Screen name="Explore">
            {({ navigation }) => (
              <Explore
                onOpenMenu={() => navigation.getParent(drawerId)?.openDrawer()}
                onOpenNotifications={onOpenNotifications}
              />
            )}
          </BottomTab.Screen>

          <BottomTab.Screen name="Loans">
            {({ navigation }) => (
              <Loans
                onOpenMenu={() => navigation.getParent(drawerId)?.openDrawer()}
                onOpenNotifications={onOpenNotifications}
              />
            )}
          </BottomTab.Screen>

          {['Profile', 'Wallet'].map((name) => (
            <BottomTab.Screen key={name} name={name}>
              {({ navigation }) => (
                <PlaceholderScreen
                  drawerId={drawerId}
                  navigation={navigation}
                  onOpenNotifications={onOpenNotifications}
                  title={name}
                />
              )}
            </BottomTab.Screen>
          ))}
        </>
      ) : (
        <>
          <BottomTab.Screen name="Dashboard">
            {({ navigation }) => (
              <LenderPortal
                onOpenMenu={() => navigation.getParent(drawerId)?.openDrawer()}
                onOpenNotifications={onOpenNotifications}
                user={user}
              />
            )}
          </BottomTab.Screen>

          {['Requests', 'Portfolio', 'Wallet', 'Profile'].map((name) => (
            <BottomTab.Screen key={name} name={name}>
              {({ navigation }) => (
                <PlaceholderScreen
                  drawerId={drawerId}
                  navigation={navigation}
                  onOpenNotifications={onOpenNotifications}
                  title={name}
                />
              )}
            </BottomTab.Screen>
          ))}
        </>
      )}
    </BottomTab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
    paddingHorizontal: 14,
    paddingTop: 12,
    position: 'absolute',
    shadowColor: 'transparent',
  },
  tabItem: {
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  placeholder: {
    backgroundColor: '#494B4D',
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    alignItems: 'center',
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '800',
  },
  emptyState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 120,
  },
  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '800',
  },
  emptyText: {
    color: '#D3D7DD',
    fontSize: 15,
    marginTop: 8,
    textAlign: 'center',
  },
});
