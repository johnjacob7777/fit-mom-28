import type { Metadata } from "next";
import Link from "next/link";
import HandbookActions, { HandbookCoverActions } from "@/components/HandbookActions";
import HandbookGate from "@/components/HandbookGate";
import {
  BookOpen,
  Heart,
  ShieldCheck,
  Clock,
  Baby,
  Moon,
  Utensils,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Droplets,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Free 36-Page eBook: The Exhausted Mom's 7-Day Comeback Handbook | Fit Mom 20",
  description:
    "Free 36-page printable & PDF companion workbook for busy moms: 3-speed broken-sleep workouts, 60s diastasis & C-section timeline, 2 AM wrist/neck diagrams, 4 regional 7-day menus + grocery lists, sleep reset, and fridge trackers.",
};

export default function HandbookPage() {
  const fridgeDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <main className="min-h-screen bg-cream text-plum pb-16 selection:bg-blush-200">
      <HandbookActions />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-10">
        {/* ═══════════════ COVER / INTRO ═══════════════ */}
        <section className="card-soft border-2 border-peach-200 bg-gradient-to-br from-white via-peach-50/50 to-blush-50/40 p-8 sm:p-12 text-center space-y-6 print-avoid-break">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-peach-100 border border-peach-200 text-xs font-bold uppercase tracking-wider text-plum">
            <BookOpen className="w-3.5 h-3.5" /> Free 36-Page Complete Edition • Fit Mom 20
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-plum leading-tight">
              The Exhausted Mom&apos;s 7-Day Comeback Handbook
            </h1>
            <p className="text-base sm:text-lg text-plum/80 leading-relaxed">
              Feel strong, supported, and less stiff in 20 calm minutes a day — without gym commutes, broken-streak guilt, or cooking separate &ldquo;diet&rdquo; meals. Now expanded into a complete <strong>36-page interactive manual &amp; printable workbook</strong>.
            </p>
          </div>

          <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden border border-peach-200 shadow-xs">
            <img
              src="/images/handbook/cover-hero.jpg"
              alt="Mother gently stretching her shoulders on a sunlit living-room rug"
              className="w-full h-56 sm:h-72 object-cover object-[center_22%]"
            />
          </div>

          <div className="max-w-2xl mx-auto bg-white/90 rounded-2xl border border-peach-200 p-5 text-left space-y-2.5 text-xs sm:text-sm">
            <p className="font-bold uppercase tracking-wider text-[11px] text-plum/60">
              Inside Your 36-Page Workbook &amp; PDF Edition (8 Complete Parts):
            </p>
            <div className="grid sm:grid-cols-2 gap-2 text-plum/85">
              <span>• Part 1 (pp. 3–7): 3-Speed Rule, 4-6 Breath &amp; 5-Min Rescue</span>
              <span>• Part 2 (pp. 8–12): 2-Finger Belly Photo Guide, C-Section Timeline &amp; Swaps</span>
              <span>• Part 3 (pp. 13–15): 2 AM Wrist Scoop, Feeding Neck &amp; Ergonomics</span>
              <span>• Part 4 (pp. 16–17): Full 7-Day Workouts &amp; Missed-Days Reboot</span>
              <span>• Part 5 (pp. 18–20): One-Stove Pot, Hydration &amp; 15-Min Prep</span>
              <span>• Part 6 (pp. 21–27): All 4 Regional 7-Day Menus &amp; Shopping Lists</span>
              <span>• Part 7 (pp. 28–29): 6-Min Sleep Downshift &amp; 3 PM Cravings Fix</span>
              <span>• Part 8 (pp. 30–36): Tear-Out Fridge Trackers, Journal &amp; Posters</span>
            </div>
          </div>

          <HandbookCoverActions />

          <p className="text-[11px] text-plum/60 max-w-lg mx-auto">
            ⚕️ Educational wellness guide only — not medical advice. Always confirm exercise clearance with your doctor or OB-GYN after childbirth or surgery.
          </p>
        </section>

        {/* ═══════════════ CHAPTER 1 (PUBLIC PREVIEW) ═══════════════ */}
        <section
          id="chapter-1"
          className="card-soft space-y-5 print-page-break print-avoid-break scroll-mt-20"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-plum/60">
            <Clock className="w-4 h-4 text-plum" /> Chapter 1 • Broken-Sleep Strategy (Free Preview)
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-plum">
            Why 20 Calm Minutes Beat 60-Minute Workouts (The 3-Speed Rule)
          </h2>
          <p className="text-sm text-plum/80 leading-relaxed">
            When you slept only four broken hours last night, forcing a sweaty high-intensity session drains stress hormones and leaves you cranky before noon. Habit research is clear: showing up for <strong>something tiny on hard days</strong> protects your momentum ten times better than aiming for perfection and quitting by Wednesday.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-cream-50 border border-peach-200 rounded-2xl p-4 space-y-2">
              <span className="inline-block text-[11px] font-bold bg-plum text-white px-2.5 py-0.5 rounded-full">
                Speed 1 • 20 Mins
              </span>
              <h3 className="font-heading font-bold text-lg text-plum">
                Slept Okay Today
              </h3>
              <p className="text-xs text-plum/75 leading-relaxed">
                3-min gentle warmup, 12-min controlled living-room strength (squats, bridges, wall push-ups), 5-min stretch &amp; slow breathing.
              </p>
            </div>

            <div className="bg-peach-50/80 border border-peach-200 rounded-2xl p-4 space-y-2">
              <span className="inline-block text-[11px] font-bold bg-peach-200 text-plum px-2.5 py-0.5 rounded-full">
                Speed 2 • 12–15 Mins
              </span>
              <h3 className="font-heading font-bold text-lg text-plum">
                Baby Is Awake
              </h3>
              <p className="text-xs text-plum/75 leading-relaxed">
                Switch to upright beside-baby moves: slow marches, chair squats, standing leg lifts holding the sofa, and wall push-ups while baby watches.
              </p>
            </div>

            <div className="bg-sage-50 border border-sage-200 rounded-2xl p-4 space-y-2">
              <span className="inline-block text-[11px] font-bold bg-sage-600 text-white px-2.5 py-0.5 rounded-full">
                Speed 3 • 5-Min Rescue
              </span>
              <h3 className="font-heading font-bold text-lg text-plum">
                Zero-Sleep Rescue
              </h3>
              <p className="text-xs text-plum/75 leading-relaxed">
                Shoulder rolls, 1 minute of slow marching, 10 chair squats, and five 4-6 calm breaths. Still marks your day complete with zero guilt!
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════ GATED CHAPTERS 2–5 & PDF DOWNLOAD ═══════════════ */}
        <HandbookGate>
          {/* CHAPTER 2 */}
          <section className="card-soft space-y-5 print-page-break print-avoid-break">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sage-700">
              <ShieldCheck className="w-4 h-4 text-sage-600" /> Chapter 2 • Core &amp; Postpartum Safety
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-plum">
              The 60-Second 2-Finger Belly Check &amp; Scar-Safe Rules
            </h2>
            <p className="text-sm text-plum/80 leading-relaxed">
              Before rushing into planks or crunches after pregnancy or C-section surgery, check how your deep midline connective tissue (linea alba) responds to gentle tension.
            </p>

            <div className="grid md:grid-cols-2 gap-4 items-center bg-sage-50 border border-sage-200 rounded-2xl p-5 text-xs sm:text-sm">
              <div className="space-y-2.5">
                <h3 className="font-heading font-bold text-lg text-plum">
                  How to Do the 2-Finger Check (1 Minute)
                </h3>
                <ol className="list-decimal pl-5 space-y-1.5 text-plum/85">
                  <li>Lie comfortably on your back with knees bent and feet flat on a mat.</li>
                  <li>Rest 2 fingers horizontally right above your belly button, pointing slightly downward.</li>
                  <li>Exhale softly, relax your belly, and lift only your head and shoulders 1 inch off the floor.</li>
                  <li>Feel whether your fingertips sink into a wide soft gap (2+ finger widths) or notice a peaked &ldquo;doming&rdquo; ridge down the center.</li>
                </ol>
              </div>
              <div className="rounded-xl overflow-hidden border border-sage-200 bg-white">
                <img
                  src="/images/handbook/belly-check.jpg"
                  alt="Postnatal 2-finger diastasis belly check posture on a cushioned mat"
                  className="w-full h-52 object-cover"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-white border border-sage-200 rounded-2xl p-4 space-y-2">
                <p className="font-bold text-sage-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Start Here First (Core &amp; Scar Safe)
                </p>
                <ul className="space-y-1.5 text-plum/80">
                  <li>• <strong>4-6 Breath Exhale:</strong> Inhale wide into side ribs (4s), exhale gently hugging lower belly inward (6s).</li>
                  <li>• <strong>Heel Slides:</strong> Lying on back, slide one heel gently out on exhale without letting lower back arch.</li>
                  <li>• <strong>Gentle Pelvic Tilts &amp; Glute Bridges:</strong> Restores pelvis alignment without abdominal bulging.</li>
                  <li>• <strong>Roll to your side</strong> when rising off a mat instead of sitting straight up like a sit-up.</li>
                </ul>
              </div>

              <div className="bg-peach-50/70 border border-peach-200 rounded-2xl p-4 space-y-2">
                <p className="font-bold text-plum flex items-center gap-1.5">
                  <Baby className="w-4 h-4 text-plum" /> Pause Briefly Until Cleared
                </p>
                <ul className="space-y-1.5 text-plum/80">
                  <li>• Full floor planks, mountain climbers, &amp; bicycle crunches while belly domes or scar feels tight.</li>
                  <li>• Heavy jumping jacks or high-impact lunges if feeling pelvic floor heaviness or leaks.</li>
                  <li>• Deep forward twists or pushing past sharp incision/low-back pinching.</li>
                </ul>
              </div>
            </div>

            <div className="bg-cream-50 border border-peach-200 rounded-2xl p-4 text-xs text-plum/85 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>
                <strong>Pages 8–12 in the 36-Page PDF</strong> also include the illustrated <strong>2-Finger Belly Check Photo Guide</strong>, the <strong>Weeks 1–12+ C-Section Scar Timeline</strong>, and <strong>12 Safe Exercise Reference Cards</strong>.
              </span>
            </div>
          </section>

          {/* CHAPTER 3 */}
          <section className="card-soft space-y-5 print-page-break print-avoid-break">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-plum/60">
              <Moon className="w-4 h-4 text-plum" /> Chapter 3 • 2 AM Relief Pocket Guide
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-plum">
              Easing &ldquo;Mommy Thumb&rdquo;, Nursing Neck &amp; Heavy Legs
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-peach-200 overflow-hidden">
                <img
                  src="/images/handbook/wrist-scoop.jpg"
                  alt="Safe neutral-wrist forearm scoop lift under baby"
                  className="w-full h-44 object-cover"
                />
                <div className="p-3.5 text-xs">
                  <p className="font-bold text-plum">Safe Forearm Scoop Lift</p>
                  <p className="text-plum/75 mt-0.5">Keep wrists straight and thumbs relaxed flat instead of hooking under armpits.</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-peach-200 overflow-hidden">
                <img
                  src="/images/handbook/nursing-posture.jpg"
                  alt="Upright nursing pillow posture supporting lower back and neck"
                  className="w-full h-44 object-cover object-[center_20%]"
                />
                <div className="p-3.5 text-xs">
                  <p className="font-bold text-plum">Upright Pillow-Stack Nursing Setup</p>
                  <p className="text-plum/75 mt-0.5">Bring baby up to chest level with cushions so chin stays neutral and shoulders drop.</p>
                </div>
              </div>
            </div>

            <div className="bg-blush-50/60 border border-blush-200 rounded-2xl p-5 space-y-2 text-xs sm:text-sm">
              <h3 className="font-heading font-bold text-lg text-plum">
                The #1 Instant Fix: Change How You Scoop Baby
              </h3>
              <p className="text-plum/85 leading-relaxed">
                Repeatedly lifting a growing baby under the armpits with thumbs hooked outward (&ldquo;L-grip&rdquo;) strains the thumb tendons at your wrist. Instead, <strong>keep wrists straight and scoop smoothly underneath baby&apos;s bottom and upper back with your forearms</strong>.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-cream-50 border border-peach-200 rounded-2xl p-4 space-y-1.5">
                <h4 className="font-bold text-plum">1. Soft Thumb &amp; Tendon Tilt (30s)</h4>
                <p className="text-plum/75">
                  Curl fingers loosely around your thumb (zero forceful squeezing), extend arm forward gently, and tilt pinky-side slightly down until you feel a mild, soothing forearm stretch — never sharp pain.
                </p>
              </div>
              <div className="bg-cream-50 border border-peach-200 rounded-2xl p-4 space-y-1.5">
                <h4 className="font-bold text-plum">2. Feeding Shoulder &amp; Chest Unwind (45s)</h4>
                <p className="text-plum/75">
                  After nursing or bottle feeding, roll shoulders up, wide back, and drop them heavy down away from your ears 8 slow times while sighing out through your mouth.
                </p>
              </div>
              <div className="bg-cream-50 border border-peach-200 rounded-2xl p-4 space-y-1.5">
                <h4 className="font-bold text-plum">3. Ear-to-Shoulder Neck Reset (30s/side)</h4>
                <p className="text-plum/75">
                  Tuck chin softly 1 inch, drop right ear toward right shoulder, and keep left fingertips heavy toward the floor. Never yank your head downward.
                </p>
              </div>
              <div className="bg-cream-50 border border-peach-200 rounded-2xl p-4 space-y-1.5">
                <h4 className="font-bold text-plum">4. Evening Ankle Pumps (45s)</h4>
                <p className="text-plum/75">
                  Prop feet on a sofa cushion for 2 minutes, trace slow wide circles with both ankles to ease standing/swollen-foot soreness before bed.
                </p>
              </div>
            </div>
          </section>

          {/* CHAPTER 4 */}
          <section className="card-soft space-y-5 print-page-break print-avoid-break">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sage-700">
              <Utensils className="w-4 h-4 text-sage-600" /> Chapter 4 • Real Home Kitchen
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-plum">
              One-Stove Family Meals (Zero Separate Diet Cooking)
            </h2>
            <p className="text-sm text-plum/80 leading-relaxed">
              Diets fail moms because cooking two meals doubles dishes and stress. Use the <strong>&ldquo;Kid-First Extraction&rdquo; rule</strong>: cook one mild, iron- and protein-rich family pot, scoop baby/kid portions cleanly first, then top your bowl with extra crunchy veg, tadka, or lemon.
            </p>

            <div className="rounded-2xl overflow-hidden border border-peach-200">
              <img
                src="/images/handbook/one-stove-meals.jpg"
                alt="One-stove family meal spread with dal tadka, phulka rotis, fresh cucumber salad and curd"
                className="w-full h-48 sm:h-60 object-cover"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-3.5 text-xs">
              <div className="bg-cream-50 border border-peach-200 rounded-2xl p-4 space-y-2">
                <h3 className="font-heading font-bold text-base text-plum">
                  North Indian Base
                </h3>
                <p className="text-plum/75">
                  <strong>Fast Base:</strong> Pressure-cook moong dal khichdi, rajma, or palak paneer batch for 2 days.
                </p>
                <p className="text-plum/75">
                  <strong>10-Min Save:</strong> Besan/moong chilla or egg bhurji + phulka + cucumber raita.
                </p>
              </div>

              <div className="bg-cream-50 border border-peach-200 rounded-2xl p-4 space-y-2">
                <h3 className="font-heading font-bold text-base text-plum">
                  South Indian Base
                </h3>
                <p className="text-plum/75">
                  <strong>Fast Base:</strong> Fresh fermented idli/dosa batter + pre-boiled toor dal in the fridge.
                </p>
                <p className="text-plum/75">
                  <strong>10-Min Save:</strong> Curd rice with grated carrot &amp; jeera, rava upma, or egg dosa + rasam.
                </p>
              </div>

              <div className="bg-cream-50 border border-peach-200 rounded-2xl p-4 space-y-2">
                <h3 className="font-heading font-bold text-base text-plum">
                  US / UK / Global Base
                </h3>
                <p className="text-plum/75">
                  <strong>Fast Base:</strong> Overnight berry chia oats + 1 batch cooked quinoa or shredded chicken/beans.
                </p>
                <p className="text-plum/75">
                  <strong>10-Min Save:</strong> Avocado egg sourdough, hummus veggie wraps, or tomato lentil soup.
                </p>
              </div>
            </div>

            <div className="bg-sage-50 border border-sage-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-plum/85">
              <Droplets className="w-5 h-5 text-sage-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-plum">
                  Nursing &amp; Hydration Shortcut: Keep 1 Bottle Per Room
                </p>
                <p className="mt-0.5">
                  Nursing moms thrive near <strong>10–11 glasses/day</strong>; non-nursing target <strong>8 glasses</strong>. Sip 1 full glass automatically every time you sit down to feed baby or start dinner.
                </p>
              </div>
            </div>
          </section>

          {/* CHAPTER 5 / PART 7–8 */}
          <section className="card-soft space-y-5 print-page-break print-avoid-break">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-plum/60">
              <Moon className="w-4 h-4 text-plum" /> Parts 4, 7 &amp; 8 in the 36-Page Workbook PDF
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-plum">
              Complete 7-Day Schedule, 6-Min Sleep Downshift &amp; 3 PM Craving Fix
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="bg-cream-50 border border-peach-200 rounded-2xl p-4 space-y-1.5">
                <h3 className="font-heading font-bold text-base text-plum">
                  Full 7-Day Workout Flow (pp. 16–17)
                </h3>
                <p className="text-plum/75">
                  Day-by-day Warmup, Main Flow, Cooldown, Baby-Awake Pivot, plus the <em>&ldquo;Missed 4 Days&rdquo; Zero-Guilt Reboot</em>.
                </p>
              </div>
              <div className="bg-cream-50 border border-peach-200 rounded-2xl p-4 space-y-1.5">
                <h3 className="font-heading font-bold text-base text-plum">
                  Evening Downshift &amp; 3 PM Crash (pp. 28–29)
                </h3>
                <p className="text-plum/75">
                  6-minute bedtime legs-up wind-down for tired-but-wired nights, plus 6 one-handed Protein + Fiber craving upgrades.
                </p>
              </div>
              <div className="bg-sage-50 border border-sage-200 rounded-2xl p-4 space-y-1.5">
                <h3 className="font-heading font-bold text-base text-plum">
                  Tear-Out Posters &amp; 4 Shopping Lists (pp. 21–36)
                </h3>
                <p className="text-plum/75">
                  Full 7-day menus &amp; categorized checklists for all 4 regions, 10-min emergency dinners, and cribside 2 AM stretch posters.
                </p>
              </div>
            </div>
          </section>

          {/* CHAPTER 6 / PRINTABLE FRIDGE TRACKER */}
          <section className="card-soft border-2 border-plum/15 space-y-5 print-page-break print-avoid-break">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-plum/60">
                  <Sparkles className="w-4 h-4 text-plum" /> Chapter 5 • Print &amp; Stick On Fridge
                </div>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-plum mt-1">
                  Your 7-Day Zero-Guilt Fridge Tracker
                </h2>
              </div>
              <span className="text-xs font-semibold bg-peach-100 text-plum px-3 py-1 rounded-full border border-peach-200">
                Even 5 Mins Counts ✓
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b-2 border-peach-200 text-plum/70 text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Day</th>
                    <th className="py-2.5 px-3">Movement (20m / Baby Awake / 5m)</th>
                    <th className="py-2.5 px-3">Water Glasses (8–11)</th>
                    <th className="py-2.5 px-3">Today&apos;s Win / How I Feel</th>
                  </tr>
                </thead>
                <tbody>
                  {fridgeDays.map((day) => (
                    <tr key={day} className="border-b border-peach-100">
                      <td className="py-3 px-3 font-bold text-plum">{day}</td>
                      <td className="py-3 px-3 text-plum/70">
                        <span className="inline-block w-4 h-4 border border-plum/40 rounded align-middle mr-2" />
                        Moved / Rested
                      </td>
                      <td className="py-3 px-3 tracking-widest text-plum/40">
                        ◯ ◯ ◯ ◯ ◯ ◯ ◯ ◯
                      </td>
                      <td className="py-3 px-3 text-plum/35">______________________</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-peach-50 border border-peach-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
              <div className="space-y-1">
                <p className="font-heading font-bold text-lg text-plum flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-blush-400 fill-blush-300" /> Ready for All 28 Days Guided Step-by-Step?
                </p>
                <p className="text-xs text-plum/75">
                  Unlock 58 YouTube-guided form demos, instant 5-Min Rescue buttons, regional meals, and interactive tracking inside Fit Mom 20.
                </p>
              </div>
              <Link href="/onboarding" className="btn-primary py-2.5 px-5 text-xs shrink-0">
                Personalize My 4-Week Plan <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>
        </HandbookGate>
      </div>
    </main>
  );
}
