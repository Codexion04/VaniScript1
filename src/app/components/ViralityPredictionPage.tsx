import { TrendingUp, Flame, Users, Heart, Share2, Eye, History, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { useEffect, useState } from "react";

export function ViralityPredictionPage() {

  /* ===============================
     STATE 
  =============================== */

  const [history, setHistory] = useState<any[]>([]);
  const [currentMetric, setCurrentMetric] = useState({
    score: 0,
    reach: "0",
    engagement: "0%",
    shares: "0",
    impressions: "0"
  });

  /* ===============================
     LOAD DATA FROM LOCAL STORAGE
  =============================== */

  useEffect(() => {
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
    } else {
      // Fallback to legacy single items if no history exists
      const savedScore = localStorage.getItem("viralityScore");
      const savedReach = localStorage.getItem("viralityReach");
      const savedEngagement = localStorage.getItem("viralityEngagement");
      const savedShares = localStorage.getItem("viralityShares");
      const savedImpressions = localStorage.getItem("viralityImpressions");

      if (savedScore) {
        setCurrentMetric({
          score: parseInt(savedScore) || 0,
          reach: savedReach || "0",
          engagement: savedEngagement || "0%",
          shares: savedShares || "0",
          impressions: savedImpressions || "0"
        });
      }
    }
  }, []);

  /* ===============================
     CHART DATA
  =============================== */

  const scoreData = [
    { name: "Score", value: currentMetric.score },
    { name: "Remaining", value: 100 - currentMetric.score },
  ];

  const COLORS = ["#3B82F6", "#F3F4F6"];
  const DARK_COLORS = ["#3B82F6", "#1F2937"];

  // Generate trend data from history
  const trendData = history.slice(0, 7).reverse().map((h, i) => ({
    name: `Post ${i + 1}`,
    score: parseInt(h.score) || 0,
    engagement: parseFloat(h.engagement) || 0
  }));

  // Default data if history index is low
  const defaultTrendData = [
    { name: "Mon", score: 45, engagement: 4.2 },
    { name: "Tue", score: 52, engagement: 5.1 },
    { name: "Wed", score: 48, engagement: 4.8 },
    { name: "Thu", score: 61, engagement: 6.2 },
    { name: "Fri", score: 55, engagement: 5.5 },
    { name: "Sat", score: 67, engagement: 7.1 },
    { name: "Sun", score: currentMetric.score || 70, engagement: parseFloat(currentMetric.engagement) || 8.2 },
  ];

  const chartData = trendData.length > 2 ? trendData : defaultTrendData;

  const insights = [
    {
      icon: Users,
      label: "Audience Reach",
      value: currentMetric.reach,
      change: "+23%",
      color: "from-blue-500 to-blue-600",
      positive: true,
    },
    {
      icon: Heart,
      label: "Engagement Rate",
      value: currentMetric.engagement,
      change: "+12%",
      color: "from-pink-500 to-pink-600",
      positive: true,
    },
    {
      icon: Share2,
      label: "Share Rate",
      value: currentMetric.shares,
      change: "+18%",
      color: "from-green-500 to-green-600",
      positive: true,
    },
    {
      icon: Eye,
      label: "Impressions",
      value: currentMetric.impressions,
      change: "+15%",
      color: "from-purple-500 to-purple-600",
      positive: true,
    },
  ];

  return (
    <div className="space-y-8 pb-10">

      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Virality Prediction
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time AI analysis for your content orchestration
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-100 dark:border-blue-800/30 text-xs font-bold uppercase tracking-widest">
          <Flame className="w-4 h-4 fill-blue-600" />
          AI Live Analysis
        </div>
      </motion.div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 p-6 group hover:shadow-2xl transition-all duration-300"
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${insight.color} flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
              <insight.icon className="w-7 h-7 text-white" />
            </div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
              {insight.label}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {insight.value}
              </p>
              <div className="flex items-center gap-1 text-green-500 font-bold text-xs bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                <ArrowUpRight className="w-3 h-3" />
                {insight.change}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* SCORE + TRENDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* DONUT CHART */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-[40px] shadow-2xl border border-gray-100 dark:border-gray-700 p-8 flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 blur-[80px] rounded-full" />
          <div className="flex items-center gap-2 mb-8 self-start">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Flame className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Overall Viral Score</h3>
          </div>

          <div className="relative w-full aspect-square max-w-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreData}
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  startAngle={180}
                  endAngle={-180}
                >
                  {scoreData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? COLORS[0] : (document.documentElement.classList.contains('dark') ? DARK_COLORS[1] : COLORS[1])}
                      stroke="none"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-bold text-gray-900 dark:text-white leading-none">
                {currentMetric.score}
              </span>
              <span className="text-xs font-semibold text-gray-500 mt-2">Predicted %</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 w-full">
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Confidence</p>
              <p className="font-bold text-gray-900 dark:text-white">92.4%</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Status</p>
              <p className="font-bold text-blue-600">Optimal</p>
            </div>
          </div>
        </motion.div>

        {/* LINE CHART */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-[40px] shadow-2xl border border-gray-100 dark:border-gray-700 p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-xl">Virality Trend</h3>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-[10px] font-bold text-blue-600">Score</span>
              </div>
            </div>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#2563EB"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* RECENT HISTORY */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-[40px] shadow-2xl border border-gray-100 dark:border-gray-700 p-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <History className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-xl">Recent Analysis History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Content Preview</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Date Analyzed</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Viral Score</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Reach</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {history.length > 0 ? history.map((item, idx) => (
                <tr key={idx} className="group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all">
                  <td className="py-4">
                    <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 max-w-[200px]">
                      {item.post.slice(0, 50)}...
                    </p>
                  </td>
                  <td className="py-4 text-xs font-semibold text-gray-500">
                    {new Date(item.time).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${item.score}%` }} />
                      </div>
                      <span className="text-xs font-black text-gray-900 dark:text-white">{item.score}%</span>
                    </div>
                  </td>
                  <td className="py-4 text-xs font-bold text-gray-700 dark:text-gray-300">
                    {item.reach}
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => {
                        alert(`📝 CONTENT REPORT\n\nPost: ${item.post}\n\nViral Score: ${item.score}%\nReach: ${item.reach}\nEngagement: ${item.engagement}\nAnalyzed on: ${new Date(item.time).toLocaleString()}`);
                      }}
                      className="text-[10px] uppercase font-bold text-blue-600 hover:text-blue-700 tracking-tighter border-b border-blue-600/30"
                    >
                      VIEW REPORT
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                    No history available. Generate some content to see analysis.
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