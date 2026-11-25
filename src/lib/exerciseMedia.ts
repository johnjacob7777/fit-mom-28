// ---------------------------------------------------------
// Exercise Media Registry — supports:
// 1. Uploaded MP4/WebM files in `public/videos/<slug>.mp4`
// 2. Verified embeddable YouTube form tutorials for all 55 moves
// ---------------------------------------------------------
import uploadedVideos from "./uploadedVideos.generated.json";

export function toExerciseSlug(exerciseName: string): string {
  return exerciseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Verified, oEmbed-tested YouTube tutorial links for every Fit Mom 20 exercise.
 * Uploading a custom `.mp4` with the matching slug into `public/videos/`
 * automatically overrides the YouTube video cleanly.
 */
export const EXERCISE_YOUTUBE_LINKS: Record<string, string> = {
  // ─── Warm-Ups ───
  "march-in-place": "https://www.youtube.com/watch?v=16oJspYFz7s",
  "arm-circles-forward-back": "https://www.youtube.com/watch?v=Jf40owVcXmM",
  "gentle-side-bends": "https://www.youtube.com/watch?v=H5bjGU7hUeA",
  "shoulder-rolls-chest-opener": "https://www.youtube.com/watch?v=A7kgx8gGmPA",
  "hip-circles": "https://www.youtube.com/watch?v=jUft857xWzw",
  "walking-high-knees-slow": "https://www.youtube.com/watch?v=LdcquWkKUFc",

  // ─── Cool-Downs ───
  "deep-breathing-inhale-4s-exhale-6s": "https://www.youtube.com/watch?v=NUppNQ3LOsU",
  "standing-quad-stretch": "https://www.youtube.com/watch?v=aNXGOpP37CY",
  "forward-fold-touch-your-toes-gently": "https://www.youtube.com/watch?v=sEBFsU_CnNw",
  "child-s-pose": "https://www.youtube.com/watch?v=kH12QrSGedM",
  "cat-cow-stretch": "https://www.youtube.com/watch?v=UixnUD6rZWE",
  "neck-rolls-ear-to-shoulder-release": "https://www.youtube.com/watch?v=5D1GkREjz3I",

  // ─── Gentle & Postpartum (Core Priority) ───
  "supported-chair-squats": "https://www.youtube.com/watch?v=5Wd4S29E-yE",
  "wall-push-ups": "https://www.youtube.com/watch?v=wIPJvBQs7RA",
  "seated-leg-extensions": "https://www.youtube.com/watch?v=9Du-oWjs_lE",
  "pelvic-floor-squeeze-kegels-breath": "https://www.youtube.com/watch?v=XjImclS9IbI",
  "gentle-glute-bridges": "https://www.youtube.com/watch?v=LORVjN2bg5o",
  "standing-side-leg-lifts-hold-wall": "https://www.youtube.com/watch?v=szmyQ0VuOWQ",
  "seated-arm-raises-posture-reset": "https://www.youtube.com/watch?v=bcF0vNrtHrE",
  "heel-slides-lying-down": "https://www.youtube.com/watch?v=t17Z6HeiiQs",
  "marching-in-place-slow": "https://www.youtube.com/watch?v=uVsgq-rzgBk",
  "gentle-bird-dogs-from-all-fours": "https://www.youtube.com/watch?v=xEDnlOxeJH4",
  "supported-squats-hold-chair": "https://www.youtube.com/watch?v=ATYX9LAbpdY",
  "ankle-circles-calf-pump": "https://www.youtube.com/watch?v=z24gW6aHJrI",
  "standing-hip-circles": "https://www.youtube.com/watch?v=x-5h_QUOem8",
  "gentle-cat-cow-all-fours": "https://www.youtube.com/watch?v=LIVJZZyZ2qM",
  "seated-torso-chest-opener": "https://www.youtube.com/watch?v=VH16GqIiy7Q",

  // ─── Regular Bodyweight ───
  "bodyweight-squats": "https://www.youtube.com/watch?v=n_xLyzPEX7A",
  "push-ups-on-knees-if-needed": "https://www.youtube.com/watch?v=rrVwNeIpy-k",
  "glute-bridges": "https://www.youtube.com/watch?v=XLXGydU5DdU",
  "reverse-lunges": "https://www.youtube.com/watch?v=TI2U-RfbALY",
  "plank-hold": "https://www.youtube.com/watch?v=v25dawSzRTM",
  "jumping-jacks-low-impact-step-out-jacks": "https://www.youtube.com/watch?v=FJ-seqGfwzA",
  "tricep-dips-using-a-chair": "https://www.youtube.com/watch?v=4ua3MzaU0QU",
  "side-lying-leg-lifts": "https://www.youtube.com/watch?v=TdfRsUbODlM",
  "wall-sit": "https://www.youtube.com/watch?v=mDdLC-yKudY",
  "superman-hold": "https://www.youtube.com/watch?v=nuKDHrBlpFs",
  "bicycle-crunches": "https://www.youtube.com/watch?v=_I2Fiy7ueNw",
  "donkey-kicks": "https://www.youtube.com/watch?v=sN-RNP_jvRY",
  "fire-hydrants": "https://www.youtube.com/watch?v=IRkRgk2Gc1E",
  "standing-calf-raises": "https://www.youtube.com/watch?v=sNqa1ad2qIQ",
  "mountain-climbers-slow": "https://www.youtube.com/watch?v=7W4JEfEKuC4",
  "dead-bugs": "https://www.youtube.com/watch?v=GbSC02oU3To",
  "inchworms": "https://www.youtube.com/watch?v=7jeW4v_oaes",
  "side-plank-each-side": "https://www.youtube.com/watch?v=8imTmxwFgRg",
  "sumo-squats": "https://www.youtube.com/watch?v=u2oXPmPH0hA",
  "bird-dogs": "https://www.youtube.com/watch?v=QABW99qPiNM",

  // ─── Light Equipment ───
  "dumbbell-bicep-curls": "https://www.youtube.com/watch?v=MKWBV29S6c0",
  "dumbbell-shoulder-press": "https://www.youtube.com/watch?v=k6tzKisR3NY",
  "resistance-band-rows": "https://www.youtube.com/watch?v=LSkyinhmA8k",
  "dumbbell-goblet-squats": "https://www.youtube.com/watch?v=lRYBbchqxtI",
  "resistance-band-lateral-walk": "https://www.youtube.com/watch?v=N28Hpdezg7Q",
  "dumbbell-deadlifts-light-weight": "https://www.youtube.com/watch?v=hu3jRvTc_po",
  "resistance-band-pull-aparts": "https://www.youtube.com/watch?v=stwYTTPXubo",
  "dumbbell-lunges": "https://www.youtube.com/watch?v=mJilHWIBWO8",
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
  youtubeWatchUrl: string | null;
  youtubeEmbedUrl: string | null;
  youtubeSearchUrl: string;
}

export function getExerciseMedia(exerciseName: string): ExerciseMedia {
  const slug = toExerciseSlug(exerciseName);
  const uploadedMap = uploadedVideos as Record<string, string>;
  const mp4Url = uploadedMap[slug] || null;
  const youtubeRaw = (EXERCISE_YOUTUBE_LINKS[slug] || "").trim();
  const youtubeEmbedUrl = parseYouTubeEmbedUrl(youtubeRaw);
  const query = encodeURIComponent(`${exerciseName} gentle beginner form`);

  return {
    slug,
    mp4Url,
    youtubeWatchUrl: youtubeRaw || null,
    youtubeEmbedUrl,
    youtubeSearchUrl: `https://www.youtube.com/results?search_query=${query}`,
  };
}
