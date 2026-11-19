// =============================================================
// API: Generate Plan — creates a 4-week personalized plan
// =============================================================
import { NextRequest, NextResponse } from "next/server";
import { generatePlan, QuizAnswers } from "@/lib/planGenerator";

export async function POST(request: NextRequest) {
  try {
    const { quizAnswers } = await request.json();

    if (!quizAnswers) {
      return NextResponse.json(
        { error: "Missing quiz answers" },
        { status: 400 }
      );
    }

    // Cast the answers and generate the plan
    const answers: QuizAnswers = {
      age: quizAnswers.age || "30",
      currentWeight: quizAnswers.currentWeight || "",
      goalWeight: quizAnswers.goalWeight || "",
      hasBabyUnder1: quizAnswers.hasBabyUnder1 || false,
      exerciseMinutes: quizAnswers.exerciseMinutes || 20,
      exerciseLocation: quizAnswers.exerciseLocation || "home_no_equipment",
      healthIssues: quizAnswers.healthIssues || ["none"],
      foodPreference: quizAnswers.foodPreference || "vegetarian",
    };

    const plan = generatePlan(answers);

    return NextResponse.json({ plan });
  } catch (error: unknown) {
    console.error("Plan generation error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
