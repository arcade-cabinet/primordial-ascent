import { motion } from "framer-motion";
import { useState } from "react";
import { OverlayButton } from "./OverlayButton";
import { generateSeedPhrase } from "@/lib/seed";
import type { SessionMode } from "@/lib/sessionMode";

interface NewAscentModalProps {
  onStart: (mode: SessionMode, seed: string) => void;
  onCancel: () => void;
}

export function NewAscentModal({ onStart, onCancel }: NewAscentModalProps) {
  const [mode, setMode] = useState<SessionMode>("standard");
  const [seed, setSeed] = useState(() => generateSeedPhrase());

  const handleRegenerateSeed = () => {
    setSeed(generateSeedPhrase(Math.random().toString()));
  };

  const handleDailySeed = () => {
    const today = new Date().toISOString().split("T")[0];
    setSeed(generateSeedPhrase(today));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl"
      style={{ background: "rgba(18, 9, 7, 0.85)" }}
    >
      <div 
        className="w-full max-w-md rounded-2xl border border-[rgba(199,84,21,0.3)] p-8 shadow-2xl"
        style={{ 
          background: "radial-gradient(circle at top, rgba(199,84,21,0.12), rgba(18, 9, 7, 0.98))",
        }}
      >
        <h2 
          className="pa-display mb-6 text-3xl font-black tracking-tighter text-[#c75415]"
          style={{ textTransform: "uppercase" }}
        >
          New Ascent
        </h2>

        <div className="mb-8 space-y-6">
          <div>
            <label className="mb-2 block text-[0.65rem] font-bold uppercase tracking-widest text-[#a0907c]">
              Cavern Signature
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                className="flex-1 rounded-lg border border-[rgba(242,232,217,0.1)] bg-[rgba(255,255,255,0.03)] px-4 py-3 font-mono text-sm text-[#f2e8d9] focus:border-[#c75415] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleDailySeed}
                className="rounded-lg border border-[rgba(199,84,21,0.2)] bg-[rgba(199,84,21,0.05)] px-3 py-3 text-[0.6rem] font-bold uppercase tracking-wider text-[#c75415] hover:bg-[rgba(199,84,21,0.1)]"
                title="Daily Challenge Signature"
              >
                Daily
              </button>
              <button
                type="button"
                onClick={handleRegenerateSeed}
                className="rounded-lg border border-[rgba(242,232,217,0.1)] bg-[rgba(255,255,255,0.03)] p-3 text-[#a0907c] hover:text-[#f2e8d9]"
                title="Regenerate Seed"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[0.65rem] font-bold uppercase tracking-widest text-[#a0907c]">
              Pressure Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["cozy", "standard", "challenge"] as SessionMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`rounded-lg border px-3 py-2 text-[0.7rem] font-black uppercase tracking-tight transition-all ${
                    mode === m 
                      ? "border-[#c75415] bg-[rgba(199,84,21,0.1)] text-[#c75415]" 
                      : "border-[rgba(242,232,217,0.1)] bg-[rgba(255,255,255,0.03)] text-[#a0907c]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <OverlayButton onClick={() => onStart(mode, seed)} variant="primary">
            Initiate Ascent
          </OverlayButton>
          <button 
            type="button"
            onClick={onCancel}
            className="py-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#a0907c] hover:text-[#f2e8d9]"
          >
            Abort Sequence
          </button>
        </div>
      </div>
    </motion.div>
  );
}
