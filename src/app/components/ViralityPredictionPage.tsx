import { TrendingUp, Flame, Target, Users, Heart, MessageCircle, Share2, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

export function ViralityPredictionPage() {
  const viralScore = 78;
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
    { 
      icon: Users, 
      label: 'Audience Reach', 
      value: '124K', 
      change: '+23%', 
      color: 'from-blue-500 to-blue-600',
      positive: true 
    },
    { 
      icon: Heart, 
      label: 'Engagement Rate', 
      value: '8.4%', 
      change: '+12%', 
      color: 'from-pink-500 to-pink-600',
      positive: true 
    },
    { 
      icon: Share2, 
      label: 'Share Rate', 
      value: '4.2%', 
      change: '+18%', 
      color: 'from-green-500 to-green-600',
      positive: true 
    },
    { 
      icon: Eye, 
      label: 'Impressions', 
      value: '342K', 
      change: '+15%', 
      color: 'from-purple-500 to-purple-600',
      positive: true 
    },
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Virality Prediction
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          AI-powered insights to maximize your content's viral potential
        </p>
      </motion.div>

      {/* Top Metrics Grid */}
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
              <span className={`text-sm font-medium mb-1 ${insight.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {insight.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Virality Score */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-white to-orange-50/50 dark:from-gray-800 dark:to-orange-900/20 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Overall Score</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Your viral potential</p>
            </div>
          </div>

          <div className="relative">
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
                  paddingAngle={0}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center pt-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="text-5xl font-bold text-gray-900 dark:text-white"
                >
                  {viralScore}%
                </motion.div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Viral Score</p>
              </div>
            </div>
          </div>

          {/* Viral Factors */}
          <div className="space-y-3 mt-8">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Key Factors</h4>
            {viralFactors.map((factor, index) => (
              <motion.div
                key={factor.factor}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
              >
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-700 dark:text-gray-300">{factor.factor}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{factor.score}%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${factor.score}%` }}
                    transition={{ duration: 1, delay: 0.8 + index * 0.05 }}
                    className={`h-full ${factor.color} rounded-full`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Engagement Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Engagement Timeline</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Best times for maximum impact</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="engagement" 
                stroke="#2563EB" 
                strokeWidth={3}
                dot={{ fill: '#2563EB', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white mb-1">Optimal Posting Window</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Your audience is most active between <span className="font-semibold text-[#2563EB]">6:00 PM - 9:00 PM</span>. 
                  Posts during this time have 95% higher engagement rate.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
      >
        <h3 className="font-semibold text-gray-900 dark:text-white mb-6">Content Type Performance</h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={contentPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="type" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: 'none', 
                borderRadius: '12px',
                color: '#fff'
              }}
            />
            <Legend />
            <Bar dataKey="score" fill="#2563EB" radius={[8, 8, 0, 0]} name="Virality Score" />
            <Bar dataKey="posts" fill="#7C3AED" radius={[8, 8, 0, 0]} name="Total Posts" />
          </BarChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {contentPerformance.map((content, index) => (
            <motion.div
              key={content.type}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{content.type}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{content.score}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{content.posts} posts</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-800 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">AI Recommendations</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Actionable tips to boost virality</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Use Video Content', desc: 'Videos get 92% higher engagement than images', icon: '🎥' },
            { title: 'Post at 7 PM', desc: 'Peak engagement window for your audience', icon: '⏰' },
            { title: 'Add 5-8 Hashtags', desc: 'Optimal range for maximum reach', icon: '#️⃣' },
            { title: 'Include CTAs', desc: 'Posts with CTAs get 70% more interactions', icon: '👆' },
            { title: 'Use Carousels', desc: 'Carousel posts have 1.4x more reach', icon: '📱' },
            { title: 'Engage Quickly', desc: 'Respond to comments within first hour', icon: '💬' },
          ].map((tip, index) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
            >
              <div className="text-2xl mb-2">{tip.icon}</div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">{tip.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tip.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
