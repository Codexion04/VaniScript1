import { API_URL } from "../../config";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
    Trash2,
    Calendar,
    Search,
    Copy,
    Check,
    Filter,
    Linkedin,
    Twitter,
    Instagram,
    Plus,
    RefreshCcw,
    Archive,
    Share2
} from "lucide-react";
import { Button } from "./ui/button";
import { translations } from "../translations";

interface Post {
    userId: string;
    title: string;
    content: string;
    platform: string;
    createdAt: string;
}

interface MyPostsPageProps {
    onNavigate: (view: "home" | "scheduler" | "virality" | "posts" | "discovery" | "settings") => void;
    uiLanguage: string;
}

export function MyPostsPage({ onNavigate, uiLanguage }: MyPostsPageProps) {
    const t = translations[uiLanguage] || translations["English"];
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPlatform, setFilterPlatform] = useState("All");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/my-posts`);
            const data = await res.json();
            setPosts(data.posts || []);
        } catch (error) {
            console.error("Fetch posts error:", error);
        } finally {
            setLoading(false);
        }
    };

    const deletePost = async (userId: string) => {
        try {
            const res = await fetch(`${API_URL}/delete-post`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            if (res.ok) {
                setPosts(posts.filter((p) => p.userId !== userId));
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleCopy = (content: string, id: string) => {
        navigator.clipboard.writeText(content);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const filteredPosts = posts.filter(post => {
        const title = post?.title || "";
        const content = post?.content || "";
        const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterPlatform === "All" || (post?.platform && post.platform.toLowerCase() === filterPlatform.toLowerCase());
        return matchesSearch && matchesFilter;
    });

    const getPlatformIcon = (platform: string) => {
        switch (platform?.toLowerCase()) {
            case 'linkedin': return <Linkedin className="w-4 h-4" />;
            case 'twitter': return <Twitter className="w-4 h-4" />;
            case 'instagram': return <Instagram className="w-4 h-4" />;
            default: return <Share2 className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t.libTitle}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{t.libSubtitle}</p>
                </motion.div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={fetchPosts}
                        className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-2xl"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        {t.libRefresh}
                    </Button>
                    <Button
                        onClick={() => onNavigate('home')}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-500/20"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        {t.libNewPost}
                    </Button>
                </div>
            </div>

            {/* STATS OVERVIEW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                        <Archive className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t.libTotalPostsLabel}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{posts.length}</p>
                    </div>
                </div>
            </div>

            {/* SEARCH AND FILTERS */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder={t.libSearchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 h-12 bg-gray-50 dark:bg-gray-700/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" className="rounded-2xl h-12 px-6">
                        <Filter className="w-4 h-4 mr-2" />
                        {t.libFilter}
                    </Button>
                </div>
            </div>

            {/* CONTENT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map((i) => (
                        <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-3xl" />
                    ))
                ) : filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <motion.div
                            key={post.userId}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-[32px] shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 relative overflow-hidden group"
                        >
                            <div className="flex justify-between items-start relative z-10">
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${post.platform === 'LinkedIn' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                    post.platform === 'Twitter' ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' :
                                        'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                                    }`}>
                                    {getPlatformIcon(post.platform)}
                                    {post.platform}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleCopy(post.content, post.userId)}
                                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                                    >
                                        {copiedId === post.userId ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => deletePost(post.userId)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3 relative z-10">
                                <h3 className="font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 min-h-[3rem]">
                                    {post.title || "Social Media Strategy"}
                                </h3>

                                <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                                    <Calendar className="w-3 h-3 text-blue-500" />
                                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}
                                </div>

                                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-5 leading-relaxed whitespace-pre-wrap">
                                        {post?.content || 'No content available'}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3 relative z-10">
                                <Button
                                    variant="outline"
                                    className="flex-1 rounded-xl h-10 text-xs font-semibold border-gray-200 dark:border-gray-700"
                                    onClick={() => handleCopy(post.content, post.userId)}
                                >
                                    {t.libCopyAll}
                                </Button>
                                <Button
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl h-10 text-xs font-semibold shadow-lg shadow-blue-500/20"
                                    onClick={() => alert(t.libPublishFeature)}
                                >
                                    {t.stPublishNow}
                                </Button>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                            <Archive className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.libNoContent}</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                            {searchQuery ? t.libTrySearching : t.libStartGenerating}
                        </p>
                        {!searchQuery && (
                            <Button
                                onClick={() => onNavigate('home')}
                                className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 rounded-2xl"
                            >
                                {t.libGenerateFirst}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
