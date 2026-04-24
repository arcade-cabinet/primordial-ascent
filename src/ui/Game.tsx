import {
  GameOverScreen,
  GameViewport,
  OverlayButton,
  StartScreen,
  NewAscentModal,
} from "@/ui/shell";
import { PhaseTrait } from "@/store/shared-traits";
import { useRunSnapshotAutosave } from "@/hooks/useRunSnapshotAutosave";
import { recordRunResult } from "@/hooks/runtimeResult";
import {
  createInitialPrimordialState,
  getPrimordialRunSummary,
} from "@/engine/primordialSimulation";
import { PrimordialTrait } from "@/store/traits";
import { primordialEntity, primordialWorld } from "@/store/world";
import type { GameSaveSlot, SessionMode } from "@/lib/sessionMode";
import { useTrait, WorldProvider } from "koota/react";
import { Suspense, lazy, useEffect, useState } from "react";
import { audioManager } from "@/engine/audio";
import { AnimatePresence, motion } from "framer-motion";

// All three gameplay surfaces pull in @react-three/fiber, drei, rapier,
// and three. That's ~1.1MB gzipped of code a landing visitor should not
// pay for. Lazy-load them together so the landing chunk is just React,
// koota, framer-motion, and the StartScreen DOM.
const GameStage = lazy(() => import("./game/GameStage"));

function PrimordialApp() {
  const [showNewAscentModal, setShowNewAscentModal] = useState(false);
  const liveState = useTrait(primordialEntity, PrimordialTrait);
  const fallback = createInitialPrimordialState();
  const state = liveState ?? fallback;
  const summary = getPrimordialRunSummary(state);

  const handleStart = (mode: SessionMode, seed?: string, saveSlot?: GameSaveSlot) => {
    audioManager.init();
    audioManager.resume();
    const next = resolvePrimordialStartState(mode, seed, saveSlot);
    primordialEntity.set(PhaseTrait, { phase: "playing" });
    primordialEntity.set(PrimordialTrait, next);
    setShowNewAscentModal(false);
  };

  useRunSnapshotAutosave<ReturnType<typeof createInitialPrimordialState>>({
    key: "primordial-ascent:v1:save",
    paused: state.phase !== "playing",
    build: () => state,
  });

  const needsStage = state.phase === "playing" || state.phase === "gameover" || state.phase === "complete";

  return (
    <GameViewport background="#020608" data-browser-screenshot-mode="page">
      <AnimatePresence mode="wait">
        {needsStage && (
          <motion.div
            key="gameplay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <Suspense fallback={null}>
              <GameStage showOverlays={state.phase === "playing"} />
            </Suspense>
          </motion.div>
        )}

        {state.phase === "menu" && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10"
          >
            <StartScreen
              title="PRIMORDIAL ASCENT"
              subtitle="Thumb a grapple up a primal face, feel each catch, reach a variable final climb that tests what you learned."
              primaryAction={{
                label: "Initiate Sequence",
                onClick: () => setShowNewAscentModal(true),
              }}
              glowColor="var(--color-ember)"
              glowRgb="199, 84, 21"
              background={[
                "radial-gradient(ellipse 80% 60% at center 40%, rgba(199, 84, 21, 0.22), transparent 65%)",
                "radial-gradient(ellipse 40% 40% at center 60%, rgba(232, 220, 192, 0.08), transparent 70%)",
                "linear-gradient(180deg, rgba(18, 9, 7, 0.85) 0%, rgba(18, 9, 7, 0.96) 100%)",
              ].join(", ")}
              displayClassName="pa-display"
              verbs={[
                { icon: "◎", text: "Grapple the ceilings" },
                { icon: "◇", text: "Rest on moss" },
                { icon: "⟆", text: "Out-climb the lava" },
              ]}
            />
          </motion.div>
        )}

        {state.phase === "gameover" && (
          <motion.div
            key="gameover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white backdrop-blur-md"
            style={{
              background:
                "linear-gradient(180deg, rgba(20,2,2,0.74), rgba(2,6,8,0.94)), repeating-linear-gradient(0deg, rgba(255,51,51,0.22) 0 2px, transparent 2px 16px)",
            }}
            data-testid="defeat-screen"
          >
            <RunResultEffect
              phase={state.phase}
              mode={state.sessionMode}
              maxAltitude={summary.maxAltitude}
              finalDistanceToLava={summary.finalDistanceToLava}
            />
            <h1
              className="text-5xl md:text-7xl font-black uppercase tracking-[5px] mb-12 text-center text-white"
              style={{ textShadow: "0 0 20px #ff3333, 2px 2px 0px #000" }}
            >
              CONSUMED BY MAGMA
            </h1>

            <div className="grid grid-cols-2 gap-5 mb-10 bg-black/50 p-6 rounded-lg border border-slate-800">
              <div className="text-center">
                <div className="text-[10px] text-slate-400 mb-1">MAX ALTITUDE</div>
                <div className="text-3xl font-bold text-white">{state.maxAltitude}m</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-slate-400 mb-1">TIME SURVIVED</div>
                <div className="text-3xl font-bold text-white">
                  {Math.floor(state.timeSurvived / 1000)}s
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleStart(state.sessionMode)}
              className="px-12 py-4 text-xl font-bold uppercase tracking-[3px] text-[#ff3333] bg-[#ff3333]/10 border-2 border-[#ff3333] rounded hover:bg-[#ff3333] hover:text-black transition-all duration-200"
              style={{
                boxShadow: "0 0 15px rgba(255,51,51,0.2), inset 0 0 10px rgba(255,51,51,0.1)",
              }}
            >
              Retry Ascent
            </button>
          </motion.div>
        )}

        {state.phase === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30"
            data-testid="completion-screen"
          >
            <RunResultEffect
              phase={state.phase}
              mode={state.sessionMode}
              maxAltitude={summary.maxAltitude}
              finalDistanceToLava={summary.finalDistanceToLava}
            />
            <GameOverScreen
              accent="var(--color-limestone)"
              glowRgb="232, 220, 192"
              displayClassName="pa-display"
              background="radial-gradient(ellipse at center, rgba(232, 220, 192, 0.18), rgba(18, 9, 7, 0.96) 70%)"
              title="SURFACE BREACHED"
              subtitle={`Escaped in ${summary.elapsedSeconds}s at ${summary.maxAltitude}m. Final lava gap: ${summary.finalDistanceToLava}m.`}
              actions={
                <OverlayButton onClick={() => handleStart(state.sessionMode)}>
                  Climb Again
                </OverlayButton>
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNewAscentModal && (
          <NewAscentModal 
            onStart={(mode, seed) => handleStart(mode, seed)} 
            onCancel={() => setShowNewAscentModal(false)} 
          />
        )}
      </AnimatePresence>
    </GameViewport>
  );
}

