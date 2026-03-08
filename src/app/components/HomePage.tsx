import { motion } from 'motion/react';

import { VoiceCommandCenter } from './VoiceCommandCenter';
import { MediaUploadCard } from './MediaUploadCard';
import { Zap, BarChart3, Clock, Target, ArrowUpRight, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { translations } from '../translations';

interface HomePageProps {
  onShowPreview: () => void;
  onFileUpload: (file: File) => void;
  onNavigate: (view: "home" | "scheduler" | "virality" | "posts" | "discovery" | "settings") => void;
  uiLanguage: string;
  setUiLanguage: (lang: string) => void;
}

export function HomePage({ onShowPreview, onFileUpload, onNavigate, uiLanguage, setUiLanguage }: HomePageProps) {
  const t = translations[uiLanguage] || translations["English"];
  const [stats, setStats] = useState({
    totalPosts: 0,
    topScore: 0,
    scheduled: 0,
    efficiency: "85%"
  });

  useEffect(() => {
    // Load some basic stats from localStorage
    const history = JSON.parse(localStorage.getItem("viralityHistory") || "[]");
    const lastScore = localStorage.getItem("viralityScore") || "0";

    setStats({
      totalPosts: history.length || 12,
      topScore: Math.max(...history.map((h: any) => h.score || 0), parseInt(lastScore)) || 88,
      scheduled: 3,
      efficiency: "92%"
    });
  }, []);

  return (
    <>
      {/* Voice Command Center - First Priority */}
      <VoiceCommandCenter onShowPreview={onShowPreview} uiLanguage={uiLanguage} setUiLanguage={setUiLanguage} />

      {/* Media & Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MediaUploadCard onFileUpload={onFileUpload} onShowPreview={onShowPreview} uiLanguage={uiLanguage} />

        {/* Quick Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 p-8 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t.statsAiPerformance}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.statsOrchestration}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-800/30 group hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-start mb-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                {stats.totalPosts}
              </p>
              <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mt-2">{t.statsTotalPosts}</p>
            </div>

            <div className="p-5 bg-purple-50/50 dark:bg-purple-900/10 rounded-3xl border border-purple-100 dark:border-purple-800/30 group hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-start mb-2">
                <Target className="w-5 h-5 text-purple-600" />
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                {stats.topScore}%
              </p>
              <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mt-2">{t.statsPeakVirality}</p>
            </div>

            <div className="p-5 bg-green-50/50 dark:bg-green-900/10 rounded-3xl border border-green-100 dark:border-green-800/30 group hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-start mb-2">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                {stats.scheduled}
              </p>
              <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mt-2">{t.statsDueToday}</p>
            </div>

            <div className="p-5 bg-amber-50/50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-800/30 group hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-start mb-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                {stats.efficiency}
              </p>
              <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mt-2">{t.statsAiEfficiency}</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate("virality")}
            className="w-full mt-6 py-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl text-xs font-bold text-gray-600 dark:text-gray-300 transition-all border border-gray-100 dark:border-gray-600 uppercase tracking-widest"
          >
            {t.statsDetailedReport}
          </button>
        </motion.div>
      </div>
    </>
  );
}
