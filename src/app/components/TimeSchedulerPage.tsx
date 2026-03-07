import { Calendar as CalendarIcon, Clock, Zap, Plus, Edit, Trash2, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';

interface ScheduledPost {
  id: string;
  title: string;
  platform: string;
  date: string;
  time: string;
  status: 'scheduled';
}

export function TimeSchedulerPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newPlatform, setNewPlatform] = useState("LinkedIn");

  // AI Tool State
  const [aiTopic, setAiTopic] = useState("");
  const [aiPlatform, setAiPlatform] = useState("LinkedIn");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");

  // Load posts from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("scheduledPosts");
    if (saved) {
      setScheduledPosts(JSON.parse(saved));
    } else {
      // Default sample data
      const sample = [
        { id: '1', title: 'DSA Certificate Post', platform: 'LinkedIn', date: '2026-02-28', time: '19:30', status: 'scheduled' },
        { id: '2', title: 'Weekly Tech Tips', platform: 'X (Twitter)', date: '2026-03-02', time: '20:00', status: 'scheduled' },
      ];
      setScheduledPosts(sample as ScheduledPost[]);
      localStorage.setItem("scheduledPosts", JSON.stringify(sample));
    }
  }, []);

  const savePosts = (posts: ScheduledPost[]) => {
    setScheduledPosts(posts);
    localStorage.setItem("scheduledPosts", JSON.stringify(posts));
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate || !newTime) return;

    const post: ScheduledPost = {
      id: Date.now().toString(),
      title: newTitle,
      platform: newPlatform,
      date: newDate,
      time: newTime,
      status: 'scheduled'
    };

    savePosts([post, ...scheduledPosts]);
    setIsModalOpen(false);
    setNewTitle("");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this post from schedule?")) {
      const filtered = scheduledPosts.filter(p => p.id !== id);
      savePosts(filtered);
    }
  };

  const fetchBestTimes = async () => {
    if (!aiTopic) return;
    setAiLoading(true);
    try {
      const res = await fetch("http://localhost:5000/best-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: aiTopic, platform: aiPlatform }),
      });
      const data = await res.json();
      setAiResult(data.bestTime);
    } catch (error) {
      console.error("Best time error:", error);
    } finally {
      setAiLoading(false);
    }
  };

  const peakTimes = [
    { day: 'Monday', time: '6:00 PM - 8:00 PM', score: 85, color: 'from-blue-500 to-blue-600' },
    { day: 'Tuesday', time: '12:00 PM - 2:00 PM', score: 72, color: 'from-purple-500 to-purple-600' },
    { day: 'Wednesday', time: '8:00 PM - 10:00 PM', score: 92, color: 'from-green-500 to-green-600' },
    { day: 'Thursday', time: '7:00 AM - 9:00 AM', score: 68, color: 'from-yellow-500 to-yellow-600' },
    { day: 'Friday', time: '7:00 PM - 9:00 PM', score: 88, color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Time Scheduler
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize and automate your social presence
          </p>
        </motion.div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-500/20 font-bold"
        >
          <Plus className="w-5 h-5 mr-2" />
          Schedule New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CalendarIcon className="text-blue-500" />
              March 2026
            </h2>
          </div>

          <div className="grid grid-cols-7 gap-4 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const dateStr = `2026-03-${day.toString().padStart(2, '0')}`;
              const hasScheduled = scheduledPosts.some(p => p.date === dateStr);
              return (
                <motion.button
                  key={day}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setNewDate(dateStr);
                    setSelectedDate(dateStr);
                  }}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all relative group ${selectedDate === dateStr
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/40 ring-4 ring-blue-500/20'
                    : hasScheduled
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-2 border-green-100 dark:border-green-800'
                      : 'bg-gray-50 dark:bg-gray-900/50 text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg'
                    }`}
                >
                  <span className="text-base font-bold">{day}</span>
                  {hasScheduled && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* AI Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[32px] shadow-2xl p-8 text-white relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              </div>
              <h3 className="font-bold text-lg">AI Strategy</h3>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Topic: Launch, Update..."
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className="w-full h-12 px-5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/50 outline-none transition-all"
              />
              <select
                value={aiPlatform}
                onChange={(e) => setAiPlatform(e.target.value)}
                className="w-full h-12 px-5 bg-white/10 border border-white/20 rounded-2xl text-white focus:ring-2 focus:ring-white/50 outline-none"
              >
                <option value="LinkedIn" className="text-black">LinkedIn</option>
                <option value="Instagram" className="text-black">Instagram</option>
                <option value="X" className="text-black">X (Twitter)</option>
              </select>
              <Button
                onClick={fetchBestTimes}
                disabled={!aiTopic || aiLoading}
                className="w-full h-12 bg-white text-indigo-700 hover:bg-gray-50 font-bold rounded-2xl shadow-lg"
              >
                {aiLoading ? "Analyzing..." : "Calculate Best Time"}
              </Button>
            </div>
            {aiResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 p-4 bg-white/10 rounded-2xl border border-white/20 text-xs shadow-inner"
              >
                <p className="font-bold text-[10px] uppercase tracking-[0.2em] mb-2 text-white/70 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  Strategic Insights
                </p>
                <div className="space-y-1.5 font-medium leading-relaxed whitespace-pre-line text-white/90">
                  {aiResult.trim()}
                </div>
              </motion.div>
            )}
          </div>

          <div className="bg-gradient-to-br from-white to-green-50/50 dark:from-gray-800 dark:to-green-900/20 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Peak Times</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Best times to post</p>
              </div>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {peakTimes.map((peak, index) => (
                <motion.div
                  key={peak.day}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="p-4 bg-white dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{peak.day}</h4>
                    <span className="text-xs font-bold text-green-600 dark:text-green-400">
                      {peak.score}% optimal
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{peak.time}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-[1px]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${peak.score}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className={`h-full bg-gradient-to-r ${peak.color} rounded-full`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scheduled Posts */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Up Next</h2>
        <div className="space-y-4">
          {scheduledPosts.length === 0 ? (
            <div className="py-12 text-center bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-bold">No posts scheduled yet</p>
              <Button variant="outline" className="mt-4 rounded-xl" onClick={() => setIsModalOpen(true)}>Create One Now</Button>
            </div>
          ) : (
            scheduledPosts.map((post) => (
              <motion.div
                key={post.id}
                layout
                className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-gray-50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-800 rounded-3xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all shadow-sm hover:shadow-xl"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                    <CalendarIcon />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">{post.title}</h4>
                    <div className="flex flex-wrap gap-4 mt-1 text-xs font-semibold">
                      <span className="flex items-center gap-1.5 text-blue-600">
                        <CalendarIcon className="w-4 h-4" /> {post.date}
                      </span>
                      <span className="flex items-center gap-1.5 text-purple-600">
                        <Clock className="w-4 h-4" /> {post.time}
                      </span>
                      <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full uppercase tracking-tighter">
                        {post.platform}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="outline" size="sm" className="rounded-xl h-10 w-10 p-0 border-gray-200 dark:border-gray-700">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    className="rounded-xl h-10 w-10 p-0 text-red-500 border-red-100 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Scheduler Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-[32px] p-8 shadow-2xl border border-white/5"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="text-blue-500" />
                  Schedule Post
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleAddPost} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-500 ml-1">Title</label>
                  <input
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="E.g. Project Launch"
                    className="w-full h-14 bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-blue-500 rounded-2xl px-6 outline-none transition-all dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-500 ml-1">Date</label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full h-14 bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-blue-500 rounded-2xl px-4 outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-500 ml-1">Time</label>
                    <input
                      type="time"
                      required
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full h-14 bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-blue-500 rounded-2xl px-4 outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-500 ml-1">Platform</label>
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    className="w-full h-14 bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-blue-500 rounded-2xl px-6 outline-none transition-all dark:text-white"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Instagram">Instagram</option>
                    <option value="X (Twitter)">X (Twitter)</option>
                    <option value="Facebook">Facebook</option>
                  </select>
                </div>

                <Button type="submit" className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/30 text-lg">
                  Confirm Schedule
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
