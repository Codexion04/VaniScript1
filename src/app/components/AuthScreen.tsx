import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { motion } from "motion/react";
import { signUp, signIn, confirmSignUp } from "aws-amplify/auth";
import { translations } from "../translations";
import { Globe } from "lucide-react";

interface AuthScreenProps {
  onAuthenticate: () => void;
  uiLanguage: string;
  setUiLanguage: (lang: string) => void;
}

export function AuthScreen({ onAuthenticate, uiLanguage, setUiLanguage }: AuthScreenProps) {
  const t = translations[uiLanguage] || translations["English"];
  const [isSignIn, setIsSignIn] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignIn) {
        await signIn({
          username: email,
          password: password,
        });

        alert(t.authLoginSuccess);
        onAuthenticate();
      } else {
        await signUp({
          username: email,
          password: password,
          options: {
            userAttributes: {
              name: fullName,
              email: email,
            },
          },
        });

        setNeedsVerification(true);
        alert(t.authCodeSent);
      }
    } catch (error: any) {
      alert(error.message || "Something went wrong");
    }

    setLoading(false);
  };

  const handleVerify = async () => {
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: verificationCode,
      });

      alert(t.authAccountVerified);
      setNeedsVerification(false);
      setIsSignIn(true);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Language Picker Overlay */}
      <div className="absolute top-6 right-6 z-50">
        <div className="bg-white/80 backdrop-blur-md p-1 rounded-2xl border border-gray-100 shadow-xl flex gap-1">
          {["English", "Hindi", "Marathi", "Tamil"].map((lang) => (
            <button
              key={lang}
              onClick={() => setUiLanguage(lang)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${uiLanguage === lang
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-gray-500 hover:bg-gray-100"
                }`}
            >
              {lang === 'English' ? 'EN' : lang === 'Hindi' ? 'HI' : lang === 'Marathi' ? 'MR' : 'TA'}
            </button>
          ))}
        </div>
      </div>

      {/* Left Section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#2563EB] to-[#7C3AED] items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1687392946857-96c2b7f94b0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 text-center px-12">
          <h1 className="text-6xl font-black text-white mb-6 tracking-tight">
            {t.authWelcome}
          </h1>
          <p className="text-xl text-white/90 max-w-md mx-auto font-medium">
            {t.authTagline}
          </p>
        </div>
      </motion.div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 p-8 lg:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600" />

            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                {isSignIn ? t.authSignIn : t.authSignUp}
              </h2>
            </div>

            {/* Toggle */}
            <div className="flex gap-2 p-1.5 bg-gray-100 rounded-[24px] mb-8">
              <button
                onClick={() => setIsSignIn(true)}
                className={`flex-1 py-3 text-xs font-bold rounded-[18px] transition-all ${isSignIn ? "bg-white text-blue-600 shadow-md" : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {t.authSignIn}
              </button>
              <button
                onClick={() => setIsSignIn(false)}
                className={`flex-1 py-3 text-xs font-bold rounded-[18px] transition-all ${!isSignIn ? "bg-white text-blue-600 shadow-md" : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {t.authSignUp}
              </button>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleAuth}>
              {!isSignIn && (
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{t.authFullName}</Label>
                  <Input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-14 rounded-2xl bg-gray-50 border-transparent focus:border-blue-500 transition-all font-medium"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{t.authEmail}</Label>
                <Input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 rounded-2xl bg-gray-50 border-transparent focus:border-blue-500 transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{t.authPassword}</Label>
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 rounded-2xl bg-gray-50 border-transparent focus:border-blue-500 transition-all font-medium"
                />
              </div>

              {needsVerification && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{t.authVerificationCode}</Label>
                    <Input
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="h-14 rounded-2xl bg-gray-50 border-transparent focus:border-blue-500 transition-all font-medium text-center text-2xl tracking-[0.5em]"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleVerify}
                    className="w-full h-14 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold text-lg"
                  >
                    {t.authVerifyBtn}
                  </Button>
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 mt-4"
              >
                {loading
                  ? t.authPleaseWait
                  : isSignIn
                    ? t.authSignIn
                    : t.authSignUp}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}