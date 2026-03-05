import { X, Sparkles, Copy, Download, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ContentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  uploadedFile: File | null;
}

export function ContentPreviewModal({ isOpen, onClose, uploadedFile }: ContentPreviewModalProps) {
  const generatedCaption = `🎓 Excited to share that I've completed the Data Structures & Algorithms certification! 

This journey has been incredible, diving deep into:
✅ Advanced algorithms and optimization
✅ Complex data structures
✅ Problem-solving techniques
✅ Real-world applications

Big thanks to everyone who supported me along the way! 💪

#DataStructures #Algorithms #CodingJourney #TechCertification #DeveloperLife`;

  const viralityMetrics = [
    { label: 'Engagement', value: 92, color: 'from-blue-500 to-blue-600' },
    { label: 'Reach', value: 85, color: 'from-green-500 to-green-600' },
    { label: 'Virality', value: 88, color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 lg:inset-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-full lg:max-w-5xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    AI-Generated Content Preview
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Review and customize before posting
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(100vh-200px)] lg:max-h-[600px] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Side - Image Preview */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 dark:text-white">Enhanced Image</h3>
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-lg">
                    {uploadedFile && uploadedFile.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(uploadedFile)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800"
                        alt="Certificate Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Virality Heatmap */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-4 border border-orange-100 dark:border-orange-800">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="text-orange-500">🔥</span>
                      Virality Prediction
                    </h4>
                    <div className="space-y-3">
                      {viralityMetrics.map((metric) => (
                        <div key={metric.label}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-700 dark:text-gray-300">{metric.label}</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {metric.value}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${metric.value}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                              className={`h-full bg-gradient-to-r ${metric.color} rounded-full`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side - Caption */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 dark:text-white">Generated Caption</h3>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 rounded-lg"
                      onClick={() => navigator.clipboard.writeText(generatedCaption)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 min-h-[300px]">
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                      {generatedCaption}
                    </p>
                  </div>

                  {/* AI Suggestions */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#2563EB]" />
                      AI Suggestions
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Best posting time: Today at 7:30 PM</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Add 2-3 more relevant hashtags for reach</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Consider tagging relevant accounts</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between gap-4 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <Button
                variant="outline"
                className="h-11 px-6 rounded-xl border-gray-200 dark:border-gray-600"
                onClick={onClose}
              >
                Edit Content
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="h-11 px-6 rounded-xl border-gray-200 dark:border-gray-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
                <Button className="h-11 px-6 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-xl shadow-lg shadow-blue-500/30">
                  <Share2 className="w-4 h-4 mr-2" />
                  Post Now
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
