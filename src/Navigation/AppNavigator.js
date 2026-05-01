import { NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';

import {
  AuthStackNavigator,
  BorrowerStackNavigator,
  LenderStackNavigator,
} from './StackNavigator';

export default function AppNavigator() {
  const [user, setUser] = useState(null);
  const [activePortal, setActivePortal] = useState(null);

  function handleLogin(loggedInUser) {
    setUser(loggedInUser);
    setActivePortal(loggedInUser.role);
  }

  function handleLogout() {
    setUser(null);
    setActivePortal(null);
  }

  return (
    <NavigationContainer>
      {!user ? (
        <AuthStackNavigator onLogin={handleLogin} />
      ) : activePortal === 'borrower' ? (
        <BorrowerStackNavigator
          onLogout={handleLogout}
          onSwitchPortal={() => setActivePortal('lender')}
          user={user}
        />
      ) : (
        <LenderStackNavigator
          onLogout={handleLogout}
          onSwitchPortal={() => setActivePortal('borrower')}
          user={user}
        />
      )}
    </NavigationContainer>
  );
}
