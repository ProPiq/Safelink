import { useState } from 'react';
import LoginScreen from '../Auth/LoginScreen';
import BorrowerPortal from '../Borrower/BorrowerPortal';
import LenderPortal from '../Lender/LenderPortal';

export default function AppNavigator() {
  const [user, setUser] = useState(null);

  function handleLogin(loggedInUser) {
    setUser(loggedInUser);
  }

  function handleLogout() {
    setUser(null);
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (user.role === 'borrower') {
    return <BorrowerPortal onLogout={handleLogout} user={user} />;
  }

  return <LenderPortal onLogout={handleLogout} user={user} />;
}