function resolvePrimordialStartState(mode: SessionMode, seed?: string, saveSlot?: GameSaveSlot) {
  const snapshot = saveSlot?.snapshot;
  if (isPrimordialSnapshot(snapshot)) {
    const restored = snapshot as ReturnType<typeof createInitialPrimordialState>;
    return {
      ...restored,
      phase: "playing" as const,
      sessionMode: mode,
    };
  }

  return createInitialPrimordialState("playing", mode, seed || "void");
}

function isPrimordialSnapshot(
  snapshot: unknown
): snapshot is ReturnType<typeof createInitialPrimordialState> {
  const value = snapshot as Partial<ReturnType<typeof createInitialPrimordialState>> | undefined;
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof value.altitude === "number" &&
      typeof value.maxAltitude === "number" &&
      typeof value.timeSurvived === "number" &&
      typeof value.distToLava === "number"
  );
}

export default function Game() {
  return (
    <WorldProvider world={primordialWorld}>
      <PrimordialApp />
    </WorldProvider>
  );
}

interface RunResultEffectProps {
  phase: string;
  mode: SessionMode;
  maxAltitude: number;
  finalDistanceToLava: number;
}

function RunResultEffect({
  phase,
  mode,
  maxAltitude,
  finalDistanceToLava,
}: RunResultEffectProps) {
  useEffect(() => {
    if (phase === "gameover") {
      recordRunResult({
        mode,
        score: maxAltitude,
        status: "failed",
        summary: `Consumed at ${maxAltitude}m`,
      });
    } else if (phase === "complete") {
      audioManager.playCompletion();
      recordRunResult({
        mode,
        score: maxAltitude + finalDistanceToLava * 10,
        status: "completed",
        summary: `Escaped at ${maxAltitude}m`,
        milestones: ["first-surface-breach"],
      });
    }
  }, [phase, mode, maxAltitude, finalDistanceToLava]);
  return null;
}
