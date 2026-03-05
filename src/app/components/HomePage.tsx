import { motion } from 'motion/react';
import { SocialPlatformSelector } from './SocialPlatformSelector';
import { VoiceCommandCenter } from './VoiceCommandCenter';
import { MediaUploadCard } from './MediaUploadCard';

interface HomePageProps {
  onShowPreview: () => void;
  onFileUpload: (file: File) => void;
}

export function HomePage({ onShowPreview, onFileUpload }: HomePageProps) {
  return (
    <>
      {/* Voice Command Center - First Priority */}
      <VoiceCommandCenter onCertificateUpload={onShowPreview} />

      {/* Social Platform Selector */}
      <SocialPlatformSelector />

      {/* Media Upload Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MediaUploadCard onFileUpload={onFileUpload} />
        
        {/* Quick Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-800 dark:to-purple-900/20 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-6">
            Quick Stats
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Posts This Week</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
              </div>
              <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                +12%
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Engagement</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">8.4K</p>
              </div>
              <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                +23%
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled Posts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
              </div>
              <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                View All
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
