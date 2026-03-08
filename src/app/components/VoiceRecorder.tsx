import { API_URL } from "../../config";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { translations } from "../translations";

interface VoiceRecorderProps {
    onTranscript: (text: string) => void;
    onLanguageDetected?: (langCode: string) => void;
    languageCode: string;
    uiLanguage: string;
}

// Map UI language to Web Speech API BCP-47 language codes
const langMap: Record<string, string> = {
    "English": "en-IN",
    "Hindi": "hi-IN",
    "Marathi": "mr-IN",
    "Tamil": "ta-IN",
};

// Reverse map for language detection
const reverseLangMap: Record<string, string> = {
    "en-IN": "English",
    "hi-IN": "Hindi",
    "mr-IN": "Marathi",
    "ta-IN": "Tamil",
};

export default function VoiceRecorder({ onTranscript, onLanguageDetected, languageCode, uiLanguage }: VoiceRecorderProps) {
    const t = translations[uiLanguage] || translations["English"];
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [liveTranscript, setLiveTranscript] = useState("");
    const [micError, setMicError] = useState<string | null>(null);
    const [useWebSpeech, setUseWebSpeech] = useState(true);

    const recognitionRef = useRef<any>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);

    // Check if Web Speech API is available
    const SpeechRecognition = typeof window !== "undefined"
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;

    // ===== WEB SPEECH API APPROACH (Primary) =====
    const startWebSpeechRecording = () => {
        if (!SpeechRecognition) {
            console.log("Web Speech API not available, falling back to MediaRecorder");
            setUseWebSpeech(false);
            startMediaRecording();
            return;
        }

        setMicError(null);
        setLiveTranscript("");

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        // Configure
        const speechLang = langMap[uiLanguage] || "en-IN";
        recognition.lang = speechLang;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        let finalText = "";
        let detectedLang = speechLang;

        recognition.onstart = () => {
            console.log("🎙️ Web Speech Recognition started (lang:", speechLang, ")");
            setIsRecording(true);
            setMicError(null);
        };

        recognition.onresult = (event: any) => {
            let interim = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalText += result[0].transcript + " ";
                } else {
                    interim += result[0].transcript;
                }
            }
            setLiveTranscript(finalText + interim);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            if (event.error === "not-allowed") {
                setMicError("Microphone permission denied. Please allow mic access in Chrome settings (click the lock icon in the address bar).");
            } else if (event.error === "audio-capture") {
                // This is the equivalent of NotReadableError - try MediaRecorder fallback
                console.log("audio-capture error, trying MediaRecorder fallback...");
                setUseWebSpeech(false);
                startMediaRecording();
                return;
            } else if (event.error === "no-speech") {
                // Not an error, just no speech detected - ignore
                return;
            } else {
                setMicError(`Speech recognition error: ${event.error}`);
            }
            setIsRecording(false);
        };

        recognition.onend = () => {
            setIsRecording(false);
            const trimmed = finalText.trim();
            if (trimmed) {
                setTranscript(trimmed);
                onTranscript(trimmed);

                // Notify about detected language
                if (onLanguageDetected) {
                    onLanguageDetected(detectedLang);
                }
            }
            setLiveTranscript("");
        };

        try {
            recognition.start();
        } catch (e: any) {
            console.error("Failed to start speech recognition:", e);
            setMicError(`Failed to start: ${e.message}`);
        }
    };

    const stopWebSpeechRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsRecording(false);
    };

    // ===== MEDIARECORDER APPROACH (Fallback) =====
    const startMediaRecording = async () => {
        setMicError(null);

        try {
            // Try multiple strategies
            let stream: MediaStream;
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const audioInputs = devices.filter(d => d.kind === "audioinput");
                if (audioInputs.length > 0 && audioInputs[0].deviceId) {
                    stream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            deviceId: { exact: audioInputs[0].deviceId },
                            echoCancellation: false,
                            noiseSuppression: false,
                            autoGainControl: false,
                        }
                    });
                } else {
                    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                }
            } catch {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({
                        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
                    });
                } catch {
                    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                }
            }

            streamRef.current = stream;
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                setIsProcessing(true);
                try {
                    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                    const file = new File([audioBlob], `audio-${Date.now()}.webm`, { type: "audio/webm" });
                    const formData = new FormData();
                    formData.append("file", file);

                    const uploadRes = await fetch(`${API_URL}/upload`, {
                        method: "POST",
                        body: formData,
                    });
                    if (!uploadRes.ok) throw new Error("Upload failed");
                    const uploadData = await uploadRes.json();

                    const transcribeRes = await fetch(`${API_URL}/transcribe`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ fileName: uploadData.fileName, languageCode }),
                    });
                    if (!transcribeRes.ok) throw new Error("Transcribe failed");
                    const transcribeData = await transcribeRes.json();

                    if (transcribeData.detectedLanguageCode && onLanguageDetected) {
                        onLanguageDetected(transcribeData.detectedLanguageCode);
                    }

                    if (transcribeData.transcriptUrl) {
                        const transcriptRes = await fetch(transcribeData.transcriptUrl);
                        if (!transcriptRes.ok) throw new Error("Transcript fetch failed");
                        const transcriptJson = await transcriptRes.json();
                        const text = transcriptJson?.results?.transcripts?.[0]?.transcript || "";
                        console.log("Transcript:", text);
                        setTranscript(text);
                        onTranscript(text);
                    }
                } catch (error) {
                    console.error("Voice processing error:", error);
                    alert(t.recTranscriptionFailed);
                } finally {
                    setIsProcessing(false);
                    streamRef.current?.getTracks().forEach((track) => track.stop());
                }
            };

            mediaRecorder.start(1000);
            setIsRecording(true);
        } catch (error: any) {
            console.error("Microphone error:", error?.name, error?.message);
            if (error?.name === "NotAllowedError" || error?.name === "PermissionDeniedError") {
                setMicError("Permission denied. Allow mic access in browser settings and reload.");
            } else if (error?.name === "NotReadableError" || error?.name === "TrackStartError") {
                setMicError("Microphone is busy or locked by another app (Teams, HP Audio, etc). Restart your browser or PC to release the mic.");
            } else {
                setMicError(`Mic error: ${error?.message || "Unknown"}`);
            }
        }
    };

    const stopMediaRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    };

    // ===== UNIFIED HANDLERS =====
    const handleStart = () => {
        if (useWebSpeech) {
            startWebSpeechRecording();
        } else {
            startMediaRecording();
        }
    };

    const handleStop = () => {
        if (useWebSpeech) {
            stopWebSpeechRecording();
        } else {
            stopMediaRecording();
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800/50 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center">{t.recRecorderTitle}</h2>

            {/* Mic error banner */}
            {micError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 space-y-2">
                    <p className="text-sm font-bold text-red-700 dark:text-red-400">⚠️ Microphone Issue</p>
                    <p className="text-xs text-red-600 dark:text-red-400">{micError}</p>
                    <button
                        onClick={() => { setMicError(null); handleStart(); }}
                        className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                        🔄 Retry
                    </button>
                </div>
            )}

            <div className="flex flex-col items-center justify-center py-4">
                <button
                    onClick={isRecording ? handleStop : handleStart}
                    disabled={isProcessing}
                    className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl focus:outline-none disabled:opacity-50 ${isRecording
                        ? "bg-red-500 hover:bg-red-600 shadow-red-500/40 scale-110"
                        : isProcessing
                            ? "bg-yellow-500 shadow-yellow-500/30"
                            : "bg-gradient-to-br from-[#2563EB] to-[#7C3AED] hover:scale-105 shadow-blue-500/30"
                        }`}
                >
                    {/* Pulsing ring when recording */}
                    {isRecording && (
                        <>
                            <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-30" />
                            <span className="absolute inset-[-8px] rounded-full border-2 border-red-400 animate-pulse opacity-50" />
                        </>
                    )}
                    {isProcessing ? (
                        <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    ) : (
                        <svg className="w-10 h-10 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                        </svg>
                    )}
                </button>

                <p className={`mt-4 text-sm font-bold ${isRecording
                    ? "text-red-500 animate-pulse"
                    : isProcessing
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}>
                    {isRecording
                        ? t.recStopRecording
                        : isProcessing
                            ? t.recProcessing
                            : t.recStartRecording}
                </p>

                {/* Mode indicator */}
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    {useWebSpeech ? "🌐 Live Speech Recognition" : "☁️ AWS Transcribe"}
                </p>
            </div>

            {/* Live transcript while speaking (Web Speech only) */}
            {isRecording && liveTranscript && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 animate-pulse">
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">🎙️ Listening...</p>
                    <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">{liveTranscript}</p>
                </div>
            )}

            {transcript && !isRecording && (
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{t.recFinalTranscript}</p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm leading-relaxed">{transcript}</p>
                </div>
            )}
        </div>
    );
}