// ---------------------------------------------------------
// Plan Generator — creates a personalized 4-week fitness,
// gentle coaching cues, 5-min express rescue, and meal/grocery
// plan based on quiz answers.
// ---------------------------------------------------------

// =========================================================
// Types
// =========================================================
export interface QuizAnswers {
  age: string;
  currentWeight: string;
  goalWeight: string;
  hasBabyUnder1: boolean;
  exerciseMinutes: number;    // 10, 20, or 30
  exerciseLocation: string;   // "home_no_equipment" | "home_light_equipment"
  healthIssues: string[];     // ["back_pain", "knee_pain", "none", "other"]
  foodPreference: string;     // "vegetarian" | "non_vegetarian" | "eggs_only"
}

export interface Exercise {
  name: string;
  duration: string;           // e.g. "12 reps" or "45 seconds"
  seconds?: number;           // Used by the guided step-by-step timer
  focus?: string;             // e.g. "Glutes & Pelvic Floor"
  formCues?: string[];        // Quick, safe form guidance
  breathingCue?: string;      // Pelvic-floor friendly breathing tip
  gentleVariation?: string;   // Instant easier modification
}

export interface WorkoutDay {
  day: number;                // 1–28
  week: number;               // 1–4
  weekTheme?: string;
  focusTitle?: string;
  dayOfWeek: string;          // "Monday", etc.
  warmup: Exercise[];
  exercises: Exercise[];
  cooldown: Exercise[];
  isRestDay: boolean;
}

export interface MealDay {
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
}

export interface MealGuidance {
  prepTime: string;
  highlight: string;
  prepTip: string;
  familyNote: string;
}

export interface GroceryCategory {
  category: string;
  items: string[];
}

export interface Plan {
  workouts: WorkoutDay[];
  meals: MealDay[];
  isGentle: boolean;
  doctorReminder: boolean;
  motivationalMessages: string[];
}

// =========================================================
// Weekly progression themes & daily focuses
// =========================================================
export const WEEK_THEMES = [
  "Week 1: Gentle Foundation & Breath",
  "Week 2: Steady Stamina & Posture Relief",
  "Week 3: Core Strength & Pelvic Support",
  "Week 4: Confident Daily Flow",
];

const DAILY_FOCUSES = [
  "Lower Body & Daily Energy",       // Mon
  "Feeding Posture & Upper Back",    // Tue
  "Gentle Core & Stability",         // Wed
  "Full-Body Light Stamina",         // Thu
  "Glutes, Hips & Joint Relief",     // Fri
  "Weekend Refresh & Stretch",       // Sat
  "Rest & Mindful Recovery",         // Sun
];

// =========================================================
// Rich Exercise Library
// =========================================================
const WARMUPS: Exercise[] = [
  {
    name: "March in place",
    duration: "1 minute",
    seconds: 60,
    focus: "Circulation",
    formCues: [
      "Stand tall with relaxed shoulders and swing your arms softly.",
      "Keep knees low if managing pelvic heaviness or knee tenderness.",
    ],
    breathingCue: "Inhale through your nose for 3 steps, exhale softly for 3 steps.",
    gentleVariation: "Seated knee marches on a sturdy chair.",
  },
  {
    name: "Arm circles (forward & back)",
    duration: "45 seconds",
    seconds: 45,
    focus: "Shoulder Tension",
    formCues: [
      "Draw slow circles from the shoulder joint, keeping your neck relaxed.",
      "Switch direction halfway through without arching your lower back.",
    ],
    breathingCue: "Steady slow breaths; drop shoulders away from ears on every exhale.",
    gentleVariation: "Keep elbows bent near your sides for smaller circles.",
  },
  {
    name: "Gentle side bends",
    duration: "45 seconds",
    seconds: 45,
    focus: "Ribs & Waist",
    formCues: [
      "Reach one arm up and lean softly to the opposite side without twisting.",
      "Keep weight balanced equally through both feet.",
    ],
    breathingCue: "Inhale to expand the stretched ribcage; exhale to return tall.",
    gentleVariation: "Slide hands gently down your thighs without lifting arms overhead.",
  },
  {
    name: "Shoulder rolls & chest opener",
    duration: "45 seconds",
    seconds: 45,
    focus: "Feeding Posture",
    formCues: [
      "Roll shoulders forward, up, back, and down in wide smooth loops.",
      "Lightly squeeze shoulder blades together at the back.",
    ],
    breathingCue: "Inhale as shoulders lift; exhale long as you drop them down.",
    gentleVariation: "Perform seated while resting back gently against a pillow.",
  },
  {
    name: "Hip circles",
    duration: "45 seconds",
    seconds: 45,
    focus: "Hip Mobility",
    formCues: [
      "Place hands on hips, soften knees slightly, and trace gentle circles.",
      "Keep movement pain-free and smaller if your lower back feels tight.",
    ],
    breathingCue: "Keep jaw relaxed and breathe steadily into your belly.",
    gentleVariation: "Stand lightly touching a countertop for extra balance.",
  },
  {
    name: "Walking high knees (slow)",
    duration: "1 minute",
    seconds: 60,
    focus: "Warm Legs",
    formCues: [
      "Lift one knee comfortably to hip height without rounding your spine.",
      "Tap softly onto the balls of your feet.",
    ],
    breathingCue: "Exhale lightly each time you lift a knee.",
    gentleVariation: "Low ankle lifts / heel taps in front with zero knee strain.",
  },
];

