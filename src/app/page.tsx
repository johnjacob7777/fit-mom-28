import Link from "next/link";
import {
  Clock,
  BatteryCharging,
  Compass,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Heart,
  Droplets,
  Timer,
  ChevronRight,
  User,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-cream text-plum selection:bg-blush-200">
      {/* ───────── HEADER BRAND ───────── */}
      <header className="px-6 py-6 max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-peach-200 flex items-center justify-center text-plum font-heading font-bold text-lg">
            F
          </div>
          <span className="font-heading font-bold text-xl tracking-tight text-plum">
            Fit Mom 20
          </span>
        </div>
        <Link
          href="/login"
          className="text-sm font-semibold text-plum/80 hover:text-plum px-4 py-2 rounded-xl hover:bg-peach-100 transition-colors"
        >
          Member Login
        </Link>
      </header>

      {/* ───────── HERO SECTION ───────── */}
      <section className="relative overflow-hidden px-6 pt-8 pb-20 md:pt-16 md:pb-28">
        {/* Soft decorative background gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-peach-200/50 via-blush-100/40 to-sage-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-peach-100 border border-peach-200 text-xs font-semibold uppercase tracking-wider text-plum">
              <Sparkles className="w-3.5 h-3.5 text-plum" />
              Gentle, Sustainable Daily Movement
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-plum leading-[1.15]">
              A simple 20-minute daily plan for busy moms to feel fit again
            </h1>

            <p className="text-lg sm:text-xl text-plum/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              No gym. No equipment. No guilt. Just 20 minutes a day crafted around real mom life.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/signup" className="btn-primary w-full sm:w-auto">
                Start My Plan <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
              <a
                href="#sample-workout"
                className="btn-secondary w-full sm:w-auto"
              >
                Try Free Sample Workout
              </a>
            </div>

            {/* Prominent Doctor Notice near Main CTA */}
            <div className="flex items-start gap-2.5 text-xs text-plum/70 max-w-lg mx-auto lg:mx-0 pt-1 text-left bg-peach-50/80 p-3 rounded-xl border border-peach-200/60">
              <ShieldCheck className="w-4 h-4 text-plum shrink-0 mt-0.5" />
              <span>
                <strong>Not medical advice:</strong> Fit Mom 20 provides general educational fitness guidance. Please check with your doctor before starting any exercise routine, especially postpartum or if managing pain.
              </span>
            </div>

            <p className="text-xs text-plum/60 text-center lg:text-left">
              7-Day Money-Back Guarantee • Cancel anytime with one tap
            </p>
          </div>

          {/* Right Column: Phone Mockup of the Dashboard */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-[290px] sm:w-[320px] rounded-[42px] p-3.5 bg-plum shadow-soft-lg border-4 border-plum-700">
              {/* Speaker / Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-plum-800 rounded-full z-20" />

              {/* Screen */}
              <div className="bg-cream rounded-[34px] overflow-hidden pt-7 pb-5 px-4 text-plum border border-peach-200 space-y-3.5">
                {/* Header in phone */}
                <div className="flex items-center justify-between text-xs border-b border-peach-200 pb-2">
                  <span className="font-heading font-bold text-plum">FIT MOM 20</span>
                  <span className="text-plum/60 font-medium">Day 3 of 28</span>
                </div>

                {/* Motivational banner */}
                <div className="bg-peach-100 rounded-xl p-2.5 text-center text-xs font-medium text-plum">
                  You showed up today — that&apos;s already a win! 🌸
                </div>

                {/* Workout Card */}
                <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-peach-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-plum flex items-center gap-1.5">
                      <Timer className="w-3.5 h-3.5 text-plum" /> Today&apos;s 20-Min Workout
                    </span>
                    <span className="bg-sage-100 text-sage-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      Gentle
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] text-plum/80">
                    <div className="flex justify-between">
                      <span>• Warm-up: March in place</span>
                      <span className="text-plum/50">2 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Squats & Glute bridges</span>
                      <span className="text-plum/50">12 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Pelvic floor & Cooldown</span>
                      <span className="text-plum/50">6 min</span>
                    </div>
                  </div>

                  <div className="w-full bg-plum text-white text-[11px] font-semibold py-1.5 rounded-xl text-center flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sage-300" /> Done (Marked)
                  </div>
                </div>

                {/* Water Tracker */}
                <div className="bg-white rounded-xl p-2.5 shadow-xs border border-peach-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-sage-500" />
                    <span className="text-[11px] font-semibold text-plum">Water: 6/8 cups</span>
                  </div>
                  <div className="flex gap-1 text-xs">
                    <span className="w-5 h-5 rounded-full bg-sage-200 flex items-center justify-center text-[10px] font-bold text-plum">+</span>
                  </div>
                </div>

                {/* Streak */}
                <div className="bg-white rounded-xl p-2.5 shadow-xs border border-peach-100">
                  <div className="flex justify-between text-[10px] text-plum/70 font-semibold mb-1">
                    <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                  </div>
                  <div className="flex justify-between">
                    {["✓", "✓", "✓", "•", " ", " ", " "].map((status, i) => (
                      <span
                        key={i}
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          status === "✓"
                            ? "bg-sage-400 text-white"
                            : status === "•"
                            ? "bg-peach-200 text-plum"
                            : "bg-peach-50 text-plum/30"
                        }`}
                      >
                        {status}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── PAIN POINTS ───────── */}
      <section className="px-6 py-16 bg-peach-50/60 border-y border-peach-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-plum mb-3">
            Does this sound like your days?
          </h2>
          <p className="text-plum/70 text-base mb-10">
            Motherhood takes everything you have. Your fitness plan shouldn&apos;t demand what you don&apos;t have left.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {[
              {
                icon: Clock,
                title: "No time for the gym",
                desc: "Packing bags, driving through traffic, and finding childcare takes 2 hours for a 40-minute workout.",
              },
              {
                icon: BatteryCharging,
                title: "Too tired after the kids",
                desc: "When evening comes, the last thing your body needs is high-intensity exhaustion.",
              },
              {
                icon: Compass,
                title: "Don't know where to start",
                desc: "Generic fitness apps push random workouts with no attention to postpartum recovery or back pain.",
              },
              {
                icon: RotateCcw,
                title: "Tried plans before and quit",
                desc: "Unrealistic 60-minute routines build guilt when life happens. Consistency requires simplicity.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="card-soft flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-peach-100 flex items-center justify-center text-plum shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-plum mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-plum/75 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────── HOW IT WORKS (3 STEPS) ───────── */}
      <section className="px-6 py-20 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage-100 text-sage-600 text-xs font-semibold uppercase tracking-wider mb-4">
          Simple 3-Step Process
        </div>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-plum mb-12">
          How Fit Mom 20 Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          {[
            {
              num: "01",
              title: "Answer a 2-minute quiz",
              desc: "Tell us about your schedule, postpartum status (baby under 1), back or knee comfort, and diet preferences.",
              icon: Compass,
            },
            {
              num: "02",
              title: "Get your personal 4-week plan",
              desc: "Receive customized daily routines with gentle warmup, 3 focused exercises, cooldown, and aligned meal ideas.",
              icon: Calendar,
            },
            {
              num: "03",
              title: "Follow 20 minutes a day",
              desc: "Open your daily card, press start on the timer, follow gentle movements at home, and mark it done with zero guilt.",
              icon: CheckCircle2,
            },
          ].map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="card-soft relative flex flex-col justify-between">
                <div>
                  <span className="text-3xl font-heading font-extrabold text-peach-300 block mb-2">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-peach-100 flex items-center justify-center text-plum mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-plum mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-plum/75 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ───────── TRY A FREE SAMPLE WORKOUT ───────── */}
      <section id="sample-workout" className="px-6 py-20 bg-blush-50/50 border-y border-blush-100">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blush-100 text-plum text-xs font-semibold uppercase tracking-wider mb-3">
            No Sign-up Required
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-plum mb-4">
            Try a Free 20-Minute Sample Workout
          </h2>
          <p className="text-plum/80 text-base mb-10 max-w-xl mx-auto">
            Experience how realistic and refreshing a gentle 20-minute daily session feels right in your living room.
          </p>

          <div className="card-soft text-left space-y-6 border-2 border-blush-200">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-peach-200">
              <div>
                <h3 className="font-heading font-bold text-xl text-plum">
                  Day 1 Sample: Total Body Energizer
                </h3>
                <p className="text-xs text-plum/60 mt-0.5">
                  Equipment: None • Level: Gentle / Beginner friendly
                </p>
              </div>
              <span className="bg-sage-100 text-sage-600 font-semibold text-xs px-3 py-1 rounded-full">
                ⏱️ 20 Minutes Total
              </span>
            </div>

            {/* Phase 1: Warmup */}
            <div>
              <p className="text-xs uppercase font-bold text-plum/70 tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-peach-400" /> Part 1: Gentle Warm-Up (3 mins)
              </p>
              <div className="space-y-2 bg-cream-50 p-4 rounded-xl border border-peach-100 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-plum">Marching in place with shoulder rolls</span>
                  <span className="text-plum/60 text-xs">1 min 30 sec</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-plum">Gentle side bends & arm reach</span>
                  <span className="text-plum/60 text-xs">1 min 30 sec</span>
                </div>
              </div>
            </div>

            {/* Phase 2: Core 3 Exercises */}
            <div>
              <p className="text-xs uppercase font-bold text-plum/70 tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sage-400" /> Part 2: 3 Simple Exercises (14 mins)
              </p>
              <div className="space-y-2 bg-cream-50 p-4 rounded-xl border border-peach-100 text-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-plum block">1. Supported Chair Squats</span>
                    <span className="text-xs text-plum/60">Lower until sitting, then stand up tall.</span>
                  </div>
                  <span className="text-plum/80 font-semibold text-xs shrink-0">10–12 reps</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-peach-100/60">
                  <div>
                    <span className="font-medium text-plum block">2. Gentle Glute Bridges</span>
                    <span className="text-xs text-plum/60">Lying on mat, squeeze glutes and lift hips softly.</span>
                  </div>
                  <span className="text-plum/80 font-semibold text-xs shrink-0">10–12 reps</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-peach-100/60">
                  <div>
                    <span className="font-medium text-plum block">3. Wall Push-Ups</span>
                    <span className="text-xs text-plum/60">Gentle upper body strength with zero floor pressure.</span>
                  </div>
                  <span className="text-plum/80 font-semibold text-xs shrink-0">10 reps</span>
                </div>
                <p className="text-[11px] text-plum/50 pt-1 italic">
                  Take a 45-second breather between movements. Repeat for 2–3 gentle rounds.
                </p>
              </div>
            </div>

            {/* Phase 3: Cool Down */}
            <div>
              <p className="text-xs uppercase font-bold text-plum/70 tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blush-400" /> Part 3: Calming Cool-Down (3 mins)
              </p>
              <div className="space-y-2 bg-cream-50 p-4 rounded-xl border border-peach-100 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-plum">Child&apos;s pose & deep belly breathing</span>
                  <span className="text-plum/60 text-xs">1 min 30 sec</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-plum">Neck rolls & seated torso stretch</span>
                  <span className="text-plum/60 text-xs">1 min 30 sec</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <Link href="/signup" className="btn-primary w-full sm:w-auto">
                Get Your Personalized 4-Week Plan <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── WHY 20 MINUTES WORKS ───────── */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-peach-100 text-plum text-xs font-semibold uppercase tracking-wider mb-3">
            Science & Real Life
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-plum">
            Why 20 Minutes Daily Works
          </h2>
          <p className="text-plum/75 text-base max-w-xl mx-auto mt-2">
            No exaggerated fitness myths. Here is the honest truth about making movement fit around a family.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="card-soft">
            <h3 className="font-heading font-bold text-xl text-plum mb-3">
              1. Consistency Beats Burnout
            </h3>
            <p className="text-sm text-plum/75 leading-relaxed">
              Research shows that 20 minutes of daily moderate movement builds stronger habit loops than an ambitious 60-minute workout you only manage once a week before feeling overwhelmed.
            </p>
          </div>

          <div className="card-soft">
            <h3 className="font-heading font-bold text-xl text-plum mb-3">
              2. Energy Without Depletion
            </h3>
            <p className="text-sm text-plum/75 leading-relaxed">
              High-intensity interval exhaustion drains cortisol and leaves you drained for child care. 20 minutes of restorative strength gently awakens circulation and elevates daily stamina.
            </p>
          </div>

          <div className="card-soft">
            <h3 className="font-heading font-bold text-xl text-plum mb-3">
              3. Zero Friction
            </h3>
            <p className="text-sm text-plum/75 leading-relaxed">
              When a workout takes 20 minutes from the comfort of your carpet with zero special gear, the psychological hurdle disappears. You can press play during nap time or while dinner is simmering.
            </p>
          </div>
        </div>

        {/* Clearly Marked Placeholder: What Moms Say */}
        <div className="mt-14 card-soft border-dashed border-2 border-peach-300 text-center bg-peach-50/50 p-8">
          <Heart className="w-8 h-8 text-blush-400 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-2xl text-plum mb-2">
            What Moms Say
          </h3>
          <p className="text-sm text-plum/70 max-w-lg mx-auto italic mb-3">
            [Reviews from real moms using Fit Mom 20 will be added here as our community grows. We believe in 100% honest, genuine feedback with zero fake numbers or paid reviews.]
          </p>
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-plum/50 bg-white px-3 py-1 rounded-full border border-peach-200">
            Real Community Section Placeholder
          </span>
        </div>
      </section>

      {/* ───────── ABOUT NOTE & PRICING ───────── */}
      <section className="px-6 py-20 bg-peach-50/60 border-t border-peach-100">
        <div className="max-w-3xl mx-auto space-y-16">
          {/* About Creator Note */}
          <div className="card-soft flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-20 h-20 rounded-full bg-peach-200 border-2 border-plum/10 flex items-center justify-center shrink-0 text-plum font-heading font-bold text-2xl shadow-xs">
              <User className="w-10 h-10 text-plum/60" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-plum/60 mb-1">
                About the Program
              </p>
              <h3 className="font-heading font-bold text-2xl text-plum mb-2">
                Built for busy moms by [YOUR NAME]
              </h3>
              <p className="text-sm text-plum/80 leading-relaxed">
                Created to provide an antidote to unrealistic fitness standards. A respectful, gentle approach that acknowledges broken sleep, recovery, and the mental load of motherhood.
              </p>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-3xl font-heading font-bold text-plum mb-2">
              Simple, Accessible Membership
            </h2>
            <p className="text-plum/70 text-sm mb-6">
              Invest in your well-being with complete peace of mind.
            </p>

            <div className="card-soft border-2 border-plum/20 relative shadow-soft-md">
              <div className="inline-block bg-peach-100 text-plum text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-peach-200">
                Full All-Access Plan
              </div>
              <p className="text-5xl font-heading font-extrabold text-plum mb-1">
                ₹499
                <span className="text-lg font-sans font-normal text-plum/60">/month</span>
              </p>
              <p className="text-xs text-plum/60 mb-6">
                (Placeholder pricing — cancel anytime in 1 click)
              </p>

              <ul className="space-y-3 text-left text-sm text-plum/85 mb-8">
                {[
                  "Personalized 4-week daily 20-min workout plan",
                  "Gentle postpartum & pain-conscious variations",
                  "Aligned weekly meal ideas (veg, non-veg, eggs)",
                  "Interactive timer and 'done' streak tracker",
                  "Daily water and optional wellness tracking",
                  "Fresh updated routines every month",
                ].map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-sage-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* 7-day money back note */}
              <div className="bg-sage-50 border border-sage-200 rounded-xl p-3 mb-6 text-xs text-plum/80 text-left flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-sage-600 shrink-0 mt-0.5" />
                <span>
                  <strong>7-Day Free Trial / Money-Back Guarantee:</strong> Try the first week without worry. If you don&apos;t feel more energized, message us for a prompt refund.
                </span>
              </div>

              <Link href="/signup" className="btn-primary w-full">
                Start My Plan <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              {/* Medical note near button */}
              <p className="text-[11px] text-plum/60 mt-4 leading-normal">
                ⚕️ Fit Mom 20 provides general wellness plans. Please check with your physician before beginning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── SHORT FAQ (3 QUESTIONS) ───────── */}
      <section className="px-6 py-20 max-w-3xl mx-auto">
        <h2 className="text-3xl font-heading font-bold text-plum text-center mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {[
            {
              q: "Do I need any gym equipment?",
              a: "None at all. Every single workout is built for your living room using bodyweight movements. If you happen to own light dumbbells or a resistance band, we offer optional bonus variations, but they are never mandatory.",
            },
            {
              q: "I have a baby under 1 year old or back discomfort. Is this safe?",
              a: "During our 2-minute quiz, we ask about your baby's age and any back or knee sensitivity. Your plan automatically activates Gentle Mode, swapping high-impact movements for restorative core, pelvic floor, and gentle joint relief. However, please always clear exercise with your doctor first.",
            },
            {
              q: "What if my schedule is chaotic and I miss days?",
              a: "There is zero guilt and no 'falling behind.' Your plan saves your progress day-by-day. Whenever you return, your next 20 minutes is ready for you. Life happens, and this app was built to support you, not judge you.",
            },
          ].map((item) => (
            <div key={item.q} className="card-soft">
              <h3 className="font-heading font-bold text-lg text-plum mb-2">
                {item.q}
              </h3>
              <p className="text-sm text-plum/75 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── FOOTER ───────── */}
      <footer className="px-6 py-12 bg-plum text-cream-50 border-t border-plum-700">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full bg-peach-300 text-plum flex items-center justify-center font-heading font-bold">
              F
            </div>
            <span className="font-heading font-bold text-xl text-cream-50">
              Fit Mom 20
            </span>
          </div>

          <p className="text-sm text-cream-50/70 max-w-lg mx-auto">
            A simple 20-minute daily plan for busy moms to feel fit again. No gym. No equipment. No guilt.
          </p>

          <div className="flex justify-center flex-wrap gap-6 text-sm font-medium text-peach-200">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact & Support
            </Link>
          </div>

          <div className="pt-4 border-t border-plum-600/60 max-w-2xl mx-auto text-xs text-cream-50/50 space-y-2">
            <p>
              ⚕️ <strong>Medical Disclaimer:</strong> This app provides general fitness and wellness guidance and does not constitute medical advice. Please consult your physician or obstetrician before beginning any physical exercise program.
            </p>
            <p>
              © {new Date().getFullYear()} Fit Mom 20. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
