import { TrendingUp, Flame, Target, Users, Heart, Share2, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { useEffect, useState } from 'react';

export function ViralityPredictionPage() {

  /* 🔥 GET SCORE FROM LOCAL STORAGE */

  const [viralScore, setViralScore] = useState(78);

  useEffect(() => {
    const savedScore = localStorage.getItem("viralityScore");

    if (savedScore) {
      const numericScore = parseInt(savedScore);
      if (!isNaN(numericScore)) {
        setViralScore(numericScore);
      }
    }
  }, []);

  const data = [
    { name: 'Score', value: viralScore },
    { name: 'Remaining', value: 100 - viralScore },
  ];

  const COLORS = ['#2563EB', '#E5E7EB'];

  const engagementData = [
    { time: '6 AM', engagement: 45 },
    { time: '9 AM', engagement: 62 },
    { time: '12 PM', engagement: 78 },
    { time: '3 PM', engagement: 85 },
    { time: '6 PM', engagement: 95 },
    { time: '9 PM', engagement: 88 },
    { time: '12 AM', engagement: 42 },
  ];

  const contentPerformance = [
    { type: 'Images', score: 85, posts: 45 },
    { type: 'Videos', score: 92, posts: 28 },
    { type: 'Carousels', score: 78, posts: 32 },
    { type: 'Text Only', score: 65, posts: 20 },
  ];

  const insights = [
    { icon: Users, label: 'Audience Reach', value: '124K', change: '+23%', color: 'from-blue-500 to-blue-600', positive: true },
    { icon: Heart, label: 'Engagement Rate', value: '8.4%', change: '+12%', color: 'from-pink-500 to-pink-600', positive: true },
    { icon: Share2, label: 'Share Rate', value: '4.2%', change: '+18%', color: 'from-green-500 to-green-600', positive: true },
    { icon: Eye, label: 'Impressions', value: '342K', change: '+15%', color: 'from-purple-500 to-purple-600', positive: true },
  ];

  const viralFactors = [
    { factor: 'Content Quality', score: 92, color: 'bg-green-500' },
    { factor: 'Timing', score: 88, color: 'bg-blue-500' },
    { factor: 'Hashtag Optimization', score: 75, color: 'bg-yellow-500' },
    { factor: 'Audience Relevance', score: 85, color: 'bg-purple-500' },
    { factor: 'Call-to-Action', score: 70, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Virality Prediction
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          AI-powered insights to maximize your content's viral potential
        </p>
      </motion.div>

      {/* Top Metrics */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${insight.color} flex items-center justify-center shadow-lg`}>
                <insight.icon className="w-6 h-6 text-white" />
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{insight.label}</p>

            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{insight.value}</p>
              <span className={`text-sm font-medium mb-1 ${insight.positive ? 'text-green-600' : 'text-red-600'}`}>
                {insight.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Viral Score */}

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-lg border p-6"
        >

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>

            <div>
              <h3 className="font-semibold">Overall Score</h3>
              <p className="text-xs text-gray-500">Your viral potential</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="text-center -mt-28">
            <div className="text-5xl font-bold text-gray-900">
              {viralScore}%
            </div>
            <p className="text-sm text-gray-600">Viral Score</p>
          </div>

        </motion.div>

        {/* Engagement Timeline */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:col-span-2 bg-white rounded-3xl shadow-lg border p-6"
        >

          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">Engagement Timeline</h3>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="engagement" stroke="#2563EB" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>

        </motion.div>
      </div>

      {/* Content Performance */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-3xl shadow-lg border p-6"
      >

        <h3 className="font-semibold mb-6">Content Type Performance</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={contentPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#2563EB" name="Virality Score" />
            <Bar dataKey="posts" fill="#7C3AED" name="Total Posts" />
          </BarChart>
        </ResponsiveContainer>

      </motion.div>

    </div>
  );
}