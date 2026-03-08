import { useState, useEffect } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
import { signOut, getCurrentUser } from 'aws-amplify/auth';

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("isDarkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [uiLanguage, setUiLanguage] = useState<string>(() => localStorage.getItem("uiLanguage") || "English");

  useEffect(() => {
    localStorage.setItem("uiLanguage", uiLanguage);
  }, [uiLanguage]);

  // Check if user is already authenticated on mount
  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      await getCurrentUser();
      setIsAuthenticated(true);
      setShowLanding(false); // If already logged in, go straight to dashboard
    } catch (err) {
      setIsAuthenticated(false);
    }
  }

  const handleLogout = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
      // Still set to false to allow re-login attempt
      setIsAuthenticated(false);
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 transition-colors duration-300">
        {showLanding && !isAuthenticated ? (
          <LandingPage onGetStarted={() => setShowLanding(false)} />
        ) : !isAuthenticated ? (
          <AuthScreen
            onAuthenticate={() => setIsAuthenticated(true)}
            uiLanguage={uiLanguage}
            setUiLanguage={setUiLanguage}
          />
        ) : (
          <Dashboard
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            onLogout={handleLogout}
            uiLanguage={uiLanguage}
            setUiLanguage={setUiLanguage}
          />
        )}
      </div>
    </div>
  );
}
