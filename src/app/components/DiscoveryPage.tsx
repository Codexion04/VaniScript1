import { useState } from "react";
import { motion } from "motion/react";
import { Search, Sparkles, TrendingUp, Lightbulb, ArrowRight, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface DiscoveryPageProps {
    onUseIdea: (idea: string) => void;
}

export function DiscoveryPage({ onUseIdea }: DiscoveryPageProps) {
    const [niche, setNiche] = useState("");
    const [topics, setTopics] = useState<string>("");
    const [ideas, setIdeas] = useState<string>("");
    const [loading, setLoading] = useState({ topics: false, ideas: false });

    const fetchTrendingTopics = async () => {
        if (!niche) return;
        setLoading(prev => ({ ...prev, topics: true }));
        try {
            const res = await fetch("http://localhost:5000/trending-topics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ niche }),
            });
            const data = await res.json();
            setTopics(data.topics);
        } catch (error) {
            console.error("Topics error:", error);
        } finally {
            setLoading(prev => ({ ...prev, topics: false }));
        }
    };

    const fetchContentIdeas = async () => {
        if (!niche) return;
        setLoading(prev => ({ ...prev, ideas: true }));
        try {
            const res = await fetch("http://localhost:5000/content-ideas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ niche }),
            });
            const data = await res.json();
            setIdeas(data.ideas);
        } catch (error) {
            console.error("Ideas error:", error);
        } finally {
            setLoading(prev => ({ ...prev, ideas: false }));
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Discovery Hub</h1>
                <p className="text-gray-600 dark:text-gray-400">Discover trending topics and viral ideas for your niche</p>
            </motion.div>

            {/* SEARCH CARD */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-blue-100 dark:border-gray-700"
            >
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Enter Your Niche / Industry</label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={niche}
                                onChange={(e) => setNiche(e.target.value)}
                                placeholder="e.g. Artificial Intelligence, Real Estate, Healthy Cooking..."
                                className="w-full pl-12 pr-4 h-14 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={fetchTrendingTopics}
                            disabled={!niche || loading.topics}
                            className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-500/20"
                        >
                            {loading.topics ? "Analyzing..." : "Find Trends"}
                        </Button>
                        <Button
                            onClick={fetchContentIdeas}
                            disabled={!niche || loading.ideas}
                            className="h-14 px-8 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl shadow-lg shadow-purple-500/20"
                        >
                            {loading.ideas ? "Generating..." : "Get Ideas"}
                        </Button>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* TRENDING TOPICS */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-orange-600" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">Trending Topics</h3>
                    </div>
                    {topics ? (
                        <div className="bg-orange-50/50 dark:bg-orange-900/10 p-6 rounded-2xl border border-orange-100 dark:border-orange-800/50">
                            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{topics}</p>
                            <div className="mt-4 flex gap-3">
                                <Button variant="ghost" className="text-orange-600 hover:text-orange-700 hover:bg-orange-100/50" onClick={() => navigator.clipboard.writeText(topics)}>
                                    Copy Trends
                                </Button>
                                <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50" onClick={() => onUseIdea(topics)}>
                                    Use as Prompt
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-2xl">
                            Select a niche to see what's trending
                        </div>
                    )}
                </motion.div>

                {/* CONTENT IDEAS */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <Lightbulb className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">Viral Content Ideas</h3>
                    </div>
                    {ideas ? (
                        <div className="bg-purple-50/50 dark:bg-purple-900/10 p-6 rounded-2xl border border-purple-100 dark:border-purple-800/50">
                            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{ideas}</p>
                            <div className="mt-4 flex gap-3">
                                <Button variant="ghost" className="text-purple-600 hover:text-purple-700 hover:bg-purple-100/50" onClick={() => navigator.clipboard.writeText(ideas)}>
                                    Copy Ideas
                                </Button>
                                <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50" onClick={() => onUseIdea(ideas)}>
                                    Use as Prompt
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-2xl">
                            Get inspired by AI-generated viral hooks
                        </div>
                    )}
                </motion.div>
            </div>

            {/* QUICK TIP */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-3xl text-white flex items-center justify-between gap-6"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">Ready to create?</h4>
                        <p className="text-white/80">Use these insights in the Voice Command Center to generate your next viral post.</p>
                    </div>
                </div>
                <ArrowRight className="w-8 h-8 opacity-50" />
            </motion.div>
        </div>
    );
}