const COOLDOWNS: Exercise[] = [
  {
    name: "Deep breathing (inhale 4s, exhale 6s)",
    duration: "1 minute",
    seconds: 60,
    focus: "Calm Nervous System",
    formCues: [
      "Place one hand on chest and one on lower belly.",
      "Let your ribcage expand wide 360°, then exhale longer than you inhaled.",
    ],
    breathingCue: "4s gentle nose inhale → 6s slow sighing exhale.",
    gentleVariation: "Rest legs up on a couch seat for deeper relaxation.",
  },
  {
    name: "Standing quad stretch",
    duration: "1 minute",
    seconds: 60,
    focus: "Front Thighs",
    formCues: [
      "Hold a wall or chair with one hand and bring your heel gently back.",
      "Keep knees close together and tuck your tailbone lightly.",
    ],
    breathingCue: "Inhale upright; soften any tension on the exhale.",
    gentleVariation: "Rest top of foot behind you on a chair or couch cushion instead.",
  },
  {
    name: "Forward fold (touch your toes gently)",
    duration: "45 seconds",
    seconds: 45,
    focus: "Hamstrings & Spine",
    formCues: [
      "Bend your knees generously so your belly rests near your thighs.",
      "Let your head hang heavy like a bowling ball; don't force straight legs.",
    ],
    breathingCue: "Breathe into the back of your ribs and hips.",
    gentleVariation: "Place hands flat on a kitchen counter or chair back (half-fold).",
  },
  {
    name: "Child's pose",
    duration: "1 minute",
    seconds: 60,
    focus: "Lower Back Release",
    formCues: [
      "Take knees wide, bring big toes together, and fold forehead toward a cushion.",
      "Reach arms gently forward or rest them beside your knees.",
    ],
    breathingCue: "Feel your lower back expand upward with every deep inhale.",
    gentleVariation: "Place a folded blanket behind knees or under forehead.",
  },
  {
    name: "Cat-cow stretch",
    duration: "1 minute",
    seconds: 60,
    focus: "Spine Mobility",
    formCues: [
      "Start on hands and knees with wrists under shoulders.",
      "Move slowly with your breath — arch gently, then round smoothly.",
    ],
    breathingCue: "Inhale looking softly forward; exhale rounding spine toward ceiling.",
    gentleVariation: "Do seated cat-cow with hands on thighs if wrists/knees ache.",
  },
  {
    name: "Neck rolls & ear-to-shoulder release",
    duration: "45 seconds",
    seconds: 45,
    focus: "Neck & Traps",
    formCues: [
      "Drop right ear softly toward right shoulder, chin slightly tucked.",
      "Roll chin across chest to the other side; avoid tilting head far back.",
    ],
    breathingCue: "Exhale tension down out of your shoulders.",
    gentleVariation: "Keep chin neutral and look gently side-to-side instead.",
  },
];

