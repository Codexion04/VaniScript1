import { Calendar as CalendarIcon, Clock, Zap, Plus, Edit, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { useState } from 'react';

export function TimeSchedulerPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const peakTimes = [
    { day: 'Monday', time: '6:00 PM - 8:00 PM', score: 85, color: 'from-blue-500 to-blue-600' },
    { day: 'Tuesday', time: '12:00 PM - 2:00 PM', score: 72, color: 'from-purple-500 to-purple-600' },
    { day: 'Wednesday', time: '8:00 PM - 10:00 PM', score: 92, color: 'from-green-500 to-green-600' },
    { day: 'Thursday', time: '7:00 AM - 9:00 AM', score: 68, color: 'from-yellow-500 to-yellow-600' },
    { day: 'Friday', time: '7:00 PM - 9:00 PM', score: 88, color: 'from-orange-500 to-orange-600' },
    { day: 'Saturday', time: '11:00 AM - 1:00 PM', score: 75, color: 'from-pink-500 to-pink-600' },
    { day: 'Sunday', time: '5:00 PM - 7:00 PM', score: 80, color: 'from-indigo-500 to-indigo-600' },
  ];

  const scheduledPosts = [
    { id: 1, title: 'DSA Certificate Post', platform: 'LinkedIn', date: 'Feb 28, 2026', time: '7:30 PM', status: 'scheduled' },
    { id: 2, title: 'Product Launch Announcement', platform: 'Instagram', date: 'Mar 1, 2026', time: '6:00 PM', status: 'scheduled' },
    { id: 3, title: 'Weekly Tech Tips', platform: 'X (Twitter)', date: 'Mar 2, 2026', time: '8:00 PM', status: 'scheduled' },
    { id: 4, title: 'Behind the Scenes', platform: 'Instagram', date: 'Mar 3, 2026', time: '5:30 PM', status: 'scheduled' },
  ];

  const daysInMonth = Array.from({ length: 28 }, (_, i) => i + 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Time Scheduler
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Schedule your posts at optimal times for maximum engagement
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-900 dark:text-white">February 2026</h2>
            <Button className="h-10 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-xl shadow-lg shadow-blue-500/30">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Post
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-3 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3">
            {daysInMonth.map((day) => {
              const hasScheduled = [5, 8, 12, 15, 20, 24, 28].includes(day);
              return (
                <motion.button
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDate(`Feb ${day}`)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all relative ${
                    selectedDate === `Feb ${day}`
                      ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-500/30'
                      : hasScheduled
                      ? 'bg-green-100 dark:bg-green-900/30 text-gray-900 dark:text-white hover:bg-green-200 dark:hover:bg-green-900/50'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="text-lg font-medium">{day}</span>
                  {hasScheduled && (
                    <div className="absolute bottom-1 w-1.5 h-1.5 bg-green-500 rounded-full" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Peak Times Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-white to-green-50/50 dark:from-gray-800 dark:to-green-900/20 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Peak Times</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Best times to post</p>
            </div>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {peakTimes.map((peak, index) => (
              <motion.div
                key={peak.day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="p-4 bg-white dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{peak.day}</h4>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                    {peak.score}% optimal
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>{peak.time}</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${peak.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${peak.score}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scheduled Posts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
      >
        <h2 className="font-semibold text-gray-900 dark:text-white mb-6">Scheduled Posts</h2>
        
        <div className="space-y-4">
          {scheduledPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">{post.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.time}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                      {post.platform}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-9 px-3 rounded-lg">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="h-9 px-3 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
