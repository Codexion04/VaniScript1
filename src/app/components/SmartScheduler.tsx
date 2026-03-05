import { Calendar as CalendarIcon, Clock, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';

export function SmartScheduler() {
  const peakTimes = [
    { day: 'Mon', time: '6 PM', score: 85 },
    { day: 'Wed', time: '8 PM', score: 92 },
    { day: 'Fri', time: '7 PM', score: 88 },
  ];

  const nextWeek = [
    { date: '27', day: 'Mon', isPeak: true },
    { date: '28', day: 'Tue', isPeak: false },
    { date: '29', day: 'Wed', isPeak: true },
    { date: '1', day: 'Thu', isPeak: false },
    { date: '2', day: 'Fri', isPeak: true },
    { date: '3', day: 'Sat', isPeak: false },
    { date: '4', day: 'Sun', isPeak: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gradient-to-br from-white to-green-50/50 dark:from-gray-800 dark:to-green-900/20 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
          <CalendarIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Smart Scheduler</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">Peak engagement times</p>
        </div>
      </div>

      {/* Mini Calendar */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {nextWeek.map((day, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.05 }}
            className={`aspect-square rounded-xl flex flex-col items-center justify-center text-center transition-all ${
              day.isPeak
                ? 'bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            <span className="text-xs font-medium mb-0.5">{day.day}</span>
            <span className="text-lg font-bold">{day.date}</span>
            {day.isPeak && <Zap className="w-3 h-3 mt-0.5" />}
          </motion.div>
        ))}
      </div>

      {/* Peak Times List */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm mb-2">
          <Clock className="w-4 h-4 text-[#2563EB]" />
          <span className="font-medium text-gray-900 dark:text-white">Top Engagement Times:</span>
        </div>
        {peakTimes.map((peak, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold">
                {peak.day}
              </div>
              <span className="text-sm text-gray-900 dark:text-white font-medium">{peak.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-16 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  style={{ width: `${peak.score}%` }}
                />
              </div>
              <span className="text-xs font-medium text-green-600 dark:text-green-400 ml-1">
                {peak.score}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <Button className="w-full h-11 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl shadow-lg shadow-green-500/30">
        <CalendarIcon className="w-4 h-4 mr-2" />
        Schedule Now
      </Button>
    </motion.div>
  );
}
