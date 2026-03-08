import { useState, useEffect } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';

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

  const handleLogout = () => {
    setIsAuthenticated(false);
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
