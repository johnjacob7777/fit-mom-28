import Link from "next/link";

// =============================================================
// LANDING PAGE — the first page visitors see
// =============================================================
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-cream-50">
      {/* ───────── HERO ───────── */}
      <section className="px-6 py-16 md:py-24 text-center max-w-3xl mx-auto">
        {/* Logo / brand */}
        <p className="text-peach-500 font-extrabold text-lg tracking-widest uppercase mb-4">
          Fit Mom 20
        </p>

        <h1 className="text-3xl md:text-5xl font-extrabold text-warm-800 leading-tight mb-6">
          A simple 20-minute daily plan for busy moms to feel fit again
        </h1>

        <p className="text-lg md:text-xl text-warm-500 mb-10">
          No gym. No equipment. No guilt. Just 20 minutes a day.
        </p>

        <Link
          href="/signup"
          className="inline-block bg-sage-400 hover:bg-sage-500 text-white font-bold text-lg px-10 py-4 rounded-full shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
        >
          Start My Plan →
        </Link>
      </section>

      {/* ───────── PAIN POINTS ───────── */}
      <section className="bg-peach-50 px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-warm-800 text-center mb-10">
            Does this sound like you?
          </h2>

          <div className="space-y-5">
            {[
              { emoji: "⏰", text: "No time for the gym" },
              { emoji: "😴", text: "Too tired after looking after the kids" },
              { emoji: "🤷‍♀️", text: "Don't know where to start" },
              { emoji: "😔", text: "Tried plans before and quit" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm"
              >
                <span className="text-3xl">{item.emoji}</span>
                <span className="text-warm-700 font-semibold text-lg">{item.text}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-warm-500 mt-8 text-lg">
            You're not alone — and you don't need to change your life to feel fit.
            <br />
            <span className="font-bold text-sage-500">Just 20 minutes a day is enough.</span>
          </p>
        </div>
      </section>

      {/* ───────── WHAT YOU GET ───────── */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-warm-800 text-center mb-10">
          What&apos;s inside your plan
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: "🏋️‍♀️",
              title: "Daily 20-Minute Workout",
              desc: "Warm-up, 3 simple exercises, cool-down. Done!",
            },
            {
              icon: "🥗",
              title: "Weekly Meal Ideas",
              desc: "Simple, healthy meals that fit your food preference.",
            },
            {
              icon: "📊",
              title: "Progress Tracker",
              desc: "See your streak grow day by day.",
            },
            {
              icon: "💧",
              title: "Water & Weight Log",
              desc: "Track hydration and optional weight goals.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-peach-100 text-center"
            >
              <div className="text-4xl mb-3">{card.icon}</div>
              <h3 className="font-bold text-warm-800 text-lg mb-1">{card.title}</h3>
              <p className="text-warm-500">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── PRICING ───────── */}
      <section className="bg-sage-50 px-6 py-16">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-warm-800 mb-4">
            Simple pricing
          </h2>
          <div className="bg-white rounded-3xl p-8 shadow-md border-2 border-sage-200">
            <p className="text-warm-500 mb-2">Everything included</p>
            <p className="text-5xl font-extrabold text-warm-800 mb-1">
              ₹499<span className="text-lg font-normal text-warm-400">/month</span>
            </p>
            <p className="text-warm-400 text-sm mb-6">Cancel anytime</p>

            <ul className="text-left text-warm-600 space-y-2 mb-8">
              {[
                "Personalized 4-week workout plan",
                "Weekly meal ideas for your diet",
                "Daily progress tracking",
                "Gentle mode for new moms",
                "New plan every month",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-sage-400 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/signup"
              className="block bg-sage-400 hover:bg-sage-500 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg transition-all hover:shadow-xl"
            >
              Start My Plan →
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="px-6 py-16 max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-warm-800 text-center mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {[
            {
              q: "Do I need any gym equipment?",
              a: "Nope! All workouts can be done at home with zero equipment. If you have light dumbbells or a resistance band, we'll include bonus exercises — but they're optional.",
            },
            {
              q: "I just had a baby. Is this safe for me?",
              a: "We ask about this in the quiz and create a gentle, postpartum-safe plan for you. However, please always check with your doctor before starting any exercise after childbirth.",
            },
            {
              q: "What if I miss a day?",
              a: "That's totally okay! Life happens, especially with kids. Just pick up where you left off — no guilt, no catch-up needed. Consistency over perfection!",
            },
          ].map((faq) => (
            <div key={faq.q} className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-warm-800 text-lg mb-2">{faq.q}</h3>
              <p className="text-warm-500">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── FINAL CTA ───────── */}
      <section className="px-6 py-16 text-center bg-peach-100">
        <h2 className="text-2xl md:text-3xl font-bold text-warm-800 mb-4">
          Ready to feel fit again?
        </h2>
        <p className="text-warm-500 mb-8 text-lg">
          Start your personalized plan today — just 20 minutes a day.
        </p>
        <Link
          href="/signup"
          className="inline-block bg-sage-400 hover:bg-sage-500 text-white font-bold text-lg px-10 py-4 rounded-full shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
        >
          Start My Plan →
        </Link>
      </section>

      {/* ───────── FOOTER ───────── */}
      <footer className="px-6 py-8 text-center border-t border-peach-100">
        <p className="text-warm-400 text-sm max-w-xl mx-auto">
          ⚕️ This app gives general fitness guidance and is not medical advice.
          Please check with your doctor before starting any exercise program.
        </p>
        <p className="text-warm-300 text-xs mt-4">
          © {new Date().getFullYear()} Fit Mom 20. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
