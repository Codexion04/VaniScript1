import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Sparkles,
    Mic,
    Zap,
    BarChart3,
    Globe,
    Calendar,
    ArrowRight,
    TrendingUp,
    Languages,
    ChevronDown,
    Play,
} from "lucide-react";

interface LandingPageProps {
    onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
    const [activeFeature, setActiveFeature] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleMouse = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouse);
        return () => window.removeEventListener("mousemove", handleMouse);
    }, []);

    const features = [
        {
            icon: Mic,
            title: "Voice-First Content",
            description:
                "Speak in Hindi, Tamil, Marathi or English — our AI understands and creates platform-perfect posts instantly.",
            gradient: "from-blue-500 to-cyan-400",
            bg: "bg-blue-500/10",
        },
        {
            icon: Sparkles,
            title: "AI-Powered Generation",
            description:
                "Powered by AWS Bedrock, generate viral-ready content for LinkedIn, Instagram & Twitter in seconds.",
            gradient: "from-purple-500 to-pink-400",
            bg: "bg-purple-500/10",
        },
        {
            icon: BarChart3,
            title: "Virality Prediction",
            description:
                "Know your post's viral potential before publishing. Get reach, engagement & share predictions.",
            gradient: "from-emerald-500 to-teal-400",
            bg: "bg-emerald-500/10",
        },
        {
            icon: Calendar,
            title: "Smart Scheduling",
            description:
                "AI finds the perfect time to post. Schedule with your voice — just say 'post tomorrow at 9am'.",
            gradient: "from-orange-500 to-amber-400",
            bg: "bg-orange-500/10",
        },
    ];

    const stats = [
        { value: "4+", label: "Languages Supported" },
        { value: "3", label: "Platforms" },
        { value: "AI", label: "Powered by AWS" },
        { value: "100%", label: "Voice Driven" },
    ];



    return (
        <div className="min-h-screen bg-[#0a0a1a] text-white overflow-hidden">
            {/* Animated background gradient orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute w-[800px] h-[800px] rounded-full opacity-20 blur-[120px] transition-all duration-[2000ms]"
                    style={{
                        background:
                            "radial-gradient(circle, #2563EB 0%, transparent 70%)",
                        left: `${mousePos.x * 0.05 - 200}px`,
                        top: `${mousePos.y * 0.05 - 200}px`,
                    }}
                />
                <div
                    className="absolute w-[600px] h-[600px] rounded-full opacity-15 blur-[100px]"
                    style={{
                        background:
                            "radial-gradient(circle, #7C3AED 0%, transparent 70%)",
                        right: "10%",
                        top: "20%",
                    }}
                />
                <div
                    className="absolute w-[500px] h-[500px] rounded-full opacity-10 blur-[80px]"
                    style={{
                        background:
                            "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
                        left: "20%",
                        bottom: "10%",
                    }}
                />
            </div>

            {/* Navbar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0a0a1a]/70 border-b border-white/5"
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            VaniScript
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a
                            href="#features"
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Features
                        </a>
                        <a
                            href="#how-it-works"
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            How it Works
                        </a>

                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onGetStarted}
                        className="px-6 py-2.5 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] rounded-full text-sm font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow"
                    >
                        Get Started
                    </motion.button>
                </div>
            </motion.nav>

            {/* ===== HERO SECTION ===== */}
            <section className="relative min-h-screen flex items-center justify-center pt-20">
                {/* Floating particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                        animate={{
                            y: [0, -100, 0],
                            x: [0, Math.random() * 50 - 25, 0],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${50 + Math.random() * 40}%`,
                        }}
                    />
                ))}

                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
                    >
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-sm text-gray-300">
                            Powered by AWS Bedrock AI
                        </span>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-6"
                    >
                        <span className="bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent">
                            Speak.
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
                            Create.
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">
                            Go Viral.
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        India's first{" "}
                        <span className="text-white font-semibold">
                            voice-powered AI content studio
                        </span>
                        . Create viral social media posts in Hindi, Tamil, Marathi &
                        English — just by speaking.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onGetStarted}
                            className="group px-8 py-4 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] rounded-2xl text-lg font-bold shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center gap-3"
                        >
                            Start Creating Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-lg font-semibold hover:bg-white/10 transition-all flex items-center gap-3 backdrop-blur-sm"
                        >
                            <Play className="w-5 h-5" />
                            Watch Demo
                        </motion.button>
                    </motion.div>

                    {/* Language badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="flex flex-wrap items-center justify-center gap-3 mb-12"
                    >
                        {["English", "हिन्दी", "मराठी", "தமிழ்"].map((lang, i) => (
                            <motion.span
                                key={lang}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1 + i * 0.1 }}
                                className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 flex items-center gap-2"
                            >
                                <Languages className="w-3.5 h-3.5" />
                                {lang}
                            </motion.span>
                        ))}
                    </motion.div>

                    {/* Hero visual mockup */}
                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 1 }}
                        className="relative max-w-4xl mx-auto"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-r from-[#2563EB]/20 via-[#7C3AED]/20 to-[#EC4899]/20 rounded-3xl blur-2xl" />
                        <div className="relative bg-[#111128] rounded-2xl border border-white/10 p-6 shadow-2xl">
                            {/* Mock browser chrome */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                <div className="flex-1 ml-4 h-7 bg-white/5 rounded-lg flex items-center px-3">
                                    <span className="text-xs text-gray-500">
                                        vaniscript.app/dashboard
                                    </span>
                                </div>
                            </div>

                            {/* Mock dashboard content */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2 space-y-4">
                                    {/* Fake voice recorder */}
                                    <div className="bg-white/5 rounded-xl p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                                <Sparkles className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-white">
                                                    AI Content Studio
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Speak or type your idea
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mic button */}
                                        <div className="flex items-center justify-center py-4">
                                            <motion.div
                                                animate={{ scale: [1, 1.1, 1] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                                className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30"
                                            >
                                                <Mic className="w-6 h-6 text-white" />
                                            </motion.div>
                                        </div>

                                        {/* Waveform animation */}
                                        <div className="flex items-center justify-center gap-1 h-8">
                                            {[...Array(20)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="w-1 bg-gradient-to-t from-blue-500 to-purple-400 rounded-full"
                                                    animate={{
                                                        height: [
                                                            4,
                                                            Math.random() * 24 + 4,
                                                            4,
                                                        ],
                                                    }}
                                                    transition={{
                                                        repeat: Infinity,
                                                        duration: 0.8 + Math.random() * 0.4,
                                                        delay: i * 0.05,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Fake generated content */}
                                    <div className="bg-white/5 rounded-xl p-4">
                                        <div className="flex gap-2 mb-3">
                                            {["LinkedIn", "Instagram", "Twitter"].map((p) => (
                                                <span
                                                    key={p}
                                                    className={`px-3 py-1 rounded-lg text-xs font-bold ${p === "LinkedIn"
                                                        ? "bg-blue-500/20 text-blue-400"
                                                        : "bg-white/5 text-gray-500"
                                                        }`}
                                                >
                                                    {p}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-3 bg-white/10 rounded w-full" />
                                            <div className="h-3 bg-white/10 rounded w-4/5" />
                                            <div className="h-3 bg-white/10 rounded w-3/5" />
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar mockup */}
                                <div className="space-y-3">
                                    <div className="bg-white/5 rounded-xl p-4">
                                        <div className="text-xs text-gray-500 mb-2">
                                            Virality Score
                                        </div>
                                        <div className="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                                            92
                                        </div>
                                        <div className="text-xs text-green-400 mt-1">
                                            ↑ High Potential
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4">
                                        <div className="text-xs text-gray-500 mb-2">
                                            Best Time
                                        </div>
                                        <div className="text-sm font-bold text-white">
                                            9:00 AM
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Tomorrow, Mon
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4">
                                        <div className="text-xs text-gray-500 mb-2">
                                            Language
                                        </div>
                                        <div className="text-sm font-bold text-white">
                                            हिन्दी
                                        </div>
                                        <div className="text-xs text-purple-400 mt-1">
                                            ✨ Auto-detected
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="mt-12"
                    >
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            <ChevronDown className="w-6 h-6 text-gray-500 mx-auto" />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ===== STATS BAR ===== */}
            <section className="relative py-16 border-y border-white/5">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FEATURES SECTION ===== */}
            <section id="features" className="relative py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-sm font-bold text-blue-400 uppercase tracking-widest">
                            Features
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black mt-4 mb-4">
                            Everything You Need to{" "}
                            <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
                                Go Viral
                            </span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            From voice-to-content in any Indian language, to AI-powered
                            virality predictions — VaniScript does it all.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                onMouseEnter={() => setActiveFeature(i)}
                                className={`group relative p-8 rounded-3xl border transition-all duration-500 cursor-pointer overflow-hidden ${activeFeature === i
                                    ? "border-white/20 bg-white/5"
                                    : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                                    }`}
                            >
                                {/* Hover glow */}
                                {activeFeature === i && (
                                    <motion.div
                                        layoutId="featureGlow"
                                        className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 rounded-3xl`}
                                        transition={{ duration: 0.4 }}
                                    />
                                )}

                                <div className="relative z-10">
                                    <div
                                        className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-5`}
                                    >
                                        <feature.icon
                                            className={`w-7 h-7 bg-gradient-to-r ${feature.gradient} bg-clip-text`}
                                            style={{
                                                color:
                                                    feature.gradient.includes("blue")
                                                        ? "#3b82f6"
                                                        : feature.gradient.includes("purple")
                                                            ? "#a855f7"
                                                            : feature.gradient.includes("emerald")
                                                                ? "#10b981"
                                                                : "#f97316",
                                            }}
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed text-sm">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section id="how-it-works" className="relative py-24 bg-white/[0.02]">
                <div className="max-w-5xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-sm font-bold text-purple-400 uppercase tracking-widest">
                            How it Works
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black mt-4 mb-4">
                            Three Steps to{" "}
                            <span className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">
                                Viral Content
                            </span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Speak Your Idea",
                                description:
                                    "Hit the mic and speak in any supported language. Our AI understands context, tone, and intent.",
                                icon: Mic,
                                color: "blue",
                            },
                            {
                                step: "02",
                                title: "AI Generates Content",
                                description:
                                    "Get platform-optimized posts for LinkedIn, Instagram & Twitter — with hashtags and emojis.",
                                icon: Sparkles,
                                color: "purple",
                            },
                            {
                                step: "03",
                                title: "Predict & Schedule",
                                description:
                                    "See your virality score, find the best posting time, and schedule — all by voice.",
                                icon: TrendingUp,
                                color: "pink",
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="relative text-center p-8"
                            >
                                {/* Step number */}
                                <div className="text-7xl font-black text-white/5 absolute top-0 left-1/2 -translate-x-1/2">
                                    {item.step}
                                </div>

                                <div
                                    className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center relative z-10 ${item.color === "blue"
                                        ? "bg-blue-500/10"
                                        : item.color === "purple"
                                            ? "bg-purple-500/10"
                                            : "bg-pink-500/10"
                                        }`}
                                >
                                    <item.icon
                                        className="w-8 h-8"
                                        style={{
                                            color:
                                                item.color === "blue"
                                                    ? "#3b82f6"
                                                    : item.color === "purple"
                                                        ? "#a855f7"
                                                        : "#ec4899",
                                        }}
                                    />
                                </div>

                                <h3 className="text-lg font-bold text-white mb-3 relative z-10">
                                    {item.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed relative z-10">
                                    {item.description}
                                </p>

                                {/* Connector line */}
                                {i < 2 && (
                                    <div className="hidden md:block absolute top-1/3 -right-4 w-8 h-[2px] bg-gradient-to-r from-white/10 to-transparent" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>



            {/* ===== FINAL CTA ===== */}
            <section className="relative py-24">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-[400px] h-[400px] rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-[100px]" />
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black mb-6 relative z-10">
                            Ready to Create{" "}
                            <span className="bg-gradient-to-r from-[#2563EB] to-[#EC4899] bg-clip-text text-transparent">
                                Viral Content
                            </span>
                            ?
                        </h2>
                        <p className="text-gray-400 mb-10 text-lg relative z-10">
                            Join thousands of Indian creators who are already using
                            VaniScript to dominate social media.
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onGetStarted}
                            className="relative z-10 px-10 py-5 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] rounded-2xl text-lg font-bold shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all flex items-center gap-3 mx-auto"
                        >
                            Start Creating — It&apos;s Free
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="border-t border-white/5 py-8">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-bold text-gray-400">
                            VaniScript
                        </span>
                    </div>
                    <p className="text-sm text-gray-600">
                        © 2026 VaniScript. Built with ❤️ for Indian Creators.
                    </p>
                </div>
            </footer>
        </div>
    );
}
