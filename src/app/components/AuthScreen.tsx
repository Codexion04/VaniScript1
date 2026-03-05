import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { motion } from "motion/react";
import { signUp, signIn, confirmSignUp } from "aws-amplify/auth";

interface AuthScreenProps {
  onAuthenticate: () => void;
}

export function AuthScreen({ onAuthenticate }: AuthScreenProps) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [fullName, setFullName] = useState(""); // ✅ Added
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
        // SIGN IN
        await signIn({
          username: email,
          password: password,
        });

        alert("Login successful!");
        onAuthenticate();
      } else {
        // SIGN UP
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
        alert("Verification code sent to your email.");
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

      alert("Account verified! Please sign in.");
      setNeedsVerification(false);
      setIsSignIn(true);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex">
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
          <h1 className="text-5xl font-bold text-white mb-6">
            Vaniscript
          </h1>
          <p className="text-xl text-white/90 max-w-md mx-auto">
            Your AI-Powered Social Media Manager.
          </p>
        </div>
      </motion.div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-xl border p-8 lg:p-10">

            {/* Toggle */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl mb-8">
              <button
                onClick={() => setIsSignIn(true)}
                className={`flex-1 py-3 rounded-xl ${isSignIn ? "bg-white shadow-md" : "text-gray-600"
                  }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignIn(false)}
                className={`flex-1 py-3 rounded-xl ${!isSignIn ? "bg-white shadow-md" : "text-gray-600"
                  }`}
              >
                Create Account
              </button>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleAuth}>

              {/* Full Name (Only for Signup) */}
              {!isSignIn && (
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Verification Step */}
              {needsVerification && (
                <div className="space-y-2">
                  <Label>Verification Code</Label>
                  <Input
                    type="text"
                    placeholder="Enter code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                  <Button
                    type="button"
                    onClick={handleVerify}
                    className="w-full"
                  >
                    Verify Account
                  </Button>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#2563EB] text-white rounded-xl"
              >
                {loading
                  ? "Please wait..."
                  : isSignIn
                    ? "Sign In"
                    : "Create Account"}
              </Button>
            </form>

          </div>
        </motion.div>
      </div>
    </div>
  );
}