"use client";
// =============================================================
// ONBOARDING QUIZ — one question per screen
// =============================================================
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

// The quiz steps
const STEPS = [
  "age",
  "weight",
  "baby",
  "minutes",
  "location",
  "health",
  "food",
] as const;

type StepName = (typeof STEPS)[number];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, userData, loading, updateUserDocument } = useAuth();

  // Quiz answers
  const [age, setAge] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [hasBabyUnder1, setHasBabyUnder1] = useState<boolean | null>(null);
  const [exerciseMinutes, setExerciseMinutes] = useState<number | null>(null);
  const [exerciseLocation, setExerciseLocation] = useState("");
  const [healthIssues, setHealthIssues] = useState<string[]>([]);
  const [foodPreference, setFoodPreference] = useState("");

  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Redirect if not logged in or already completed quiz
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (userData?.quizCompleted) {
        if (userData.isPaid) {
          router.push("/dashboard");
        } else {
          router.push("/checkout");
        }
      }
    }
  }, [user, userData, loading, router]);

  const step: StepName = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const canGoNext = (): boolean => {
    switch (step) {
      case "age":        return age.trim() !== "";
      case "weight":     return true; // optional
      case "baby":       return hasBabyUnder1 !== null;
      case "minutes":    return exerciseMinutes !== null;
      case "location":   return exerciseLocation !== "";
      case "health":     return healthIssues.length > 0;
      case "food":       return foodPreference !== "";
      default:           return false;
    }
  };

  const goNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const toggleHealthIssue = (issue: string) => {
    if (issue === "none") {
      setHealthIssues(["none"]);
    } else {
      const without = healthIssues.filter((i) => i !== "none");
      if (without.includes(issue)) {
        setHealthIssues(without.filter((i) => i !== issue));
      } else {
        setHealthIssues([...without, issue]);
      }
    }
  };

  // Save all answers to Firestore
  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);

    const quizAnswers = {
      age,
      currentWeight,
      goalWeight,
      hasBabyUnder1: hasBabyUnder1 || false,
      exerciseMinutes: exerciseMinutes || 20,
      exerciseLocation,
      healthIssues,
      foodPreference,
    };

    try {
      await updateUserDocument({
        quizAnswers,
        quizCompleted: true,
      });
      router.push("/checkout");
    } catch (err) {
      console.error("Error saving quiz:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <p className="text-warm-400 animate-pulse text-lg">Loading...</p>
      </div>
    );
  }

  // ─── Render each question ───
  const renderStep = () => {
    switch (step) {
      case "age":
        return (
          <QuizScreen
            emoji="🎂"
            title="How old are you?"
            subtitle="This helps us pick the right intensity."
          >
            <input
              type="number"
              min="16"
              max="65"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full border-2 border-warm-100 rounded-xl px-4 py-4 text-center text-2xl font-bold focus:border-sage-300 focus:outline-none"
              placeholder="e.g. 30"
            />
          </QuizScreen>
        );

      case "weight":
        return (
          <QuizScreen
            emoji="⚖️"
            title="Current weight & goal"
            subtitle="This is completely optional — skip if you prefer."
          >
            <div className="space-y-4">
              <div>
                <label className="text-warm-500 text-sm font-semibold">Current weight (kg)</label>
                <input
                  type="number"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  className="w-full border-2 border-warm-100 rounded-xl px-4 py-3 text-center text-xl focus:border-sage-300 focus:outline-none"
                  placeholder="e.g. 65"
                />
              </div>
              <div>
                <label className="text-warm-500 text-sm font-semibold">Goal weight (kg)</label>
                <input
                  type="number"
                  value={goalWeight}
                  onChange={(e) => setGoalWeight(e.target.value)}
                  className="w-full border-2 border-warm-100 rounded-xl px-4 py-3 text-center text-xl focus:border-sage-300 focus:outline-none"
                  placeholder="e.g. 58"
                />
              </div>
            </div>
          </QuizScreen>
        );

      case "baby":
        return (
          <QuizScreen
            emoji="👶"
            title="Do you have a baby under 1 year old?"
            subtitle="We'll create a gentle, postpartum-safe plan for you."
          >
            <div className="grid grid-cols-2 gap-4">
              <OptionButton
                selected={hasBabyUnder1 === true}
                onClick={() => setHasBabyUnder1(true)}
              >
                Yes
              </OptionButton>
              <OptionButton
                selected={hasBabyUnder1 === false}
                onClick={() => setHasBabyUnder1(false)}
              >
                No
              </OptionButton>
            </div>
          </QuizScreen>
        );

      case "minutes":
        return (
          <QuizScreen
            emoji="⏱️"
            title="How many minutes can you exercise daily?"
            subtitle="Pick what feels realistic — you can always change later."
          >
            <div className="grid grid-cols-3 gap-4">
              {[10, 20, 30].map((min) => (
                <OptionButton
                  key={min}
                  selected={exerciseMinutes === min}
                  onClick={() => setExerciseMinutes(min)}
                >
                  {min} min
                </OptionButton>
              ))}
            </div>
          </QuizScreen>
        );

      case "location":
        return (
          <QuizScreen
            emoji="🏠"
            title="Where will you exercise?"
            subtitle="Both options work great!"
          >
            <div className="space-y-4">
              <OptionButton
                selected={exerciseLocation === "home_no_equipment"}
                onClick={() => setExerciseLocation("home_no_equipment")}
                wide
              >
                🏠 Home, with no equipment
              </OptionButton>
              <OptionButton
                selected={exerciseLocation === "home_light_equipment"}
                onClick={() => setExerciseLocation("home_light_equipment")}
                wide
              >
                🏋️ Home, with light equipment
              </OptionButton>
            </div>
          </QuizScreen>
        );

      case "health":
        return (
          <QuizScreen
            emoji="🩺"
            title="Any pain or health issues?"
            subtitle="Select all that apply. We'll adjust your plan."
          >
            <div className="space-y-3">
              {[
                { value: "back_pain", label: "🔙 Back pain" },
                { value: "knee_pain", label: "🦵 Knee pain" },
                { value: "none", label: "✅ None" },
                { value: "other", label: "📝 Other" },
              ].map((option) => (
                <OptionButton
                  key={option.value}
                  selected={healthIssues.includes(option.value)}
                  onClick={() => toggleHealthIssue(option.value)}
                  wide
                >
                  {option.label}
                </OptionButton>
              ))}
            </div>
          </QuizScreen>
        );

      case "food":
        return (
          <QuizScreen
            emoji="🥗"
            title="What's your food preference?"
            subtitle="We'll suggest meal ideas that match your diet."
          >
            <div className="space-y-3">
              {[
                { value: "vegetarian", label: "🥬 Vegetarian" },
                { value: "non_vegetarian", label: "🍗 Non-vegetarian" },
                { value: "eggs_only", label: "🥚 Eggs only (ovo-vegetarian)" },
              ].map((option) => (
                <OptionButton
                  key={option.value}
                  selected={foodPreference === option.value}
                  onClick={() => setFoodPreference(option.value)}
                  wide
                >
                  {option.label}
                </OptionButton>
              ))}
            </div>
          </QuizScreen>
        );
    }
  };

  return (
    <main className="min-h-screen bg-cream-50 flex flex-col">
      {/* Progress bar */}
      <div className="w-full bg-peach-100 h-2">
        <div
          className="bg-sage-400 h-2 rounded-r-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step indicator */}
      <div className="text-center pt-6 pb-2">
        <span className="text-warm-400 text-sm font-semibold">
          Step {currentStep + 1} of {STEPS.length}
        </span>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-md">{renderStep()}</div>
      </div>

      {/* Navigation buttons */}
      <div className="px-6 pb-8 max-w-md mx-auto w-full flex gap-3">
        {currentStep > 0 && (
          <button
            onClick={goBack}
            className="flex-1 border-2 border-warm-200 text-warm-600 font-bold py-3 rounded-xl hover:bg-warm-50 transition-colors"
          >
            ← Back
          </button>
        )}

        {currentStep < STEPS.length - 1 ? (
          <button
            onClick={goNext}
            disabled={!canGoNext()}
            className="flex-1 bg-sage-400 hover:bg-sage-500 text-white font-bold py-3 rounded-xl shadow transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleFinish}
            disabled={!canGoNext() || saving}
            className="flex-1 bg-sage-400 hover:bg-sage-500 text-white font-bold py-3 rounded-xl shadow transition-all disabled:opacity-40"
          >
            {saving ? "Saving..." : "Finish & Continue →"}
          </button>
        )}
      </div>
    </main>
  );
}

// ─── Reusable components ─────────────────────────────────────

function QuizScreen({
  emoji,
  title,
  subtitle,
  children,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="text-center">
      <div className="text-5xl mb-4">{emoji}</div>
      <h2 className="text-xl md:text-2xl font-bold text-warm-800 mb-2">{title}</h2>
      <p className="text-warm-500 mb-8">{subtitle}</p>
      {children}
    </div>
  );
}

function OptionButton({
  selected,
  onClick,
  children,
  wide = false,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`${
        wide ? "w-full" : ""
      } border-2 rounded-xl px-6 py-4 font-semibold text-lg transition-all ${
        selected
          ? "border-sage-400 bg-sage-50 text-sage-600"
          : "border-warm-100 text-warm-600 hover:border-warm-200"
      }`}
    >
      {children}
    </button>
  );
}
