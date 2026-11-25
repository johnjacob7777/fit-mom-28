"use client";
// =============================================================
// EXERCISE DEMO DISPLAY — Renders:
// 1. Uploaded MP4 clip (`public/videos/<slug>.mp4`) if present
// 2. Embedded verified YouTube form tutorial (with 1-tap Motion Loop toggle)
// 3. Otherwise, the smooth Live Animated Motion Visual
// =============================================================
import { useState, useEffect, useMemo } from "react";
import { getExerciseMedia } from "@/lib/exerciseMedia";
import ExerciseMotionVisual from "@/components/ExerciseMotionVisual";
import { ExternalLink, Video, Sparkles } from "lucide-react";

interface ExerciseDemoDisplayProps {
  exerciseName: string;
  isPlaying?: boolean;
  isGentle?: boolean;
  compact?: boolean;
  /** When true, opens the YouTube video tutorial directly instead of Motion Loop first */
  preferVideo?: boolean;
}

export default function ExerciseDemoDisplay({
  exerciseName,
  isPlaying = true,
  isGentle = false,
  compact = false,
  preferVideo = false,
}: ExerciseDemoDisplayProps) {
  const media = useMemo(() => getExerciseMedia(exerciseName), [exerciseName]);
  const [viewMode, setViewMode] = useState<"video" | "motion">(
    preferVideo && media.youtubeEmbedUrl ? "video" : "motion"
  );

  // Sync default tab cleanly when exercise changes
  useEffect(() => {
    setViewMode(preferVideo && media.youtubeEmbedUrl ? "video" : "motion");
  }, [exerciseName, preferVideo, media.youtubeEmbedUrl]);

  // Priority 1: Uploaded local/CDN MP4 video clip
  if (media.mp4Url) {
    return (
      <div className="rounded-2xl overflow-hidden border border-peach-200 bg-cream-50">
        <video
          src={media.mp4Url}
          autoPlay={isPlaying}
          loop
          muted
          playsInline
          controls
          className={`w-full object-cover ${compact ? "max-h-48" : "max-h-64"}`}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Mode Switcher when a verified YouTube video exists */}
      {media.youtubeEmbedUrl && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="inline-flex bg-white p-0.5 rounded-xl border border-peach-200 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setViewMode("video")}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                viewMode === "video"
                  ? "bg-plum text-white shadow-xs"
                  : "text-plum/70 hover:text-plum"
              }`}
            >
              <Video className="w-3 h-3" /> YouTube Tutorial
            </button>
            <button
              type="button"
              onClick={() => setViewMode("motion")}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                viewMode === "motion"
                  ? "bg-plum text-white shadow-xs"
                  : "text-plum/70 hover:text-plum"
              }`}
            >
              <Sparkles className="w-3 h-3" /> Animated Motion
            </button>
          </div>

          <a
            href={media.youtubeWatchUrl || media.youtubeSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-plum/65 hover:text-plum transition-colors"
          >
            Open on YouTube <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {viewMode === "video" && media.youtubeEmbedUrl ? (
        <div className="rounded-2xl overflow-hidden border border-peach-200 bg-black aspect-video shadow-xs">
          <iframe
            key={media.youtubeEmbedUrl}
            src={media.youtubeEmbedUrl}
            title={`${exerciseName} form tutorial`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <ExerciseMotionVisual
          exerciseName={exerciseName}
          isPlaying={isPlaying}
          isGentle={isGentle}
          compact={compact}
        />
      )}
    </div>
  );
}
