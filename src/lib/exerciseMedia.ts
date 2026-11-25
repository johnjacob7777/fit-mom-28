// ---------------------------------------------------------
// Exercise Media Registry — supports:
// 1. Uploaded MP4/WebM files in `public/videos/<slug>.mp4`
// 2. YouTube / YouTube Shorts URLs pasted below
// 3. Built-in Live Animated Motion Guide + Voice Coach fallback
// ---------------------------------------------------------
import uploadedVideos from "./uploadedVideos.generated.json";

export function toExerciseSlug(exerciseName: string): string {
  return exerciseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Paste any YouTube URL (standard, youtu.be, or /shorts/) next to an exercise
 * slug below to embed a real video demonstration inside the workout player
 * and exercise cards automatically.
 */
export const EXERCISE_YOUTUBE_LINKS: Record<string, string> = {
  // ─── Warm-Ups ───
  "march-in-place": "",
  "arm-circles-forward-back": "",
  "gentle-side-bends": "",
  "shoulder-rolls-chest-opener": "",
  "hip-circles": "",
  "walking-high-knees-slow": "",

  // ─── Cool-Downs ───
  "deep-breathing-inhale-4s-exhale-6s": "",
  "standing-quad-stretch": "",
  "forward-fold-touch-your-toes-gently": "",
  "child-s-pose": "",
  "cat-cow-stretch": "",
  "neck-rolls-ear-to-shoulder-release": "",

  // ─── Gentle & Postpartum (Core Priority) ───
  "supported-chair-squats": "",
  "wall-push-ups": "",
  "seated-leg-extensions": "",
  "pelvic-floor-squeeze-kegels-breath": "",
  "gentle-glute-bridges": "",
  "standing-side-leg-lifts-hold-wall": "",
  "seated-arm-raises-posture-reset": "",
  "heel-slides-lying-down": "",
  "marching-in-place-slow": "",
  "gentle-bird-dogs-from-all-fours": "",
  "supported-squats-hold-chair": "",
  "ankle-circles-calf-pump": "",
  "standing-hip-circles": "",
  "gentle-cat-cow-all-fours": "",
  "seated-torso-chest-opener": "",

  // ─── Regular Bodyweight ───
  "bodyweight-squats": "",
  "push-ups-on-knees-if-needed": "",
  "glute-bridges": "",
  "reverse-lunges": "",
  "plank-hold": "",
  "jumping-jacks-low-impact-step-out-jacks": "",
  "tricep-dips-using-a-chair": "",
  "side-lying-leg-lifts": "",
  "wall-sit": "",
  "superman-hold": "",
  "bicycle-crunches": "",
  "donkey-kicks": "",
  "fire-hydrants": "",
  "standing-calf-raises": "",
  "mountain-climbers-slow": "",
  "dead-bugs": "",
  "inchworms": "",
  "side-plank-each-side": "",
  "sumo-squats": "",
  "bird-dogs": "",

  // ─── Light Equipment ───
  "dumbbell-bicep-curls": "",
  "dumbbell-shoulder-press": "",
  "resistance-band-rows": "",
  "dumbbell-goblet-squats": "",
  "resistance-band-lateral-walk": "",
  "dumbbell-deadlifts-light-weight": "",
  "resistance-band-pull-aparts": "",
  "dumbbell-lunges": "",
};

/** Converts youtube.com/watch, youtu.be, or /shorts links to privacy-enhanced embed URLs */
export function parseYouTubeEmbedUrl(rawUrl: string): string | null {
  const url = rawUrl.trim();
  if (!url) return null;

  let videoId: string | null = null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.replace("/", "").split("/")[0];
    } else if (parsed.pathname.startsWith("/shorts/")) {
      videoId = parsed.pathname.split("/shorts/")[1]?.split("/")[0] || null;
    } else if (parsed.pathname.startsWith("/embed/")) {
      videoId = parsed.pathname.split("/embed/")[1]?.split("/")[0] || null;
    } else {
      videoId = parsed.searchParams.get("v");
    }
  } catch {
    return null;
  }

  if (!videoId || !/^[a-zA-Z0-9_-]{6,20}$/.test(videoId)) return null;
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
}

export interface ExerciseMedia {
  slug: string;
  mp4Url: string | null;
  youtubeEmbedUrl: string | null;
  youtubeSearchUrl: string;
}

export function getExerciseMedia(exerciseName: string): ExerciseMedia {
  const slug = toExerciseSlug(exerciseName);
  const uploadedMap = uploadedVideos as Record<string, string>;
  const mp4Url = uploadedMap[slug] || null;
  const youtubeRaw = EXERCISE_YOUTUBE_LINKS[slug] || "";
  const youtubeEmbedUrl = parseYouTubeEmbedUrl(youtubeRaw);
  const query = encodeURIComponent(`${exerciseName} gentle beginner form`);

  return {
    slug,
    mp4Url,
    youtubeEmbedUrl,
    youtubeSearchUrl: `https://www.youtube.com/results?search_query=${query}`,
  };
}
