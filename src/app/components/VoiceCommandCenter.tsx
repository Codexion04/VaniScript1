import { Upload, Sparkles, Wand2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
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

  /* =============================
     RECEIVE TRANSCRIPT FROM VOICE
  ============================= */

  const handleTranscript = (text: string) => {
    setPrompt((prev) => prev + " " + text);
  };

  /* =============================
     CALL BACKEND (BEDROCK)
  ============================= */

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
    } catch (error) {
      console.error("AI generation error:", error);
      alert("AI generation failed ❌");
    } finally {
      setIsGenerating(false);
    }
  };

  /* =============================
     SIMPLE AI ENHANCEMENTS
  ============================= */

  const handleAIEnhance = (action: string) => {
    let enhanced = generatedPost;

    if (action === "shorten") {
      enhanced = generatedPost.slice(0, 150) + "...";
    }

    if (action === "add-emojis") {
      enhanced = "🔥✨ " + generatedPost + " 🚀🎉";
    }

    setGeneratedPost(enhanced);
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
        className="min-h-[120px] rounded-2xl border-gray-200 dark:border-gray-600 focus:border-[#2563EB] focus:ring-[#2563EB] resize-none"
      />

      {/* ACTION BUTTONS */}

      <div className="flex gap-3 mt-4">
        <Button
          onClick={handleGenerateContent}
          disabled={!prompt || isGenerating}
          className="flex-1 h-12 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-xl shadow-lg shadow-blue-500/30"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {isGenerating ? "Generating..." : "Generate Content"}
        </Button>

        <Button
          onClick={onCertificateUpload}
          variant="outline"
          className="h-12 px-6 rounded-xl"
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
          className="mt-6 p-6 bg-green-50 dark:bg-green-900/10 rounded-3xl border"
        >
          <h4 className="font-semibold mb-4">Generated Post</h4>

          <Textarea
            value={generatedPost}
            onChange={(e) => setGeneratedPost(e.target.value)}
            className="min-h-[200px] mb-4"
          />

          <div className="flex gap-3 flex-wrap">
            <Button
              size="sm"
              onClick={() => handleAIEnhance("shorten")}
              className="bg-purple-500 text-white"
            >
              <Wand2 className="w-3.5 h-3.5 mr-2" />
              Shorten
            </Button>

            <Button
              size="sm"
              onClick={() => handleAIEnhance("add-emojis")}
              className="bg-pink-500 text-white"
            >
              <Wand2 className="w-3.5 h-3.5 mr-2" />
              Add Emojis
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}