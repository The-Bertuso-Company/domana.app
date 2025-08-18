"use client";

import { useState, useEffect } from "react";
import { INVITE_CODE } from "./invite.config";
import { motion, AnimatePresence } from "framer-motion";

export default function InviteGate({ children }: { children: React.ReactNode }) {
  // phase: "locked" → "welcome" → "form"
  const [phase, setPhase] = useState<"locked" | "welcome" | "form">("locked");
  const [code, setCode] = useState("");

  // On first load, check if already unlocked
  useEffect(() => {
    const unlocked = localStorage.getItem("domana-beta-access");
    if (unlocked === "welcome") setPhase("welcome");
    if (unlocked === "form") setPhase("form");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() === INVITE_CODE) {
      setPhase("welcome");
      localStorage.setItem("domana-beta-access", "welcome");
    } else {
      alert("Invalid code. Please try again.");
    }
  };

  const handleContinue = () => {
    setPhase("form");
    localStorage.setItem("domana-beta-access", "form");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50">
      <AnimatePresence mode="wait">
        {phase === "locked" && (
          <>
            {/* Dimmed overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-black z-0"
            />

            {/* Invite form */}
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative z-10 w-full max-w-sm bg-white border rounded-xl shadow-lg p-6 text-center"
            >
              <h2 className="text-lg font-semibold mb-4">Enter Invite Code</h2>
              <input
                className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Invite code"
              />
              <button
                type="submit"
                className="w-full rounded bg-black text-white py-2 font-medium hover:bg-gray-800"
              >
                Continue
              </button>
              <p className="text-xs opacity-70 mt-3">
                Ask Domana for a code to join the private beta.
              </p>
            </motion.form>
          </>
        )}

        {phase === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md bg-white border rounded-xl shadow-lg p-8 text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Welcome to Domana Beta 🎉</h2>
            <p className="mb-6 text-gray-600">
              Thank you for joining our private beta. You’re helping us shape the
              future of real estate in the Philippines.
              <br />
              Please continue to the signup form below to complete your tester
              access.
            </p>
            <button
              onClick={handleContinue}
              className="w-full rounded bg-black text-white py-2 font-medium hover:bg-gray-800"
            >
              Continue to Form
            </button>
          </motion.div>
        )}

        {phase === "form" && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full relative z-10"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
