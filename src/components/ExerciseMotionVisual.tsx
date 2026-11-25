"use client";
// =============================================================
// EXERCISE MOTION VISUAL — Animated biomechanics demonstration
// Covers all 54 Fit Mom 20 exercises + breathing pauses with smooth
// CSS-animated Start <-> End posture loops, target area glow, and
// tempo cues (no external paid video API needed).
// =============================================================
import { CSSProperties, useMemo } from "react";

export type MotionPattern =
  | "squat"
  | "wall_sit"
  | "lunge"
  | "bridge"
  | "pushup_wall"
  | "plank"
  | "cat_cow"
  | "bird_dog"
  | "donkey_kick"
  | "fire_hydrant"
  | "dead_bug"
  | "heel_slide"
  | "side_lying_leg"
  | "standing_side_leg"
  | "calf_raise"
  | "seated_leg"
  | "chair_dips"
  | "arm_circles"
  | "arm_press"
  | "band_row"
  | "side_bend"
  | "hip_circles"
  | "march"
  | "step_jacks"
  | "forward_fold"
  | "childs_pose"
  | "quad_stretch"
  | "neck_release"
  | "superman"
  | "breathe";

export function getMotionPattern(exerciseName: string): MotionPattern {
  const n = exerciseName.toLowerCase();

  if (n.includes("catch your breath") || n.includes("sip water") || n.includes("kegel") || n.includes("pelvic floor") || n.includes("deep breathing")) return "breathe";
  if (n.includes("wall sit")) return "wall_sit";
  if (n.includes("squat") || n.includes("lateral walk")) return "squat";
  if (n.includes("lunge")) return "lunge";
  if (n.includes("bridge")) return "bridge";
  if (n.includes("push-up") || n.includes("pushup")) return "pushup_wall";
  if (n.includes("plank") || n.includes("mountain climber")) return "plank";
  if (n.includes("cat-cow")) return "cat_cow";
  if (n.includes("bird dog")) return "bird_dog";
  if (n.includes("donkey kick")) return "donkey_kick";
  if (n.includes("fire hydrant")) return "fire_hydrant";
  if (n.includes("heel slide")) return "heel_slide";
  if (n.includes("dead bug") || n.includes("bicycle crunch")) return "dead_bug";
  if (n.includes("side-lying")) return "side_lying_leg";
  if (n.includes("side leg lift")) return "standing_side_leg";
  if (n.includes("calf raise")) return "calf_raise";
  if (n.includes("seated leg") || n.includes("ankle circle")) return "seated_leg";
  if (n.includes("tricep dip")) return "chair_dips";
  if (n.includes("arm circle") || n.includes("shoulder roll")) return "arm_circles";
  if (n.includes("row") || n.includes("pull-apart")) return "band_row";
  if (n.includes("curl") || n.includes("shoulder press") || n.includes("arm raise")) return "arm_press";
  if (n.includes("side bend") || n.includes("torso")) return "side_bend";
  if (n.includes("hip circle")) return "hip_circles";
  if (n.includes("jumping jack") || n.includes("step-out")) return "step_jacks";
  if (n.includes("march") || n.includes("high knees")) return "march";
  if (n.includes("child's pose")) return "childs_pose";
  if (n.includes("quad stretch")) return "quad_stretch";
  if (n.includes("neck roll")) return "neck_release";
  if (n.includes("superman")) return "superman";
  if (n.includes("forward fold") || n.includes("inchworm") || n.includes("deadlift")) return "forward_fold";

  return "march";
}

