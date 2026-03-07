import { useState, useRef } from "react";
import { Button } from "./ui/button";

interface VoiceRecorderProps {
    onTranscript: (text: string) => void;
}

export default function VoiceRecorder({ onTranscript }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState("");

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
                    const audioBlob = new Blob(audioChunksRef.current, {
                        type: "audio/webm",
                    });

                    const file = new File([audioBlob], `audio-${Date.now()}.webm`, {
                        type: "audio/webm",
                    });

                    const formData = new FormData();
                    formData.append("file", file);

                    /* =============================
                       UPLOAD AUDIO
                    ============================= */

                    const uploadRes = await fetch("http://localhost:5000/upload", {
                        method: "POST",
                        body: formData,
                    });

                    if (!uploadRes.ok) {
                        throw new Error("Upload failed");
                    }

                    const uploadData = await uploadRes.json();

                    /* =============================
                       TRANSCRIBE
                    ============================= */

                    const transcribeRes = await fetch("http://localhost:5000/transcribe", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            fileName: uploadData.fileName,
                        }),
                    });

                    if (!transcribeRes.ok) {
                        throw new Error("Transcribe failed");
                    }

                    const transcribeData = await transcribeRes.json();

                    /* =============================
                       FETCH TRANSCRIPT
                    ============================= */

                    if (transcribeData.transcriptUrl) {
                        let transcriptRes = await fetch(transcribeData.transcriptUrl);

                        if (!transcriptRes.ok) {
                            throw new Error("Transcript fetch failed");
                        }

                        const transcriptJson = await transcriptRes.json();

                        const text =
                            transcriptJson?.results?.transcripts?.[0]?.transcript || "";

                        console.log("Transcript:", text);

                        setTranscript(text);
                        onTranscript(text);
                    }
                } catch (error) {
                    console.error("Voice processing error:", error);
                    alert("Voice transcription failed ❌");
                } finally {
                    setIsProcessing(false);
                    streamRef.current?.getTracks().forEach((track) => track.stop());
                }
            };

            mediaRecorder.start(1000);
            setIsRecording(true);
        } catch (error) {
            alert("Microphone permission denied ❌");
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800/50 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Voice to Text</h2>

            <Button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className={`w-full ${isRecording ? "bg-red-500 hover:bg-red-600 text-white" : "bg-[#2563EB] hover:bg-blue-700 text-white"
                    }`}
            >
                {isRecording
                    ? "Stop Recording"
                    : isProcessing
                        ? "Processing..."
                        : "Start Recording"}
            </Button>

            {transcript && (
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Transcript:</p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm leading-relaxed">{transcript}</p>
                </div>
            )}
        </div>
    );
}