// Regular bodyweight exercises
const REGULAR_BODYWEIGHT: Exercise[] = [
  {
    name: "Bodyweight squats",
    duration: "12 reps (60s)",
    seconds: 60,
    focus: "Legs & Glutes",
    formCues: [
      "Feet shoulder-width apart; sit hips back as if lowering onto a chair.",
      "Keep chest lifted and push smoothly through whole feet to stand.",
    ],
    breathingCue: "Inhale as you sit back; exhale from pelvic floor up as you stand.",
    gentleVariation: "Tap hips lightly onto a dining chair at the bottom.",
  },
  {
    name: "Push-ups (on knees if needed)",
    duration: "10 reps (50s)",
    seconds: 50,
    focus: "Arms & Chest",
    formCues: [
      "Elbows angle slightly back at 45° rather than flaring straight out.",
      "Keep ribs knitted down — don't let lower back sag or doming appear.",
    ],
    breathingCue: "Inhale lowering smoothly; exhale firmly as you press away.",
    gentleVariation: "Hands elevated on a kitchen counter or sturdy sofa.",
  },
  {
    name: "Glute bridges",
    duration: "12 reps (60s)",
    seconds: 60,
    focus: "Glutes & Lower Back",
    formCues: [
      "Lie on back, knees bent, heels flat near glutes.",
      "Squeeze glutes to lift hips until shoulders-hips-knees align without rib flare.",
    ],
    breathingCue: "Exhale and gently hug belly in as you lift hips; inhale down.",
    gentleVariation: "Reduce lift height slightly or place pillow under head.",
  },
  {
    name: "Reverse lunges",
    duration: "10 each leg (60s)",
    seconds: 60,
    focus: "Balance & Quads",
    formCues: [
      "Step one foot straight back and lower rear knee comfortably.",
      "Keep 80% of weight in your front heel as you step back together.",
    ],
    breathingCue: "Inhale stepping back; exhale driving through front heel.",
    gentleVariation: "Hold chair/wall for balance with a shallow bend.",
  },
  {
    name: "Plank hold",
    duration: "25 seconds",
    seconds: 40,
    focus: "Deep Core",
    formCues: [
      "Spread fingers wide, push floor away, and gently tuck tailbone.",
      "Stop immediately if you see belly coning or feel low-back strain.",
    ],
    breathingCue: "Keep steady gentle breaths; never hold your breath.",
    gentleVariation: "Incline plank with hands on counter or knees down.",
  },
  {
    name: "Jumping jacks (low impact: step-out jacks)",
    duration: "40 seconds",
    seconds: 40,
    focus: "Cardio Boost",
    formCues: [
      "Step one foot out at a time while lifting arms gracefully overhead.",
      "Keep knees soft and movements light on your carpet.",
    ],
    breathingCue: "Rhythmic breathing to keep heart rate pleasant and energized.",
    gentleVariation: "Arms to shoulder height only with slow side taps.",
  },
  {
    name: "Tricep dips (using a chair)",
    duration: "10 reps (50s)",
    seconds: 50,
    focus: "Back of Arms",
    formCues: [
      "Sit on a steady chair edge, hands beside hips, bend elbows straight back.",
      "Keep back close to the chair and shoulders rolled down away from ears.",
    ],
    breathingCue: "Inhale bending elbows; exhale pressing back tall.",
    gentleVariation: "Keep knees bent close to chair to support more weight.",
  },
  {
    name: "Side-lying leg lifts",
    duration: "12 each side (60s)",
    seconds: 60,
    focus: "Outer Hips",
    formCues: [
      "Lie on side with bottom knee slightly bent for balance, hips stacked.",
      "Lift top leg slightly backward and up — feel the side glute, not hip flexor.",
    ],
    breathingCue: "Exhale as you lift the leg; inhale controlling it down.",
    gentleVariation: "Smaller 6-inch lifts resting head on a pillow.",
  },
  {
    name: "Wall sit",
    duration: "30 seconds",
    seconds: 45,
    focus: "Thigh Endurance",
    formCues: [
      "Slide down wall until knees sit safely above ankles (not past toes).",
      "Press gently through lower back into wall and hold.",
    ],
    breathingCue: "Long slow exhales to keep calves and mind calm.",
    gentleVariation: "Slide down only halfway for a gentle knee-friendly angle.",
  },
  {
    name: "Superman hold",
    duration: "20 seconds",
    seconds: 40,
    focus: "Upper Back Posture",
    formCues: [
      "Lie face down and hover chest and hands an inch off the mat.",
      "Look down at mat to keep the back of your neck long.",
    ],
    breathingCue: "Inhale softly into ribs, keep breathing while hovering.",
    gentleVariation: "Lift alternating arms only while legs stay resting.",
  },
  {
    name: "Bicycle crunches",
    duration: "12 each side (50s)",
    seconds: 50,
    focus: "Obliques",
    formCues: [
      "Move slowly from your ribs — don't pull on your neck with hands.",
      "Keep lower back gently pressed toward the floor.",
    ],
    breathingCue: "Exhale smoothly on every twist.",
    gentleVariation: "Seated or standing standing-elbow-to-knee marches.",
  },
  {
    name: "Donkey kicks",
    duration: "12 each side (60s)",
    seconds: 60,
    focus: "Glutes",
    formCues: [
      "From hands & knees, press one heel up toward ceiling without arching spine.",
      "Engage glute at top rather than swinging leg high.",
    ],
    breathingCue: "Exhale gently as heel presses up.",
    gentleVariation: "Stand facing a wall/counter and extend leg softly behind you.",
  },
  {
    name: "Fire hydrants",
    duration: "12 each side (60s)",
    seconds: 60,
    focus: "Hip Stability",
    formCues: [
      "On all fours, lift bent knee softly out to the side like opening a hinge.",
      "Keep both elbows soft and hips level toward the mat.",
    ],
    breathingCue: "Exhale opening knee; inhale lowering with control.",
    gentleVariation: "Rest forearms on a couch cushion or fold a mat under knees.",
  },
  {
    name: "Standing calf raises",
    duration: "15 reps (45s)",
    seconds: 45,
    focus: "Ankles & Calves",
    formCues: [
      "Hold wall or counter lightly, rise smoothly onto balls of feet.",
      "Pause 1 second at top, then lower heels slowly.",
    ],
    breathingCue: "Exhale lifting up; inhale lowering steadily.",
    gentleVariation: "Seated heel raises while holding baby or sitting at edge of chair.",
  },
  {
    name: "Mountain climbers (slow)",
    duration: "30 seconds",
    seconds: 45,
    focus: "Core & Stamina",
    formCues: [
      "Slow, quiet steps from plank; avoid bouncing hips up and down.",
      "Prioritize quiet, controlled knee pulls.",
    ],
    breathingCue: "Exhale softly every time a knee draws forward.",
    gentleVariation: "Hands on kitchen counter or chair seat (incline slow march).",
  },
  {
    name: "Dead bugs",
    duration: "10 each side (60s)",
    seconds: 60,
    focus: "Postpartum Core",
    formCues: [
      "Lie on back, knees in tabletop; keep ribs softly melted down.",
      "Tap one heel slowly down while keeping back flat on mat.",
    ],
    breathingCue: "Exhale gently lifting pelvic floor as heel lowers.",
    gentleVariation: "Keep hands resting on belly and tap one heel at a time.",
  },
  {
    name: "Inchworms",
    duration: "6 reps (60s)",
    seconds: 60,
    focus: "Mobility & Arms",
    formCues: [
      "Soften knees, hinge down, walk hands forward slowly, then walk back.",
      "Pause briefly at the bottom to stretch calves and hamstrings.",
    ],
    breathingCue: "Inhale walking out; exhale pulling navel gently up as you return.",
    gentleVariation: "Bend knees deep so hands reach floor comfortably.",
  },
  {
    name: "Side plank (each side)",
    duration: "20s each side (50s)",
    seconds: 50,
    focus: "Side Core & Hips",
    formCues: [
      "Stack elbow directly under shoulder and press ribs up away from mat.",
      "Use bent bottom knee as kickstand for steady support.",
    ],
    breathingCue: "Steady slow breaths through your nose.",
    gentleVariation: "Keep bottom knee on floor or do forearm side plank against a wall.",
  },
  {
    name: "Sumo squats",
    duration: "12 reps (60s)",
    seconds: 60,
    focus: "Inner Thighs & Pelvic",
    formCues: [
      "Stand wide with toes angled slightly out; knees track over second toe.",
      "Keep torso upright rather than leaning chest far forward.",
    ],
    breathingCue: "Inhale lowering down; exhale gently lifting pelvic floor up.",
    gentleVariation: "Small-range pulses holding wall or chair back.",
  },
  {
    name: "Bird dogs",
    duration: "10 each side (60s)",
    seconds: 60,
    focus: "Back & Core Balance",
    formCues: [
      "From all fours, slide opposite arm & leg long rather than lifting too high.",
      "Imagine balancing a warm mug of tea on your lower back.",
    ],
    breathingCue: "Exhale extending limb long; inhale returning smoothly.",
    gentleVariation: "Slide leg back along floor without lifting it into the air.",
  },
];

