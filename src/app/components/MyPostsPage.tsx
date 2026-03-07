import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
    Trash2,
    Sparkles,
    Calendar,
    Share2,
    Search,
    Copy,
    Check,
    ExternalLink,
    Filter,
    MoreVertical,
    Linkedin,
    Twitter,
    Instagram,
    FileText,
    Plus
} from "lucide-react";
import { Button } from "./ui/button";

interface Post {
    userId: string;
    title: string;
    content: string;
    platform: string;
    createdAt: string;
}

interface MyPostsPageProps {
    onNavigate: (view: "home" | "scheduler" | "virality" | "posts" | "discovery") => void;
}

export function MyPostsPage({ onNavigate }: MyPostsPageProps) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPlatform, setFilterPlatform] = useState("All");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/my-posts");
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
            const res = await fetch("http://localhost:5000/delete-post", {
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
            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                        Content Library
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and repurpose your high-performing AI content</p>
                </motion.div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={fetchPosts}
                        className="rounded-2xl border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        Refresh
                    </Button>
                    <Button
                        onClick={() => onNavigate('home')}
                        className="rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 gap-2"
                    >
                        <Plus className="w-4 h-4" /> New Post
                    </Button>
                </div>
            </div>

            {/* STATS SUMMARY */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Posts", value: posts.length, color: "blue" },
                    { label: "LinkedIn", value: posts.filter(p => p.platform === 'LinkedIn').length, color: "indigo" },
                    { label: "Twitter", value: posts.filter(p => p.platform === 'Twitter').length, color: "sky" },
                    { label: "Saved Ideas", value: posts.length > 5 ? "85%" : "20%", color: "purple" }
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-gray-800/50 p-4 rounded-3xl border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm shadow-sm"
                    >
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* FILTERS & SEARCH */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search keywords, titles, or tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white shadow-sm"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    {['All', 'LinkedIn', 'Twitter', 'Instagram'].map((plat) => (
                        <button
                            key={plat}
                            onClick={() => setFilterPlatform(plat)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterPlatform === plat
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                                }`}
                        >
                            {plat}
                        </button>
                    ))}
                </div>
            </div>

            {/* POSTS GRID */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(n => (
                        <div key={n} className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-3xl"></div>
                    ))}
                </div>
            ) : filteredPosts.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 bg-white dark:bg-gray-800/30 rounded-[40px] border-2 border-dashed border-gray-200 dark:border-gray-700"
                >
                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-10 h-10 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">No content found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
                        {searchQuery ? "Try searching for different keywords or clear your filters." : "Start generating viral post ideas using the Voice Command Center!"}
                    </p>
                    {!searchQuery && (
                        <Button
                            onClick={() => onNavigate('home')}
                            className="mt-8 rounded-2xl bg-blue-600 px-8 py-6 h-auto text-lg font-bold"
                        >
                            Generate My First Post
                        </Button>
                    )}
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map((post) => (
                        <motion.div
                            key={post?.userId || Math.random()}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group bg-white dark:bg-gray-800 p-6 rounded-[32px] shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 relative overflow-hidden"
                        >
                            {/* BACKGROUND ELEMENT */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

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
                                    Copy All
                                </Button>
                                <Button
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl h-10 text-xs font-semibold shadow-lg shadow-blue-500/20"
                                    onClick={() => alert("Publishing feature coming soon! 🚀 This will connect to your social media APIs.")}
                                >
                                    Publish Now
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
