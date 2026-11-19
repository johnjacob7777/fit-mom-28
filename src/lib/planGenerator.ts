// ---------------------------------------------------------
// Plan Generator — creates a personalized 4-week fitness
// and meal plan based on quiz answers.
//
// This uses smart templates. You can later swap this out
// for an AI API (like Gemini) for even more personalization.
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
  duration: string;           // e.g. "12 reps" or "30 seconds"
}

export interface WorkoutDay {
  day: number;                // 1–28
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

export interface Plan {
  workouts: WorkoutDay[];
  meals: MealDay[];
  isGentle: boolean;
  doctorReminder: boolean;
  motivationalMessages: string[];
}

// =========================================================
// Exercise pools
// =========================================================
const WARMUPS: Exercise[] = [
  { name: "March in place", duration: "1 minute" },
  { name: "Arm circles (forward & back)", duration: "30 seconds each" },
  { name: "Gentle side bends", duration: "30 seconds each side" },
  { name: "Shoulder rolls", duration: "30 seconds" },
  { name: "Hip circles", duration: "30 seconds each direction" },
  { name: "Walking high knees (slow)", duration: "1 minute" },
];

const COOLDOWNS: Exercise[] = [
  { name: "Deep breathing (inhale 4s, exhale 6s)", duration: "1 minute" },
  { name: "Standing quad stretch", duration: "30 seconds each leg" },
  { name: "Forward fold (touch your toes gently)", duration: "30 seconds" },
  { name: "Child's pose", duration: "30 seconds" },
  { name: "Cat-cow stretch", duration: "1 minute" },
  { name: "Neck rolls", duration: "30 seconds each side" },
];

// Regular bodyweight exercises
const REGULAR_BODYWEIGHT: Exercise[] = [
  { name: "Bodyweight squats", duration: "12 reps" },
  { name: "Push-ups (on knees if needed)", duration: "10 reps" },
  { name: "Glute bridges", duration: "12 reps" },
  { name: "Reverse lunges", duration: "10 each leg" },
  { name: "Plank hold", duration: "20 seconds" },
  { name: "Jumping jacks (low impact: step-out jacks)", duration: "30 seconds" },
  { name: "Tricep dips (using a chair)", duration: "10 reps" },
  { name: "Side-lying leg lifts", duration: "12 each side" },
  { name: "Wall sit", duration: "20 seconds" },
  { name: "Superman hold", duration: "15 seconds" },
  { name: "Bicycle crunches", duration: "12 each side" },
  { name: "Donkey kicks", duration: "12 each side" },
  { name: "Fire hydrants", duration: "12 each side" },
  { name: "Standing calf raises", duration: "15 reps" },
  { name: "Mountain climbers (slow)", duration: "20 seconds" },
  { name: "Dead bugs", duration: "10 each side" },
  { name: "Inchworms", duration: "6 reps" },
  { name: "Side plank (each side)", duration: "15 seconds each" },
  { name: "Sumo squats", duration: "12 reps" },
  { name: "Bird dogs", duration: "10 each side" },
];

// Extra exercises when user has light equipment
const EQUIPMENT_EXERCISES: Exercise[] = [
  { name: "Dumbbell bicep curls", duration: "10 reps" },
  { name: "Dumbbell shoulder press", duration: "10 reps" },
  { name: "Resistance band rows", duration: "12 reps" },
  { name: "Dumbbell goblet squats", duration: "10 reps" },
  { name: "Resistance band lateral walk", duration: "10 steps each way" },
  { name: "Dumbbell deadlifts (light weight)", duration: "10 reps" },
  { name: "Resistance band pull-aparts", duration: "12 reps" },
  { name: "Dumbbell lunges", duration: "8 each leg" },
];

// Gentle exercises (postpartum-safe or for pain)
const GENTLE_EXERCISES: Exercise[] = [
  { name: "Wall push-ups", duration: "10 reps" },
  { name: "Seated leg extensions", duration: "10 each leg" },
  { name: "Pelvic floor squeeze (Kegels)", duration: "10 reps, hold 5s each" },
  { name: "Gentle glute bridges", duration: "10 reps" },
  { name: "Standing side leg lifts (hold wall)", duration: "10 each" },
  { name: "Seated arm raises", duration: "10 reps" },
  { name: "Heel slides (lying down)", duration: "10 each leg" },
  { name: "Marching in place (slow)", duration: "1 minute" },
  { name: "Gentle bird dogs (from all fours)", duration: "8 each side" },
  { name: "Supported squats (hold chair)", duration: "10 reps" },
  { name: "Ankle circles", duration: "10 each direction" },
  { name: "Standing hip circles", duration: "10 each direction" },
  { name: "Gentle cat-cow (all fours)", duration: "10 reps" },
  { name: "Seated torso twist", duration: "8 each side" },
];

// Exercises to AVOID with specific pain
const KNEE_AVOID = ["Reverse lunges", "Jumping jacks", "Mountain climbers", "Sumo squats", "Dumbbell lunges"];
const BACK_AVOID = ["Superman hold", "Bicycle crunches", "Mountain climbers", "Dumbbell deadlifts"];

// =========================================================
// Meal pools
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

// =========================================================
// Motivational messages (one per day for 28 days)
// =========================================================
const MOTIVATIONAL_MESSAGES = [
  "You showed up today — that's already a win! 💪",
  "Every minute you move is a gift to yourself. Keep going! 🌟",
  "You're stronger than you think, mama! 💖",
  "Small steps every day lead to big changes. You've got this!",
  "Taking care of yourself IS taking care of your family. 🌸",
  "Progress, not perfection. You're doing amazing!",
  "Your body carried life — it can do anything! 🤱",
  "20 minutes is all it takes. You are worth those 20 minutes!",
  "Consistency beats intensity. You're building a habit! 🔥",
  "You're not starting over — you're starting from experience. 💫",
  "Be proud of yourself today. You chose YOU!",
  "One workout closer to feeling like yourself again. 🌈",
  "Rest days are part of the plan. No guilt allowed! 😌",
  "Your kids are watching you choose health — what a role model! 🌻",
  "Energy begets energy. After this workout, you'll feel amazing!",
  "Two weeks in! You're building something beautiful. 🎉",
  "Listen to your body — it knows what it needs. 🧘‍♀️",
  "Strength isn't just physical — look at all you manage every day!",
  "You deserve to feel good in your body. Keep showing up! 💛",
  "Halfway there! Look how far you've come already! 🏆",
  "You are proof that busy and fit can coexist. 🙌",
  "Some days are hard. Showing up on hard days matters most.",
  "Your future self is thanking you right now. 🕊️",
  "Three weeks done! This is becoming YOUR lifestyle! 🌺",
  "Celebrate every small victory — they add up fast! 🥳",
  "You are not just a mom — you are a strong, fit mom! 💪",
  "Almost there! One more week to finish your first plan! 🎯",
  "28 days! You did it! Time to start your next chapter! 🏅",
];

// =========================================================
// Helper functions
// =========================================================
function pickRandom<T>(arr: T[], count: number, avoid: string[] = []): T[] {
  const filtered = arr.filter((item) => {
    if (typeof item === "object" && item !== null && "name" in item) {
      return !avoid.includes((item as { name: string }).name);
    }
    return true;
  });
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
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
  const isGentle = answers.hasBabyUnder1 || 
    answers.healthIssues.some(i => i !== "none");
  
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
  let exerciseCount = 3;    // default for 20 min
  if (answers.exerciseMinutes === 10) exerciseCount = 2;
  if (answers.exerciseMinutes === 30) exerciseCount = 4;

  // Generate 28 days of workouts
  const workouts: WorkoutDay[] = [];
  for (let day = 1; day <= 28; day++) {
    const dayOfWeek = getDayOfWeek(day);
    const isRestDay = dayOfWeek === "Sunday"; // Sunday is rest day

    if (isRestDay) {
      workouts.push({
        day,
        dayOfWeek,
        warmup: [],
        exercises: [],
        cooldown: [],
        isRestDay: true,
      });
    } else {
      workouts.push({
        day,
        dayOfWeek,
        warmup: pickRandom(WARMUPS, 2),
        exercises: pickRandom(exercisePool, exerciseCount, avoidExercises),
        cooldown: pickRandom(COOLDOWNS, 2),
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
