import { useState } from 'react';
import LoginScreen from '../Auth/LoginScreen';
import BorrowerPortal from '../Borrower/BorrowerPortal';
import LenderPortal from '../Lender/LenderPortal';
import LandingScreen from '../Boarding/LandingScreen';

export default function AppNavigator() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('boarding');

  function handleLogin(loggedInUser) {
    setUser(loggedInUser);
  }

  function handleLogout() {
    setUser(null);
    setScreen('boarding');
  }

  function handleEnterLogin() {
    setScreen('login');
  }

  if (!user) {
    if (screen === 'boarding') {
      return <LandingScreen onContinue={handleEnterLogin} />;
    }

    return <LoginScreen onLogin={handleLogin} />;
  }

  if (user.role === 'borrower') {
    return <BorrowerPortal onLogout={handleLogout} user={user} />;
  }

  return <LenderPortal onLogout={handleLogout} user={user} />;
}
