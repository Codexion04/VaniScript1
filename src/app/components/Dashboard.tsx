import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { HomePage } from './HomePage';
import { TimeSchedulerPage } from './TimeSchedulerPage';
import { ViralityPredictionPage } from './ViralityPredictionPage';
import { MyPostsPage } from './MyPostsPage';
import { DiscoveryPage } from './DiscoveryPage';
import { ContentPreviewModal } from './ContentPreviewModal';
import { Moon, Sun, Settings } from 'lucide-react';
import { SettingsPage } from './SettingsPage';
import { translations } from '../translations';

interface DashboardProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean | ((prev: boolean) => boolean)) => void;
  onLogout: () => void;
  uiLanguage: string;
  setUiLanguage: (lang: string) => void;
}

export function Dashboard({ isDarkMode, setIsDarkMode, onLogout, uiLanguage, setUiLanguage }: DashboardProps) {
  const [activeView, setActiveView] = useState<'home' | 'scheduler' | 'virality' | 'posts' | 'discovery' | 'settings'>('home');
  const [showPreview, setShowPreview] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const t = translations[uiLanguage] || translations["English"];

  const handleUseIdea = (idea: string) => {
    localStorage.setItem("lastDiscoveryIdea", idea);
    setActiveView('home');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar
        activeView={activeView as any}
        onNavigate={setActiveView as any}
        onLogout={onLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        uiLanguage={uiLanguage}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
          {/* Header with Dark Mode Toggle */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setActiveView('settings')}
              className={`p-3 rounded-2xl border transition-all ${activeView === 'settings' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* Dynamic Content Based on Active View */}
          {activeView === 'home' && (
            <HomePage
              onShowPreview={() => setShowPreview(true)}
              onNavigate={setActiveView as any}
              onFileUpload={(file) => {
                setUploadedFile(file);
                setShowPreview(true);
              }}
              uiLanguage={uiLanguage}
              setUiLanguage={setUiLanguage}
            />
          )}

          {activeView === 'settings' && (
            <SettingsPage
              uiLanguage={uiLanguage}
              setUiLanguage={setUiLanguage}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          )}

          {activeView === 'scheduler' && <TimeSchedulerPage uiLanguage={uiLanguage} />}

          {activeView === 'virality' && <ViralityPredictionPage uiLanguage={uiLanguage} />}

          {activeView === 'posts' && <MyPostsPage onNavigate={setActiveView} uiLanguage={uiLanguage} />}

          {activeView === 'discovery' && <DiscoveryPage onUseIdea={handleUseIdea} uiLanguage={uiLanguage} setUiLanguage={setUiLanguage} />}
        </div>
      </main>

      {/* Content Preview Modal */}
      {showPreview && (
        <ContentPreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          uploadedFile={uploadedFile}
          uiLanguage={uiLanguage}
        />
      )}
    </div>
  );
}
