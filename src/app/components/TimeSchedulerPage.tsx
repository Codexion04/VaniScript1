import { Calendar, Clock, Zap, Plus, Edit, Trash2, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { translations } from '../translations';

interface ScheduledPost {
  id: string;
  title: string;
  platform: string;
  date: string;
  time: string;
  status: 'scheduled';
}

interface TimeSchedulerPageProps {
  uiLanguage: string;
}

export function TimeSchedulerPage({ uiLanguage }: TimeSchedulerPageProps) {
  const t = translations[uiLanguage] || translations["English"];
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newPlatform, setNewPlatform] = useState("LinkedIn");

  // Load posts from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("scheduledPosts");
    if (saved) {
      setScheduledPosts(JSON.parse(saved));
    } else {
      const sample = [
        { id: '1', title: 'DSA Certificate Post', platform: 'LinkedIn', date: new Date().toISOString().split('T')[0], time: '19:30', status: 'scheduled' },
        { id: '2', title: 'Weekly Tech Tips', platform: 'X (Twitter)', date: new Date().toISOString().split('T')[0], time: '20:00', status: 'scheduled' },
      ];
      setScheduledPosts(sample as ScheduledPost[]);
      localStorage.setItem("scheduledPosts", JSON.stringify(sample));
    }
  }, []);

  const savePosts = (posts: ScheduledPost[]) => {
    setScheduledPosts(posts);
    localStorage.setItem("scheduledPosts", JSON.stringify(posts));
  };

  const resetForm = () => {
    setNewTitle("");
    setNewDate("");
    setNewTime("");
    setNewPlatform("LinkedIn");
    setEditingPost(null);
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate || !newTime) return;

    if (editingPost) {
      const updated = scheduledPosts.map(p =>
        p.id === editingPost.id
          ? { ...p, title: newTitle, platform: newPlatform, date: newDate, time: newTime }
          : p
      );
      savePosts(updated);
    } else {
      const post: ScheduledPost = {
        id: Date.now().toString(),
        title: newTitle,
        platform: newPlatform,
        date: newDate,
        time: newTime,
        status: 'scheduled'
      };
      savePosts([post, ...scheduledPosts]);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (post: ScheduledPost) => {
    setEditingPost(post);
    setNewTitle(post.title);
    setNewDate(post.date);
    setNewTime(post.time);
    setNewPlatform(post.platform);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(t.scConfirmDeletePost)) {
      const filtered = scheduledPosts.filter(p => p.id !== id);
      savePosts(filtered);
    }
  };

  const handleAutoSchedule = () => {
    const updated = scheduledPosts.map(post => ({
      ...post,
      time: ["14:15", "15:45", "19:00", "20:30"][Math.floor(Math.random() * 4)]
    }));
    savePosts(updated);
    alert(t.scAutoScheduleAlert);
  };

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00", "22:00"
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin': return <Zap className="w-4 h-4 text-blue-500" />;
      case 'twitter':
      case 'x':
      case 'x (twitter)': return <Zap className="w-4 h-4 text-sky-500" />;
      case 'instagram': return <Zap className="w-4 h-4 text-purple-500" />;
      default: return <Zap className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{t.scTitle}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            {t.scSubtitle}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl border-gray-100 dark:border-gray-700 h-12 px-6 bg-white dark:bg-gray-800 font-bold text-xs uppercase tracking-widest">
            <Calendar className="w-4 h-4 mr-2" />
            {t.scFullCalendar}
          </Button>
          <Button
            onClick={handleAutoSchedule}
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg h-12 px-6 font-bold text-xs uppercase tracking-widest"
          >
            <Zap className="w-4 h-4 mr-2" />
            {t.scAutoSchedule}
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TIMELINE VIEW */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-[40px] shadow-sm border border-gray-50 dark:border-gray-700 overflow-hidden">
            <div className="p-8 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
                <Clock className="w-5 h-5 text-blue-600" />
                {t.scTodaysTimeline}
              </h3>
              <div className="flex bg-gray-50 dark:bg-gray-700/50 p-1 rounded-2xl">
                <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest bg-white dark:bg-gray-600 text-blue-600 dark:text-white rounded-xl shadow-sm">{t.scDay}</button>
                <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">{t.scWeek}</button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {timeSlots.map((slot) => {
                const post = scheduledPosts.find(p => p.time === slot);
                return (
                  <div key={slot} className="flex gap-6 group">
                    <div className="w-20 pt-2 text-right">
                      <span className="text-[10px] font-black text-gray-300 group-hover:text-blue-500 transition-colors uppercase tracking-[0.2em]">{slot}</span>
                    </div>
                    <div className="flex-1 min-h-[100px] relative">
                      {/* LINE */}
                      <div className="absolute left-[-24px] top-0 bottom-0 w-px bg-gray-50 dark:bg-gray-700" />
                      <div className="absolute left-[-29px] top-3 w-2.5 h-2.5 rounded-full border-4 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-600 group-hover:bg-blue-500 group-hover:scale-150 transition-all z-10" />

                      {post ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`p-5 rounded-3xl border border-transparent shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all ${post.platform.toLowerCase() === 'linkedin' ? 'bg-blue-50/50 dark:bg-blue-900/10 hover:border-blue-200' :
                            post.platform.toLowerCase() === 'x (twitter)' || post.platform.toLowerCase() === 'twitter' ? 'bg-sky-50/50 dark:bg-sky-900/10 hover:border-sky-200' :
                              'bg-purple-50/50 dark:bg-purple-900/10 hover:border-purple-200'
                            }`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                              {getPlatformIcon(post.platform)}
                              {post.platform}
                            </span>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 rounded-xl" onClick={() => handleEdit(post)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500 rounded-xl" onClick={() => handleDelete(post.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-900 dark:text-gray-100 font-bold leading-relaxed">{post.title}</p>
                        </motion.div>
                      ) : (
                        <button
                          onClick={() => { resetForm(); setIsModalOpen(true); setNewTime(slot); }}
                          className="w-full h-full border-2 border-dashed border-gray-50 dark:border-gray-700/50 rounded-3xl flex items-center justify-center text-gray-300 dark:text-gray-600 hover:border-blue-200 dark:hover:border-blue-900/50 hover:bg-blue-50/10 transition-all font-black text-[10px] uppercase tracking-widest gap-2 group/btn"
                        >
                          <Plus className="w-4 h-4 group-hover/btn:scale-125 transition-transform" />
                          {t.scSchedulePost}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ANALYTICS & TOOLS */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* SMART SCHEDULER WIDGET */}
          <div className="bg-gradient-to-br from-indigo-700 via-blue-600 to-indigo-800 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full -mb-32 -mr-32 group-hover:scale-110 transition-transform duration-1000" />
            <h3 className="text-xl font-black mb-3 flex items-center gap-2 tracking-tight">
              <Sparkles className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              {t.scAiInsights}
            </h3>
            <p className="text-indigo-100/80 text-xs mb-8 leading-relaxed font-medium">
              {t.scInsightDescription}
            </p>

            <div className="space-y-4">
              <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-xl border border-white/10">
                <p className="text-[10px] uppercase font-black text-indigo-200 mb-1 tracking-widest">{t.scBestTime}</p>
                <p className="text-2xl font-black">2:15 PM - 3:45 PM</p>
              </div>
              <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-xl border border-white/10">
                <p className="text-[10px] uppercase font-black text-indigo-200 mb-1 tracking-widest">{t.scExpectedBoost}</p>
                <p className="text-2xl font-black text-green-300">+42% AI Engagement</p>
              </div>
            </div>

            <Button onClick={handleAutoSchedule} className="w-full mt-8 h-14 bg-white text-indigo-600 hover:bg-indigo-50 rounded-2xl font-bold shadow-xl shadow-black/10 text-xs uppercase tracking-widest">
              {t.scApplyOptimized}
            </Button>
          </div>

          {/* WEEKLY OVERVIEW */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[40px] shadow-sm border border-gray-50 dark:border-gray-700">
            <h3 className="font-black text-gray-900 dark:text-white mb-8 text-sm uppercase tracking-widest text-center">{t.scWeeklyActivity}</h3>
            <div className="flex items-end justify-between h-32 gap-3 mb-8">
              {[45, 62, 35, 84, 55, 92, 40].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05 }}
                    className={`w-full rounded-xl transition-all duration-500 ${i === 5 ? 'bg-blue-600 shadow-lg shadow-blue-500/20' : 'bg-blue-50 dark:bg-gray-700'}`}
                  />
                  <span className="text-[10px] font-black text-gray-300">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-50 dark:border-gray-700">
              <div className="text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.scTotalScheduled}</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{scheduledPosts.length}</p>
              </div>
              <div className="text-center border-l border-gray-50 dark:border-gray-700">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.scAvgEngagement}</p>
                <p className="text-2xl font-black text-blue-600">5.8%</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* UP NEXT */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-[40px] shadow-xl border border-gray-50 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">{t.scUpNext}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scheduledPosts.length === 0 ? (
            <div className="col-span-2 py-12 text-center bg-gray-50 dark:bg-gray-900/50 rounded-[40px] border-2 border-dashed border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-400 font-bold text-sm">{t.scNoPosts}</p>
              <Button variant="outline" className="mt-6 rounded-2xl h-12 px-8 font-bold text-xs uppercase tracking-widest border-gray-200" onClick={() => { resetForm(); setIsModalOpen(true); }}>{t.scCreateOne}</Button>
            </div>
          ) : (
            scheduledPosts.map((post) => (
              <motion.div
                key={post.id}
                layout
                className="group flex items-center justify-between p-6 bg-gray-50/50 dark:bg-gray-900/30 hover:bg-white dark:hover:bg-gray-800 rounded-[32px] border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-all shadow-sm hover:shadow-xl"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${post.platform.toLowerCase() === 'linkedin' ? 'bg-blue-600' :
                    post.platform.toLowerCase() === 'instagram' ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600' :
                      'bg-gray-900'
                    }`}>
                    {getPlatformIcon(post.platform)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-base line-clamp-1">{post.title}</h4>
                    <div className="flex gap-4 mt-1 text-[10px] font-black uppercase tracking-widest">
                      <span className="flex items-center gap-1.5 text-blue-500">
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1.5 text-purple-500">
                        {post.time}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-blue-600 rounded-xl" onClick={() => handleEdit(post)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-red-500 rounded-xl" onClick={() => handleDelete(post.id)}>
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
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-[40px] p-10 shadow-2xl border border-white/10"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                    <Sparkles className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                      {editingPost ? t.scEdit : t.scSchedulePost}
                    </h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{editingPost ? "Refine details" : "Create new event"}</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleAddPost} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">{t.scPostTitle}</label>
                  <input
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Project Viral Launch"
                    className="w-full h-16 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 rounded-2xl px-6 outline-none transition-all font-bold dark:text-white text-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">{t.scPostDate}</label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full h-16 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 rounded-2xl px-4 outline-none transition-all font-bold dark:text-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">{t.scPostTime}</label>
                    <input
                      type="time"
                      required
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full h-16 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 rounded-2xl px-4 outline-none transition-all font-bold dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">{t.scPostPlatform}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["LinkedIn", "Instagram", "X (Twitter)", "Facebook"].map(plat => (
                      <button
                        key={plat}
                        type="button"
                        onClick={() => setNewPlatform(plat)}
                        className={`h-14 rounded-2xl font-bold text-sm transition-all border-2 ${newPlatform === plat
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                          : "bg-gray-50 dark:bg-gray-800 border-transparent text-gray-500 hover:border-gray-200"
                          }`}
                      >
                        {plat}
                      </button>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full h-16 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-[24px] font-black shadow-2xl text-lg uppercase tracking-widest">
                  {editingPost ? t.vccSave : t.scConfirmSchedule}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
