import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, Sparkles, TrendingUp, Lightbulb, ArrowRight, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { translations } from "../translations";
import VoiceRecorder from "./VoiceRecorder";

interface DiscoveryPageProps {
    onUseIdea: (idea: string) => void;
    uiLanguage: string;
    setUiLanguage: (lang: string) => void;
}

export function DiscoveryPage({ onUseIdea, uiLanguage, setUiLanguage }: DiscoveryPageProps) {
    const t = translations[uiLanguage] || translations["English"];
    const [niche, setNiche] = useState("");
    const [topics, setTopics] = useState<string>("");
    const [ideas, setIdeas] = useState<string>("");
    const [loading, setLoading] = useState({ topics: false, ideas: false });
    const [detectedLanguage, setDetectedLanguage] = useState<string>(uiLanguage);

    // Sync detectedLanguage with uiLanguage when props change
    useEffect(() => {
        setDetectedLanguage(uiLanguage);
    }, [uiLanguage]);

    const handleLanguageDetected = (code: string) => {
        const langMap: Record<string, string> = {
            "en-IN": "English",
            "hi-IN": "Hindi",
            "mr-IN": "Marathi",
            "ta-IN": "Tamil"
        };
        const lang = langMap[code] || uiLanguage;
        setDetectedLanguage(lang);

        // Only auto-switch UI if it's one of our target Indic languages
        // This prevents English loanwords like "AI" from accidentally flipping the entire UI to English
        if (lang === "Hindi" || lang === "Marathi" || lang === "Tamil") {
            setUiLanguage(lang);
        }
    };

    const handleTranscript = (text: string) => {
        setNiche((prev) => (prev ? prev + " " + text : text));
    };

    const fetchTrendingTopics = async () => {
        if (!niche) return;
        setLoading(prev => ({ ...prev, topics: true }));
        try {
            const res = await fetch("http://localhost:5000/trending-topics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ niche, language: uiLanguage }),
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
                body: JSON.stringify({ niche, language: uiLanguage }),
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t.discTitle}</h1>
                <p className="text-gray-600 dark:text-gray-400">{t.discSubtitle}</p>
            </motion.div>

            {/* SEARCH CARD */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-[40px] shadow-2xl border border-blue-100 dark:border-gray-700 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -mr-32 -mt-32" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">
                                {t.discNicheLabel}
                            </label>
                            {detectedLanguage && detectedLanguage !== uiLanguage && (
                                <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-tighter">
                                    ✨ {t.vccDetected}: {detectedLanguage}
                                </span>
                            )}
                        </div>
                        <div className="relative">
                            <Search className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                            <textarea
                                value={niche}
                                onChange={(e) => setNiche(e.target.value)}
                                placeholder={t.discNichePlaceholder}
                                className="w-full pl-12 pr-4 pt-4 min-h-[140px] bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-blue-500 rounded-3xl text-gray-900 dark:text-white transition-all resize-none shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">
                            {t.vccSmartDetection}
                        </label>
                        <VoiceRecorder
                            onTranscript={handleTranscript}
                            onLanguageDetected={handleLanguageDetected}
                            languageCode="auto"
                            uiLanguage={uiLanguage}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <Button
                        onClick={fetchTrendingTopics}
                        disabled={!niche || loading.topics}
                        className="h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-500/20 font-bold transition-all hover:scale-105"
                    >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        {loading.topics ? t.discAnalyzing : t.discFindTrends}
                    </Button>
                    <Button
                        onClick={fetchContentIdeas}
                        disabled={!niche || loading.ideas}
                        className="h-14 px-10 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl shadow-lg shadow-purple-500/20 font-bold transition-all hover:scale-105"
                    >
                        <Lightbulb className="w-4 h-4 mr-2" />
                        {loading.ideas ? t.discGeneratingIdeas : t.discGetIdeas}
                    </Button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* TRENDING TOPICS */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-orange-600" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{t.discTrendingTopics}</h3>
                    </div>
                    {topics ? (
                        <div className="bg-orange-50/50 dark:bg-orange-900/10 p-6 rounded-[32px] border border-orange-100 dark:border-orange-800/50">
                            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{topics}</p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <Button variant="ghost" className="text-orange-600 hover:text-orange-700 hover:bg-orange-100/50 font-bold rounded-xl" onClick={() => navigator.clipboard.writeText(topics)}>
                                    {t.discCopyTrends}
                                </Button>
                                <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50 font-bold rounded-xl" onClick={() => onUseIdea(topics)}>
                                    {t.discUseAsPrompt}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-[32px] gap-4">
                            <TrendingUp className="w-12 h-12 opacity-10" />
                            <p className="font-bold text-sm opacity-50">{t.discSelectNiche}</p>
                        </div>
                    )}
                </motion.div>

                {/* CONTENT IDEAS */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <Lightbulb className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{t.discViralIdeas}</h3>
                    </div>
                    {ideas ? (
                        <div className="bg-purple-50/50 dark:bg-purple-900/10 p-6 rounded-[32px] border border-purple-100 dark:border-purple-800/50">
                            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{ideas}</p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <Button variant="ghost" className="text-purple-600 hover:text-purple-700 hover:bg-purple-100/50 font-bold rounded-xl" onClick={() => navigator.clipboard.writeText(ideas)}>
                                    {t.discCopyIdeas}
                                </Button>
                                <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 font-bold rounded-xl" onClick={() => onUseIdea(ideas)}>
                                    {t.discUseAsPrompt}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-[32px] gap-4">
                            <Lightbulb className="w-12 h-12 opacity-10" />
                            <p className="font-bold text-sm opacity-50">{t.discGetInspired}</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* QUICK TIP */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-[40px] text-white flex items-center justify-between gap-6 shadow-2xl shadow-blue-500/20"
            >
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/20 rounded-[24px] flex items-center justify-center backdrop-blur-md">
                        <Sparkles className="w-8 h-8" />
                    </div>
                    <div>
                        <h4 className="font-black text-xl tracking-tight">{t.discReadyToCreate}</h4>
                        <p className="text-white/80 font-medium">{t.discUsageTip}</p>
                    </div>
                </div>
                <ArrowRight className="w-10 h-10 opacity-30 hidden md:block" />
            </motion.div>
        </div>
    );
}