function getMotionCaption(pattern: MotionPattern): { action: string; beat: string } {
  switch (pattern) {
    case "squat":
      return { action: "Lower hips back softly, chest tall, press upright", beat: "3s down • 2s up" };
    case "wall_sit":
      return { action: "Slide back along wall until knees align above ankles", beat: "Steady isometric hold" };
    case "lunge":
      return { action: "Step one foot calmly back, lower rear knee comfortably", beat: "Controlled step & rise" };
    case "bridge":
      return { action: "Press through heels, squeeze glutes, float hips up smoothly", beat: "Lift on exhale" };
    case "pushup_wall":
      return { action: "Hands on wall/counter, elbows bent 45°, ribs hugged gently in", beat: "Smooth press" };
    case "plank":
      return { action: "Long line from head to heels/knees, ribs steady & quiet breath", beat: "Core wrap & hold" };
    case "cat_cow":
      return { action: "Flow smoothly from gentle chest arch to soft spine round", beat: "Follow each breath" };
    case "bird_dog":
      return { action: "Reach opposite fingertips and heel long without arching lower back", beat: "Slow alternating reach" };
    case "donkey_kick":
      return { action: "Press heel gently upward using glute while pelvis stays level", beat: "Controlled lift & lower" };
    case "fire_hydrant":
      return { action: "Lift bent knee sideways like an easy hinge without twisting torso", beat: "Steady hip control" };
    case "dead_bug":
      return { action: "Tap one heel toward floor while lower back rests heavy on mat", beat: "Exhale as heel lowers" };
    case "heel_slide":
      return { action: "Glide one heel slowly flat out along carpet and draw calmly back", beat: "Deep core stability" };
    case "side_lying_leg":
      return { action: "Keep hips stacked; lift top leg smoothly from outer hip", beat: "Pause softly at top" };
    case "standing_side_leg":
      return { action: "Stand tall touching wall lightly; sweep outside leg out smoothly", beat: "No leaning sideways" };
    case "calf_raise":
      return { action: "Rise softly onto balls of feet, pause 1 sec, lower slowly", beat: "Smooth ankle control" };
    case "seated_leg":
      return { action: "Sit upright on chair, extend leg straight gently without locking knee", beat: "Seated knee care" };
    case "chair_dips":
      return { action: "Keep back close to sturdy chair edge; bend elbows straight behind", beat: "Controlled dip & press" };
    case "arm_circles":
      return { action: "Trace wide calm shoulder circles while dropping neck tension", beat: "Slow even loops" };
    case "arm_press":
      return { action: "Curl or float arms smoothly overhead without flaring lower ribs", beat: "Exhale on lift" };
    case "band_row":
      return { action: "Pull elbows back past ribs and squeeze shoulder blades together", beat: "Open nursing posture" };
    case "side_bend":
      return { action: "Reach softly up and across to lengthen side ribs gracefully", beat: "Inhale into side ribs" };
    case "hip_circles":
      return { action: "Sway pelvis in comfortable smooth circles to soften low-back stiffness", beat: "Relaxed pelvis flow" };
    case "march":
      return { action: "Alternating easy knee lifts with natural swinging arms", beat: "Light quiet footsteps" };
    case "step_jacks":
      return { action: "Low-impact side steps paired with soft arm sweeps overhead", beat: "Smooth cardio boost" };
    case "forward_fold":
      return { action: "Soften knees generously and hinge hips back keeping spine calm", beat: "Melt tension down" };
    case "childs_pose":
      return { action: "Knees wide, hips melted toward heels, forehead resting on cushion", beat: "Expand back ribs" };
    case "quad_stretch":
      return { action: "Hold wall softly, draw heel gently toward glute without arching", beat: "Calm upright balance" };
    case "neck_release":
      return { action: "Drop ear lightly toward shoulder and roll chin calmly across chest", beat: "Zero force on neck" };
    case "superman":
      return { action: "Hover chest gently off mat keeping chin tucked & neck long", beat: "Gentle upper-back lift" };
    case "breathe":
      return { action: "Hands on belly & ribs — 4s nose inhale, 6s pelvic-floor lift exhale", beat: "4s Inhale • 6s Exhale" };
  }
}

interface ExerciseMotionVisualProps {
  exerciseName: string;
  isPlaying?: boolean;
  isGentle?: boolean;
  compact?: boolean;
}

function animStyle(
  name: string,
  durationSec: number,
  playState: "running" | "paused",
  origin?: string
): CSSProperties {
  return {
    ...(origin ? { transformOrigin: origin } : {}),
    animationName: name,
    animationDuration: `${durationSec}s`,
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
    animationPlayState: playState,
  };
}

