import { TrendingUp, Flame } from 'lucide-react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export function ViralityGauge() {
  const viralScore = 78;
  const data = [
    { name: 'Score', value: viralScore },
    { name: 'Remaining', value: 100 - viralScore },
  ];

  const COLORS = ['#2563EB', '#E5E7EB'];

  const insights = [
    { label: 'Engagement', value: 'High', color: 'text-green-600' },
    { label: 'Timing', value: 'Perfect', color: 'text-blue-600' },
    { label: 'Content', value: 'Strong', color: 'text-purple-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-gradient-to-br from-white to-orange-50/50 dark:from-gray-800 dark:to-orange-900/20 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
          <Flame className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Virality Prediction</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">AI-powered insights</p>
        </div>
      </div>

      <div className="relative">
        <ResponsiveContainer width="100%" height={180}>
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
              className="text-4xl font-bold text-gray-900 dark:text-white"
            >
              {viralScore}%
            </motion.div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Viral Potential</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 mt-6">
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-[#2563EB]" />
          <span className="font-medium text-gray-900 dark:text-white">AI Insights:</span>
        </div>
        {insights.map((insight) => (
          <div key={insight.label} className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">{insight.label}</span>
            <span className={`font-medium ${insight.color}`}>{insight.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
        <p className="text-xs text-gray-700 dark:text-gray-300">
          <span className="font-medium">💡 Tip:</span> Post between 6-9 PM for maximum engagement
        </p>
      </div>
    </motion.div>
  );
}
