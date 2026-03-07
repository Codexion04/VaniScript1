import { Upload, Sparkles, Wand2 } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import VoiceRecorder from "./VoiceRecorder";

interface VoiceCommandCenterProps {
  onCertificateUpload: () => void;
}

export function VoiceCommandCenter({
  onCertificateUpload,
}: VoiceCommandCenterProps) {

  const [prompt, setPrompt] = useState("");
  const [generatedPost, setGeneratedPost] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showVirality, setShowVirality] = useState(false);
  const [viralityScore, setViralityScore] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedIdea = localStorage.getItem("lastDiscoveryIdea");
    if (savedIdea) {
      setPrompt(savedIdea);
      localStorage.removeItem("lastDiscoveryIdea");
    }
  }, []);

  /* =====================================
     RESTORE PREVIOUS DATA ON PAGE LOAD
  ====================================== */

  useEffect(() => {
    const savedPost = localStorage.getItem("generatedPost");
    const savedScore = localStorage.getItem("viralityScore");

    if (savedPost) {
      setGeneratedPost(savedPost);
    }

    if (savedScore) {
      setViralityScore(parseInt(savedScore) || null);
    }
  }, []);

  /* =====================================
     RECEIVE TRANSCRIPT FROM VOICE
  ====================================== */

  const handleTranscript = (text: string) => {
    setPrompt((prev) => prev + " " + text);
  };

  /* =====================================
     GENERATE AI POST
  ====================================== */

  const handleGenerateContent = async () => {

    if (!prompt) return;

    setIsGenerating(true);

    try {

      const res = await fetch("http://localhost:5000/generate-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      });

      if (!res.ok) {
        throw new Error("AI generation failed");
      }

      const data = await res.json();

      setGeneratedPost(data.post);

      /* SAVE POST */
      localStorage.setItem("generatedPost", data.post);

      /* CALL VIRALITY API */
      getViralityScore(data.post);

    } catch (error) {
      console.error("AI generation error:", error);
      alert("AI generation failed ❌");
    } finally {
      setIsGenerating(false);
    }
  };

  /* =====================================
     GET VIRALITY SCORE FROM BACKEND
  ====================================== */

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



      console.log("Virality score:", data);

      const score = data.score || data.analysis || "70";

      setViralityScore(score);
      localStorage.setItem("viralityScore", score);
      localStorage.setItem("viralityReach", data.reach);
      localStorage.setItem("viralityEngagement", data.engagement);
      localStorage.setItem("viralityShares", data.shares);
      localStorage.setItem("viralityImpressions", data.impressions);

      /* SAVE DATA FOR VIRALITY PAGE */

      const newResult = {
        post: post,
        score: data.score,
        reach: data.reach,
        engagement: data.engagement,
        shares: data.shares,
        impressions: data.impressions,
        time: new Date().toISOString()
      };

      /* GET PREVIOUS HISTORY */

      const oldHistory = localStorage.getItem("viralityHistory");
      let history = [];

      if (oldHistory) {
        history = JSON.parse(oldHistory);
      }

      /* ADD NEW RESULT */

      history.unshift(newResult);

      /* SAVE BACK */

      localStorage.setItem("viralityHistory", JSON.stringify(history));

    } catch (error) {
      console.error("Virality error:", error);
    }

  };

  /* =====================================
     AI ENHANCEMENTS VIA BACKEND
  ====================================== */

  const handleAIEnhanceByAI = async (action: string) => {
    if (!generatedPost) return;
    setIsGenerating(true);

    try {
      let endpoint = "/rewrite-post";
      let body = { post: generatedPost };

      if (action === "hashtags") {
        endpoint = "/generate-hashtags";
      }

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      const newPost = data.rewrittenPost || data.hashtags || generatedPost;

      if (action === "hashtags") {
        setGeneratedPost(generatedPost + "\n\n" + newPost);
      } else {
        setGeneratedPost(newPost);
      }

      localStorage.setItem("generatedPost", newPost);
    } catch (error) {
      console.error("Enhancement error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  /* =====================================
     SAVE POST TO DYNAMODB
  ====================================== */

  const handleSavePost = async () => {
    if (!generatedPost) return;

    try {
      const res = await fetch("http://localhost:5000/save-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: generatedPost,
          title: prompt.slice(0, 30) + "...",
          platform: "LinkedIn",
        }),
      });

      if (res.ok) {
        alert("Post saved successfully to History! 💾");
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-900/20 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-8"
    >

      {/* HEADER */}

      <div className="flex items-start gap-4 mb-6">

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Sparkles className="w-6 h-6 text-white" />
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            Voice-to-Post Command Center
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Record voice → Transcribe → Generate AI Post
          </p>
        </div>

      </div>

      {/* VOICE RECORDER */}

      <div className="mb-6">
        <VoiceRecorder onTranscript={handleTranscript} />
      </div>

      {/* PROMPT INPUT */}

      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Your transcribed voice will appear here..."
        className="min-h-[120px] rounded-2xl border-gray-200 dark:border-gray-600 focus:border-[#2563EB] focus:ring-[#2563EB] resize-none text-gray-900 dark:text-white"
      />

      {/* BUTTONS */}

      <div className="flex gap-3 mt-4">

        <Button
          onClick={handleGenerateContent}
          disabled={!prompt || isGenerating}
          className="flex-1 h-12 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-xl shadow-lg shadow-blue-500/30"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {isGenerating ? "Generating..." : "Generate Content"}
        </Button>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            console.log("Certificate selected:", file.name);
            setIsGenerating(true);

            try {
              const formData = new FormData();
              formData.append("file", file);

              const res = await fetch("http://localhost:5000/upload", { method: "POST", body: formData });
              const data = await res.json();

              if (res.ok) {
                console.log("Upload successful, opening modal...");
                // 🔥 Clear old data and OPEN MODAL IMMEDIATELY
                localStorage.removeItem("generatedPost");
                localStorage.removeItem("viralityScore");
                onCertificateUpload(); // Open modal

                // Generate post about the certificate (background)
                try {
                  const genRes = await fetch("http://localhost:5000/generate-post", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt: `An achievement post about receiving a certificate: ${file.name}` }),
                  });
                  const genData = await genRes.json();
                  if (genData.post) {
                    setGeneratedPost(genData.post);
                    localStorage.setItem("generatedPost", genData.post);

                    // Trigger virality score
                    fetch("http://localhost:5000/virality-score", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ post: genData.post }),
                    }).then(r => r.json()).then(vData => {
                      if (vData.score) localStorage.setItem("viralityScore", vData.score.toString());
                    });
                  }
                } catch (genError) {
                  console.error("Auto-gen error:", genError);
                }
              }
            } catch (err) {
              console.error("Certificate upload error:", err);
              alert("Failed to upload certificate. Is the backend running?");
            } finally {
              setIsGenerating(false);
              if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
            }
          }}
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="h-12 px-6 rounded-xl border-gray-200 dark:border-gray-600 dark:text-white"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Certificate
        </Button>

      </div>

      {/* GENERATED POST */}

      {generatedPost && (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-6 bg-green-50 dark:bg-green-900/10 rounded-3xl border border-green-100 dark:border-green-800"
        >

          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Generated Post
            </h4>
            <Button
              size="sm"
              onClick={handleSavePost}
              className="bg-green-600 text-white hover:bg-green-700 rounded-lg px-4"
            >
              Save to History
            </Button>
          </div>

          <Textarea
            value={generatedPost}
            onChange={(e) => {
              setGeneratedPost(e.target.value);
              localStorage.setItem("generatedPost", e.target.value);
            }}
            className="min-h-[200px] mb-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />

          {/* VIRALITY SCORE */}

          {viralityScore && (
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">

              <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-1">
                Virality Score
              </h4>

              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Score: <span className="font-bold text-lg">{viralityScore}</span> / 100
              </p>

            </div>
          )}

          {/* AI BUTTONS */}

          <div className="flex gap-3 flex-wrap">

            <Button
              size="sm"
              onClick={() => handleAIEnhanceByAI("rewrite")}
              disabled={isGenerating}
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg"
            >
              <Wand2 className="w-3.5 h-3.5 mr-2" />
              AI Rewrite
            </Button>

            <Button
              size="sm"
              onClick={() => handleAIEnhanceByAI("hashtags")}
              disabled={isGenerating}
              className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg"
            >
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Gen Hashtags
            </Button>

          </div>

        </motion.div>

      )}

    </motion.div>
  );
}
