import CreatePasswordScreen from '../Auth/CreatePasswordScreen';
import { useState } from 'react';
import ForgotPasswordScreen from '../Auth/ForgotPasswordScreen';
import LoginScreen from '../Auth/LoginScreen';
import OtpVerificationScreen from '../Auth/OtpVerificationScreen';
import BorrowerHome from '../Borrower/borrowerHome';
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

  function handleEnterForgotPassword() {
    setScreen('forgotPassword');
  }

  function handleEnterOtpVerification() {
    setScreen('otpVerification');
  }

  function handleEnterCreatePassword() {
    setScreen('createPassword');
  }

  if (!user) {
    if (screen === 'boarding') {
      return <LandingScreen onContinue={handleEnterLogin} />;
    }

    if (screen === 'forgotPassword') {
      return <ForgotPasswordScreen onBack={handleEnterLogin} onContinue={handleEnterOtpVerification} />;
    }

    if (screen === 'otpVerification') {
      return <OtpVerificationScreen onContinue={handleEnterCreatePassword} />;
    }

    if (screen === 'createPassword') {
      return <CreatePasswordScreen onContinue={handleEnterLogin} />;
    }

    return <LoginScreen onForgotPassword={handleEnterForgotPassword} onLogin={handleLogin} />;
  }

  if (user.role === 'borrower') {
    return <BorrowerHome onLogout={handleLogout} user={user} />;
  }

  return <LenderPortal onLogout={handleLogout} user={user} />;
}
