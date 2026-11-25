"use client";
// =============================================================
// SAMPLE WORKOUT PLAYER — Interactive preview on Landing Page
// Lets moms try the step-by-step guided player right away.
// =============================================================
import { useState } from "react";
import Link from "next/link";
import GuidedWorkoutPlayer from "@/components/GuidedWorkoutPlayer";
import { WorkoutDay } from "@/lib/planGenerator";
import { ChevronRight, PlayCircle, ListChecks, Sparkles } from "lucide-react";

const SAMPLE_WORKOUT: WorkoutDay = {
  day: 1,
  week: 1,
  weekTheme: "Gentle Sample Session",
  focusTitle: "Day 1 Sample: Total Body Energizer",
  dayOfWeek: "Sample",
  isRestDay: false,
  warmup: [
    {
      name: "March in place",
      duration: "1 minute",
      seconds: 60,
      focus: "Circulation",
      formCues: [
        "Stand tall with relaxed shoulders and gentle arm swings.",
        "Keep knees comfortable and soft on your feet.",
      ],
      breathingCue: "Inhale through your nose for 3 steps, exhale softly for 3 steps.",
      gentleVariation: "Seated knee marches on a dining chair.",
    },
    {
      name: "Shoulder rolls & chest opener",
      duration: "45 seconds",
      seconds: 45,
      focus: "Feeding Posture",
      formCues: [
        "Roll shoulders forward, up, back, and down in wide smooth loops.",
        "Open chest gently after holding baby or typing.",
      ],
      breathingCue: "Inhale as shoulders lift; exhale long as you drop them down.",
      gentleVariation: "Seated leaning softly against a cushion.",
    },
  ],
  exercises: [
    {
      name: "Supported Chair Squats",
      duration: "10–12 reps (50s)",
      seconds: 50,
      focus: "Legs & Safe Lifting",
      formCues: [
        "Stand in front of a dining chair, sit hips gently back until tapping seat.",
        "Keep weight balanced in heels and press upright cleanly.",
      ],
      breathingCue: "Inhale sitting back; exhale lifting pelvic floor gently as you stand.",
      gentleVariation: "Pause seated for 1 second before standing back up.",
    },
    {
      name: "Gentle glute bridges",
      duration: "10–12 reps (55s)",
      seconds: 55,
      focus: "Glutes & Lower Back",
      formCues: [
        "Lie on mat with knees bent; lift hips smoothly only a few inches.",
        "Avoid arching lower back or flaring ribs at top.",
      ],
      breathingCue: "Exhale softly hugging lower belly in as hips rise.",
      gentleVariation: "Place a soft cushion between knees for pelvic stability.",
    },
    {
      name: "Wall push-ups",
      duration: "10 reps (45s)",
      seconds: 45,
      focus: "Arms & Core",
      formCues: [
        "Stand arm's length from a wall, hands shoulder height.",
        "Lower chest calmly toward wall with elbows angled slightly down.",
      ],
      breathingCue: "Inhale lowering in; exhale pressing back tall.",
      gentleVariation: "Step closer to wall for lighter upper body load.",
    },
  ],
  cooldown: [
    {
      name: "Child's pose",
      duration: "1 minute",
      seconds: 60,
      focus: "Lower Back Release",
      formCues: [
        "Knees wide, big toes touching, rest forehead onto hands or a pillow.",
      ],
      breathingCue: "Let your back ribs expand smoothly on each slow inhale.",
      gentleVariation: "Stay upright in tabletop with gentle cat-cow waves.",
    },
    {
      name: "Deep breathing (inhale 4s, exhale 6s)",
      duration: "1 minute",
      seconds: 60,
      focus: "Calm Nervous System",
      formCues: [
        "Place one hand on chest, one on belly — relax your jaw completely.",
      ],
      breathingCue: "4s calm nose inhale → 6s slow calming exhale.",
      gentleVariation: "Close eyes softly seated on your sofa.",
    },
  ],
};

