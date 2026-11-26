"use client";
// =============================================================
// ONBOARDING QUIZ — Friendly 7-step personalized quiz
// =============================================================
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FOOD_REGIONS, type FoodRegion } from "@/lib/foodRegions";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Baby,
  Clock,
  Home,
  Dumbbell,
  AlertCircle,
  Salad,
  Egg,
  Beef,
  Activity,
  Calendar,
  Sparkles,
} from "lucide-react";

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

  // Quiz state
  const [age, setAge] = useState("30");
  const [currentWeight, setCurrentWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [hasBabyUnder1, setHasBabyUnder1] = useState<boolean | null>(null);
  const [deliveryType, setDeliveryType] = useState<"vaginal" | "c_section" | "not_applicable">("not_applicable");
  const [isBreastfeeding, setIsBreastfeeding] = useState<boolean>(false);
  const [exerciseMinutes, setExerciseMinutes] = useState<number | null>(20);
  const [exerciseLocation, setExerciseLocation] = useState("home_no_equipment");
  const [healthIssues, setHealthIssues] = useState<string[]>(["none"]);
  const [foodPreference, setFoodPreference] = useState("vegetarian");
  const [foodRegion, setFoodRegion] = useState<FoodRegion>("indian_balanced");

  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Prepopulate if user already had answers (e.g. from Settings or return)
  useEffect(() => {
    if (userData?.quizAnswers) {
      const q = userData.quizAnswers as any;
      if (q.age) setAge(String(q.age));
      if (q.currentWeight) setCurrentWeight(String(q.currentWeight));
      if (q.goalWeight) setGoalWeight(String(q.goalWeight));
      if (typeof q.hasBabyUnder1 === "boolean") setHasBabyUnder1(q.hasBabyUnder1);
      if (q.deliveryType) setDeliveryType(q.deliveryType);
      if (typeof q.isBreastfeeding === "boolean") setIsBreastfeeding(q.isBreastfeeding);
      if (q.exerciseMinutes) setExerciseMinutes(Number(q.exerciseMinutes));
      if (q.exerciseLocation) setExerciseLocation(q.exerciseLocation);
      if (Array.isArray(q.healthIssues)) setHealthIssues(q.healthIssues);
      if (q.foodPreference) setFoodPreference(q.foodPreference);
      if (q.foodRegion) setFoodRegion(q.foodRegion);
    }
  }, [userData]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const step: StepName = STEPS[currentStep];
  const progressPercent = ((currentStep + 1) / STEPS.length) * 100;

  const canGoNext = (): boolean => {
    switch (step) {
      case "age":
        return age.trim() !== "" && Number(age) >= 16;
      case "weight":
        return true; // Optional
      case "baby":
        return hasBabyUnder1 !== null;
      case "minutes":
        return exerciseMinutes !== null;
      case "location":
        return exerciseLocation !== "";
      case "health":
        return healthIssues.length > 0;
      case "food":
        return foodPreference !== "";
      default:
        return false;
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
    } else {
      router.push("/");
    }
  };

  const toggleHealthIssue = (issue: string) => {
    if (issue === "none") {
      setHealthIssues(["none"]);
    } else {
      const withoutNone = healthIssues.filter((i) => i !== "none");
      if (withoutNone.includes(issue)) {
        const next = withoutNone.filter((i) => i !== issue);
        setHealthIssues(next.length > 0 ? next : ["none"]);
      } else {
        setHealthIssues([...withoutNone, issue]);
      }
    }
  };

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);

    const quizAnswers = {
      age,
      currentWeight,
      goalWeight,
      hasBabyUnder1: hasBabyUnder1 || false,
      deliveryType: hasBabyUnder1 ? deliveryType : "not_applicable",
      isBreastfeeding,
      restDay: "Sunday",
      exerciseMinutes: exerciseMinutes || 20,
      exerciseLocation,
      healthIssues,
      foodPreference,
      foodRegion,
    };

    try {
      await updateUserDocument({
        quizAnswers,
        quizCompleted: true,
      });

      if (userData?.isPaid) {
        // Regenerate plan if coming from settings
        await fetch("/api/generate-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quizAnswers }),
        })
          .then((r) => r.json())
          .then((d) => {
            if (d.plan) {
              updateUserDocument({ plan: d.plan });
            }
          });
        router.push("/dashboard");
      } else {
        router.push("/checkout");
      }
    } catch (err) {
      console.error("Error saving quiz:", err);
      alert("Could not save answers. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-peach-200 border-t-plum rounded-full animate-spin" />
          <p className="text-plum/70 font-medium text-sm">Preparing your quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-cream text-plum flex flex-col justify-between py-6 px-4 sm:px-6">
      {/* ─── Top Bar: Friendly reassurance & progress ─── */}
      <div className="max-w-xl mx-auto w-full space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-plum/70 hover:text-plum py-1.5 px-3 rounded-xl hover:bg-peach-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-xs font-semibold uppercase tracking-wider text-plum/60 bg-peach-100 px-3 py-1 rounded-full border border-peach-200">
            Step {currentStep + 1} of {STEPS.length}
          </span>
        </div>

        {/* Progress Line */}
        <div className="w-full bg-peach-200/70 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-plum h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Friendly Top line requirement */}
        <p className="text-center text-xs sm:text-sm font-medium text-plum/70 flex items-center justify-center gap-1.5 pt-1">
          <Sparkles className="w-4 h-4 text-plum/60" /> Let&apos;s build a plan that fits your life.
        </p>
      </div>

      {/* ─── Question Body ─── */}
      <div className="max-w-xl mx-auto w-full my-auto py-8">
        <div className="card-soft shadow-soft-md animate-fade-in">
          {/* STEP 1: AGE */}
          {step === "age" && (
            <div className="space-y-6 text-center">
              <div>
                <span className="w-12 h-12 rounded-2xl bg-peach-100 text-plum flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6" />
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-plum">
                  How old are you?
                </h2>
                <p className="text-sm text-plum/70 mt-1">
                  We use this to set appropriate joint warmup and pace.
                </p>
              </div>

              <div className="max-w-xs mx-auto">
                <input
                  type="number"
                  min="16"
                  max="65"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full text-center text-4xl font-heading font-bold text-plum bg-cream-50 border-2 border-peach-200 rounded-2xl py-4 focus:border-plum focus:outline-none"
                  placeholder="30"
                />
                <span className="text-xs text-plum/50 block mt-2">years young</span>
              </div>
            </div>
          )}

          {/* STEP 2: WEIGHT (OPTIONAL) */}
          {step === "weight" && (
            <div className="space-y-6 text-center">
              <div>
                <span className="w-12 h-12 rounded-2xl bg-blush-100 text-plum flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-6 h-6" />
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-plum">
                  Current weight & goal
                </h2>
                <p className="text-sm text-plum/70 mt-1">
                  Totally optional. Feel free to skip and focus on how you feel.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-left">
                <div className="bg-cream-50 p-4 rounded-2xl border border-peach-200">
                  <label className="block text-xs font-semibold text-plum/70 mb-1.5 uppercase tracking-wider">
                    Current Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                    className="w-full text-lg font-bold text-plum bg-white border border-peach-200 rounded-xl p-3 focus:border-plum focus:outline-none"
                    placeholder="e.g. 64"
                  />
                </div>

                <div className="bg-cream-50 p-4 rounded-2xl border border-peach-200">
                  <label className="block text-xs font-semibold text-plum/70 mb-1.5 uppercase tracking-wider">
                    Goal Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={goalWeight}
                    onChange={(e) => setGoalWeight(e.target.value)}
                    className="w-full text-lg font-bold text-plum bg-white border border-peach-200 rounded-xl p-3 focus:border-plum focus:outline-none"
                    placeholder="e.g. 58"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: BABY UNDER 1 YEAR */}
          {step === "baby" && (
            <div className="space-y-6 text-center">
              <div>
                <span className="w-12 h-12 rounded-2xl bg-peach-100 text-plum flex items-center justify-center mx-auto mb-3">
                  <Baby className="w-6 h-6" />
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-plum">
                  Do you have a baby under 1 year old?
                </h2>
                <p className="text-sm text-plum/70 mt-1">
                  We automatically adjust for pelvic floor care and postpartum recovery.
                </p>
              </div>

              {/* Big Tappable Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setHasBabyUnder1(true)}
                  className={`p-6 rounded-2xl border-2 text-center transition-all ${
                    hasBabyUnder1 === true
                      ? "border-plum bg-peach-100/70 shadow-sm"
                      : "border-peach-200 bg-cream-50 hover:border-peach-300"
                  }`}
                >
                  <span className="block text-2xl font-heading font-bold text-plum mb-1">
                    Yes, I do
                  </span>
                  <span className="text-xs text-plum/70">
                    Enable Gentle Postpartum mode
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHasBabyUnder1(false);
                    setDeliveryType("not_applicable");
                  }}
                  className={`p-6 rounded-2xl border-2 text-center transition-all ${
                    hasBabyUnder1 === false
                      ? "border-plum bg-peach-100/70 shadow-sm"
                      : "border-peach-200 bg-cream-50 hover:border-peach-300"
                  }`}
                >
                  <span className="block text-2xl font-heading font-bold text-plum mb-1">
                    No
                  </span>
                  <span className="text-xs text-plum/70">
                    Older kids or general wellness
                  </span>
                </button>
              </div>

              {hasBabyUnder1 === true && (
                <div className="bg-cream-50 border border-peach-200 rounded-2xl p-4 text-left space-y-2.5 animate-fade-in">
                  <span className="block text-xs font-bold text-plum">
                    Delivery type (helps us protect your core &amp; scar cleanly):
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                    {[
                      { id: "vaginal", label: "Vaginal Birth" },
                      { id: "c_section", label: "C-Section Scar" },
                      { id: "not_applicable", label: "Skip" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          setDeliveryType(opt.id as "vaginal" | "c_section" | "not_applicable")
                        }
                        className={`py-2 px-2 rounded-xl border transition-all ${
                          deliveryType === opt.id
                            ? "bg-plum text-white border-plum"
                            : "bg-white text-plum/75 border-peach-200 hover:border-peach-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Breastfeeding / Nursing hydration support */}
              <label className="flex items-start gap-3 p-4 rounded-2xl border border-sage-200 bg-sage-50/70 text-left cursor-pointer hover:bg-sage-50 transition-colors">
                <input
                  type="checkbox"
                  checked={isBreastfeeding}
                  onChange={(e) => setIsBreastfeeding(e.target.checked)}
                  className="mt-0.5 accent-plum w-4 h-4 rounded shrink-0"
                />
                <span className="text-xs text-plum/85 leading-relaxed">
                  <strong className="block text-plum">I am currently breastfeeding / nursing (optional)</strong>
                  Adjusts your daily hydration goal to 11 glasses and prioritizes steady-energy nursing nutrition reminders.
                </span>
              </label>

              {/* Doctor Reminder Requirement on Baby Question */}
              <div className="bg-peach-50 border border-peach-200 rounded-xl p-3.5 text-xs text-plum/80 text-left flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-plum shrink-0 mt-0.5" />
                <span>
                  <strong>Doctor Reminder:</strong> If you are postpartum, please confirm with your obstetrician or doctor that you are cleared for physical exercise before starting.
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: MINUTES */}
          {step === "minutes" && (
            <div className="space-y-6 text-center">
              <div>
                <span className="w-12 h-12 rounded-2xl bg-sage-100 text-sage-600 flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6" />
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-plum">
                  How many minutes can you exercise daily?
                </h2>
                <p className="text-sm text-plum/70 mt-1">
                  Choose what feels realistic. You can change this anytime.
                </p>
              </div>

              {/* Big Tappable Cards */}
              <div className="grid gap-3">
                {[
                  {
                    mins: 10,
                    label: "10 Minutes",
                    desc: "Quick restorative movement on high-demand days",
                  },
                  {
                    mins: 20,
                    label: "20 Minutes (Recommended)",
                    desc: "The sweet spot: full warmup, 3 exercises, and cooldown",
                  },
                  {
                    mins: 30,
                    label: "30 Minutes",
                    desc: "Extended sets and deeper mobility",
                  },
                ].map((opt) => (
                  <button
                    key={opt.mins}
                    type="button"
                    onClick={() => setExerciseMinutes(opt.mins)}
                    className={`p-4 sm:p-5 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                      exerciseMinutes === opt.mins
                        ? "border-plum bg-peach-100/70 shadow-sm"
                        : "border-peach-200 bg-cream-50 hover:border-peach-300"
                    }`}
                  >
                    <div>
                      <span className="block font-heading font-bold text-lg text-plum">
                        {opt.label}
                      </span>
                      <span className="text-xs text-plum/70">{opt.desc}</span>
                    </div>
                    <span
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        exerciseMinutes === opt.mins
                          ? "border-plum bg-plum text-white"
                          : "border-peach-300"
                      }`}
                    >
                      {exerciseMinutes === opt.mins && <span className="w-2 h-2 rounded-full bg-white" />}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: LOCATION */}
          {step === "location" && (
            <div className="space-y-6 text-center">
              <div>
                <span className="w-12 h-12 rounded-2xl bg-peach-100 text-plum flex items-center justify-center mx-auto mb-3">
                  <Home className="w-6 h-6" />
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-plum">
                  Where will you exercise?
                </h2>
                <p className="text-sm text-plum/70 mt-1">
                  Both options are completely customized for living rooms.
                </p>
              </div>

              <div className="grid gap-4">
                <button
                  type="button"
                  onClick={() => setExerciseLocation("home_no_equipment")}
                  className={`p-5 rounded-2xl border-2 text-left flex items-start gap-4 transition-all ${
                    exerciseLocation === "home_no_equipment"
                      ? "border-plum bg-peach-100/70 shadow-sm"
                      : "border-peach-200 bg-cream-50 hover:border-peach-300"
                  }`}
                >
                  <Home className="w-6 h-6 text-plum shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-heading font-bold text-lg text-plum">
                      Home, with no equipment
                    </span>
                    <span className="text-xs text-plum/70">
                      100% bodyweight movements. Zero gear required.
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setExerciseLocation("home_light_equipment")}
                  className={`p-5 rounded-2xl border-2 text-left flex items-start gap-4 transition-all ${
                    exerciseLocation === "home_light_equipment"
                      ? "border-plum bg-peach-100/70 shadow-sm"
                      : "border-peach-200 bg-cream-50 hover:border-peach-300"
                  }`}
                >
                  <Dumbbell className="w-6 h-6 text-plum shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-heading font-bold text-lg text-plum">
                      Home, with light equipment
                    </span>
                    <span className="text-xs text-plum/70">
                      I have light dumbbells or a resistance band available.
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: PAIN / HEALTH ISSUES */}
          {step === "health" && (
            <div className="space-y-6 text-center">
              <div>
                <span className="w-12 h-12 rounded-2xl bg-blush-100 text-plum flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-6 h-6" />
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-plum">
                  Any pain or health considerations?
                </h2>
                <p className="text-sm text-plum/70 mt-1">
                  Select all that apply. We filter out aggravating movements.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-left">
                {[
                  { id: "back_pain", label: "Lower Back Pain", desc: "Filters out crunches & heavy spinal loads" },
                  { id: "knee_pain", label: "Knee Discomfort", desc: "Filters out deep lunges & jumping" },
                  { id: "diastasis_recti", label: "Diastasis Recti / Belly Gap", desc: "Replaces planks & crunches with deep-core heals" },
                  { id: "pelvic_heaviness", label: "Pelvic Floor Heaviness", desc: "Low-impact breath & pelvic support only" },
                  { id: "other", label: "Other Sensitivity", desc: "Prioritizes gentle floor routines" },
                  { id: "none", label: "None / Feeling Good", desc: "Standard balanced movements" },
                ].map((item) => {
                  const isSelected = healthIssues.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleHealthIssue(item.id)}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? "border-plum bg-peach-100/70 shadow-sm"
                          : "border-peach-200 bg-cream-50 hover:border-peach-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-heading font-bold text-base text-plum">
                          {item.label}
                        </span>
                        <span
                          className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs font-bold ${
                            isSelected
                              ? "border-plum bg-plum text-white"
                              : "border-peach-300"
                          }`}
                        >
                          {isSelected && "✓"}
                        </span>
                      </div>
                      <span className="text-[11px] text-plum/70 block">
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Doctor Reminder Requirement on Pain Question */}
              <div className="bg-peach-50 border border-peach-200 rounded-xl p-3.5 text-xs text-plum/80 text-left flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-plum shrink-0 mt-0.5" />
                <span>
                  <strong>Doctor Reminder:</strong> If you experience chronic or sharp back or knee pain, please consult a physiotherapist or doctor to ensure physical exercise is safe for you.
                </span>
              </div>
            </div>
          )}

          {/* STEP 7: FOOD PREFERENCE */}
          {step === "food" && (
            <div className="space-y-6 text-center">
              <div>
                <span className="w-12 h-12 rounded-2xl bg-sage-100 text-sage-600 flex items-center justify-center mx-auto mb-3">
                  <Salad className="w-6 h-6" />
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-plum">
                  What is your dietary preference?
                </h2>
                <p className="text-sm text-plum/70 mt-1">
                  We suggest simple, wholesome weekly meal ideas that match.
                </p>
              </div>

              <div className="grid gap-3">
                {[
                  {
                    id: "vegetarian",
                    label: "Vegetarian",
                    desc: "Dal, khichdi, paneer, sprouts, seasonal sabzis, oats",
                    icon: Salad,
                  },
                  {
                    id: "non_vegetarian",
                    label: "Non-Vegetarian",
                    desc: "Lean chicken, fish, eggs, nourishing soups, and veggies",
                    icon: Beef,
                  },
                  {
                    id: "eggs_only",
                    label: "Eggs Only (Ovo-Vegetarian)",
                    desc: "Wholesome egg bhurji, omelettes, lentils, and fresh produce",
                    icon: Egg,
                  },
                ].map((diet) => {
                  const Icon = diet.icon;
                  const isSelected = foodPreference === diet.id;
                  return (
                    <button
                      key={diet.id}
                      type="button"
                      onClick={() => setFoodPreference(diet.id)}
                      className={`p-4 sm:p-5 rounded-2xl border-2 text-left flex items-center gap-4 transition-all ${
                        isSelected
                          ? "border-plum bg-peach-100/70 shadow-sm"
                          : "border-peach-200 bg-cream-50 hover:border-peach-300"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-white border border-peach-200 flex items-center justify-center text-plum shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <span className="block font-heading font-bold text-base text-plum">
                          {diet.label}
                        </span>
                        <span className="text-xs text-plum/70">{diet.desc}</span>
                      </div>
                      <span
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "border-plum bg-plum text-white"
                            : "border-peach-300"
                        }`}
                      >
                        {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Regional Cuisine Style */}
              <div className="pt-2 text-left space-y-2.5">
                <span className="block text-xs font-bold uppercase tracking-wider text-plum/70">
                  Kitchen &amp; Regional Style
                </span>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {FOOD_REGIONS.map((reg) => {
                    const selected = foodRegion === reg.id;
                    return (
                      <button
                        key={reg.id}
                        type="button"
                        onClick={() => setFoodRegion(reg.id)}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                          selected
                            ? "border-plum bg-peach-100/70 shadow-xs"
                            : "border-peach-200 bg-cream-50 hover:border-peach-300"
                        }`}
                      >
                        <span className="block font-heading font-bold text-sm text-plum">
                          {reg.label}
                        </span>
                        <span className="block text-[11px] text-plum/70 mt-0.5 leading-snug">
                          {reg.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Bottom Actions ─── */}
      <div className="max-w-xl mx-auto w-full pt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={goBack}
          className="btn-secondary flex-1"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>

        {currentStep < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={!canGoNext()}
            className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next Step <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            disabled={!canGoNext() || saving}
            className="btn-primary flex-1 disabled:opacity-40"
          >
            {saving ? "Personalizing Your 4-Week Plan..." : "Build My Custom Blueprint →"}
          </button>
        )}
      </div>

      {currentStep === STEPS.length - 1 && (
        <p className="max-w-xl mx-auto w-full text-center text-[11px] text-plum/65 pt-2">
          Next: review your custom 4-week plan summary &amp; unlock full access (protected by our 7-day money-back guarantee).
        </p>
      )}
    </main>
  );
}
