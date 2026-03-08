import { useState } from "react";
import { motion } from "motion/react";
import { Sliders, RotateCcw, Check, Sun, Contrast, Droplet, CloudFog as BlurIcon, Square, Maximize } from "lucide-react";
import { Button } from "./ui/button";
import { translations } from "../translations";

interface MediaEditorProps {
    file: File;
    uiLanguage: string;
    onApply: (filters: string, aspectRatio: string) => void;
    onCancel: () => void;
}

export function MediaEditor({ file, uiLanguage, onApply, onCancel }: MediaEditorProps) {
    const t = translations[uiLanguage] || translations["English"];
    const [filters, setFilters] = useState({
        brightness: 100,
        contrast: 100,
        saturate: 100,
        blur: 0,
    });
    const [aspectRatio, setAspectRatio] = useState("aspect-square");

    const imageUrl = URL.createObjectURL(file);

    const filterString = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) blur(${filters.blur}px)`;

    const ratios = [
        { label: "1:1", value: "aspect-square", icon: Square },
        { label: "4:5", value: "aspect-[4/5]", icon: Maximize },
        { label: "16:9", value: "aspect-video", icon: Maximize },
        { label: "9:16", value: "aspect-[9/16]", icon: Maximize },
    ];

    const resetFilters = () => {
        setFilters({
            brightness: 100,
            contrast: 100,
            saturate: 100,
            blur: 0,
        });
        setAspectRatio("aspect-square");
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col h-full bg-white dark:bg-gray-950 rounded-[40px] overflow-hidden"
        >
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                {/* Preview Area */}
                <div className="flex-1 bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-8 relative">
                    <div className={`${aspectRatio} w-full max-w-md bg-black rounded-3xl overflow-hidden shadow-2xl transition-all duration-500`}>
                        <img
                            src={imageUrl}
                            alt="Edit Preview"
                            style={{ filter: filterString }}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Controls Area */}
                <div className="w-full lg:w-80 border-l border-gray-100 dark:border-gray-800 p-8 flex flex-col gap-8 overflow-y-auto">
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
                            <Sliders className="w-4 h-4 text-blue-500" />
                            {t.stFilters}
                        </h4>

                        <div className="space-y-6">
                            {/* Brightness */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-tighter">
                                    <span className="flex items-center gap-2"><Sun className="w-3.5 h-3.5" /> {t.stBrightness}</span>
                                    <span>{filters.brightness}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="200"
                                    value={filters.brightness}
                                    onChange={(e) => setFilters({ ...filters, brightness: parseInt(e.target.value) })}
                                    className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>

                            {/* Contrast */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-tighter">
                                    <span className="flex items-center gap-2"><Contrast className="w-3.5 h-3.5" /> {t.stContrast}</span>
                                    <span>{filters.contrast}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="200"
                                    value={filters.contrast}
                                    onChange={(e) => setFilters({ ...filters, contrast: parseInt(e.target.value) })}
                                    className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>

                            {/* Saturate */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-tighter">
                                    <span className="flex items-center gap-2"><Droplet className="w-3.5 h-3.5" /> {t.stSaturate}</span>
                                    <span>{filters.saturate}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="200"
                                    value={filters.saturate}
                                    onChange={(e) => setFilters({ ...filters, saturate: parseInt(e.target.value) })}
                                    className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>

                            {/* Blur */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-tighter">
                                    <span className="flex items-center gap-2"><BlurIcon className="w-3.5 h-3.5" /> {t.stBlur}</span>
                                    <span>{filters.blur}px</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="20"
                                    value={filters.blur}
                                    onChange={(e) => setFilters({ ...filters, blur: parseInt(e.target.value) })}
                                    className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-widest">
                            <Maximize className="w-4 h-4 text-purple-500" />
                            Aspect Ratio
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            {ratios.map((r) => (
                                <button
                                    key={r.value}
                                    onClick={() => setAspectRatio(r.value)}
                                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${aspectRatio === r.value
                                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600"
                                        : "border-gray-100 dark:border-gray-800 text-gray-500 hover:border-purple-200"
                                        }`}
                                >
                                    <r.icon className="w-3 h-3" />
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto flex flex-col gap-3">
                        <Button
                            variant="outline"
                            onClick={resetFilters}
                            className="w-full h-12 rounded-2xl border-gray-200 dark:border-gray-800 font-bold text-xs uppercase tracking-widest"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            {t.stReset}
                        </Button>
                        <Button
                            onClick={() => onApply(filterString, aspectRatio)}
                            className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20"
                        >
                            <Check className="w-4 h-4 mr-2" />
                            {t.stApplyChanges}
                        </Button>
                        <button
                            onClick={onCancel}
                            className="text-xs font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-center uppercase tracking-widest py-2"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

