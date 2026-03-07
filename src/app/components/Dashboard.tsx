import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { HomePage } from './HomePage';
import { TimeSchedulerPage } from './TimeSchedulerPage';
import { ViralityPredictionPage } from './ViralityPredictionPage';
import { MyPostsPage } from './MyPostsPage';
import { DiscoveryPage } from './DiscoveryPage';
import { ContentPreviewModal } from './ContentPreviewModal';
import { Moon, Sun } from 'lucide-react';

interface DashboardProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  onLogout: () => void;
}

export function Dashboard({ isDarkMode, setIsDarkMode, onLogout }: DashboardProps) {
  const [activeView, setActiveView] = useState<'home' | 'scheduler' | 'virality' | 'posts' | 'discovery'>('home');
  const [showPreview, setShowPreview] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleUseIdea = (idea: string) => {
    localStorage.setItem("lastDiscoveryIdea", idea);
    setActiveView('home');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        onLogout={onLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
          {/* Header with Dark Mode Toggle */}
          <div className="flex items-center justify-end">
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
              onNavigate={setActiveView}
              onFileUpload={(file) => {
                setUploadedFile(file);
                setShowPreview(true);
              }}
            />
          )}

          {activeView === 'scheduler' && <TimeSchedulerPage />}

          {activeView === 'virality' && <ViralityPredictionPage />}

          {activeView === 'posts' && <MyPostsPage onNavigate={setActiveView} />}

          {activeView === 'discovery' && <DiscoveryPage onUseIdea={handleUseIdea} />}
        </div>
      </main>

      {/* Content Preview Modal */}
      {showPreview && (
        <ContentPreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          uploadedFile={uploadedFile}
        />
      )}
    </div>
  );
}