// Extra exercises when user has light equipment
const EQUIPMENT_EXERCISES: Exercise[] = [
  {
    name: "Dumbbell bicep curls",
    duration: "12 reps (50s)",
    seconds: 50,
    focus: "Biceps & Lifting Strength",
    formCues: [
      "Pin elbows gently at ribs and curl weights without swinging your torso.",
      "Lower weights slowly for 2 counts to build steady arm tone.",
    ],
    breathingCue: "Exhale lifting weights up; inhale lowering slowly.",
    gentleVariation: "Use water bottles or skip weights and squeeze fists smoothly.",
  },
  {
    name: "Dumbbell shoulder press",
    duration: "10 reps (50s)",
    seconds: 50,
    focus: "Strong Shoulders",
    formCues: [
      "Press dumbbells overhead slightly in front of ears so ribs don't flare.",
      "Keep knees soft and core gently braced.",
    ],
    breathingCue: "Exhale pressing up; inhale returning to shoulders.",
    gentleVariation: "Perform seated or press one arm at a time.",
  },
  {
    name: "Resistance band rows",
    duration: "12 reps (50s)",
    seconds: 50,
    focus: "Feeding Posture",
    formCues: [
      "Sit tall with band looped around feet and pull elbows straight past ribs.",
      "Squeeze between shoulder blades like holding a pencil.",
    ],
    breathingCue: "Exhale pulling band back; inhale releasing slowly.",
    gentleVariation: "Do standing doorframe rows without a band.",
  },
  {
    name: "Dumbbell goblet squats",
    duration: "10 reps (60s)",
    seconds: 60,
    focus: "Full Legs & Core",
    formCues: [
      "Hold one light dumbbell close against your chest with both hands.",
      "The front weight helps keep your torso upright naturally.",
    ],
    breathingCue: "Inhale down; exhale pressing through heels.",
    gentleVariation: "Set weight down and do supported chair squats.",
  },
  {
    name: "Resistance band lateral walk",
    duration: "10 steps each way (50s)",
    seconds: 50,
    focus: "Glutes & Hips",
    formCues: [
      "Loop light band above knees or ankles; keep a small athletic bend.",
      "Step side-to-side quietly without letting knees cave inward.",
    ],
    breathingCue: "Relax upper shoulders and breathe steadily.",
    gentleVariation: "Remove band and do controlled slow side-steps.",
  },
  {
    name: "Dumbbell deadlifts (light weight)",
    duration: "10 reps (60s)",
    seconds: 60,
    focus: "Back & Hamstrings",
    formCues: [
      "Soften knees and push hips straight back as weights graze thighs.",
      "Keep spine completely flat; never round to touch the floor.",
    ],
    breathingCue: "Inhale hinging hips back; exhale squeezing glutes to stand.",
    gentleVariation: "Bodyweight hip hinges with hands on hips.",
  },
  {
    name: "Resistance band pull-aparts",
    duration: "12 reps (45s)",
    seconds: 45,
    focus: "Upper Back Unwind",
    formCues: [
      "Hold band straight in front at shoulder height and pull hands wide.",
      "Keep neck relaxed — tension belongs between shoulder blades.",
    ],
    breathingCue: "Exhale pulling wide; inhale returning gently.",
    gentleVariation: "Grip wider on the band for lighter resistance.",
  },
  {
    name: "Dumbbell lunges",
    duration: "8 each leg (60s)",
    seconds: 60,
    focus: "Lower Body Tone",
    formCues: [
      "Hold light dumbbells at sides and take controlled backward steps.",
      "Pause briefly at bottom for balance.",
    ],
    breathingCue: "Inhale stepping back; exhale rising upright.",
    gentleVariation: "Drop weights and hold wall for supported split squats.",
  },
];

