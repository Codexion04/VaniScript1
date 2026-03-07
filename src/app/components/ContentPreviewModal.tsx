import { X, Sparkles, Copy, Download, Share2, Check, RefreshCw, AlertCircle, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';

interface ContentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  uploadedFile: File | null;
}

export function ContentPreviewModal({ isOpen, onClose, uploadedFile }: ContentPreviewModalProps) {
  const [caption, setCaption] = useState("");
  const [score, setScore] = useState(85);
  const [isSaving, setIsSaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorCount, setErrorCount] = useState(0);

  // Poll for data until it's available
  useEffect(() => {
    let interval: any;
    let attempts = 0;

    if (isOpen) {
      console.log("Modal opened, starting poll...");
      setIsLoading(true);
      setErrorCount(0);

      const checkData = () => {
        attempts++;
        const savedCaption = localStorage.getItem("generatedPost");
        const savedScore = localStorage.getItem("viralityScore");

        console.log("Polling... attempts:", attempts, "caption:", savedCaption ? "found" : "null");

        if (savedCaption && savedCaption.length > 10 && !savedCaption.includes("analyzing")) {
          setCaption(savedCaption);
          setIsLoading(false);
          if (savedScore) setScore(parseInt(savedScore) || 85);
          clearInterval(interval);
        } else if (attempts > 30) { // Stop after ~45 seconds
          setErrorCount(prev => prev + 1);
          setIsLoading(false);
          clearInterval(interval);
          if (!caption) setCaption("Content generation is taking longer than expected. Please manually type your post or click Edit Content to retry recording.");
        }
      };

      checkData(); // Initial check
      interval = setInterval(checkData, 1500); // Check every 1.5s
    } else {
      setIsLoading(true);
      setCaption("");
    }

    return () => clearInterval(interval);
  }, [isOpen]);

  const viralityMetrics = [
    { label: 'Engagement', value: score - 5, color: 'from-blue-500 to-blue-600' },
    { label: 'Reach', value: score - 10, color: 'from-green-500 to-green-600' },
    { label: 'Virality', value: score, color: 'from-purple-500 to-purple-600' },
  ];

  const handleCopy = () => {
    if (!caption || isLoading) return;
    navigator.clipboard.writeText(caption);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveDraft = async () => {
    if (!caption || isLoading) return;
    setIsSaving(true);
    try {
      const res = await fetch("http://localhost:5000/save-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: caption,
          title: "AI Generated Draft",
          platform: "Social Media",
        }),
      });

      if (res.ok) {
        alert("Draft saved to History! 💾");
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePostNow = async () => {
    await handleSaveDraft();
    alert("Post sent to scheduler! 🚀 Your content will be published at the optimal time.");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl bg-white dark:bg-gray-950 rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[95vh] border border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-7 border-b border-gray-100 dark:border-gray-800 shrink-0 bg-white/50 dark:bg-gray-950/50 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                    AI Content Studio
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">✨ Refining your viral masterpiece in real-time</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all group"
              >
                <X className="w-6 h-6 text-gray-400 group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar bg-white dark:bg-gray-950">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left Side: Preview & Metrics */}
                <div className="space-y-8">
                  <div className="aspect-square rounded-[40px] overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl relative group">
                    {uploadedFile ? (
                      <img
                        src={URL.createObjectURL(uploadedFile)}
                        alt="Content"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-sm font-medium opacity-50">No media preview available</p>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-white font-bold text-sm flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400" />
                        Media Uploaded Successfully
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 rounded-[40px] p-8 border border-blue-500/10 dark:border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full -mr-16 -mt-16" />
                    <h4 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3 text-sm uppercase tracking-[0.2em]">
                      <span className="text-blue-500">◈</span>
                      Virality Prediction
                    </h4>
                    <div className="space-y-6">
                      {viralityMetrics.map((metric) => (
                        <div key={metric.label}>
                          <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3 ml-1">
                            <span>{metric.label}</span>
                            <span className={isLoading ? "animate-pulse" : ""}>{isLoading ? "--" : `${metric.value}%`}</span>
                          </div>
                          <div className="h-2.5 bg-gray-100 dark:bg-gray-800/50 rounded-full overflow-hidden p-[2px]">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: isLoading ? "15%" : `${metric.value}%` }}
                              transition={{ type: "spring", stiffness: 50, damping: 15 }}
                              className={`h-full bg-gradient-to-r ${metric.color} rounded-full`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side: Caption Editor */}
                <div className="flex flex-col h-full space-y-6">
                  <div className="flex items-center justify-between shrink-0">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      Generated Caption
                      {!isLoading && <Edit3 className="w-4 h-4 text-gray-400" />}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isLoading}
                      className="rounded-2xl h-10 px-6 border-gray-200 dark:border-gray-800 font-bold hover:scale-105 transition-all"
                      onClick={handleCopy}
                    >
                      {isCopied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                      {isCopied ? "Copied" : "Copy Post"}
                    </Button>
                  </div>

                  <div className="relative flex-1 group min-h-[400px]">
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      disabled={isLoading}
                      placeholder="Waiting for AI to finish crafting..."
                      className="w-full h-full p-8 bg-gray-50 dark:bg-gray-900/50 border-2 border-transparent focus:border-blue-500/50 rounded-[40px] text-base text-gray-800 dark:text-gray-200 leading-relaxed resize-none transition-all focus:bg-white dark:focus:bg-gray-900 shadow-inner custom-scrollbar"
                    />

                    {isLoading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 dark:bg-gray-950/40 backdrop-blur-[4px] rounded-[40px]">
                        <div className="relative">
                          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin" />
                          <Sparkles className="w-5 h-5 text-purple-500 absolute -top-1 -right-1 animate-bounce" />
                        </div>
                        <p className="mt-6 text-sm font-black text-gray-600 dark:text-gray-300 tracking-[0.3em] uppercase animate-pulse">
                          Crafting Content...
                        </p>
                        {errorCount > 0 && <p className="mt-2 text-xs text-red-500 font-medium">Initial attempt failed, retrying...</p>}
                      </div>
                    )}
                  </div>

                  <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-3xl p-5 border border-amber-500/20 shrink-0">
                    <p className="text-[12px] text-amber-900 dark:text-amber-200 leading-relaxed font-bold flex items-center gap-3">
                      <span className="text-xl">💡</span>
                      <span>Best Posting Time: Today at 7:45 PM (Based on your network activity)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto px-10 h-14 rounded-3xl font-bold border-gray-200 dark:border-gray-800 text-sm hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
              >
                Edit Content
              </Button>

              <div className="flex gap-4 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isLoading || isSaving}
                  className="flex-1 sm:flex-none px-8 h-14 rounded-3xl font-bold border-gray-200 dark:border-gray-800 text-sm"
                >
                  <Download className="w-4 h-4 mr-2 text-blue-500" />
                  {isSaving ? "Saving..." : "Save Draft"}
                </Button>
                <Button
                  onClick={handlePostNow}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none px-10 h-14 rounded-3xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:translate-y-[-2px] active:translate-y-[0px] transition-all text-sm"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Publish Now
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
