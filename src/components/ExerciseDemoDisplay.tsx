"use client";
// =============================================================
// EXERCISE DEMO DISPLAY — Renders:
// 1. Uploaded MP4 clip (`public/videos/<slug>.mp4`) if present
// 2. Embedded verified YouTube form tutorial
// 3. Minimal rest/breathing notice for recovery steps
// =============================================================
import { useMemo } from "react";
import { getExerciseMedia } from "@/lib/exerciseMedia";
import { ExternalLink, Video, Wind } from "lucide-react";

interface ExerciseDemoDisplayProps {
  exerciseName: string;
  isPlaying?: boolean;
  compact?: boolean;
}

export default function ExerciseDemoDisplay({
  exerciseName,
  isPlaying = true,
  compact = false,
}: ExerciseDemoDisplayProps) {
  const media = useMemo(() => getExerciseMedia(exerciseName), [exerciseName]);

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

  // Priority 2: Verified embeddable YouTube form tutorial
  if (media.youtubeEmbedUrl) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2 px-1">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-plum/75">
            <Video className="w-3.5 h-3.5 text-plum" /> Video Form Demonstration
          </span>
          <a
            href={media.youtubeWatchUrl || media.youtubeSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-plum/65 hover:text-plum transition-colors"
          >
            Open on YouTube <ExternalLink className="w-3 h-3" />
          </a>
        </div>

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
      </div>
    );
  }

  // Fallback for breathing/water recovery pauses between sets
  return (
    <div className="bg-sage-50/70 border border-sage-200 rounded-2xl p-4 text-center text-xs text-plum/80 flex flex-col items-center gap-1.5">
      <Wind className="w-5 h-5 text-sage-600" />
      <p className="font-semibold text-plum">Recovery Break</p>
      <p>Relax your shoulders, sip water gently, and take steady slow breaths.</p>
    </div>
  );
}