export default function ExerciseMotionVisual({
  exerciseName,
  isPlaying = true,
  isGentle = false,
  compact = false,
}: ExerciseMotionVisualProps) {
  const pattern = useMemo(() => getMotionPattern(exerciseName), [exerciseName]);
  const caption = useMemo(() => getMotionCaption(pattern), [pattern]);
  const speedSec = isGentle ? 3.8 : 2.8;
  const playState: "running" | "paused" = isPlaying ? "running" : "paused";

  return (
    <div
      className={`rounded-2xl border border-peach-200 bg-gradient-to-br from-cream-50 via-white to-peach-50/70 overflow-hidden ${
        compact ? "p-3" : "p-3.5 sm:p-4"
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-plum bg-peach-100 px-2.5 py-0.5 rounded-full border border-peach-200">
          <span
            className="w-1.5 h-1.5 rounded-full bg-sage-600"
            style={animStyle("fmPulseGlow", speedSec, playState)}
          />
          {isPlaying ? "Live Motion Guide" : "Paused Motion"}
        </span>
        <span className="text-[10px] font-semibold text-sage-700 bg-sage-50 px-2 py-0.5 rounded-md border border-sage-200">
          {isGentle ? `Gentle (${caption.beat})` : caption.beat}
        </span>
      </div>

      {/* Kinematic SVG Stage */}
      <div className={`relative w-full flex items-center justify-center bg-white/80 rounded-xl border border-peach-100/80 ${compact ? "h-36" : "h-44"}`}>
        <svg viewBox="0 0 240 150" className="w-full h-full max-w-[260px]" aria-label={`Animated demonstration of ${exerciseName}`}>
          {/* Floor / Yoga Mat Line */}
          <line x1="25" y1="132" x2="215" y2="132" stroke="#FFD9C7" strokeWidth="4" strokeLinecap="round" />

          {/* Breathing / Calm Aura */}
          <circle
            cx="120"
            cy="78"
            r={pattern === "breathe" ? 42 : 34}
            fill={pattern === "breathe" ? "#E3ECE1" : "#FFF6F1"}
            style={animStyle("fmBreatheHalo", speedSec * 1.4, playState, "120px 78px")}
          />

          {/* 1. SQUAT / WALL SIT / CHAIR SQUAT */}
          {(pattern === "squat" || pattern === "wall_sit") && (
            <g>
              {pattern === "wall_sit" ? (
                <line x1="72" y1="22" x2="72" y2="132" stroke="#DAC3D2" strokeWidth="6" strokeLinecap="round" />
              ) : (
                <path d="M 65 96 L 86 96 L 86 130 M 67 74 L 67 130" stroke="#DAC3D2" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              )}
              <path d="M 118 130 L 122 104" stroke="#4A2C40" strokeWidth="6" strokeLinecap="round" />
              <ellipse cx="123" cy="130" rx="8" ry="3.5" fill="#4A2C40" />
              <circle
                cx="102"
                cy="86"
                r="10"
                fill="#F7C6D0"
                opacity="0.65"
                style={animStyle("fmSquatBody", speedSec, playState, "102px 86px")}
              />
              <g style={animStyle("fmSquatBody", speedSec, playState)}>
                <path d="M 103 82 L 122 96" stroke="#663B57" strokeWidth="6.5" strokeLinecap="round" />
                <path d="M 103 82 L 114 48" stroke="#4A2C40" strokeWidth="7" strokeLinecap="round" />
                <circle cx="116" cy="34" r="9.5" fill="#4A2C40" />
                <path
                  d="M 112 53 L 140 60"
                  stroke="#8A5E7D"
                  strokeWidth="5"
                  strokeLinecap="round"
                  style={animStyle("fmSquatArms", speedSec, playState, "112px 53px")}
                />
              </g>
              <path d="M 92 66 Q 82 82 92 98" stroke="#8EA986" strokeWidth="2" strokeDasharray="3 3" fill="none" />
            </g>
          )}

          {/* 2. GLUTE BRIDGE */}
          {pattern === "bridge" && (
            <g>
              <rect x="40" y="126" width="160" height="5" rx="2.5" fill="#C7DCC4" />
              <circle cx="62" cy="116" r="9" fill="#4A2C40" />
              <line x1="72" y1="122" x2="88" y2="122" stroke="#4A2C40" strokeWidth="7" strokeLinecap="round" />
              <path d="M 142 96 L 154 126" stroke="#4A2C40" strokeWidth="6" strokeLinecap="round" />
              <ellipse cx="157" cy="126" rx="7" ry="3.5" fill="#4A2C40" />
              <g style={animStyle("fmBridgePelvis", speedSec, playState, "84px 122px")}>
                <circle cx="114" cy="117" r="10" fill="#F7C6D0" opacity="0.7" />
                <path d="M 86 122 L 118 120 L 144 96" stroke="#663B57" strokeWidth="6.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </g>
              <path d="M 114 92 L 114 78 M 109 83 L 114 78 L 119 83" stroke="#6E8966" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>
          )}

          {/* 3. WALL PUSH-UP */}
          {pattern === "pushup_wall" && (
            <g>
              <line x1="170" y1="18" x2="170" y2="132" stroke="#DAC3D2" strokeWidth="7" strokeLinecap="round" />
              <ellipse cx="98" cy="130" rx="8" ry="3.5" fill="#4A2C40" />
              <g style={animStyle("fmPushWall", speedSec, playState, "98px 130px")}>
                <path d="M 98 128 L 114 54" stroke="#4A2C40" strokeWidth="7" strokeLinecap="round" />
                <circle cx="117" cy="39" r="9.5" fill="#4A2C40" />
                <path d="M 113 58 L 143 60 L 166 56" stroke="#8A5E7D" strokeWidth="5.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </g>
              <path d="M 135 44 L 149 44" stroke="#6E8966" strokeWidth="2" strokeDasharray="3 3" />
            </g>
          )}

          {/* 4. LUNGE */}
          {pattern === "lunge" && (
            <g style={animStyle("fmLunge", speedSec, playState)}>
              <circle cx="118" cy="34" r="9" fill="#4A2C40" />
              <path d="M 118 44 L 118 82" stroke="#4A2C40" strokeWidth="7" strokeLinecap="round" />
              <path d="M 118 82 L 144 92 L 144 128" stroke="#663B57" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 118 82 L 96 106 L 82 128" stroke="#8A5E7D" strokeWidth="5.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="118" cy="70" r="8" fill="#A8C3A0" opacity="0.55" />
            </g>
          )}

          {/* 5. PLANK / MOUNTAIN CLIMBER */}
          {pattern === "plank" && (
            <g>
              <rect x="38" y="126" width="164" height="5" rx="2.5" fill="#C7DCC4" />
              <ellipse cx="64" cy="126" rx="5" ry="3" fill="#4A2C40" />
              <path d="M 64 122 L 116 96 L 166 78" stroke="#4A2C40" strokeWidth="6.5" fill="none" strokeLinecap="round" />
              <circle cx="177" cy="72" r="9" fill="#4A2C40" />
              <path d="M 162 80 L 164 124" stroke="#8A5E7D" strokeWidth="5.5" strokeLinecap="round" />
              <ellipse
                cx="122"
                cy="95"
                rx="14"
                ry="7"
                fill="#F7C6D0"
                style={animStyle("fmPulseGlow", speedSec, playState, "122px 95px")}
              />
            </g>
          )}

          {/* 6. CAT-COW / BIRD DOG / DONKEY KICK / FIRE HYDRANT */}
          {(pattern === "cat_cow" || pattern === "bird_dog" || pattern === "donkey_kick" || pattern === "fire_hydrant") && (
            <g>
              <rect x="42" y="126" width="156" height="5" rx="2.5" fill="#C7DCC4" />
              <path d="M 85 95 L 82 124 L 68 124" stroke="#4A2C40" strokeWidth="5.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 145 95 L 148 124" stroke="#4A2C40" strokeWidth="5.5" fill="none" strokeLinecap="round" />
              <circle cx="160" cy="84" r="8.5" fill="#4A2C40" />

              {pattern === "cat_cow" ? (
                <path
                  d="M 85 95 Q 115 80 145 95"
                  stroke="#663B57"
                  strokeWidth="6.5"
                  fill="none"
                  strokeLinecap="round"
                  style={animStyle("fmCatCow", speedSec, playState)}
                />
              ) : (
                <path d="M 85 95 L 145 95" stroke="#4A2C40" strokeWidth="6.5" fill="none" strokeLinecap="round" />
              )}

              {(pattern === "bird_dog" || pattern === "donkey_kick" || pattern === "fire_hydrant") && (
                <path
                  d={pattern === "fire_hydrant" ? "M 85 95 L 74 108" : "M 85 95 L 54 102"}
                  stroke="#8EA986"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  style={animStyle("fmLimbLift", speedSec, playState, "85px 95px")}
                />
              )}

              {pattern === "bird_dog" && (
                <path
                  d="M 145 95 L 176 98"
                  stroke="#F1A3B3"
                  strokeWidth="5"
                  strokeLinecap="round"
                  style={animStyle("fmLimbLower", speedSec, playState, "145px 95px")}
                />
              )}
            </g>
          )}

          {/* 7. DEAD BUG / HEEL SLIDE / SUPERMAN */}
          {(pattern === "dead_bug" || pattern === "heel_slide" || pattern === "superman") && (
            <g>
              <rect x="40" y="126" width="160" height="5" rx="2.5" fill="#C7DCC4" />
              {pattern === "superman" ? (
                <g>
                  <circle cx="168" cy="113" r="8.5" fill="#4A2C40" />
                  <path d="M 78 122 L 154 120" stroke="#4A2C40" strokeWidth="6.5" strokeLinecap="round" />
                  <path
                    d="M 152 118 L 194 108"
                    stroke="#8EA986"
                    strokeWidth="5"
                    strokeLinecap="round"
                    style={animStyle("fmLimbLift", speedSec, playState, "152px 118px")}
                  />
                </g>
              ) : (
                <g>
                  <circle cx="64" cy="116" r="8.5" fill="#4A2C40" />
                  <path d="M 74 121 L 122 121" stroke="#4A2C40" strokeWidth="7" strokeLinecap="round" />
                  <circle cx="102" cy="118" r="9" fill="#A8C3A0" opacity="0.6" />
                  <path
                    d="M 122 121 L 136 94 L 160 98"
                    stroke="#663B57"
                    strokeWidth="5.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={animStyle("fmLimbLower", speedSec, playState, "122px 121px")}
                  />
                  {pattern === "dead_bug" && (
                    <path
                      d="M 84 120 L 84 82"
                      stroke="#F1A3B3"
                      strokeWidth="5"
                      strokeLinecap="round"
                      style={animStyle("fmLimbLift", speedSec, playState, "84px 120px")}
                    />
                  )}
                </g>
              )}
            </g>
          )}

          {/* 8. SIDE-LYING LEG LIFT */}
          {pattern === "side_lying_leg" && (
            <g>
              <rect x="40" y="126" width="160" height="5" rx="2.5" fill="#C7DCC4" />
              <circle cx="66" cy="114" r="8.5" fill="#4A2C40" />
              <path d="M 76 121 L 120 121 L 165 122" stroke="#4A2C40" strokeWidth="6.5" fill="none" strokeLinecap="round" />
              <path
                d="M 120 120 L 168 112"
                stroke="#8EA986"
                strokeWidth="5.5"
                strokeLinecap="round"
                style={animStyle("fmLimbLift", speedSec, playState, "120px 120px")}
              />
            </g>
          )}

          {/* 9. STANDING SIDE LEG LIFT / CALF RAISE / QUAD STRETCH */}
          {(pattern === "standing_side_leg" || pattern === "calf_raise" || pattern === "quad_stretch") && (
            <g>
              <line x1="88" y1="30" x2="88" y2="132" stroke="#DAC3D2" strokeWidth="4" strokeLinecap="round" />
              <g style={pattern === "calf_raise" ? animStyle("fmMarchL", speedSec, playState) : undefined}>
                <circle cx="122" cy="30" r="9" fill="#4A2C40" />
                <path d="M 122 40 L 122 80" stroke="#4A2C40" strokeWidth="7" strokeLinecap="round" />
                <path d="M 118 48 L 88 64" stroke="#8A5E7D" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M 122 80 L 116 128" stroke="#4A2C40" strokeWidth="6" strokeLinecap="round" />
                <path
                  d={pattern === "quad_stretch" ? "M 124 80 L 132 104 L 142 86" : pattern === "standing_side_leg" ? "M 124 80 L 136 126" : "M 126 80 L 126 128"}
                  stroke={pattern === "calf_raise" ? "#4A2C40" : "#8EA986"}
                  strokeWidth="5.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={pattern === "standing_side_leg" ? animStyle("fmLimbLift", speedSec, playState, "124px 80px") : undefined}
                />
              </g>
            </g>
          )}

          {/* 10. SEATED LEG EXTENSION / CHAIR TRICEP DIPS */}
          {(pattern === "seated_leg" || pattern === "chair_dips") && (
            <g>
              <path d="M 82 54 L 82 130 M 82 94 L 116 94 L 116 130" stroke="#DAC3D2" strokeWidth="4" fill="none" strokeLinecap="round" />
              <g style={pattern === "chair_dips" ? animStyle("fmSquatBody", speedSec, playState) : undefined}>
                <circle cx={pattern === "chair_dips" ? 124 : 98} cy="44" r="9" fill="#4A2C40" />
                <path
                  d={pattern === "chair_dips" ? "M 124 54 L 124 90 L 154 96 L 156 128" : "M 98 54 L 98 90 L 126 92"}
                  stroke="#4A2C40"
                  strokeWidth="6.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {pattern === "seated_leg" && (
                  <path
                    d="M 126 92 L 130 128"
                    stroke="#8EA986"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                    style={animStyle("fmLimbLift", speedSec, playState, "126px 92px")}
                  />
                )}
              </g>
            </g>
          )}

          {/* 11. ARM CIRCLES / PRESS / BAND ROW / MARCH / STEP JACKS / SIDE BEND / HIP CIRCLES / NECK RELEASE / FOLD */}
          {(pattern === "arm_circles" ||
            pattern === "arm_press" ||
            pattern === "band_row" ||
            pattern === "march" ||
            pattern === "step_jacks" ||
            pattern === "side_bend" ||
            pattern === "hip_circles" ||
            pattern === "neck_release" ||
            pattern === "forward_fold") && (
            <g>
              <path
                d="M 114 82 L 106 128"
                stroke="#4A2C40"
                strokeWidth="6"
                strokeLinecap="round"
                style={pattern === "march" ? animStyle("fmMarchL", speedSec * 0.7, playState) : undefined}
              />
              <path
                d="M 126 82 L 134 128"
                stroke="#663B57"
                strokeWidth="6"
                strokeLinecap="round"
                style={pattern === "march" || pattern === "step_jacks" ? animStyle("fmMarchR", speedSec * 0.7, playState) : undefined}
              />

              <g
                style={
                  pattern === "side_bend"
                    ? animStyle("fmSideBend", speedSec, playState, "120px 82px")
                    : pattern === "forward_fold"
                    ? animStyle("fmFold", speedSec, playState, "120px 82px")
                    : undefined
                }
              >
                <path d="M 120 82 L 120 44" stroke="#4A2C40" strokeWidth="7" strokeLinecap="round" />
                <circle
                  cx="120"
                  cy="30"
                  r="9.5"
                  fill="#4A2C40"
                  style={
                    pattern === "neck_release"
                      ? animStyle("fmNeckTilt", speedSec, playState, "120px 42px")
                      : undefined
                  }
                />

                <path
                  d="M 118 50 L 90 66"
                  stroke="#8EA986"
                  strokeWidth="5"
                  strokeLinecap="round"
                  style={
                    pattern === "arm_press" || pattern === "step_jacks" || pattern === "arm_circles" || pattern === "band_row"
                      ? animStyle("fmArmSweep", speedSec, playState, "118px 50px")
                      : undefined
                  }
                />
                <path
                  d="M 122 50 L 150 66"
                  stroke="#8EA986"
                  strokeWidth="5"
                  strokeLinecap="round"
                  style={
                    pattern === "arm_press" || pattern === "step_jacks" || pattern === "arm_circles" || pattern === "band_row"
                      ? animStyle("fmLimbLift", speedSec, playState, "122px 50px")
                      : undefined
                  }
                />
              </g>
            </g>
          )}

          {/* 12. CHILD'S POSE */}
          {pattern === "childs_pose" && (
            <g>
              <rect x="38" y="126" width="164" height="5" rx="2.5" fill="#C7DCC4" />
              <path d="M 76 122 L 96 106 L 146 116 L 182 122" stroke="#4A2C40" strokeWidth="6.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="152" cy="112" r="8.5" fill="#4A2C40" />
              <ellipse
                cx="118"
                cy="106"
                rx="16"
                ry="8"
                fill="#A8C3A0"
                opacity="0.5"
                style={animStyle("fmBreatheHalo", speedSec, playState, "118px 106px")}
              />
            </g>
          )}

          {/* 13. DEEP BREATHING / KEGEL & PELVIC FLOOR */}
          {pattern === "breathe" && (
            <g>
              <path d="M 96 122 Q 120 112 144 122" stroke="#6E8966" strokeWidth="5.5" fill="none" strokeLinecap="round" />
              <path d="M 120 112 L 120 68" stroke="#4A2C40" strokeWidth="7.5" strokeLinecap="round" />
              <circle cx="120" cy="52" r="10.5" fill="#4A2C40" />
              <path d="M 118 76 L 106 90 L 120 94 L 134 90 L 122 76" stroke="#8A5E7D" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <circle
                cx="120"
                cy="92"
                r="13"
                fill="#A8C3A0"
                opacity="0.65"
                style={animStyle("fmBreatheHalo", speedSec * 1.3, playState, "120px 92px")}
              />
            </g>
          )}
        </svg>
      </div>

      {/* Concise Visual Caption */}
      <p className="text-[11px] text-plum/80 text-center mt-2 font-medium leading-snug">
        {caption.action}
      </p>
    </div>
  );
}