// Gentle exercises (postpartum-safe or for pain)
const GENTLE_EXERCISES: Exercise[] = [
  {
    name: "Wall push-ups",
    duration: "10 reps (45s)",
    seconds: 45,
    focus: "Safe Upper Body",
    formCues: [
      "Stand arm's length from a wall, hands shoulder height.",
      "Bend elbows smoothly toward wall while keeping core softly wrapped.",
    ],
    breathingCue: "Inhale leaning in; exhale pressing back upright.",
    gentleVariation: "Step feet closer to the wall for ultra-light load.",
  },
  {
    name: "Seated leg extensions",
    duration: "10 each leg (50s)",
    seconds: 50,
    focus: "Knee-Safe Quads",
    formCues: [
      "Sit tall on a sturdy chair, extend one foot slowly until leg is straight.",
      "Flex thigh for 1 second at top, then lower softly.",
    ],
    breathingCue: "Exhale straightening leg; inhale lowering down.",
    gentleVariation: "Rest hands lightly on chair seat for posture support.",
  },
  {
    name: "Pelvic floor squeeze (Kegels) & Breath",
    duration: "10 reps, hold 5s (60s)",
    seconds: 60,
    focus: "Pelvic Recovery",
    formCues: [
      "Sit or lie comfortably; gently lift pelvic floor up & inward on exhale.",
      "Fully relax and soften completely between every repetition.",
    ],
    breathingCue: "Inhale relax belly/pelvis; exhale gentle lift + hug baby-muscle in.",
    gentleVariation: "Hold for 2–3 seconds instead of 5 if fatiguing.",
  },
  {
    name: "Gentle glute bridges",
    duration: "10 reps (55s)",
    seconds: 55,
    focus: "Glutes & Pelvic Alignment",
    formCues: [
      "Lie on back with knees bent; lift hips smoothly only a few inches.",
      "Avoid overarching your lower back at the top.",
    ],
    breathingCue: "Exhale gently while lifting hips; inhale lowering vertebrae by vertebrae.",
    gentleVariation: "Place a soft pillow between knees and squeeze lightly.",
  },
  {
    name: "Standing side leg lifts (hold wall)",
    duration: "10 each side (50s)",
    seconds: 50,
    focus: "Hip Support",
    formCues: [
      "Stand next to a wall or chair back and lift outside leg smoothly out.",
      "Keep standing knee unlocked and torso tall (no leaning sideways).",
    ],
    breathingCue: "Exhale lifting leg out; inhale returning calmly.",
    gentleVariation: "Smaller toe-tap lift just a few inches off the carpet.",
  },
  {
    name: "Seated arm raises & posture reset",
    duration: "12 reps (45s)",
    seconds: 45,
    focus: "Neck & Shoulder Relief",
    formCues: [
      "Sit tall and float arms forward to shoulder height, then open wide to a 'T'.",
      "Keep neck completely soft and jaw unclenched.",
    ],
    breathingCue: "Inhale opening arms wide; exhale lowering slowly.",
    gentleVariation: "Keep elbows bent at 90° like goalpost arms.",
  },
  {
    name: "Heel slides (lying down)",
    duration: "10 each leg (60s)",
    seconds: 60,
    focus: "Diastasis-Safe Core",
    formCues: [
      "Lie on back, knees bent; exhale as you slide one heel out flat on floor.",
      "Keep back stable against mat and draw heel gently back in.",
    ],
    breathingCue: "Exhale extending heel; inhale sliding back.",
    gentleVariation: "Slide leg halfway out only, keeping core calm.",
  },
  {
    name: "Marching in place (slow)",
    duration: "1 minute",
    seconds: 60,
    focus: "Easy Stamina",
    formCues: [
      "Soft quiet steps in place, knees low and posture stacked.",
      "Swing arms lightly to awaken shoulders.",
    ],
    breathingCue: "Natural rhythmic breathing through nose.",
    gentleVariation: "March seated in a chair.",
  },
  {
    name: "Gentle bird dogs (from all fours)",
    duration: "8 each side (55s)",
    seconds: 55,
    focus: "Back-Friendly Stability",
    formCues: [
      "Extend opposite arm and leg slowly while keeping hips level.",
      "Pad knees with a folded towel or blanket.",
    ],
    breathingCue: "Exhale lengthening arm & leg; inhale bringing back under.",
    gentleVariation: "Slide one foot back along floor without lifting leg up.",
  },
  {
    name: "Supported squats (hold chair)",
    duration: "10 reps (55s)",
    seconds: 55,
    focus: "Safe Daily Lifting",
    formCues: [
      "Face the back of a sturdy chair, hold lightly, and sit hips smoothly back.",
      "Use only comfortable range — zero knee pinching.",
    ],
    breathingCue: "Inhale sitting back; exhale lifting smoothly through feet.",
    gentleVariation: "Sit halfway down onto a couch cushion and rise back up.",
  },
  {
    name: "Ankle circles & calf pump",
    duration: "10 each side (45s)",
    seconds: 45,
    focus: "Joint Fluidity",
    formCues: [
      "Seated or lying down, trace big gentle circles with your toes.",
      "Helps reduce leg swelling after long hours on your feet.",
    ],
    breathingCue: "Slow restorative breaths.",
    gentleVariation: "Rest feet up on sofa pillow while circling.",
  },
  {
    name: "Standing hip circles",
    duration: "10 each direction (45s)",
    seconds: 45,
    focus: "Pelvic Ease",
    formCues: [
      "Make gentle figure-eights or wide circles with hips to loosen low-back stiffness.",
    ],
    breathingCue: "Soft belly breaths.",
    gentleVariation: "Hold counter lightly for support.",
  },
  {
    name: "Gentle cat-cow (all fours)",
    duration: "10 reps (60s)",
    seconds: 60,
    focus: "Mid-Back Relief",
    formCues: [
      "Move like water through your spine between gentle arch and soft round.",
      "Keep range small if abdominal separation feels stretched.",
    ],
    breathingCue: "Inhale broaden chest; exhale look softly toward belly.",
    gentleVariation: "Seated cat-cow on sofa or dining chair.",
  },
  {
    name: "Seated torso & chest opener",
    duration: "8 each side (50s)",
    seconds: 50,
    focus: "Nursing & Carry Posture",
    formCues: [
      "Sit tall, cross arms softly over chest, and gently rotate ribs side-to-side.",
      "Keep pelvis anchored on chair seat.",
    ],
    breathingCue: "Exhale into gentle turn; inhale back to center.",
    gentleVariation: "Do smaller turns with hands resting comfortably on lap.",
  },
];

// Combine all exercises into a lookup map for legacy plan enrichment & gentle swaps
const ALL_EXERCISES: Exercise[] = [
  ...WARMUPS,
  ...COOLDOWNS,
  ...REGULAR_BODYWEIGHT,
  ...EQUIPMENT_EXERCISES,
  ...GENTLE_EXERCISES,
];

const EXERCISE_LOOKUP = new Map<string, Exercise>(
  ALL_EXERCISES.map((ex) => [ex.name.toLowerCase(), ex])
);

/** Enriches any exercise (even from previously saved Firestore plans) with full guidance. */
export function enrichExercise(ex: Exercise): Exercise {
  if (ex.formCues && ex.breathingCue && ex.seconds && ex.gentleVariation) {
    return ex;
  }
  const match = EXERCISE_LOOKUP.get(ex.name.toLowerCase());
  if (match) {
    return {
      ...match,
      ...ex,
      seconds: ex.seconds ?? match.seconds ?? 50,
      focus: ex.focus ?? match.focus ?? "Full-Body Control",
      formCues: ex.formCues ?? match.formCues,
      breathingCue: ex.breathingCue ?? match.breathingCue,
      gentleVariation: ex.gentleVariation ?? match.gentleVariation,
    };
  }
  return {
    ...ex,
    seconds: ex.seconds ?? 50,
    focus: ex.focus ?? "Mindful Movement",
    formCues: ex.formCues ?? [
      "Move slowly with soft joints and upright posture.",
      "Stop immediately if you feel any sharp pain or dizziness.",
    ],
    breathingCue: ex.breathingCue ?? "Inhale on preparation, exhale smoothly during effort.",
    gentleVariation: ex.gentleVariation ?? "Reduce range of motion or pause briefly whenever needed.",
  };
}

