"use client";
// =============================================================
// GUIDED WORKOUT PLAYER — Step-by-step calm movement player
// with breathing cues, safe form notes, gentle chime, and
// simple timer toggle.
// =============================================================
import { useState, useEffect, useMemo, useCallback } from "react";
import { Exercise, WorkoutDay, enrichExercise } from "@/lib/planGenerator";
import ExerciseDemoDisplay from "@/components/ExerciseDemoDisplay";
import BreathingPacer from "@/components/BreathingPacer";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Wind,
  Heart,
  Timer,
  Sparkles,
  CheckCircle2,
  Droplets,
  Mic,
  MicOff,
} from "lucide-react";

interface SessionStep {
  id: string;
  phase: "Warm-Up" | "Movement" | "Breathe & Sip" | "Cool-Down";
  roundLabel?: string;
  title: string;
  durationLabel: string;
  seconds: number;
  focus: string;
  formCues: string[];
  breathingCue: string;
  gentleVariation?: string;
}

/** Soft calming Web Audio chime (won't wake a sleeping baby) */
function playSoftChime(type: "step" | "complete" = "step") {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const notes = type === "complete" ? [523.25, 659.25, 783.99] : [523.25, 659.25];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.14);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + idx * 0.14 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.14 + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.14);
      osc.stop(ctx.currentTime + idx * 0.14 + 0.7);
    });
  } catch {
    // Audio playback blocked or unavailable; ignore gracefully
  }
}

interface GuidedWorkoutPlayerProps {
  workout: WorkoutDay;
  targetMinutes: number;
  isGentleMode: boolean;
  onCompleteWorkout?: () => void;
  isCompleted?: boolean;
  compact?: boolean;
}