export default function SampleWorkoutPlayer() {
  const [view, setView] = useState<"interactive" | "overview">("interactive");
  const [sampleGentle, setSampleGentle] = useState<boolean>(true);

  return (
    <div className="card-soft text-left space-y-6 border-2 border-blush-200 shadow-soft-md">
      {/* Header + View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-peach-200">
        <div>
          <h3 className="font-heading font-bold text-xl sm:text-2xl text-plum">
            Day 1 Sample: Total Body Energizer
          </h3>
          <p className="text-xs text-plum/65 mt-0.5">
            Equipment: None • Level: Gentle / Postpartum & Beginner friendly
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex bg-cream-50 p-1 rounded-xl border border-peach-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setView("interactive")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                view === "interactive"
                  ? "bg-plum text-white shadow-xs"
                  : "text-plum/70 hover:text-plum"
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5" /> Interactive Player
            </button>
            <button
              type="button"
              onClick={() => setView("overview")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                view === "overview"
                  ? "bg-plum text-white shadow-xs"
                  : "text-plum/70 hover:text-plum"
              }`}
            >
              <ListChecks className="w-3.5 h-3.5" /> Full Overview
            </button>
          </div>
        </div>
      </div>

      {view === "interactive" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-peach-50/70 px-3.5 py-2.5 rounded-xl border border-peach-200/70 text-xs">
            <span className="font-medium text-plum/80 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-plum" />
              Try pressing <strong>Start Guided Session</strong> below — includes breathing &amp; form cues!
            </span>
            <label className="inline-flex items-center gap-2 cursor-pointer font-semibold text-plum">
              <input
                type="checkbox"
                checked={sampleGentle}
                onChange={(e) => setSampleGentle(e.target.checked)}
                className="accent-plum w-4 h-4 rounded"
              />
              Show Gentle Tips
            </label>
          </div>

          <GuidedWorkoutPlayer
            workout={SAMPLE_WORKOUT}
            targetMinutes={20}
            isGentleMode={sampleGentle}
            compact
          />
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {/* Phase 1: Warmup */}
          <div>
            <p className="text-xs uppercase font-bold text-plum/70 tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-peach-400" /> Part 1: Gentle Warm-Up
            </p>
            <div className="space-y-2 bg-cream-50 p-4 rounded-xl border border-peach-100 text-sm">
              {SAMPLE_WORKOUT.warmup.map((ex) => (
                <div key={ex.name} className="flex justify-between items-center">
                  <span className="font-medium text-plum">{ex.name}</span>
                  <span className="text-plum/60 text-xs">{ex.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 2: Core 3 Exercises */}
          <div>
            <p className="text-xs uppercase font-bold text-plum/70 tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sage-400" /> Part 2: 3 Simple Movements (2 Rounds)
            </p>
            <div className="space-y-2.5 bg-cream-50 p-4 rounded-xl border border-peach-100 text-sm">
              {SAMPLE_WORKOUT.exercises.map((ex, i) => (
                <div
                  key={ex.name}
                  className={`flex justify-between items-start gap-2 ${
                    i > 0 ? "pt-2.5 border-t border-peach-100/70" : ""
                  }`}
                >
                  <div>
                    <span className="font-semibold text-plum block">
                      {i + 1}. {ex.name}
                    </span>
                    <span className="text-xs text-plum/65 block mt-0.5">
                      {ex.formCues?.[0]}
                    </span>
                    <span className="text-[11px] text-sage-700 block mt-0.5 font-medium">
                      Breath: {ex.breathingCue}
                    </span>
                  </div>
                  <span className="text-plum/80 font-semibold text-xs shrink-0 bg-white px-2.5 py-1 rounded-lg border border-peach-200">
                    {ex.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 3: Cool Down */}
          <div>
            <p className="text-xs uppercase font-bold text-plum/70 tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blush-400" /> Part 3: Calming Cool-Down
            </p>
            <div className="space-y-2 bg-cream-50 p-4 rounded-xl border border-peach-100 text-sm">
              {SAMPLE_WORKOUT.cooldown.map((ex) => (
                <div key={ex.name} className="flex justify-between items-center">
                  <span className="font-medium text-plum">{ex.name}</span>
                  <span className="text-plum/60 text-xs">{ex.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="pt-2 text-center">
        <Link href="/signup" className="btn-primary w-full sm:w-auto">
          Get Your Personalized 4-Week Plan <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
}
