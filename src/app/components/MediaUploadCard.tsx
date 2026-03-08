import { API_URL } from "../../config";
import { Upload, Image, Video, FileText, Wand2 } from "lucide-react";
import { motion } from "motion/react";
import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { translations } from "../translations";

interface MediaUploadCardProps {
  onFileUpload?: (file: File, uploadedUrl?: string) => void;
  onShowPreview?: () => void;
  uiLanguage: string;
}

export function MediaUploadCard({ onFileUpload, onShowPreview, uiLanguage }: MediaUploadCardProps) {
  const t = translations[uiLanguage] || translations["English"];
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔥 Upload file to backend → S3
  const uploadToServer = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);

      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      console.log("Upload response:", data);
      setUploadedFileName(data.fileName);

      // 🔥 Clear old data and OPEN MODAL IMMEDIATELY for feedback
      localStorage.removeItem("generatedPost");
      localStorage.removeItem("viralityScore");
      onShowPreview?.();

      // 🔥 AUTO-GENERATE CONTENT FOR THE FILE (in background)
      try {
        const genRes = await fetch(`${API_URL}/generate-post`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: `A professional update about the file`,
            media: file.name,
            language: uiLanguage
          }),
        });
        const genData = await genRes.json();
        const generatedContent = genData.post || (genData.posts && Object.values(genData.posts)[0]);

        if (generatedContent) {
          localStorage.setItem("generatedPost", generatedContent);
          // Trigger virality score
          fetch(`${API_URL}/virality-score`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ post: generatedContent }),
          }).then(r => r.json()).then(vData => {
            if (vData.score) localStorage.setItem("viralityScore", vData.score.toString());
          });
        }
      } catch (genError) {
        console.error("Auto-gen error:", genError);
      }

      alert(t.mediaFileAnalyzed);

      // Optional callback to parent
      onFileUpload?.(file, data.fileName);

    } catch (error) {
      console.error("Upload error:", error);
      alert(t.mediaCheckBackend);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];

    if (file) {
      setUploadedFile(file);
      uploadToServer(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setUploadedFile(file);
      uploadToServer(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
          <Image className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {t.mediaTitle}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {t.mediaSubtitle}
          </p>
        </div>
      </div>

      {/* Upload Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${isDragging
          ? "border-[#2563EB] bg-blue-50 dark:bg-blue-900/20"
          : "border-gray-200 dark:border-gray-600 hover:border-[#2563EB] hover:bg-gray-50 dark:hover:bg-gray-700/50"
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,.pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploadedFile ? (
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              {uploadedFile.type.startsWith("image/") ? (
                <Image className="w-8 h-8 text-green-600 dark:text-green-400" />
              ) : uploadedFile.type.startsWith("video/") ? (
                <Video className="w-8 h-8 text-green-600 dark:text-green-400" />
              ) : (
                <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
              )}
            </div>

            <p className="text-sm font-medium text-gray-900 dark:text-white truncate px-4">
              {uploadedFile.name}
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>

            {isUploading && (
              <p className="text-sm text-blue-500">{t.mediaUploading}</p>
            )}

            {!isUploading && uploadedFileName && (
              <p className="text-sm text-green-500">
                {t.mediaUploadedSuccess}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>

            <div>
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                {t.mediaDropFiles}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t.mediaFormats}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <Video className="w-4 h-4 text-gray-400" />
              <Image className="w-4 h-4 text-gray-400" />
              <FileText className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        )}
      </div>

      {/* AI Button */}
      <Button
        onClick={onShowPreview}
        className="w-full mt-4 h-11 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-lg shadow-purple-500/30"
        disabled={!uploadedFile || isUploading}
      >
        <Wand2 className="w-4 h-4 mr-2" />
        {isUploading ? t.mediaUploading : t.mediaAiEnhance}
      </Button>
    </motion.div>
  );
}