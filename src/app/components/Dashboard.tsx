import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { HomePage } from './HomePage';
import { TimeSchedulerPage } from './TimeSchedulerPage';
import { ViralityPredictionPage } from './ViralityPredictionPage';
import { ContentPreviewModal } from './ContentPreviewModal';
import { Moon, Sun } from 'lucide-react';

interface DashboardProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  onLogout: () => void;
}

export function Dashboard({ isDarkMode, setIsDarkMode, onLogout }: DashboardProps) {
  const [activeView, setActiveView] = useState<'home' | 'scheduler' | 'virality'>('home');
  const [showPreview, setShowPreview] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeView={activeView} onNavigate={setActiveView} onLogout={onLogout} />

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
              onFileUpload={(file) => {
                setUploadedFile(file);
                setShowPreview(true);
              }}
            />
          )}

          {activeView === 'scheduler' && <TimeSchedulerPage />}

          {activeView === 'virality' && <ViralityPredictionPage />}
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
