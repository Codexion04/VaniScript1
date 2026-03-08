import { TrendingUp, Flame, Users, Heart, Share2, Eye, History, ArrowUpRight, Target, BarChart3 } from "lucide-react";
import { motion } from "motion/react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area
} from "recharts";
import { useEffect, useState } from "react";
import { translations } from "../translations";
import { Button } from "./ui/button";

interface ViralityPredictionPageProps {
  uiLanguage: string;
}

export function ViralityPredictionPage({ uiLanguage }: ViralityPredictionPageProps) {
  const t = translations[uiLanguage] || translations["English"];

  const [history, setHistory] = useState<any[]>([]);
  const [currentMetric, setCurrentMetric] = useState({
    score: 0,
    reach: "0",
    engagement: "0%",
    shares: "0",
    impressions: "0"
  });
  const [analyzeText, setAnalyzeText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const loadHistory = () => {
    const savedHistory = JSON.parse(localStorage.getItem("viralityHistory") || "[]");
    setHistory(savedHistory);

    if (savedHistory.length > 0) {
      const latest = savedHistory[0];
      setCurrentMetric({
        score: parseInt(latest.score) || 0,
        reach: latest.reach || "0",
        engagement: latest.engagement || "0%",
        shares: latest.shares || "0",
        impressions: latest.impressions || "0"
      });
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const analyzeContent = async () => {
    if (!analyzeText.trim()) return;
    setIsAnalyzing(true);

    try {
      const res = await fetch("http://localhost:5000/virality-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post: analyzeText }),
      });

      const data = await res.json();
      const score = data.score || 70;

      const historyEntry = {
        score: score,
        reach: data.reach || "0",
        engagement: data.engagement || "0%",
        shares: data.shares || "0",
        impressions: data.impressions || "0",
        post: analyzeText.slice(0, 100),
        date: new Date().toISOString(),
      };

      setCurrentMetric({
        score,
        reach: data.reach || "0",
        engagement: data.engagement || "0%",
        shares: data.shares || "0",
        impressions: data.impressions || "0"
      });

      const existing = JSON.parse(localStorage.getItem("viralityHistory") || "[]");
      const updated = [historyEntry, ...existing].slice(0, 20);
      localStorage.setItem("viralityHistory", JSON.stringify(updated));
      setHistory(updated);
      setAnalyzeText("");
    } catch (error) {
      console.error("Analysis error:", error);
      alert("Virality analysis failed ❌");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const gaugeData = [
    { name: "Score", value: currentMetric.score },
    { name: "Remaining", value: 100 - currentMetric.score },
  ];

  const COLORS = ["#3B82F6", "#F3F4F6"];

  const defaultTrendData = [
    { time: "Mon", score: 45 },
    { time: "Tue", score: 52 },
    { time: "Wed", score: 48 },
    { time: "Thu", score: 61 },
    { time: "Fri", score: 55 },
    { time: "Sat", score: 67 },
    { time: "Sun", score: currentMetric.score || 70 },
  ];

  const historyData = history.length > 2
    ? history.slice(0, 7).reverse().map((h, i) => ({ time: `P${i + 1}`, score: parseInt(h.score) }))
    : defaultTrendData;

  const clearHistory = () => {
    localStorage.removeItem("viralityHistory");
    setHistory([]);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Area */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{t.vpTitle}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {t.vpSubtitle}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="px-5 py-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">{t.vpAiLive}</p>
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{t.vpActiveSession}</p>
          </div>
        </div>
      </motion.div>

      {/* Analyze Content Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-[32px] shadow-lg border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t.vpAnalyzeContent}</h3>
            <p className="text-xs text-gray-500">{t.vpAnalyzeDesc}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <textarea
            value={analyzeText}
            onChange={(e) => setAnalyzeText(e.target.value)}
            placeholder={t.vpAnalyzePlaceholder}
            className="flex-1 min-h-[80px] bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-3 text-sm text-gray-900 dark:text-white transition-all resize-none"
          />
          <Button
            onClick={analyzeContent}
            disabled={!analyzeText.trim() || isAnalyzing}
            className="self-end h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg font-bold"
          >
            {isAnalyzing ? t.discAnalyzing : t.vpAnalyzeBtn}
          </Button>
        </div>
      </motion.div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {[
          { label: t.vpAudienceReach, value: currentMetric.reach, sub: "+12%", icon: Users, color: "blue" },
          { label: t.vpEngagementRate, value: currentMetric.engagement, sub: "+0.5%", icon: Target, color: "purple" },
          { label: t.vpShareRate, value: currentMetric.shares, sub: "+0.8%", icon: Share2, color: "green" },
          { label: t.vpImpressions, value: currentMetric.impressions, sub: "+5.2k", icon: BarChart3, color: "orange" }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${stat.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20' :
              stat.color === 'purple' ? 'bg-purple-50 dark:bg-purple-900/20' :
                stat.color === 'green' ? 'bg-green-50 dark:bg-green-900/20' :
                  'bg-orange-50 dark:bg-orange-900/20'
              }`}>
              <stat.icon className={`w-6 h-6 ${stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                stat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                  stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
                    'text-orange-600 dark:text-orange-400'
                }`} />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-end gap-2">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</h3>
              <span className="text-[10px] font-bold text-green-500 mb-1">{stat.sub}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gauge Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-1 bg-white dark:bg-gray-800 p-8 rounded-[40px] shadow-xl border border-blue-50 dark:border-gray-700 flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-8">{t.vpOverallScore}</h3>

          <div className="relative w-full aspect-square max-w-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="50%"
                  innerRadius="75%"
                  outerRadius="100%"
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  {gaugeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-6xl font-black text-gray-900 dark:text-white"
              >
                {currentMetric.score}
              </motion.span>
              <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">
                {t.vpPredicted}
              </span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-8 w-full">
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t.vpConfidence}</p>
              <p className="text-lg font-black text-gray-900 dark:text-white">94%</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t.vpStatus}</p>
              <p className="text-lg font-black text-green-500 uppercase">{t.vpOptimal}</p>
            </div>
          </div>
        </motion.div>

        {/* Trend Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-[40px] shadow-xl border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t.vpViralTrend}</h3>
            <div className="flex gap-2">
              {[
                { label: t.vpPeriod24h, value: '24H' },
                { label: t.vpPeriod7d, value: '7D' },
                { label: t.vpPeriod30d, value: '30D' }
              ].map(p => (
                <button key={p.value} className={`px-4 py-1.5 rounded-full text-[10px] font-bold border transition-all ${p.value === '7D' ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-400 border-gray-200 dark:border-gray-600'}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="colorViral" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }} stroke="#E5E7EB" />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', background: 'white' }}
                  cursor={{ stroke: '#2563EB', strokeWidth: 2, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={4} fillOpacity={1} fill="url(#colorViral)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* History Table */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-[40px] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t.vpRecentHistory}</h3>
          <Button variant="ghost" className="text-blue-600 hover:text-blue-700 font-bold text-xs uppercase tracking-widest" onClick={clearHistory}>
            {t.vpClearAll}
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <th className="px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.vpContentPreview}</th>
                <th className="px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.vpDateAnalyzed}</th>
                <th className="px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.vpViralScore}</th>
                <th className="px-8 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.vpAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {history.length > 0 ? history.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 max-w-xs">{item.post}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(item.date).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${item.score}%` }} />
                      </div>
                      <span className="text-xs font-black text-gray-900 dark:text-white">{item.score}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline tracking-widest">
                      {t.vpViewReport}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-gray-400 font-medium">
                    {t.vpNoHistory}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}