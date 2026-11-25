"use client";
// =============================================================
// EXERCISE DEMO DISPLAY — Renders:
// 1. Uploaded MP4 clip (`public/videos/<slug>.mp4`) if present
// 2. Embedded YouTube video (`EXERCISE_YOUTUBE_LINKS`) if configured
// 3. Otherwise, the smooth Live Animated Motion Visual + YouTube reference link
// =============================================================
import { useMemo } from "react";
import { getExerciseMedia } from "@/lib/exerciseMedia";
import ExerciseMotionVisual from "@/components/ExerciseMotionVisual";
import { ExternalLink, Video } from "lucide-react";

interface ExerciseDemoDisplayProps {
  exerciseName: string;
  isPlaying?: boolean;
  isGentle?: boolean;
  compact?: boolean;
}

export default function ExerciseDemoDisplay({
  exerciseName,
  isPlaying = true,
  isGentle = false,
  compact = false,
}: ExerciseDemoDisplayProps) {
  const media = useMemo(() => getExerciseMedia(exerciseName), [exerciseName]);

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

  if (media.youtubeEmbedUrl) {
    return (
      <div className="rounded-2xl overflow-hidden border border-peach-200 bg-black aspect-video">
        <iframe
          src={media.youtubeEmbedUrl}
          title={`${exerciseName} video demonstration`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <ExerciseMotionVisual
        exerciseName={exerciseName}
        isPlaying={isPlaying}
        isGentle={isGentle}
        compact={compact}
      />
      <div className="flex items-center justify-end px-1">
        <a
          href={media.youtubeSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-plum/60 hover:text-plum transition-colors"
        >
          <Video className="w-3 h-3" /> Search form video on YouTube
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    </div>
  );
}
