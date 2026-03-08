import { Upload, Sparkles, Wand2, CalendarCheck, Mic, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import VoiceRecorder from "./VoiceRecorder";
import { translations } from "../translations";

interface VoiceCommandCenterProps {
  onShowPreview: () => void;
  uiLanguage: string;
  setUiLanguage: (lang: string) => void;
}

export function VoiceCommandCenter({
  onShowPreview,
  uiLanguage,
  setUiLanguage,
}: VoiceCommandCenterProps) {

  const [prompt, setPrompt] = useState("");
  const [platforms, setPlatforms] = useState(["LinkedIn"]);
  const [generatedPosts, setGeneratedPosts] = useState<Record<string, string>>({});
  const [activePlatform, setActivePlatform] = useState("LinkedIn");
  const [isGenerating, setIsGenerating] = useState(false);
  const [viralityScore, setViralityScore] = useState<number | null>(null);
  const [attachedMedia, setAttachedMedia] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<string>(uiLanguage);
  const [scheduleBanner, setScheduleBanner] = useState<{ date: string; time: string; platform: string } | null>(null);
  const [showNamingPopup, setShowNamingPopup] = useState(false);
  const [postName, setPostName] = useState("");
  const [isListeningForName, setIsListeningForName] = useState(false);
  const [liveNameTranscript, setLiveNameTranscript] = useState("");
  const nameRecognitionRef = useRef<any>(null);

  // Sync detectedLanguage with uiLanguage
  useEffect(() => {
    setDetectedLanguage(uiLanguage);
  }, [uiLanguage]);

  const t = translations[uiLanguage] || translations["English"];
  const handleLanguageDetected = (code: string) => {
    const langMap: Record<string, string> = {
      "en-IN": "English",
      "hi-IN": "Hindi",
      "mr-IN": "Marathi",
      "ta-IN": "Tamil"
    };
    const lang = langMap[code] || "English";
    setDetectedLanguage(lang);

    // Only auto-switch UI if it's one of our target Indic languages
    // This prevents English loanwords like "AI" from accidentally flipping the entire UI to English
    if (lang === "Hindi" || lang === "Marathi" || lang === "Tamil") {
      setUiLanguage(lang);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const promptRef = useRef(prompt);

  // Keep promptRef in sync
  useEffect(() => {
    promptRef.current = prompt;
  }, [prompt]);

  useEffect(() => {
    const savedIdea = localStorage.getItem("lastDiscoveryIdea");
    if (savedIdea) {
      setPrompt(savedIdea);
      localStorage.removeItem("lastDiscoveryIdea");
    }

    const savedPoster = localStorage.getItem("pendingPosterUrl");
    if (savedPoster) {
      setAttachedMedia("AI Generated Poster");
      setPreview(savedPoster);
      setMediaType("image/png");
      localStorage.removeItem("pendingPosterUrl");
    }
  }, []);

  useEffect(() => {

    const savedPosts = localStorage.getItem("generatedPosts");
    const savedScore = localStorage.getItem("viralityScore");

    if (savedPosts) {
      try {
        const parsed = JSON.parse(savedPosts);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          setGeneratedPosts(parsed);
        }
      } catch (e) {
        console.error("Error parsing saved posts:", e);
      }
    }

    if (savedScore) {
      setViralityScore(parseInt(savedScore));
    }

  }, []);

  const handleTranscript = async (text: string) => {
    const fullPrompt = (prompt + " " + text).trim();
    setPrompt(fullPrompt);

    // Check if user wants to auto-generate content (word-based detection)
    const lowerText = text.toLowerCase();
    const hasGenerateWord = ["generate", "create", "make", "write", "बनाओ", "जेनरेट", "तयार", "உருவாக்கு"].some(w => lowerText.includes(w));
    const hasContentWord = ["content", "post", "पोस्ट", "कंटेंट", "पोस्ट", "कंटेंट", "பதிவு", "உள்ளடக்கம்"].some(w => lowerText.includes(w));

    console.log("🎙️ Transcript:", text, "| Generate?", hasGenerateWord && hasContentWord);

    if (hasGenerateWord && hasContentWord) {
      console.log("🚀 Auto-generating with prompt:", fullPrompt);
      handleGenerateContent(fullPrompt);
      return; // Don't check schedule if we're generating
    }

    // Check if user wants to schedule via voice
    await parseScheduleIntent(text);
  };

  const parseScheduleIntent = async (text: string) => {
    // Quick keyword check for scheduling intent
    const scheduleKeywords = [
      "schedule", "post at", "post on", "post for",
      "शेड्यूल", "पोस्ट करो", "कल", "परसो",
      "शेड्यूल करा", "पोस्ट करा", "उद्या",
      "திட்டமிடு", "பதிவிடு", "நாளை"
    ];

    const lowerText = text.toLowerCase();
    const hasScheduleIntent = scheduleKeywords.some(kw => lowerText.includes(kw));
    if (!hasScheduleIntent) return;

    try {
      const res = await fetch("http://localhost:5000/parse-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text,
          currentDate: new Date().toISOString().split("T")[0],
        }),
      });

      const data = await res.json();

      if (data.isScheduleCommand && data.date && data.time) {
        // Show banner confirmation
        setScheduleBanner({ date: data.date, time: data.time, platform: data.platform || "LinkedIn" });

        // Update platform selection to match voice command
        if (data.platform && !platforms.includes(data.platform)) {
          setPlatforms(prev => [...prev, data.platform]);
        }
      }
    } catch (error) {
      console.error("Schedule parse error:", error);
    }
  };

  const confirmVoiceSchedule = () => {
    if (!scheduleBanner) return;
    // Show the naming popup instead of saving immediately
    setPostName("");
    setLiveNameTranscript("");
    setShowNamingPopup(true);
  };

  const startListeningForName = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    nameRecognitionRef.current = recognition;

    const langMapLocal: Record<string, string> = {
      "English": "en-IN", "Hindi": "hi-IN", "Marathi": "mr-IN", "Tamil": "ta-IN",
    };
    recognition.lang = langMapLocal[uiLanguage] || "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;

    let finalText = "";

    recognition.onstart = () => {
      setIsListeningForName(true);
      setLiveNameTranscript("");
    };

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript + " ";
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setLiveNameTranscript(finalText + interim);
    };

    recognition.onend = () => {
      setIsListeningForName(false);
      const trimmed = finalText.trim();
      if (trimmed) {
        setPostName(trimmed);
      }
    };

    recognition.onerror = () => {
      setIsListeningForName(false);
    };

    recognition.start();
  };

  const stopListeningForName = () => {
    nameRecognitionRef.current?.stop();
    setIsListeningForName(false);
  };

  const finalizeSchedule = () => {
    if (!scheduleBanner) return;

    const title = postName.trim() || prompt.slice(0, 40) || "Voice Scheduled Post";

    const newPost = {
      id: Date.now().toString(),
      title: title,
      platform: scheduleBanner.platform,
      date: scheduleBanner.date,
      time: scheduleBanner.time,
      status: "scheduled" as const,
    };

    const existing = JSON.parse(localStorage.getItem("scheduledPosts") || "[]");
    localStorage.setItem("scheduledPosts", JSON.stringify([newPost, ...existing]));

    alert(t.vccVoiceScheduleSuccess || `Post "${title}" scheduled for ${scheduleBanner.date} at ${scheduleBanner.time} on ${scheduleBanner.platform}! 📅`);
    setScheduleBanner(null);
    setShowNamingPopup(false);
    setPostName("");
  };

  const togglePlatform = (platform: string) => {

    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );

  };

  const handleGenerateContent = async (overridePrompt?: string) => {

    const currentPrompt = overridePrompt || promptRef.current || prompt;
    if ((!currentPrompt && !attachedMedia) || platforms.length === 0) return;

    setIsGenerating(true);

    try {

      const res = await fetch("http://localhost:5000/generate-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: currentPrompt,
          platforms: platforms,
          media: attachedMedia,
          language: uiLanguage || "English"
        }),
      });

      if (!res.ok) {
        throw new Error("AI generation failed");
      }

      const data = await res.json();

      if (data.posts && Object.keys(data.posts).length > 0) {

        setGeneratedPosts(data.posts);
        localStorage.setItem("generatedPosts", JSON.stringify(data.posts));

        const firstPlatform = Object.keys(data.posts)[0];
        setActivePlatform(firstPlatform);
        getViralityScore(data.posts[firstPlatform]);
        setAttachedMedia(null); // Clear attached media after generation
        setPreview(null);
        setMediaType(null);

      } else {

        alert("AI did not return any content");

      }

    } catch (error) {
      console.error("AI generation error:", error);
      alert("AI generation failed ❌");
    } finally {
      setIsGenerating(false);
    }
  };

  const getViralityScore = async (post: string) => {

    try {

      const res = await fetch("http://localhost:5000/virality-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post: post,
        }),
      });

      const data = await res.json();

      const score = data.score || 70;

      setViralityScore(score);
      localStorage.setItem("viralityScore", score.toString());

      // Save full virality data to history for the Virality Prediction page
      const historyEntry = {
        score: score,
        reach: data.reach || "0",
        engagement: data.engagement || "0%",
        shares: data.shares || "0",
        impressions: data.impressions || "0",
        post: post.slice(0, 100),
        date: new Date().toISOString(),
      };

      const existing = JSON.parse(localStorage.getItem("viralityHistory") || "[]");
      const updated = [historyEntry, ...existing].slice(0, 20); // Keep latest 20
      localStorage.setItem("viralityHistory", JSON.stringify(updated));

    } catch (error) {
      console.error("Virality error:", error);
    }

  };

  const handleAIEnhanceByAI = async (action: string) => {

    const post = generatedPosts[activePlatform];

    if (!post) return;

    setIsGenerating(true);

    try {

      let endpoint = "/rewrite-post";
      let body = { post };

      if (action === "hashtags") {
        endpoint = "/generate-hashtags";
      }

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      const newPost = data.rewrittenPost || data.hashtags || post;

      const updatedPosts = {
        ...generatedPosts,
        [activePlatform]:
          action === "hashtags" ? post + "\n\n" + newPost : newPost,
      };
      setGeneratedPosts(updatedPosts);
      localStorage.setItem("generatedPosts", JSON.stringify(updatedPosts));

    } catch (error) {
      console.error("Enhancement error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePost = async () => {

    const post = generatedPosts[activePlatform];

    if (!post) return;

    try {

      const res = await fetch("http://localhost:5000/save-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: post,
          title: prompt.slice(0, 30) + "...",
          platform: activePlatform,
        }),
      });

      if (res.ok) {
        alert(t.vccSaveSuccess);
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleMediaUpload = async (file: File) => {
    // Set preview immediately for better UX
    setAttachedMedia(file.name);
    setPreview(URL.createObjectURL(file));
    setMediaType(file.type);

    try {
      setIsGenerating(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Upload failed");

      alert(t.vccMediaSuccess); // Translated

    } catch (err) {
      console.error("Upload error:", err);
      alert(t.vccUploadFailed); // Translated
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-900/20 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-8"
    >

      <div className="flex items-start gap-4 mb-6">

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Sparkles className="w-6 h-6 text-white" />
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            {t.vccTitle}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t.vccSubtitle}
          </p>
        </div>

      </div>

      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block uppercase tracking-wider">
            {t.vccSmartDetection}
          </label>
          {detectedLanguage && detectedLanguage !== uiLanguage && (
            <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold animate-in fade-in zoom-in duration-300">
              ✨ {t.vccDetected}: {detectedLanguage}
            </span>
          )}
        </div>

        <VoiceRecorder
          onTranscript={handleTranscript}
          onLanguageDetected={handleLanguageDetected}
          languageCode="auto"
          uiLanguage={uiLanguage}
        />
      </div>

      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={t.vccPlaceholder}
        className="min-h-[120px] rounded-2xl border-gray-200 dark:border-gray-600"
      />

      {/* Voice Schedule Banner */}
      <AnimatePresence>
        {scheduleBanner && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="mt-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border-2 border-green-200 dark:border-green-700 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-md">
                  <CalendarCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-green-800 dark:text-green-300 text-sm">
                    {t.scVoiceScheduleDetected || "📅 Scheduling Detected!"}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                    {scheduleBanner.date} • {scheduleBanner.time} • {scheduleBanner.platform}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={confirmVoiceSchedule}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xs px-4"
                >
                  {t.scConfirmSchedule}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setScheduleBanner(null)}
                  className="text-green-600 hover:text-green-800 rounded-xl font-bold text-xs"
                >
                  ✕
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Voice Naming Popup ===== */}
      <AnimatePresence>
        {showNamingPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) { setShowNamingPopup(false); stopListeningForName(); } }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 w-full max-w-md mx-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                    <CalendarCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Name Your Post</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {scheduleBanner?.date} • {scheduleBanner?.time} • {scheduleBanner?.platform}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setShowNamingPopup(false); stopListeningForName(); }}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Voice Mic for naming */}
              <div className="flex flex-col items-center py-6">
                <button
                  onClick={isListeningForName ? stopListeningForName : startListeningForName}
                  className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${isListeningForName
                    ? "bg-red-500 hover:bg-red-600 shadow-red-500/40 scale-110"
                    : "bg-gradient-to-br from-[#2563EB] to-[#7C3AED] hover:scale-105 shadow-blue-500/30"
                    }`}
                >
                  {isListeningForName && (
                    <>
                      <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-30" />
                      <span className="absolute inset-[-6px] rounded-full border-2 border-red-400 animate-pulse opacity-50" />
                    </>
                  )}
                  <Mic className="w-8 h-8 text-white relative z-10" />
                </button>
                <p className={`mt-3 text-sm font-bold ${isListeningForName ? "text-red-500 animate-pulse" : "text-gray-500 dark:text-gray-400"}`}>
                  {isListeningForName ? "🎙️ Listening... say the name" : "🎤 Tap to speak post name"}
                </p>
              </div>

              {/* Live transcript while listening */}
              {isListeningForName && liveNameTranscript && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mb-4 animate-pulse">
                  <p className="text-sm text-blue-800 dark:text-blue-300">{liveNameTranscript}</p>
                </div>
              )}

              {/* Text input fallback */}
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">Post Name</label>
                <input
                  type="text"
                  value={postName}
                  onChange={(e) => setPostName(e.target.value)}
                  placeholder="Speak or type the post name..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={finalizeSchedule}
                  disabled={!postName.trim()}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold disabled:opacity-50"
                >
                  ✅ Schedule Post
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => { setShowNamingPopup(false); stopListeningForName(); }}
                  className="rounded-xl font-bold text-gray-500"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 mb-4">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-3 uppercase tracking-wider">
          {t.vccGenerateFor}
        </label>

        <div className="flex flex-wrap gap-2">

          {["LinkedIn", "Instagram", "Twitter"].map((platform) => (

            <button
              key={platform}
              onClick={() => togglePlatform(platform)}
              className={`px-6 py-2 rounded-full text-sm font-bold border ${platforms.includes(platform)
                ? "bg-[#2563EB] text-white border-[#2563EB]"
                : "border-gray-300"
                }`}
            >
              {platform}
            </button>

          ))}

        </div>
      </div>

      <div className="flex gap-3 mt-4">

        <Button
          onClick={() => handleGenerateContent()}
          disabled={(!prompt && !attachedMedia) || isGenerating}
          className="flex-1 h-12 bg-[#2563EB] text-white rounded-xl"
        >
          {isGenerating ? t.vccGenerating : t.vccGenerateBtn}
        </Button>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,video/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleMediaUpload(file);
          }}
        />

        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
        >
          <Upload className="w-4 h-4 mr-2" />
          {t.vccAttachMedia}
        </Button>

      </div>

      {attachedMedia && (
        <div className="mt-4">
          <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-900/50">
            {mediaType?.startsWith("image/") ? (
              <img src={preview || ""} alt="Preview" className="w-full h-auto object-cover max-h-[300px]" />
            ) : mediaType?.startsWith("video/") ? (
              <video src={preview || ""} controls className="w-full h-auto max-h-[300px]" />
            ) : null}
            <button
              onClick={() => {
                setAttachedMedia(null);
                setPreview(null);
                setMediaType(null);
              }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
            <span>📎 {t.vccAttachedMedia}:</span>
            <span className="font-bold">{attachedMedia}</span>
          </div>
        </div>
      )}

      {generatedPosts && Object.keys(generatedPosts).length > 0 && (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-6 bg-green-50 dark:bg-green-900/10 rounded-3xl"
        >

          <div className="flex gap-2 mb-4">

            {generatedPosts && Object.keys(generatedPosts).map((platform) => (

              <button
                key={platform}
                onClick={() => setActivePlatform(platform)}
                className={`px-4 py-2 rounded-lg border text-sm ${activePlatform === platform
                  ? "bg-blue-600 text-white"
                  : "border-gray-300"
                  }`}
              >
                {platform}
              </button>

            ))}

          </div>

          <Textarea
            value={generatedPosts?.[activePlatform] || ""}
            onChange={(e) =>
              setGeneratedPosts({
                ...(generatedPosts || {}),
                [activePlatform]: e.target.value,
              })
            }
            className="min-h-[200px]"
          />

          {viralityScore && (

            <div className="mb-4 mt-4 p-4 bg-blue-50 rounded-xl">
              {t.vccScore}: <b>{viralityScore}</b> / 100
            </div>

          )}

          <div className="flex gap-3 flex-wrap">

            <Button
              size="sm"
              onClick={() => handleAIEnhanceByAI("rewrite")}
              className="bg-purple-500 text-white"
            >
              <Wand2 className="w-3.5 h-3.5 mr-2" />
              {t.vccAiRewrite}
            </Button>

            <Button
              size="sm"
              onClick={() => handleAIEnhanceByAI("hashtags")}
              className="bg-pink-500 text-white"
            >
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              {t.vccGenHashtags}
            </Button>

            <Button
              size="sm"
              onClick={handleSavePost}
              className="bg-green-600 text-white"
            >
              {t.vccSave}
            </Button>

          </div>

        </motion.div>

      )}

    </motion.div>
  );
}