/** Returns a safe gentle swap from the pool that differs from the current exercise name. */
export function getGentleSwap(currentName: string, avoidNames: string[] = []): Exercise {
  const candidates = GENTLE_EXERCISES.filter(
    (g) => g.name.toLowerCase() !== currentName.toLowerCase() && !avoidNames.includes(g.name)
  );
  const pool = candidates.length > 0 ? candidates : GENTLE_EXERCISES;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Built-in 5-Minute Express Nap-Time Rescue Routine */
export function getExpressRoutine(): WorkoutDay {
  return {
    day: 0,
    week: 1,
    weekTheme: "5-Min Mom Rescue",
    focusTitle: "5-Min Nap-Time Reset (Still Counts!)",
    dayOfWeek: "Today",
    isRestDay: false,
    warmup: [WARMUPS[3]], // Shoulder rolls & chest opener (45s)
    exercises: [
      GENTLE_EXERCISES[7], // Marching in place slow (60s)
      GENTLE_EXERCISES[9], // Supported squats (55s)
      GENTLE_EXERCISES[2], // Pelvic floor squeeze & breath (60s)
    ],
    cooldown: [COOLDOWNS[0]], // Deep breathing (60s)
  };
}

/** Built-in Posture & Sore Back / Tight Neck Routine */
export function getPostureReliefRoutine(): WorkoutDay {
  return {
    day: 0,
    week: 1,
    weekTheme: "Neck, Back & Carrying Relief",
    focusTitle: "Upper Back, Neck & Pelvic Unwind",
    dayOfWeek: "Today",
    isRestDay: false,
    warmup: [WARMUPS[3], WARMUPS[1]], // Shoulder rolls + arm circles
    exercises: [
      GENTLE_EXERCISES[13], // Seated torso & chest opener
      GENTLE_EXERCISES[12], // Gentle cat-cow
      GENTLE_EXERCISES[3],  // Gentle glute bridges
      GENTLE_EXERCISES[2],  // Pelvic floor & breath
    ],
    cooldown: [COOLDOWNS[5], COOLDOWNS[3]], // Neck rolls + Child's pose
  };
}

// Exercises to AVOID with specific pain
const KNEE_AVOID = ["Reverse lunges", "Jumping jacks (low impact: step-out jacks)", "Jumping jacks", "Mountain climbers (slow)", "Mountain climbers", "Sumo squats", "Dumbbell lunges"];
const BACK_AVOID = ["Superman hold", "Bicycle crunches", "Mountain climbers (slow)", "Mountain climbers", "Dumbbell deadlifts (light weight)"];

// =========================================================
// Meal pools & Smart Meal Guidance
// =========================================================
const MEALS_VEG = {
  breakfast: [
    "Oats porridge with banana and honey",
    "Idli with coconut chutney",
    "Poha with peanuts and veggies",
    "Ragi dosa with sambar",
    "Whole wheat toast with peanut butter and fruit",
    "Upma with vegetables",
    "Muesli with curd and berries",
    "Besan chilla with mint chutney",
  ],
  lunch: [
    "Dal + brown rice + seasonal sabzi + salad",
    "Rajma chawal with raita",
    "Chole with 2 rotis + cucumber salad",
    "Mixed veg pulao with dal + curd",
    "Palak paneer with 2 rotis + buttermilk",
    "Sambar rice with papad + curd",
    "Stuffed paratha with curd + pickle",
  ],
  dinner: [
    "Moong dal khichdi with ghee",
    "Vegetable soup + 1 roti + paneer bhurji",
    "Tofu stir-fry with steamed rice",
    "Dal tadka + 2 rotis + salad",
    "Mixed veg curry + quinoa or rice",
    "Methi thepla with curd",
    "Baingan bharta + 2 rotis",
  ],
  snack: [
    "A handful of roasted makhana",
    "Fruit chaat with chaat masala",
    "Handful of almonds and walnuts",
    "Buttermilk (chaas) with roasted cumin",
    "Carrot and cucumber sticks with hummus",
    "Sprouts salad with lemon",
    "Roasted chana",
  ],
};

const MEALS_NONVEG = {
  breakfast: [
    "Scrambled eggs with whole wheat toast",
    "Egg bhurji with 2 rotis",
    "Omelette with veggies and toast",
    "Oats porridge with boiled egg on the side",
    "Chicken keema sandwich on whole wheat",
    "Idli with egg curry",
    "Poha with peanuts + boiled eggs",
    "Moong dal chilla with egg",
  ],
  lunch: [
    "Chicken curry + brown rice + salad",
    "Fish fry + dal + rice + sabzi",
    "Egg curry + 2 rotis + raita",
    "Grilled chicken salad with olive oil dressing",
    "Chicken biryani (less oil) + raita",
    "Dal + rice + grilled fish + salad",
    "Egg fried rice (less oil) with veggies",
  ],
  dinner: [
    "Grilled chicken breast + steamed veggies",
    "Fish curry + 1 roti + salad",
    "Chicken soup + whole wheat bread",
    "Egg curry + brown rice",
    "Tandoori chicken + 1 roti + salad",
    "Fish tikka + dal + roti",
    "Chicken stir-fry with veggies",
  ],
  snack: [
    "Boiled egg with salt and pepper",
    "Handful of almonds and walnuts",
    "Fruit chaat",
    "Chicken tikka bites (2–3 pieces)",
    "Greek yogurt with honey",
    "Roasted makhana",
    "Sprouts salad",
  ],
};

const MEALS_EGGS = {
  breakfast: [
    "Scrambled eggs with whole wheat toast",
    "Egg bhurji with 2 rotis",
    "Omelette with veggies and toast",
    "Oats porridge with boiled egg on the side",
    "Boiled eggs with fruit and nuts",
    "Egg dosa with chutney",
    "French toast (whole wheat) with honey",
    "Egg sandwich with veggies",
  ],
  lunch: [
    "Egg curry + brown rice + salad",
    "Rajma chawal + boiled egg",
    "Dal + rice + egg bhurji + sabzi",
    "Egg fried rice (less oil) with veggies",
    "Paneer + egg curry + 2 rotis",
    "Chole + rice + egg salad",
    "Stuffed egg paratha with curd",
  ],
  dinner: [
    "Egg curry + 2 rotis + salad",
    "Moong dal khichdi + boiled egg",
    "Vegetable soup + egg sandwich",
    "Dal tadka + 2 rotis + egg bhurji",
    "Omelette + mixed veg curry + rice",
    "Egg drop soup + roti + salad",
    "Paneer bhurji + egg + roti",
  ],
  snack: [
    "Boiled egg with salt and pepper",
    "Handful of almonds and walnuts",
    "Fruit chaat with chaat masala",
    "Egg muffin (baked in muffin tin)",
    "Carrot & cucumber sticks with hummus",
    "Buttermilk (chaas)",
    "Roasted chana",
  ],
};

/** Generates practical mom-friendly cooking shortcuts & family notes for any meal. */
export function getMealGuidance(mealName: string, slot: "breakfast" | "lunch" | "dinner" | "snack"): MealGuidance {
  const lower = mealName.toLowerCase();

  if (slot === "snack") {
    return {
      prepTime: "2–5 min",
      highlight: "Steady Afternoon Energy",
      prepTip: "Keep pre-portioned in small containers or jars on the kitchen counter for one-handed snacking.",
      familyNote: "Easy to share directly with toddlers or older kids as an after-school bite.",
    };
  }

  if (lower.includes("oats") || lower.includes("muesli") || lower.includes("toast")) {
    return {
      prepTime: "5–7 min",
      highlight: "High Fiber & Zero-Stress Prep",
      prepTip: "Prep overnight in a jar or keep sliced fruit ready the evening before.",
      familyNote: "Kids love warm oats or toast strips with mild peanut butter or mashed banana.",
    };
  }

  if (lower.includes("egg") || lower.includes("omelette") || lower.includes("scrambled")) {
    return {
      prepTime: "8–10 min",
      highlight: "High Protein Recovery",
      prepTip: "Chop onions/tomatoes once for 2–3 days in an airtight box to cut morning prep in half.",
      familyNote: "Take out mild scrambled egg for little ones before adding green chilies or pepper.",
    };
  }

  if (lower.includes("khichdi") || lower.includes("dal") || lower.includes("rajma") || lower.includes("chole") || lower.includes("sambar")) {
    return {
      prepTime: "15 min (pressure cooker)",
      highlight: "Gut-Friendly & Nourishing",
      prepTip: "Boil extra dal/legumes in one batch and refrigerate half for an effortless next-day meal.",
      familyNote: "Naturally toddler-safe before final tadka — just mash softly with a drop of ghee.",
    };
  }

  if (lower.includes("chicken") || lower.includes("fish")) {
    return {
      prepTime: "15–20 min",
      highlight: "Lean Protein & Iron",
      prepTip: "Marinate protein in lemon, curd & basic spices in the morning so cooking takes 10 minutes.",
      familyNote: "Use tender bite-sized strips and mild spices so the whole table eats the same meal.",
    };
  }

  if (lower.includes("paneer") || lower.includes("tofu") || lower.includes("pulao") || lower.includes("chilla") || lower.includes("poha") || lower.includes("upma") || lower.includes("idli") || lower.includes("dosa")) {
    return {
      prepTime: "10–15 min",
      highlight: "Balanced Sustained Energy",
      prepTip: "Toss frozen peas or grated carrot right into the pan to sneak in extra veggies quickly.",
      familyNote: "Universal family favorite — serve mild with curd or simple coconut chutney.",
    };
  }

  return {
    prepTime: "15 min",
    highlight: "Wholesome Home Fuel",
    prepTip: "Keep prep ultra-simple with pre-washed greens and minimal spices.",
    familyNote: "Easy to portion for both busy parents and kids without making two separate meals.",
  };
}

/** Builds a clean grouped weekly grocery list from a 7-day meal slice. */
export function getWeeklyGroceryList(meals: MealDay[], foodPreference: string): GroceryCategory[] {
  const joined = meals.map((m) => `${m.breakfast} ${m.lunch} ${m.dinner} ${m.snack}`).join(" ").toLowerCase();

  const produce: string[] = ["Onions & Tomatoes", "Ginger, Garlic & Green Chilies", "Seasonal Sabzi / Mixed Vegetables", "Cucumber & Carrots (for quick salads/sticks)", "Fresh Fruit (Bananas, Apples, Berries)"];
  if (joined.includes("palak")) produce.push("Fresh Spinach (Palak)");
  if (joined.includes("methi")) produce.push("Fresh Methi (Fenugreek) Leaves");
  if (joined.includes("baingan")) produce.push("Eggplant (Baingan) for Bharta");
  if (joined.includes("lemon") || joined.includes("chaat") || joined.includes("sprouts")) produce.push("Fresh Lemons & Mint/Coriander");

  const pantry: string[] = [
    "Whole Wheat Atta (for Rotis / Paratha)",
    "Brown or Steamed Rice",
    "Yellow Moong & Toor Dal",
    "Ghee / Olive Oil & Everyday Spices",
    "Almonds, Walnuts & Roasted Makhana / Chana",
  ];
  if (joined.includes("oats") || joined.includes("muesli")) pantry.push("Rolled Oats / Muesli & Honey");
  if (joined.includes("poha")) pantry.push("Flattened Rice (Poha) & Peanuts");
  if (joined.includes("upma") || joined.includes("idli") || joined.includes("dosa")) pantry.push("Suji (Rava) or Idli/Dosa Batter");
  if (joined.includes("rajma") || joined.includes("chole") || joined.includes("sprouts")) pantry.push("Rajma / Chickpeas (Chole) / Whole Moong");
  if (joined.includes("toast") || joined.includes("sandwich") || joined.includes("bread")) pantry.push("Whole Wheat Bread & Peanut Butter");
  if (joined.includes("besan")) pantry.push("Besan (Gram Flour)");

  const proteins: string[] = ["Fresh Curd / Plain Yogurt (for raita & chaas)"];
  if (joined.includes("paneer")) proteins.push("Fresh Paneer");
  if (joined.includes("tofu")) proteins.push("Firm Tofu");
  if (foodPreference === "eggs_only" || foodPreference === "non_vegetarian" || joined.includes("egg")) {
    proteins.push("1–2 Dozen Eggs");
  }
  if (foodPreference === "non_vegetarian") {
    if (joined.includes("chicken")) proteins.push("Lean Chicken Breast / Curry Cut");
    if (joined.includes("fish")) proteins.push("Fresh Fish Fillets");
  }

  return [
    { category: "Fresh Produce & Fruit", items: produce },
    { category: "Pantry, Grains & Healthy Snacks", items: pantry },
    { category: "Proteins & Dairy", items: proteins },
  ];
}

// =========================================================
// Motivational messages (one per day for 28 days)
// =========================================================
const MOTIVATIONAL_MESSAGES = [
  "You showed up today — that's already a win! 🌸",
  "Every minute you move is a gift to yourself. Keep going! 🌟",
  "You're stronger than you think, mama! 💖",
  "Small steps every day lead to big changes. You've got this!",
  "Taking care of yourself IS taking care of your family. 🌺",
  "Progress, not perfection. You're doing amazing!",
  "Your body carried life — be gentle and proud of what it can do! 🤱",
  "20 minutes is all it takes. You are worth those 20 minutes!",
  "Consistency beats intensity. You're building a lasting habit! ✨",
  "You're not starting over — you're starting from experience. 💫",
  "Be proud of yourself today. You chose YOU!",
  "One gentle session closer to feeling like yourself again. 🌈",
  "Rest days are part of the plan. Zero guilt allowed! 😌",
  "Your kids are watching you choose care and strength — what a role model! 🌻",
  "Energy creates energy. Even 10 gentle minutes changes your afternoon!",
  "Two weeks in! Look how steadily your confidence is growing. 🎉",
  "Listen to your body — slowing down is wisdom, never failure. 🧘‍♀️",
  "Strength isn't just physical — look at all you carry every single day!",
  "You deserve to feel comfortable and energized in your body. 💛",
  "Halfway through the 4-week plan! Look how far you've come! 🏆",
  "You are proof that busy motherhood and self-care can live together. 🙌",
  "Some days are exhausting. Showing up in Gentle or 5-Min mode counts just as much.",
  "Your future self is already thanking you for today's care. 🕊️",
  "Three weeks done! This gentle rhythm is becoming second nature! 🌺",
  "Celebrate every glass of water and every small stretch — they add up fast! 🥳",
  "Strong, calm, and resilient — you are doing brilliantly! 💕",
  "Final week of this cycle! Feel how much steadier your breath and posture feel. 🎯",
  "28 days complete! Whether you did 10 sessions or 28, you kept showing up! 🏅",
];

// =========================================================
// Helper functions
// =========================================================
function pickBalanced<T extends { name: string }>(
  arr: T[],
  count: number,
  avoid: string[] = [],
  seedOffset = 0
): T[] {
  const filtered = arr.filter((item) => !avoid.includes(item.name));
  const pool = filtered.length >= count ? filtered : arr;
  // Deterministic + varied rotation per day so weeks feel structured, with slight randomness when regenerated
  const rotated: T[] = [];
  const salt = Math.floor(Math.random() * pool.length);
  for (let i = 0; i < count; i++) {
    const idx = (seedOffset * 3 + salt + i * 2) % pool.length;
    const candidate = pool[idx];
    if (!rotated.some((r) => r.name === candidate.name)) {
      rotated.push(candidate);
    } else {
      const nextFallback = pool.find((p) => !rotated.some((r) => r.name === p.name));
      if (nextFallback) rotated.push(nextFallback);
    }
  }
  return rotated;
}

function getDayOfWeek(dayNumber: number): string {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return days[(dayNumber - 1) % 7];
}

// =========================================================
// Main generator function
// =========================================================
export function generatePlan(answers: QuizAnswers): Plan {
  // Determine if we need gentle mode
  const isGentle =
    answers.hasBabyUnder1 || answers.healthIssues.some((i) => i !== "none");

  const doctorReminder = isGentle;

  // Build the "avoid" list based on pain
  const avoidExercises: string[] = [];
  if (answers.healthIssues.includes("knee_pain")) {
    avoidExercises.push(...KNEE_AVOID);
  }
  if (answers.healthIssues.includes("back_pain")) {
    avoidExercises.push(...BACK_AVOID);
  }

  // Pick the exercise pool
  let exercisePool = isGentle ? GENTLE_EXERCISES : REGULAR_BODYWEIGHT;
  if (!isGentle && answers.exerciseLocation === "home_light_equipment") {
    exercisePool = [...REGULAR_BODYWEIGHT, ...EQUIPMENT_EXERCISES];
  }

  // Determine exercise count per day based on duration
  let exerciseCount = 3; // default for 20 min
  if (answers.exerciseMinutes === 10) exerciseCount = 2;
  if (answers.exerciseMinutes === 30) exerciseCount = 4;

  // Generate 28 days of workouts across 4 themed weeks
  const workouts: WorkoutDay[] = [];
  for (let day = 1; day <= 28; day++) {
    const dayIndexZero = day - 1;
    const week = Math.floor(dayIndexZero / 7) + 1;
    const dayOfWeek = getDayOfWeek(day);
    const isRestDay = dayOfWeek === "Sunday";
    const weekTheme = WEEK_THEMES[week - 1];
    const focusTitle = DAILY_FOCUSES[dayIndexZero % 7];

    if (isRestDay) {
      workouts.push({
        day,
        week,
        weekTheme,
        focusTitle,
        dayOfWeek,
        warmup: [],
        exercises: [],
        cooldown: [COOLDOWNS[0], COOLDOWNS[5]], // gentle rest stretches available optionally
        isRestDay: true,
      });
    } else {
      workouts.push({
        day,
        week,
        weekTheme,
        focusTitle,
        dayOfWeek,
        warmup: pickBalanced(WARMUPS, 2, [], day),
        exercises: pickBalanced(exercisePool, exerciseCount, avoidExercises, day),
        cooldown: pickBalanced(COOLDOWNS, 2, [], day + 1),
        isRestDay: false,
      });
    }
  }

  // Pick meal pool
  let mealPool = MEALS_VEG;
  if (answers.foodPreference === "non_vegetarian") mealPool = MEALS_NONVEG;
  if (answers.foodPreference === "eggs_only") mealPool = MEALS_EGGS;

  // Generate 28 days of meals
  const meals: MealDay[] = [];
  for (let day = 0; day < 28; day++) {
    meals.push({
      breakfast: mealPool.breakfast[day % mealPool.breakfast.length],
      lunch: mealPool.lunch[day % mealPool.lunch.length],
      dinner: mealPool.dinner[day % mealPool.dinner.length],
      snack: mealPool.snack[day % mealPool.snack.length],
    });
  }

  return {
    workouts,
    meals,
    isGentle,
    doctorReminder,
    motivationalMessages: MOTIVATIONAL_MESSAGES,
  };
}
