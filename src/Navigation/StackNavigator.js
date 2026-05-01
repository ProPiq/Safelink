import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';

import CreatePasswordScreen from '../Auth/CreatePasswordScreen';
import ForgotPasswordScreen from '../Auth/ForgotPasswordScreen';
import LoginScreen from '../Auth/LoginScreen';
import OtpVerificationScreen from '../Auth/OtpVerificationScreen';
import NotificationsScreen from '../Borrower/NotificationsScreen';
import RequestScreen from '../Borrower/RequestScreen';
import LandingScreen from '../Boarding/LandingScreen';
import DrawerNavigator from './DrawerNavigator';

const AuthStack = createNativeStackNavigator();
const BorrowerStack = createNativeStackNavigator();
const LenderStack = createNativeStackNavigator();

const screenOptions = {
  animation: 'slide_from_right',
  headerShown: false,
};

export function AuthStackNavigator({ onLogin }) {
  return (
    <AuthStack.Navigator initialRouteName="Boarding" screenOptions={screenOptions}>
      <AuthStack.Screen name="Boarding">
        {({ navigation }) => (
          <LandingScreen onContinue={() => navigation.navigate('Login')} />
        )}
      </AuthStack.Screen>

      <AuthStack.Screen name="Login">
        {({ navigation }) => (
          <LoginScreen
            onForgotPassword={() => navigation.navigate('ForgotPassword')}
            onLogin={onLogin}
          />
        )}
      </AuthStack.Screen>

      <AuthStack.Screen name="ForgotPassword">
        {({ navigation }) => (
          <ForgotPasswordScreen
            onBack={() => navigation.navigate('Login')}
            onContinue={() => navigation.navigate('OtpVerification')}
          />
        )}
      </AuthStack.Screen>

      <AuthStack.Screen name="OtpVerification">
        {({ navigation }) => (
          <OtpVerificationScreen onContinue={() => navigation.navigate('CreatePassword')} />
        )}
      </AuthStack.Screen>

      <AuthStack.Screen name="CreatePassword">
        {({ navigation }) => (
          <CreatePasswordScreen onContinue={() => navigation.navigate('Login')} />
        )}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  );
}

function navigateToPortalTab(navigation, drawerRouteName, tabRouteName, screen) {
  navigation.navigate(drawerRouteName, {
    params: { screen },
    screen: tabRouteName,
  });
}

export function BorrowerStackNavigator({ onLogout, onSwitchPortal, user }) {
  const [requestDraft, setRequestDraft] = useState(null);

  return (
    <BorrowerStack.Navigator initialRouteName="BorrowerDrawer" screenOptions={screenOptions}>
      <BorrowerStack.Screen name="BorrowerDrawer">
        {({ navigation }) => (
          <DrawerNavigator
            onLogout={onLogout}
            onOpenNotifications={() => navigation.navigate('Notifications')}
            onSubmitRequest={(requestData) => {
              setRequestDraft(requestData);
              navigation.navigate('Request');
            }}
            onSwitchPortal={onSwitchPortal}
            portal="borrower"
            user={user}
          />
        )}
      </BorrowerStack.Screen>

      <BorrowerStack.Screen name="Notifications">
        {({ navigation }) => (
          <NotificationsScreen
            onBack={() =>
              navigateToPortalTab(navigation, 'BorrowerDrawer', 'BorrowerTabs', 'Home')
            }
          />
        )}
      </BorrowerStack.Screen>

      <BorrowerStack.Screen name="Request">
        {({ navigation }) => (
          <RequestScreen
            onBack={() =>
              navigateToPortalTab(navigation, 'BorrowerDrawer', 'BorrowerTabs', 'Home')
            }
            onGoToExplore={() =>
              navigateToPortalTab(navigation, 'BorrowerDrawer', 'BorrowerTabs', 'Explore')
            }
            onOpenNotifications={() => navigation.navigate('Notifications')}
            requestData={requestDraft}
          />
        )}
      </BorrowerStack.Screen>
    </BorrowerStack.Navigator>
  );
}

export function LenderStackNavigator({ onLogout, onSwitchPortal, user }) {
  return (
    <LenderStack.Navigator initialRouteName="LenderDrawer" screenOptions={screenOptions}>
      <LenderStack.Screen name="LenderDrawer">
        {({ navigation }) => (
          <DrawerNavigator
            onLogout={onLogout}
            onOpenNotifications={() => navigation.navigate('Notifications')}
            onSwitchPortal={onSwitchPortal}
            portal="lender"
            user={user}
          />
        )}
      </LenderStack.Screen>

      <LenderStack.Screen name="Notifications">
        {({ navigation }) => (
          <NotificationsScreen
            onBack={() =>
              navigateToPortalTab(navigation, 'LenderDrawer', 'LenderTabs', 'Dashboard')
            }
          />
        )}
      </LenderStack.Screen>
    </LenderStack.Navigator>
  );
}
