import { Globe, Moon, Sun, Monitor } from "lucide-react";
import { motion } from "motion/react";
import { translations } from "../translations";

interface SettingsPageProps {
    uiLanguage: string;
    setUiLanguage: (lang: string) => void;
    isDarkMode: boolean;
    setIsDarkMode: (value: boolean) => void;
}

export function SettingsPage({ uiLanguage, setUiLanguage, isDarkMode, setIsDarkMode }: SettingsPageProps) {
    const t = translations[uiLanguage] || translations["English"];

    const languages = ["English", "Hindi", "Marathi", "Tamil"];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
        >
            <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.sideSettings}</h1>
                    <p className="text-gray-500 dark:text-gray-400">{t.settTitle}</p>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Language Selection */}
                <section className="bg-white dark:bg-gray-800 rounded-[32px] p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                        <Globe className="w-5 h-5 text-blue-500" />
                        {t.settLanguage}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {languages.map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setUiLanguage(lang)}
                                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${uiLanguage === lang
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold"
                                    : "border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400"
                                    }`}
                            >
                                <span className="text-lg">{lang === "English" ? "🇺🇸" : lang === "Hindi" ? "🇮🇳" : lang === "Marathi" ? "🚩" : "🕉️"}</span>
                                {lang}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Theme Selection */}
                <section className="bg-white dark:bg-gray-800 rounded-[32px] p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                        <Monitor className="w-5 h-5 text-purple-500" />
                        {t.settTheme}
                    </h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsDarkMode(false)}
                            className={`flex-1 p-6 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 ${!isDarkMode
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                                : "border-gray-100 dark:border-gray-700 text-gray-500"
                                }`}
                        >
                            <Sun className="w-5 h-5" />
                            <span className="font-bold">{t.settLight}</span>
                        </button>
                        <button
                            onClick={() => setIsDarkMode(true)}
                            className={`flex-1 p-6 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 ${isDarkMode
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600"
                                : "border-gray-100 dark:border-gray-700 text-gray-500"
                                }`}
                        >
                            <Moon className="w-5 h-5" />
                            <span className="font-bold">{t.settDark}</span>
                        </button>
                    </div>
                </section>
            </div>
        </motion.div>
    );
}
