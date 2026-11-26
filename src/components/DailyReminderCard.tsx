"use client";
// =============================================================
// DAILY REMINDER & HOME SCREEN CARD — 1-Tap Google Calendar /
// Apple .ics daily 20-minute block + Home-Screen PWA tips.
// =============================================================
import { useState } from "react";
import { CalendarPlus, Bell, Smartphone, Check, ChevronDown, ChevronUp } from "lucide-react";

interface DailyReminderCardProps {
  preferredTime?: string;
  onSavePreferredTime?: (time: string) => Promise<void> | void;
  compact?: boolean;
}

const TIME_PRESETS = [
  { label: "Morning (07:30)", value: "07:30" },
  { label: "Mid-Morning (10:30)", value: "10:30" },
  { label: "Naptime (14:00)", value: "14:00" },
  { label: "Evening (18:30)", value: "18:30" },
];

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function getNextOccurrenceParts(timeHHMM: string) {
  const [hStr, mStr] = (timeHHMM || "07:30").split(":");
  const hour = Math.max(0, Math.min(23, Number(hStr) || 7));
  const minute = Math.max(0, Math.min(59, Number(mStr) || 30));

  const start = new Date();
  start.setHours(hour, minute, 0, 0);
  if (start.getTime() < Date.now()) {
    start.setDate(start.getDate() + 1);
  }
  const end = new Date(start.getTime() + 20 * 60 * 1000);

  const fmtLocal = (d: Date) =>
    `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}T${pad2(
      d.getHours()
    )}${pad2(d.getMinutes())}00`;

  return {
    startStr: fmtLocal(start),
    endStr: fmtLocal(end),
  };
}

export default function DailyReminderCard({
  preferredTime = "07:30",
  onSavePreferredTime,
  compact = false,
}: DailyReminderCardProps) {
  const [time, setTime] = useState<string>(preferredTime || "07:30");
  const [savedNotice, setSavedNotice] = useState<boolean>(false);
  const [showInstallHelp, setShowInstallHelp] = useState<boolean>(false);

  const handleTimeChange = async (nextTime: string) => {
    setTime(nextTime);
    if (onSavePreferredTime) {
      await onSavePreferredTime(nextTime);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2000);
    }
  };

  const buildGoogleCalendarUrl = () => {
    const { startStr, endStr } = getNextOccurrenceParts(time);
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: "Fit Mom 20: My 20-Min Daily Self-Care",
      details:
        "No guilt if today needs Gentle or 5-Min Rescue mode! Open your dashboard: https://fit-mom-28-aj.vercel.app/dashboard",
      dates: `${startStr}/${endStr}`,
      recur: "RRULE:FREQ=DAILY",
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const handleDownloadIcs = () => {
    const { startStr, endStr } = getNextOccurrenceParts(time);
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Fit Mom 20//Daily Wellness Reminder//EN",
      "BEGIN:VEVENT",
      `UID:fitmom20-daily-${Date.now()}@fitmom20`,
      `DTSTAMP:${startStr}`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      "RRULE:FREQ=DAILY",
      "SUMMARY:Fit Mom 20 — 20-Min Daily Routine",
      "DESCRIPTION:Time for 20 calm minutes (or 5-min rescue!). Open https://fit-mom-28-aj.vercel.app/dashboard",
      "BEGIN:VALARM",
      "TRIGGER:-PT10M",
      "ACTION:DISPLAY",
      "DESCRIPTION:Fit Mom 20 starts in 10 minutes",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fit-mom-20-daily-reminder.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card-soft bg-cream-50/70 border border-peach-200 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-heading font-bold text-lg text-plum flex items-center gap-2">
            <Bell className="w-4 h-4 text-plum" /> Reserve Your Daily 20-Min Window
          </h3>
          <p className="text-xs text-plum/65 mt-0.5">
            Busy days slip away easily — lock your workout onto your phone calendar in one tap.
          </p>
        </div>
        {savedNotice && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sage-700 bg-sage-100 px-2.5 py-1 rounded-full">
            <Check className="w-3 h-3" /> Window Saved
          </span>
        )}
      </div>

      {/* Time Presets + Custom Picker */}
      <div className="flex flex-wrap items-center gap-2">
        {TIME_PRESETS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => handleTimeChange(preset.value)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
              time === preset.value
                ? "bg-plum text-white border-plum shadow-xs"
                : "bg-white text-plum/75 border-peach-200 hover:border-peach-300"
            }`}
          >
            {preset.label}
          </button>
        ))}

        <label className="inline-flex items-center gap-1.5 bg-white border border-peach-200 rounded-xl px-2.5 py-1 text-xs font-semibold text-plum">
          <span>Custom:</span>
          <input
            type="time"
            value={time}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="bg-transparent focus:outline-none text-plum font-bold"
          />
        </label>
      </div>

      {/* 1-Click Calendar Actions */}
      <div className="flex flex-wrap items-center gap-2.5">
        <a
          href={buildGoogleCalendarUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary py-2 px-4 text-xs"
        >
          <CalendarPlus className="w-3.5 h-3.5" /> Add Daily Repeat to Google Calendar
        </a>
        <button
          type="button"
          onClick={handleDownloadIcs}
          className="btn-secondary py-2 px-4 text-xs"
        >
          <CalendarPlus className="w-3.5 h-3.5" /> Apple / Phone Calendar (.ics)
        </button>
      </div>

      {/* Home-Screen Install Guide */}
      {!compact && (
        <div className="pt-2 border-t border-peach-200/60">
          <button
            type="button"
            onClick={() => setShowInstallHelp(!showInstallHelp)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-plum/80 hover:text-plum"
          >
            <Smartphone className="w-3.5 h-3.5 text-plum" />
            Save Fit Mom 20 to Phone Home Screen (Feels Like an App)
            {showInstallHelp ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showInstallHelp && (
            <div className="mt-2 bg-white rounded-xl p-3 border border-peach-100 text-xs text-plum/80 space-y-1.5">
              <p>
                <strong>iPhone (Safari):</strong> Tap the <strong>Share</strong> icon (square with arrow) at the bottom → select <strong>Add to Home Screen</strong>.
              </p>
              <p>
                <strong>Android (Chrome):</strong> Tap the <strong>⋮ menu</strong> at top-right → tap <strong>Add to Home screen</strong> or <strong>Install app</strong>.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
