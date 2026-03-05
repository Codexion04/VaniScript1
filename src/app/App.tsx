import { useState } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 transition-colors duration-300">
        {!isAuthenticated ? (
          <AuthScreen onAuthenticate={() => setIsAuthenticated(true)} />
        ) : (
          <Dashboard 
            isDarkMode={isDarkMode} 
            setIsDarkMode={setIsDarkMode}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
}
