"use client";
// =============================================================
// PROGRESS & WINS TAB — Non-scale victories, mood reflection,
// 28-day consistency map, and gentle optional weight chart.
// =============================================================
import { useState, useMemo } from "react";
import { MoodWinEntry } from "@/context/AuthContext";
import {
  Award,
  Sparkles,
  Scale,
  Smile,
  CheckCircle2,
  Heart,
  Calendar,
} from "lucide-react";

interface ProgressAndWinsTabProps {
  today: string;
  workoutsCompleted: Record<string, boolean>;
  waterIntake: Record<string, number>;
  weightLog: Record<string, number>;
  moodWins: Record<string, MoodWinEntry>;
  onSaveMoodWin: (mood: string, note: string) => Promise<void>;
  onSaveWeight: (weight: number) => Promise<void>;
}

const MOOD_OPTIONS = [
  { id: "Energized", label: "⚡ More Energy" },
  { id: "Calmer", label: "🌿 Calmer Mind" },
  { id: "Lighter", label: "🌸 Less Stiff / Sore" },
  { id: "Proud", label: "💛 Proud I Showed Up" },
];

/** Formats YYYY-MM-DD safely in local calendar without UTC timezone shift */
function formatLocalYMD(ymd: string): string {
  const parts = ymd.split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return ymd;
  const local = new Date(parts[0], parts[1] - 1, parts[2]);
  return local.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ProgressAndWinsTab({
  today,
  workoutsCompleted,
  waterIntake,
  weightLog,
  moodWins,
  onSaveMoodWin,
  onSaveWeight,
}: ProgressAndWinsTabProps) {
  const todayWin = moodWins[today];
  const [selectedMood, setSelectedMood] = useState<string>(todayWin?.mood || "");
  const [noteInput, setNoteInput] = useState<string>(todayWin?.note || "");
  const [savedMoodMsg, setSavedMoodMsg] = useState<boolean>(false);
  const [weightInput, setWeightInput] = useState<string>("");

  // Stats
  const totalWorkoutsDone = useMemo(
    () => Object.values(workoutsCompleted).filter(Boolean).length,
    [workoutsCompleted]
  );

  const hydratedDays = useMemo(
    () => Object.values(waterIntake).filter((g) => g >= 6).length,
    [waterIntake]
  );

  // Last 28 days timeline ending today
  const last28Days = useMemo(() => {
    const items = [];
    const base = new Date();
    for (let i = 27; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(base.getDate() - i);
      const ymd = [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, "0"),
        String(d.getDate()).padStart(2, "0"),
      ].join("-");
      items.push({
        ymd,
        label: d.getDate(),
        done: !!workoutsCompleted[ymd],
        isToday: ymd === today,
      });
    }
    return items;
  }, [workoutsCompleted, today]);

  // Weight entries sorted chronologically for trend sparkline
  const sortedWeights = useMemo(() => {
    return Object.entries(weightLog)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-10);
  }, [weightLog]);

  const handleMoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) return;
    await onSaveMoodWin(selectedMood, noteInput.trim());
    setSavedMoodMsg(true);
    setTimeout(() => setSavedMoodMsg(false), 2500);
  };

  const handleWeightSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightInput) return;
    const val = parseFloat(weightInput);
    if (isNaN(val)) return;
    await onSaveWeight(val);
    setWeightInput("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ───────── SUMMARY WINS STRIP ───────── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card-soft p-4 text-center">
          <Award className="w-5 h-5 text-plum mx-auto mb-1" />
          <p className="text-2xl font-heading font-extrabold text-plum">
            {totalWorkoutsDone}
          </p>
          <p className="text-[11px] text-plum/65 font-medium">Sessions Shown Up</p>
        </div>
        <div className="card-soft p-4 text-center">
          <Heart className="w-5 h-5 text-blush-400 mx-auto mb-1" />
          <p className="text-2xl font-heading font-extrabold text-plum">
            {Object.keys(moodWins).length}
          </p>
          <p className="text-[11px] text-plum/65 font-medium">Mindful Check-ins</p>
        </div>
        <div className="card-soft p-4 text-center">
          <Sparkles className="w-5 h-5 text-sage-600 mx-auto mb-1" />
          <p className="text-2xl font-heading font-extrabold text-plum">
            {hydratedDays}
          </p>
          <p className="text-[11px] text-plum/65 font-medium">Hydrated Days (6+)</p>
        </div>
      </div>

      {/* ───────── NON-SCALE WINS CHECK-IN ───────── */}
      <div className="card-soft space-y-4">
        <div>
          <h2 className="font-heading font-bold text-xl text-plum flex items-center gap-2">
            <Smile className="w-5 h-5 text-peach-400" /> Non-Scale Wins &amp; How You Feel
          </h2>
          <p className="text-xs text-plum/65 mt-0.5">
            True progress shows up in energy, mood, posture, and patience — not just numbers.
          </p>
        </div>

        <form onSubmit={handleMoodSubmit} className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {MOOD_OPTIONS.map((opt) => {
              const active = selectedMood === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedMood(opt.id)}
                  className={`p-3 rounded-xl border-2 text-xs font-bold transition-all ${
                    active
                      ? "border-plum bg-peach-100/70 text-plum shadow-xs"
                      : "border-peach-200 bg-cream-50 text-plum/70 hover:border-peach-300"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Optional quick win (e.g. Carried baby up stairs with zero back ache!)"
              className="flex-1 bg-cream-50 border-2 border-peach-200 rounded-xl px-4 py-2.5 text-xs focus:border-plum focus:outline-none"
            />
            <button
              type="submit"
              disabled={!selectedMood}
              className="btn-primary py-2.5 px-5 text-xs disabled:opacity-40"
            >
              {savedMoodMsg ? "Saved Win! ✨" : "Save Today's Win"}
            </button>
          </div>
        </form>

        {Object.keys(moodWins).length > 0 && (
          <div className="pt-3 border-t border-peach-100 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-plum/55 block">
              Recent Reflections
            </span>
            {Object.entries(moodWins)
              .sort(([a], [b]) => b.localeCompare(a))
              .slice(0, 4)
              .map(([date, entry]) => (
                <div
                  key={date}
                  className="bg-cream-50 p-3 rounded-xl border border-peach-100 flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-plum block">{entry.mood}</span>
                    {entry.note && <p className="text-plum/75 mt-0.5">{entry.note}</p>}
                  </div>
                  <span className="text-[11px] text-plum/50 shrink-0">
                    {formatLocalYMD(date)}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* ───────── 28-DAY CONSISTENCY HEATMAP ───────── */}
      <div className="card-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-plum flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sage-600" /> Last 28 Days Consistency
            </h3>
            <p className="text-xs text-plum/65">
              Zero guilt for missed days — every green tile celebrates showing up.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {last28Days.map((day) => (
            <div
              key={day.ymd}
              title={`${formatLocalYMD(day.ymd)}: ${day.done ? "Completed" : "Rest/Skipped"}`}
              className={`h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                day.done
                  ? "bg-sage-400 text-white shadow-xs"
                  : day.isToday
                  ? "bg-peach-100 border-2 border-plum text-plum"
                  : "bg-cream-50 border border-peach-100 text-plum/35"
              }`}
            >
              {day.done ? <CheckCircle2 className="w-4 h-4" /> : day.label}
            </div>
          ))}
        </div>
      </div>

      {/* ───────── OPTIONAL WEIGHT LOG + SVG SPARKLINE ───────── */}
      <div className="card-soft space-y-4">
        <div>
          <h3 className="font-heading font-bold text-lg text-plum flex items-center gap-2">
            <Scale className="w-4 h-4 text-plum" /> Optional Weight Tracker
          </h3>
          <p className="text-xs text-plum/60">
            Fluctuations from sleep and hormones are normal. Log only if helpful for you.
          </p>
        </div>

        <form onSubmit={handleWeightSubmit} className="flex gap-2">
          <input
            type="number"
            step="0.1"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            placeholder="e.g. 62.5 kg"
            className="flex-1 bg-cream-50 border-2 border-peach-200 rounded-xl px-4 py-2.5 text-sm focus:border-plum focus:outline-none"
          />
          <button
            type="submit"
            disabled={!weightInput}
            className="btn-primary py-2.5 px-5 text-sm disabled:opacity-40"
          >
            Log kg
          </button>
        </form>

        {/* Mini SVG Trend Chart if 2+ entries exist */}
        {sortedWeights.length >= 2 && (
          <div className="bg-cream-50 p-4 rounded-2xl border border-peach-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-plum/60 block mb-2">
              Gentle Trend ({sortedWeights.length} entries)
            </span>
            {(() => {
              const vals = sortedWeights.map(([, w]) => Number(w));
              const min = Math.min(...vals) - 1;
              const max = Math.max(...vals) + 1;
              const range = Math.max(1, max - min);
              const pts = vals
                .map((v, i) => {
                  const x = (i / (vals.length - 1)) * 280 + 10;
                  const y = 70 - ((v - min) / range) * 50;
                  return `${x},${y}`;
                })
                .join(" ");
              return (
                <svg viewBox="0 0 300 85" className="w-full h-24 overflow-visible">
                  <polyline
                    fill="none"
                    stroke="#8EA986"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={pts}
                  />
                  {vals.map((v, i) => {
                    const x = (i / (vals.length - 1)) * 280 + 10;
                    const y = 70 - ((v - min) / range) * 50;
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="4.5" fill="#4A2C40" stroke="#FFF" strokeWidth="1.5" />
                        <text
                          x={x}
                          y={y - 10}
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="600"
                          fill="#4A2C40"
                        >
                          {v}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              );
            })()}
          </div>
        )}

        {sortedWeights.length > 0 && (
          <div className="space-y-1.5">
            {[...sortedWeights]
              .reverse()
              .slice(0, 5)
              .map(([date, weight]) => (
                <div
                  key={date}
                  className="flex justify-between items-center text-xs bg-cream-50 p-2.5 rounded-xl border border-peach-100"
                >
                  <span className="text-plum/70 font-medium">{formatLocalYMD(date)}</span>
                  <span className="font-bold text-plum">{String(weight)} kg</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