export default function GuidedWorkoutPlayer({
  workout,
  targetMinutes,
  isGentleMode,
  onCompleteWorkout,
  isCompleted = false,
  compact = false,
}: GuidedWorkoutPlayerProps) {
  const [mode, setMode] = useState<"guided" | "simple">("guided");
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [voiceOn, setVoiceOn] = useState<boolean>(false);
  const [showGentleTip, setShowGentleTip] = useState<boolean>(isGentleMode);
  const [showBreathVideo, setShowBreathVideo] = useState<boolean>(false);

  // Sync gentle tip display when parent gentle mode toggles
  useEffect(() => {
    setShowGentleTip(isGentleMode);
  }, [isGentleMode]);

  // Build ordered follow-along steps from workout phases
  const steps: SessionStep[] = useMemo(() => {
    const list: SessionStep[] = [];

    workout.warmup.forEach((raw, idx) => {
      const ex = enrichExercise(raw);
      list.push({
        id: `warm-${idx}`,
        phase: "Warm-Up",
        title: ex.name,
        durationLabel: ex.duration,
        seconds: ex.seconds || 45,
        focus: ex.focus || "Warm-Up",
        formCues: ex.formCues || [],
        breathingCue: ex.breathingCue || "Slow steady nasal breathing.",
        gentleVariation: ex.gentleVariation,
      });
    });

    const rounds = targetMinutes >= 30 ? 3 : targetMinutes <= 10 ? 1 : 2;
    for (let r = 1; r <= rounds; r++) {
      workout.exercises.forEach((raw, idx) => {
        const ex: Exercise = enrichExercise(raw);
        list.push({
          id: `ex-r${r}-${idx}`,
          phase: "Movement",
          roundLabel: rounds > 1 ? `Round ${r} of ${rounds}` : "Main Set",
          title: ex.name,
          durationLabel: ex.duration,
          seconds: ex.seconds || 50,
          focus: ex.focus || "Strength",
          formCues: ex.formCues || [],
          breathingCue: ex.breathingCue || "Exhale smoothly on effort.",
          gentleVariation: ex.gentleVariation,
        });

        // Add gentle recovery pause between movements
        const isLastExerciseOfLastRound =
          r === rounds && idx === workout.exercises.length - 1;
        if (!isLastExerciseOfLastRound) {
          list.push({
            id: `rest-r${r}-${idx}`,
            phase: "Breathe & Sip",
            roundLabel: rounds > 1 ? `Round ${r} of ${rounds}` : undefined,
            title: "Catch Your Breath & Sip Water",
            durationLabel: "20 seconds",
            seconds: 20,
            focus: "Recovery",
            formCues: [
              "Shake out your wrists and drop your shoulders away from your ears.",
              "Take a quick sip of water if nearby before the next move.",
            ],
            breathingCue: "Deep inhale for 4 seconds, long soft exhale for 6 seconds.",
          });
        }
      });
    }

    workout.cooldown.forEach((raw, idx) => {
      const ex = enrichExercise(raw);
      list.push({
        id: `cool-${idx}`,
        phase: "Cool-Down",
        title: ex.name,
        durationLabel: ex.duration,
        seconds: ex.seconds || 50,
        focus: ex.focus || "Restore",
        formCues: ex.formCues || [],
        breathingCue: ex.breathingCue || "Slow restorative sighing exhale.",
        gentleVariation: ex.gentleVariation,
      });
    });

    return list;
  }, [workout, targetMinutes]);

  // Guided step state
  const [stepIndex, setStepIndex] = useState(0);
  const [stepSecondsLeft, setStepSecondsLeft] = useState(steps[0]?.seconds || 45);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);

  // Simple countdown timer state
  const simpleTotalSeconds = targetMinutes * 60;
  const [simpleSecondsLeft, setSimpleSecondsLeft] = useState(simpleTotalSeconds);

  // Reset when workout day or duration changes
  useEffect(() => {
    setStepIndex(0);
    setStepSecondsLeft(steps[0]?.seconds || 45);
    setSimpleSecondsLeft(targetMinutes * 60);
    setIsRunning(false);
    setSessionFinished(false);
  }, [workout.day, workout.week, steps, targetMinutes]);

  const currentStep = steps[stepIndex] || steps[0];

  // Voice Coach speaker (Web Speech API, completely free & safe for sleeping babies when muted)
  const speakPrompt = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.94;
      utter.pitch = 1.02;
      window.speechSynthesis.speak(utter);
    } catch {
      // Speech synthesis unavailable; ignore cleanly
    }
  }, []);

  useEffect(() => {
    if (mode !== "guided" || !isRunning || !voiceOn || sessionFinished || !currentStep) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }
    const cueText = currentStep.formCues?.[0] || currentStep.breathingCue;
    speakPrompt(`${currentStep.title}. ${cueText}`);

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [mode, isRunning, voiceOn, sessionFinished, currentStep, speakPrompt]);

  const goToStep = useCallback(
    (nextIdx: number, keepRunning = false) => {
      if (nextIdx >= steps.length) {
        setIsRunning(false);
        setSessionFinished(true);
        if (soundOn) playSoftChime("complete");
        onCompleteWorkout?.();
        return;
      }
      if (nextIdx < 0) return;
      setStepIndex(nextIdx);
      setStepSecondsLeft(steps[nextIdx].seconds);
      setSessionFinished(false);
      if (!keepRunning) {
        // Keep current play state when user clicks next/prev
      }
    },
    [steps, soundOn, onCompleteWorkout]
  );

  // Timer tick effect (pure state decrements only, safe in React 18 StrictMode)
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      if (mode === "guided") {
        setStepSecondsLeft((prev) => Math.max(0, prev - 1));
      } else {
        setSimpleSecondsLeft((prev) => Math.max(0, prev - 1));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, mode]);

  // Step transition & completion handler
  useEffect(() => {
    if (!isRunning) return;

    if (mode === "guided" && stepSecondsLeft === 0) {
      const nextIdx = stepIndex + 1;
      if (nextIdx >= steps.length) {
        setIsRunning(false);
        setSessionFinished(true);
        if (soundOn) playSoftChime("complete");
        onCompleteWorkout?.();
      } else {
        if (soundOn) playSoftChime("step");
        setStepIndex(nextIdx);
        setStepSecondsLeft(steps[nextIdx].seconds);
      }
    } else if (mode === "simple" && simpleSecondsLeft === 0) {
      setIsRunning(false);
      setSessionFinished(true);
      if (soundOn) playSoftChime("complete");
      onCompleteWorkout?.();
    }
  }, [
    isRunning,
    mode,
    stepSecondsLeft,
    simpleSecondsLeft,
    stepIndex,
    steps,
    soundOn,
    onCompleteWorkout,
  ]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Calculate remaining guided session time
  const totalGuidedRemaining = useMemo(() => {
    if (!steps.length) return 0;
    const futureSeconds = steps
      .slice(stepIndex + 1)
      .reduce((acc, s) => acc + s.seconds, 0);
    return stepSecondsLeft + futureSeconds;
  }, [steps, stepIndex, stepSecondsLeft]);

  const progressPct =
    currentStep && currentStep.seconds > 0
      ? Math.round(((currentStep.seconds - stepSecondsLeft) / currentStep.seconds) * 100)
      : 0;

  const overallGuidedPct =
    steps.length > 0 ? Math.round(((stepIndex + 1) / steps.length) * 100) : 0;

  const phaseBadgeColor =
    currentStep?.phase === "Warm-Up"
      ? "bg-peach-200 text-plum"
      : currentStep?.phase === "Breathe & Sip"
      ? "bg-blush-100 text-plum"
      : currentStep?.phase === "Cool-Down"
      ? "bg-sage-100 text-sage-700"
      : "bg-plum text-white";

  if (!currentStep) return null;

  return (
    <div className="bg-cream-50 rounded-2xl border border-peach-200 overflow-hidden shadow-xs">
      {/* Top Mode & Audio Bar */}
      <div className="bg-peach-50/80 border-b border-peach-200/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex bg-white p-0.5 rounded-xl border border-peach-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setIsRunning(false);
              setMode("guided");
            }}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              mode === "guided"
                ? "bg-plum text-white shadow-xs"
                : "text-plum/70 hover:text-plum"
            }`}
          >
            <Sparkles className="w-3 h-3" /> Guided Follow-Along
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRunning(false);
              setMode("simple");
            }}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              mode === "simple"
                ? "bg-plum text-white shadow-xs"
                : "text-plum/70 hover:text-plum"
            }`}
          >
            <Timer className="w-3 h-3" /> {targetMinutes}-Min Clock
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setVoiceOn(!voiceOn)}
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${
              voiceOn
                ? "bg-plum text-white border-plum"
                : "bg-white text-plum/70 hover:text-plum border-peach-200"
            }`}
            title={voiceOn ? "Turn off spoken voice coach" : "Turn on spoken voice coach"}
          >
            {voiceOn ? (
              <>
                <Mic className="w-3.5 h-3.5" /> Voice Coach On
              </>
            ) : (
              <>
                <MicOff className="w-3.5 h-3.5 text-plum/45" /> Voice Off
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSoundOn(!soundOn)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-plum/70 hover:text-plum bg-white px-2.5 py-1.5 rounded-lg border border-peach-200 transition-colors"
            title={soundOn ? "Mute gentle transition chime" : "Enable gentle transition chime"}
          >
            {soundOn ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-sage-600" /> Chime On
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-plum/40" /> Muted
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mode Body */}
      {mode === "guided" ? (
        <div className={compact ? "p-4 space-y-4" : "p-5 sm:p-6 space-y-5"}>
          {sessionFinished || isCompleted ? (
            <div className="bg-sage-50 border border-sage-200 rounded-2xl p-5 text-center space-y-3">
              <CheckCircle2 className="w-9 h-9 text-sage-600 mx-auto" />
              <div>
                <h3 className="font-heading font-bold text-xl text-plum">
                  {sessionFinished ? "Session Complete, Mama! 🌸" : "Today's Workout Completed!"}
                </h3>
                <p className="text-xs text-plum/75 mt-1">
                  You showed up for your body today. Grab a glass of water and enjoy the rest of your day.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStepIndex(0);
                  setStepSecondsLeft(steps[0].seconds);
                  setSessionFinished(false);
                  setIsRunning(false);
                }}
                className="btn-secondary py-2 px-4 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Replay Session
              </button>
            </div>
          ) : (
            <>
              {/* Step progress bar & step counter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-plum/65">
                  <span>
                    Step {stepIndex + 1} of {steps.length}
                    {currentStep.roundLabel ? ` • ${currentStep.roundLabel}` : ""}
                  </span>
                  <span>~{formatTime(totalGuidedRemaining)} remaining</span>
                </div>
                <div className="w-full h-1.5 bg-peach-200/70 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-plum rounded-full transition-all duration-300"
                    style={{ width: `${overallGuidedPct}%` }}
                  />
                </div>
              </div>

              {/* Active Move Header + Countdown Ring */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-peach-100 shadow-xs">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${phaseBadgeColor}`}>
                      {currentStep.phase}
                    </span>
                    <span className="text-[11px] font-medium text-plum/65 bg-cream-50 px-2 py-0.5 rounded-md border border-peach-100">
                      Focus: {currentStep.focus}
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-xl text-plum leading-snug">
                    {currentStep.title}
                  </h4>
                  <p className="text-xs font-semibold text-plum/70">
                    Target: {currentStep.durationLabel}
                  </p>
                </div>

                {/* Circular Visual Timer */}
                <div className="flex items-center justify-center sm:justify-end gap-3 shrink-0">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        stroke="#FFECE2"
                        strokeWidth="6"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        stroke={currentStep.phase === "Breathe & Sip" ? "#A8C3A0" : "#4A2C40"}
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 34}
                        strokeDashoffset={
                          2 * Math.PI * 34 * (1 - progressPct / 100)
                        }
                        className="transition-all duration-500"
                      />
                    </svg>
                    <span className="absolute font-mono font-extrabold text-lg text-plum">
                      {formatTime(stepSecondsLeft)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Guided Video Demonstration OR Interactive 4-6 Breathing Pacer */}
              {currentStep.phase === "Breathe & Sip" ? (
                <BreathingPacer controlledActive={isRunning} compact={compact} />
              ) : currentStep.title.toLowerCase().includes("deep breathing") ? (
                <div className="space-y-2">
                  {showBreathVideo ? (
                    <ExerciseDemoDisplay
                      exerciseName={currentStep.title}
                      isPlaying={isRunning}
                      compact={compact}
                    />
                  ) : (
                    <BreathingPacer controlledActive={isRunning} compact={compact} />
                  )}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setShowBreathVideo(!showBreathVideo)}
                      className="text-[11px] font-bold text-plum/70 hover:text-plum underline"
                    >
                      {showBreathVideo
                        ? "Switch back to visual 4-6 pacer"
                        : "Watch YouTube breathing tutorial instead"}
                    </button>
                  </div>
                </div>
              ) : (
                <ExerciseDemoDisplay
                  exerciseName={currentStep.title}
                  isPlaying={isRunning}
                  compact={compact}
                />
              )}

              {/* Form Cues & Breathing Tip */}
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-peach-100 space-y-1.5">
                  <span className="font-bold text-plum/80 uppercase tracking-wider text-[10px] block">
                    Safe Form Cues
                  </span>
                  <ul className="space-y-1 text-plum/80 leading-relaxed">
                    {currentStep.formCues.map((cue, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-peach-400 font-bold">•</span>
                        <span>{cue}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="bg-sage-50 p-3.5 rounded-xl border border-sage-200/80 space-y-1">
                    <span className="font-bold text-sage-700 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <Wind className="w-3 h-3" /> Breathing Cue
                    </span>
                    <p className="text-plum/85 leading-relaxed">{currentStep.breathingCue}</p>
                  </div>

                  {currentStep.gentleVariation && (
                    <div className="bg-blush-50/80 p-3 rounded-xl border border-blush-200/70">
                      <button
                        type="button"
                        onClick={() => setShowGentleTip(!showGentleTip)}
                        className="w-full flex items-center justify-between text-[11px] font-bold text-plum"
                      >
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-blush-400 fill-blush-300" />
                          Gentle / Easier Option
                        </span>
                        <span className="text-plum/60 underline">
                          {showGentleTip ? "Hide" : "Show"}
                        </span>
                      </button>
                      {showGentleTip && (
                        <p className="text-xs text-plum/80 mt-1.5 leading-relaxed">
                          {currentStep.gentleVariation}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => goToStep(stepIndex - 1)}
                  disabled={stepIndex === 0}
                  className="btn-secondary py-2.5 px-3.5 text-xs disabled:opacity-40"
                  title="Previous step"
                >
                  <SkipBack className="w-4 h-4" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!isRunning && soundOn && stepSecondsLeft === currentStep.seconds) {
                      playSoftChime("step");
                    }
                    setIsRunning(!isRunning);
                  }}
                  className="btn-primary py-3 px-6 text-sm flex-1 max-w-xs"
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4" /> Pause Move
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />{" "}
                      {stepIndex === 0 && stepSecondsLeft === currentStep.seconds
                        ? "Start Guided Session"
                        : "Resume Move"}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => goToStep(stepIndex + 1)}
                  className="btn-secondary py-2.5 px-3.5 text-xs"
                  title="Next step"
                >
                  <span className="hidden sm:inline">
                    {stepIndex === steps.length - 1 ? "Finish" : "Next"}
                  </span>
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        /* Simple Countdown Clock View */
        <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-peach-200 flex items-center justify-center text-plum shadow-xs">
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-plum/60 block">
                Full Routine Clock
              </span>
              <span className="text-3xl font-heading font-extrabold text-plum font-mono">
                {formatTime(simpleSecondsLeft)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsRunning(!isRunning)}
              className="btn-primary py-2.5 px-5 text-sm flex-1 sm:flex-initial"
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Start Timer
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsRunning(false);
                setSimpleSecondsLeft(simpleTotalSeconds);
              }}
              className="btn-secondary py-2.5 px-3.5 text-xs"
              title="Reset timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Quick encouragement footer inside player */}
      {!compact && mode === "guided" && !sessionFinished && !isCompleted && (
        <div className="bg-peach-50/50 border-t border-peach-100 px-4 py-2 flex items-center justify-center gap-2 text-[11px] text-plum/65">
          <Droplets className="w-3.5 h-3.5 text-sage-600" />
          Pause anytime if baby calls — your spot stays right where you left it.
        </div>
      )}
    </div>
  );
}
