"use client";
// =============================================================
// BREATHING PACER — Guided 4s Inhale / 6s Pelvic-Floor Exhale
// Interactive visual pacer for Rest Days, Stress Resets, and
// Breathe & Sip breaks between exercises.
// =============================================================
import { useState, useEffect } from "react";
import { Wind, Play, Pause, RotateCcw } from "lucide-react";

interface BreathingPacerProps {
  /** If passed, syncs Play/Pause automatically with parent player */
  controlledActive?: boolean;
  compact?: boolean;
}

export default function BreathingPacer({
  controlledActive,
  compact = false,
}: BreathingPacerProps) {
  const isControlled = typeof controlledActive === "boolean";
  const [localActive, setLocalActive] = useState<boolean>(false);
  const active = isControlled ? controlledActive : localActive;

  // 10-second loop: 0..3 = Inhale (4s), 4..9 = Exhale (6s)
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setTick((prev) => (prev + 1) % 10);
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  const isInhale = tick < 4;
  const countdown = isInhale ? 4 - tick : 10 - tick;

  return (
    <div
      className={`bg-sage-50/80 border border-sage-200 rounded-2xl text-center space-y-3 ${
        compact ? "p-3.5" : "p-5"
      }`}
    >
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold uppercase tracking-wider text-sage-700 flex items-center gap-1.5">
          <Wind className="w-3.5 h-3.5" /> 4-6 Calm Breath Pacer
        </span>
        {!isControlled && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setLocalActive(!localActive)}
              className="inline-flex items-center gap-1 bg-plum text-white px-3 py-1 rounded-lg font-semibold hover:bg-plum-500 transition-colors"
            >
              {localActive ? (
                <>
                  <Pause className="w-3 h-3" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" /> Start Pacer
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setLocalActive(false);
                setTick(0);
              }}
              className="p-1.5 rounded-lg bg-white border border-sage-200 text-plum/70 hover:text-plum"
              title="Reset breath cycle"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-1">
        {/* Expanding / Contracting Calm Orb */}
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-1000 ease-in-out ${
              active
                ? isInhale
                  ? "scale-110 bg-sage-300/70"
                  : "scale-75 bg-peach-200/80"
                : "scale-95 bg-sage-200/60"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center font-heading font-extrabold text-lg text-plum">
              {active ? `${countdown}s` : "4–6"}
            </div>
          </div>
        </div>

        <div className="text-left max-w-xs space-y-1">
          <p className="font-heading font-bold text-base text-plum">
            {!active
              ? "Ready for 1 quiet breath cycle?"
              : isInhale
              ? "Inhale Slowly Through Nose"
              : "Long Soft Exhale & Relax"}
          </p>
          <p className="text-xs text-plum/75 leading-relaxed">
            {!active
              ? "4s gentle nose inhale followed by a 6s exhale lowers cortisol and gently supports your pelvic floor."
              : isInhale
              ? "Feel your lower ribs expand gently 360° while your belly softens."
              : "Breathe out calmly and lightly draw lower belly upward like blowing out a warm candle."}
          </p>
        </div>
      </div>
    </div>
  );
}
