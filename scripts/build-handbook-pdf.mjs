/**
 * Generates the 36-page flagship PDF:
 *   public/fit-mom-20-comeback-handbook.pdf
 *
 * Uses local Google Chrome (--headless=new --print-to-pdf) with strict
 * single-page section layouts so every page stays rich, readable, visually
 * balanced, and >= 30 pages with zero overflow or orphan splits.
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import {
  TOC_SECTIONS,
  CORE_CARDS_P1,
  STRENGTH_CARDS_P2,
  WEEKLY_WORKOUTS,
  REGIONAL_MENUS,
  EMERGENCY_DINNERS,
  CRAVING_SWAPS,
} from "./handbook-data.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_PDF = path.join(ROOT, "public", "fit-mom-20-comeback-handbook.pdf");
const TMP_HTML = path.join(os.tmpdir(), "fit-mom-20-handbook-36p.html");

const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];

function findBrowser() {
  for (const c of CHROME_CANDIDATES) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error("Could not locate Chrome or Edge for HTML->PDF generation.");
}

const esc = (s) =>
  String(s)
    .replace(/->/g, "→")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function pageWrap(pageNum, totalPages, runningLabel, bodyHtml, extraClass = "") {
  return `
  <section class="page ${extraClass}">
    <div class="page-top">
      <span class="running-brand">FIT MOM 20 • THE EXHAUSTED MOM&apos;S COMEBACK HANDBOOK</span>
      <span class="running-chapter">${esc(runningLabel)}</span>
    </div>
    <div class="page-body">${bodyHtml}</div>
    <div class="page-foot">
      <span>Educational wellness guide only • Confirm postpartum clearance with your physician</span>
      <span class="page-num">Page ${pageNum} of ${totalPages}</span>
    </div>
  </section>`;
}

const SVG_BELLY_CHECK = `
<svg viewBox="0 0 460 148" width="100%" style="max-height:140px; margin-bottom:8px;" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="460" height="148" rx="14" fill="#FFF9F5" stroke="#F4D3BE"/>
  <text x="18" y="21" font-size="11" font-weight="700" fill="#4A2538">1. Lying Position (Exhale + Tiny Lift)</text>
  <line x1="20" y1="120" x2="215" y2="120" stroke="#D9B5A0" stroke-width="2.5"/>
  <circle cx="44" cy="91" r="13.5" fill="#FADAD0" stroke="#4A2538" stroke-width="1.8"/>
  <path d="M56 100 C80 95, 120 97, 138 107 L175 71 L205 117" fill="none" stroke="#4A2538" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M88 96 L86 73" stroke="#2D6A4F" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="86" cy="70" r="4" fill="#2D6A4F"/>
  <text x="95" y="76" font-size="9.5" font-weight="700" fill="#2D6A4F">2 Fingers Here</text>
  <text x="20" y="137" font-size="9" fill="#6F4C5B">Head lifts just 1 inch while exhaling softly</text>

  <line x1="232" y1="14" x2="232" y2="136" stroke="#F4D3BE" stroke-dasharray="3 3"/>
  <text x="248" y="21" font-size="11" font-weight="700" fill="#4A2538">2. Measure Three Midline Spots</text>
  <ellipse cx="298" cy="80" rx="33" ry="48" fill="#FFF2EB" stroke="#4A2538" stroke-width="1.6"/>
  <line x1="298" y1="35" x2="298" y2="125" stroke="#D98A6C" stroke-width="2" stroke-dasharray="4 2"/>
  <circle cx="298" cy="54" r="4.8" fill="#4A2538"/>
  <circle cx="298" cy="80" r="4.8" fill="#2D6A4F"/>
  <circle cx="298" cy="106" r="4.8" fill="#4A2538"/>
  <text x="342" y="57" font-size="9.5" font-weight="600" fill="#4A2538">A. 2 in Above Navel</text>
  <text x="342" y="83" font-size="9.5" font-weight="700" fill="#2D6A4F">B. Right At Navel</text>
  <text x="342" y="109" font-size="9.5" font-weight="600" fill="#4A2538">C. 2 in Below Navel</text>
  <text x="248" y="137" font-size="9" fill="#6F4C5B">Note width (fingers) &amp; tension (firm vs. soft)</text>
</svg>`;

const SVG_SCOOP_WRIST = `
<svg viewBox="0 0 460 132" width="100%" style="max-height:126px; margin-bottom:8px;" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="222" height="132" rx="14" fill="#FFF5F5" stroke="#F5C2C7"/>
  <text x="14" y="21" font-size="11" font-weight="700" fill="#9B2C2C">AVOID: Tight &ldquo;L-Grip&rdquo; Hook</text>
  <path d="M35 90 L70 90 L88 57 L102 65" fill="none" stroke="#9B2C2C" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="115" cy="53" r="13.5" fill="#FADAD0" stroke="#9B2C2C" stroke-width="1.6"/>
  <path d="M126 65 L175 65 L175 91 L124 91 Z" fill="#FFE8E8" stroke="#9B2C2C" stroke-width="1.4"/>
  <text x="14" y="109" font-size="9" fill="#7A2E2E">Thumb locks outward at 90° under</text>
  <text x="14" y="122" font-size="9" fill="#7A2E2E">armpits → pinches thumb tendon.</text>

  <rect x="238" y="0" width="222" height="132" rx="14" fill="#F0F7F2" stroke="#B7DEC3"/>
  <text x="252" y="21" font-size="11" font-weight="700" fill="#1E5631">DO THIS: Forearm Scoop Lift</text>
  <circle cx="332" cy="51" r="13.5" fill="#FADAD0" stroke="#1E5631" stroke-width="1.6"/>
  <rect x="346" y="45" width="52" height="27" rx="10" fill="#E3F2E8" stroke="#1E5631" stroke-width="1.4"/>
  <path d="M262 91 L325 80 L388 80" fill="none" stroke="#1E5631" stroke-width="5" stroke-linecap="round"/>
  <text x="252" y="109" font-size="9" fill="#1E5631">Keep wrists neutral &amp; straight; thumbs stay</text>
  <text x="252" y="122" font-size="9" fill="#1E5631">tucked lightly alongside your fingers.</text>
</svg>`;

const SVG_NURSING_POSTURE = `
<svg viewBox="0 0 460 126" width="100%" style="max-height:122px; margin-bottom:8px;" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="222" height="126" rx="14" fill="#FFF5F5" stroke="#F5C2C7"/>
  <text x="14" y="20" font-size="11" font-weight="700" fill="#9B2C2C">BEFORE: Slumping Down to Baby</text>
  <path d="M55 107 L55 69 Q65 46 92 44" fill="none" stroke="#9B2C2C" stroke-width="3.5" stroke-linecap="round"/>
  <circle cx="102" cy="50" r="10.5" fill="#FADAD0" stroke="#9B2C2C" stroke-width="1.6"/>
  <text x="14" y="103" font-size="9" fill="#7A2E2E">Chin pokes forward → tight neck,</text>
  <text x="14" y="116" font-size="9" fill="#7A2E2E">upper back knot &amp; sore ribs.</text>

  <rect x="238" y="0" width="222" height="126" rx="14" fill="#F0F7F2" stroke="#B7DEC3"/>
  <text x="252" y="20" font-size="11" font-weight="700" fill="#1E5631">AFTER: Pillow Stack Lift to Chest</text>
  <line x1="278" y1="103" x2="278" y2="50" stroke="#1E5631" stroke-width="3.5" stroke-linecap="round"/>
  <circle cx="278" cy="37" r="10.5" fill="#FADAD0" stroke="#1E5631" stroke-width="1.6"/>
  <rect x="292" y="70" width="54" height="19" rx="8" fill="#D8EEDF" stroke="#1E5631" stroke-width="1.3"/>
  <text x="297" y="83" font-size="8.5" font-weight="700" fill="#1E5631">Pillow Stack</text>
  <text x="252" y="103" font-size="9" fill="#1E5631">Spine stays stacked upright against</text>
  <text x="252" y="116" font-size="9" fill="#1E5631">sofa cushion; shoulders stay heavy.</text>
</svg>`;

function renderRegionalPage1(reg, ironTip, swapTip) {
  const rows = reg.days
    .map(
      (d) => `
    <tr>
      <td><strong>${esc(d.day)}</strong></td>
      <td>${esc(d.b)}</td>
      <td>${esc(d.l)}</td>
      <td>${esc(d.d)}</td>
      <td>${esc(d.s)}</td>
    </tr>`
    )
    .join("");
  return `
    <span class="kicker">Part 6 • Regional Real-Kitchen Menu</span>
    <h1>${esc(reg.title)}</h1>
    <p class="lead">${esc(reg.subtitle)}</p>
    <div class="callout sage">
      <strong>Kid-First Extraction Rule:</strong> Prepare one mildly seasoned family base pot. Scoop toddler/kid bowls out first, then stir chilies, tadka, black pepper, or crunchy greens directly into your bowl so zero extra dishes get dirtied.
    </div>
    <table class="tight-table">
      <thead>
        <tr><th style="width:10%">Day</th><th style="width:24%">Breakfast (Protein + Energy)</th><th style="width:24%">Lunch (One-Stove Family Pot)</th><th style="width:24%">Dinner (Easy Digestion)</th><th style="width:18%">3 PM Snack</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="grid-2" style="margin-top:9px;">
      <div class="box">
        <h4>Vegetarian Swap Key</h4>
        <p class="small">Keep moong dal, paneer, curd, tofu, roasted chana, and sprouts ready so every plate hits 15–22g protein without relying on shakes.</p>
      </div>
      <div class="box">
        <h4>Egg &amp; Non-Veg Shortcut</h4>
        <p class="small">Keep 6 hard-boiled eggs chilled on the middle fridge shelf. Add 1–2 sliced eggs or leftover tandoori/pan chicken directly atop veg dal-rice or dosa.</p>
      </div>
    </div>
    <div class="callout peach" style="margin-top:9px; margin-bottom:0;">
      <strong>Regional Nutrient Pairings &amp; Busy Swaps:</strong> ${esc(ironTip)} &nbsp;•&nbsp; <strong>Quick 10-Min Backup:</strong> ${esc(swapTip)}
    </div>
  `;
}

function renderRegionalGroceries(title, subtitle, groups, prepBox, budgetBox) {
  const cols = groups
    .map(
      (g) => `
    <div class="box">
      <h4>${esc(g.cat)}</h4>
      <ul class="check-list">
        ${g.items.map((it) => `<li><span class="chk"></span>${esc(it)}</li>`).join("")}
      </ul>
    </div>`
    )
    .join("");
  return `
    <span class="kicker">Part 6 • Weekly Market List</span>
    <h1>${esc(title)}</h1>
    <p class="lead">${esc(subtitle)}</p>
    <div class="callout peach">
      <strong>1× to 4× Household Multiplier Note:</strong> Quantities below match 1–2 adults. Cooking for a family of 4 or joint home? Double fresh produce + grains cleanly — leave basic oil/ghee spice tempering nearly unchanged.
    </div>
    <div class="grid-3">${cols}</div>
    <div class="grid-2" style="margin-top:10px;">
      <div class="box sage">
        <h4>20-Minute Batch &amp; Fridge Time-Savers</h4>
        <p class="small">${esc(prepBox)}</p>
      </div>
      <div class="box" style="background:#FFFDFB;">
        <h4>Zero-Waste &amp; Budget Swap Rule</h4>
        <p class="small">${esc(budgetBox)}</p>
      </div>
    </div>
    <div class="box" style="margin-top:9px;">
      <h4>Custom Extras / Family Requests For This Week:</h4>
      <div class="lines"></div><div class="lines"></div>
    </div>
  `;
}

function renderExerciseCardGrid(cards) {
  return `<div class="grid-2">${cards
    .map(
      (c) => `
    <div class="ex-card">
      <div class="ex-head">
        <span class="ex-name">${esc(c.name)}</span>
        <span class="pill">${esc(c.duration)}</span>
      </div>
      <div class="ex-focus">Focus: ${esc(c.focus)}</div>
      <p class="ex-p"><strong>How:</strong> ${esc(c.cue)}</p>
      <p class="ex-p"><strong>Breath:</strong> ${esc(c.breath)}</p>
      <p class="ex-mod"><strong>Gentle Swap:</strong> ${esc(c.mod)}</p>
    </div>`
    )
    .join("")}</div>`;
}

function buildAllPages() {
  const totalPages = 36;
  const pages = [];

  // PAGE 1 — FULL COVER
  pages.push(`
  <section class="page cover-page">
    <div class="cover-top">
      <span class="cover-badge">FIT MOM 20 • COMPLETE EDITION (36 PAGES)</span>
      <div class="cover-hero">
        <p class="cover-eyebrow">BUILT FOR TIRED MOTHERS, POSTPARTUM HEALING &amp; REAL KITCHENS</p>
        <h1 class="cover-title">The Exhausted Mom&apos;s<br/>7-Day Comeback Handbook</h1>
        <p class="cover-sub">Feel steady, stronger, and less stiff in 20 calm minutes a day — without gym commutes, broken-streak guilt, or cooking two separate dinners.</p>
      </div>
      <div class="cover-grid">
        <div class="cover-pill"><strong>3-Speed Energy System</strong><span>20-Min, Baby-Awake &amp; 5-Min Rescue</span></div>
        <div class="cover-pill"><strong>Postpartum Safe Checks</strong><span>60s 2-Finger DRA &amp; C-Section Rules</span></div>
        <div class="cover-pill"><strong>2 AM Pain Relief Pocket</strong><span>Mommy Thumb, Feeding Neck &amp; Swollen Legs</span></div>
        <div class="cover-pill"><strong>4 Regional 7-Day Menus</strong><span>North Indian · South Indian · All-India · Global</span></div>
        <div class="cover-pill"><strong>Categorized Grocery Lists</strong><span>1× to 4× Family Pot Formulas</span></div>
        <div class="cover-pill"><strong>Printable Fridge Workbook</strong><span>Trackers, Journals &amp; 2 AM Posters</span></div>
      </div>
      <div class="cover-quote">
        &ldquo;You don&apos;t need another grueling bootcamp. You need a calm 5-to-20 minute rhythm that adapts to teething nights, nursing pillows, and your real family kitchen.&rdquo;
      </div>
    </div>
    <div class="cover-foot">
      <div class="disclaimer-mini">
        <strong>Medical &amp; Safety Notice:</strong> This handbook is an educational wellness companion — not personalized medical advice. Always receive clearance from your OB-GYN or doctor before beginning movement after vaginal delivery, C-section surgery, or persistent pain.
      </div>
      <p class="cover-url">Interactive Timers &amp; 58 Guided Videos Inside Fit Mom 20 • <strong>fit-mom-28-aj.vercel.app</strong></p>
    </div>
  </section>`);

  // PAGE 2 — TOC + QUICK START
  const tocCols = TOC_SECTIONS.map(
    (s) => `
    <div class="toc-block">
      <div class="toc-head"><strong>${esc(s.part)}</strong><span>${esc(s.pages)}</span></div>
      <ul>${s.items.map((it) => `<li>${esc(it)}</li>`).join("")}</ul>
    </div>`
  ).join("");
  pages.push(
    pageWrap(
      2,
      totalPages,
      "Table of Contents & Emergency Quick-Find",
      `
      <span class="kicker">How to Use This Manual</span>
      <h1>Skip Straight to What Hurts or Helps Tonight</h1>
      <div class="callout peach">
        <strong>90-Second Mom Quick-Find Index:</strong>
        &nbsp;Zero sleep today? <strong>Go to p. 6</strong> · Baby refuses crib? <strong>p. 7</strong> · Belly coning / C-section worry? <strong>p. 8–9</strong> · Pain at thumb base? <strong>p. 13</strong> · Exhausted at 6:30 PM dinner? <strong>p. 27</strong> · Need 2 AM cribside stretch poster? <strong>p. 34</strong>
      </div>
      <div class="grid-2" style="gap:9px; margin-top:4px;">${tocCols}</div>
      <div class="box sage" style="margin-top:9px;">
        <h4>Your First 15 Minutes With This Book (3 Tiny Actions)</h4>
        <div class="grid-3" style="margin-top:5px;">
          <div class="small"><strong>1. Print 3 Sheets Today:</strong> Print pp. 30, 31 &amp; 34 and magnetize p. 31 to your fridge.</div>
          <div class="small"><strong>2. Do 60s Belly Check:</strong> Try p. 8 once on your bedroom rug to know your safe starting baseline.</div>
          <div class="small"><strong>3. Pick Your Stove Menu:</strong> Circle 1 menu region (pp. 21–26) for effortless weeknight groceries.</div>
        </div>
      </div>
    `
    )
  );

  // PAGE 3 — WHY MOM FITNESS FAILS
  pages.push(
    pageWrap(
      3,
      totalPages,
      "Part 1 • Sleep & Stress Physiology",
      `
      <span class="kicker">Part 1 • Mind &amp; Recovery Science</span>
      <h1>Why 20 Calm Minutes Beat 60-Minute Workouts</h1>
      <p class="lead">If a fitness plan worked great before kids and now leaves you wiped out by Wednesday, your willpower didn&apos;t break — your recovery bandwidth changed.</p>
      <div class="grid-2">
        <div class="box">
          <h4>What Broken Sleep Does to Cortisol</h4>
          <p class="small">Waking twice at 1 AM and 4 AM leaves morning cortisol elevated. Adding high-impact burpees and 1,200-calorie starvation tells a sleep-deprived nervous system to conserve energy and crave fast sugar by 3 PM.</p>
        </div>
        <div class="box">
          <h4>Why Calm Strength Restores Energy</h4>
          <p class="small">Controlled living-room resistance (squats, bridges, posture pulls) paired with long slow exhales lowers stress stiffness, pumps blood back out of heavy legs, and boosts mental clarity for the rest of the day.</p>
        </div>
      </div>
      <h3 style="margin-top:10px;">Quick Baseline Mom Audit (Check What Applies Today)</h3>
      <ul class="check-list box">
        <li><span class="chk"></span><strong>Sleep Reality:</strong> I routinely get 4–6 interrupted hours per night and wake stiff around shoulders or lower back.</li>
        <li><span class="chk"></span><strong>Streak Quit Cycle:</strong> When a baby illness or busy week breaks my plan, I feel &ldquo;off track&rdquo; and abandon the whole month.</li>
        <li><span class="chk"></span><strong>Separate Cooking Burnout:</strong> Diets asking me to weigh dry oats and cook chicken separately from family dal-rice collapse in 4 days.</li>
        <li><span class="chk"></span><strong>Thumb/Wrist &amp; Neck Tension:</strong> My thumb base aches lifting baby, or my neck knots scrolling/feeding at 2 AM.</li>
      </ul>
      <div class="grid-2" style="margin-top:9px;">
        <div class="box" style="background:#FFF8F8; border-color:#F3C5C5;">
          <h4 style="color:#9B2C2C;">Old Harsh Bootcamp Rules</h4>
          <ul class="bullet-list">
            <li>Missing 2 days = broken streak failure</li>
            <li>Sweat &amp; soreness = only proof it worked</li>
            <li>Generic crunches ignoring C-sections or leaks</li>
          </ul>
        </div>
        <div class="box sage">
          <h4 style="color:#1E5631;">Fit Mom 20 Recovery Science</h4>
          <ul class="bullet-list">
            <li>Missed days trigger an effortless Speed-3 reset</li>
            <li>Joint ease &amp; afternoon steady energy = true win</li>
            <li>Breath-synced core rebuilds strength from inside</li>
          </ul>
        </div>
      </div>
      <div class="callout sage" style="margin-top:9px; margin-bottom:0;">
        <strong>The Core Fit Mom 20 Promise:</strong> You never &ldquo;restart Monday&rdquo; here. Every day simply picks Speed 1, Speed 2, or Speed 3 based on the energy you actually woke up with.
      </div>
    `
    )
  );

  // PAGE 4 — 3-SPEED DECISION MATRIX
  pages.push(
    pageWrap(
      4,
      totalPages,
      "Part 1 • The 3-Speed Decision Matrix",
      `
      <span class="kicker">Part 1 • Anti-Quitting Architecture</span>
      <h1>The 3-Speed Broken-Sleep Rule</h1>
      <p class="lead">Habit research consistently shows that reducing friction on chaos days protects a 28-day habit far better than white-knuckling a hard plan.</p>
      <div class="grid-3">
        <div class="box" style="background:#FFFDFB;">
          <span class="pill dark">Speed 1 • 20 Mins</span>
          <h3 style="margin-top:7px;">Slept Okay Today</h3>
          <p class="small"><strong>When:</strong> 5+ reasonably continuous hours, calm window.</p>
          <p class="small" style="margin-top:5px;"><strong>Flow:</strong> 3-min warm-up + 12-min gentle strength &amp; core + 5-min deep unwind stretch.</p>
          <p class="small" style="margin-top:5px;"><strong>Goal:</strong> Build legs, glutes, posture &amp; steady metabolic energy.</p>
        </div>
        <div class="box" style="background:#FFF7F0; border-color:#F0C9AD;">
          <span class="pill peach">Speed 2 • 12–15 Mins</span>
          <h3 style="margin-top:7px;">Baby Is Awake</h3>
          <p class="small"><strong>When:</strong> Toddler wants attention or baby won&apos;t stay in crib.</p>
          <p class="small" style="margin-top:5px;"><strong>Flow:</strong> 100% standing &amp; wall moves next to baby&apos;s playmat — zero crying-floor stress.</p>
          <p class="small" style="margin-top:5px;"><strong>Goal:</strong> Stay moving while smiling or talking with baby.</p>
        </div>
        <div class="box" style="background:#EEF5EF; border-color:#B7DEC3;">
          <span class="pill sage">Speed 3 • 5-Min Rescue</span>
          <h3 style="margin-top:7px;">Zero-Sleep Night</h3>
          <p class="small"><strong>When:</strong> Teething, fever, cluster feeds or work deadline.</p>
          <p class="small" style="margin-top:5px;"><strong>Flow:</strong> 5 moves in pajamas near the kettle or sofa. Zero sweat needed.</p>
          <p class="small" style="margin-top:5px;"><strong>Goal:</strong> Protect daily habit identity — still marks DONE ✓</p>
        </div>
      </div>
      <h3 style="margin-top:11px;">Same-Day Matching Cheat Sheet</h3>
      <table>
        <thead><tr><th>How You Feel at 8 AM</th><th>Wrong Instinct</th><th>Smart 3-Speed Pivot</th></tr></thead>
        <tbody>
          <tr><td>Exhausted after 3 wakeups</td><td>&ldquo;Skip today, try harder next Monday.&rdquo;</td><td>Pick <strong>Speed 3 (5-Min Rescue)</strong> after tea/coffee.</td></tr>
          <tr><td>Kids fighting / clutter everywhere</td><td>Wait for 45 clean, quiet minutes.</td><td>Pick <strong>Speed 2</strong> right by the kitchen counter.</td></tr>
          <tr><td>Sore neck &amp; numb lower back</td><td>Do random planks from saved Reels.</td><td>Pick <strong>2 AM Posture &amp; Neck Flow (p. 14)</strong> instead.</td></tr>
          <tr><td>Energized after good sleep</td><td>Go all-out until sore for 4 days.</td><td>Complete calm <strong>Speed 1</strong> &amp; finish with tank half full.</td></tr>
        </tbody>
      </table>
      <div class="callout peach" style="margin-top:10px; margin-bottom:0;">
        <strong>What Makes a &ldquo;A+ Winning Week&rdquo;?</strong> Even just <strong>3 Speed-1 days + 2 Speed-3 rescues + 1 Sunday rest</strong> builds real strength in 4 weeks. Consistency always beats all-or-nothing perfection!
      </div>
    `
    )
  );

  // PAGE 5 — MASTER BREATHING & PISTON
  pages.push(
    pageWrap(
      5,
      totalPages,
      "Part 1 • Core Breathing Piston",
      `
      <span class="kicker">Part 1 • Internal Support Foundation</span>
      <h1>The 4-6 Core Breath (Before Every Lift)</h1>
      <p class="lead">Your diaphragm and pelvic floor work like an elevator piston: as you inhale, both descend softly; as you exhale, your pelvic floor lifts and your deep belly wraps gently inward.</p>
      <div class="grid-2">
        <div class="box sage">
          <h4>Step-by-Step 360° Rib Breathing</h4>
          <ol class="steps-list">
            <li>Place one hand gently across your side ribs and one below your navel.</li>
            <li><strong>4-Second Nose Inhale:</strong> Expand sideways into your bottom hands and feel your pelvic floor relax completely downward (don&apos;t hike shoulders to ears).</li>
            <li><strong>6-Second Calm Exhale:</strong> Purse lips as if softly fogging sunglasses or sipping through a straw; draw pelvic floor gently up &amp; lower belly inward away from waistband.</li>
            <li>Practice 6 breaths before sitting up from bed or lifting a car seat.</li>
          </ol>
        </div>
        <div class="box">
          <h4>3 Breathing Mistakes Moms Make</h4>
          <ul class="bullet-list">
            <li><strong>All-Day &ldquo;Sucking In&rdquo;:</strong> Gripping upper abs stiffly traps chest tension and pushes internal pressure downward onto weakened pelvic tissue.</li>
            <li><strong>Breath Holding While Lifting Toddler:</strong> Holding your breath creates downward bearing-down force — always <em>&ldquo;Exhale on Effort&rdquo;</em> as you lift baby up!</li>
            <li><strong>Squeezing Glutes Instead of Core:</strong> Keep tailbone soft so glutes stay relaxed during calm seated breaths.</li>
          </ul>
        </div>
      </div>
      <div class="box" style="margin-top:9px; background:#FFFDFB;">
        <h4>Practice Without Finding &ldquo;Extra Time&rdquo;: 4 Hidden Daily Anchor Spots</h4>
        <div class="grid-2" style="margin-top:5px;">
          <ul class="bullet-list">
            <li><strong>Kettle Boiling / Coffee Drip:</strong> 5 slow 4-6 breaths leaning calmly on counter.</li>
            <li><strong>Night Feed Settling:</strong> Relax shoulders down 4 inches after burping baby.</li>
          </ul>
          <ul class="bullet-list">
            <li><strong>School Pickup / Traffic Lights:</strong> Soften belly off steering wheel grip &amp; exhale long.</li>
            <li><strong>Toddler Tantrum Buffer:</strong> One 6-sec straw exhale keeps your voice calm &amp; grounded.</li>
          </ul>
        </div>
      </div>
      <div class="callout peach" style="margin-top:9px; margin-bottom:0;">
        <strong>Golden Cue to Tape Above Crib &amp; Kettle:</strong> <em>&ldquo;Inhale to prepare, EXHALE as I stand up, pick up baby, or lift a laundry basket.&rdquo;</em> One simple timing habit protects your midline 20 times every day automatically.
      </div>
    `
    )
  );

  // PAGE 6 — FLOW 1: 5-MIN RESCUE
  pages.push(
    pageWrap(
      6,
      totalPages,
      "Part 1 • Speed 3 Guided Workout",
      `
      <span class="kicker">Guided Workout Card #1 • Pajama-Friendly</span>
      <h1>The 5-Minute Zero-Sleep Nap Rescue</h1>
      <p class="lead">Save this exact 5-move timer for your hardest mornings. No yoga mat, shoes, or sweat required — just 5 intentional minutes that reset circulation and stiff joints.</p>
      <table>
        <thead><tr><th>Step</th><th>Movement</th><th>Duration</th><th>Exact Form &amp; Breath Cue</th></tr></thead>
        <tbody>
          <tr><td>Warmup</td><td><strong>Shoulder Rolls &amp; Chest Opener</strong></td><td>45 sec</td><td>Roll shoulders up, wide back, and drop down away from ears; inhale open chest.</td></tr>
          <tr><td>Move 1</td><td><strong>Slow March in Place</strong></td><td>60 sec</td><td>Soft quiet carpet steps; breathe nose 3 steps / exhale 3 steps (or sit in chair).</td></tr>
          <tr><td>Move 2</td><td><strong>Supported Chair Squats</strong></td><td>55 sec</td><td>Hold dining chair lightly, tap hips gently down toward cushion, exhale stand tall.</td></tr>
          <tr><td>Move 3</td><td><strong>Pelvic Floor Kegel + Release</strong></td><td>60 sec</td><td>Seated or standing: inhale completely relax pelvis; exhale gentle 4-sec upward hug.</td></tr>
          <tr><td>Unwind</td><td><strong>Deep 4-6 Breathing Reset</strong></td><td>60 sec</td><td>Hands on ribs, drop jaw completely loose; 5 slow cycles before coffee or baby duty.</td></tr>
        </tbody>
      </table>
      <div class="grid-2" style="margin-top:10px;">
        <div class="box">
          <h4>Need Even Gentler Swaps Today?</h4>
          <ul class="bullet-list">
            <li><strong>Sore Knees:</strong> Replace Chair Squats with Seated Leg Extensions while nursing.</li>
            <li><strong>Lightheaded / Dizzy:</strong> Keep all 5 moves seated upright against a pillow.</li>
            <li><strong>Sleeping Baby Nearby:</strong> Keep heel taps noiseless in warm socks.</li>
          </ul>
        </div>
        <div class="box sage">
          <h4>5-Min Energy Shift Test (Try Once Today)</h4>
          <p class="small">Before Move 1, rate your stiffness (1–10): <strong>____ / 10</strong></p>
          <p class="small" style="margin-top:4px;">After Unwind, rate it again: <strong>____ / 10</strong></p>
          <p class="small" style="margin-top:5px;">Most moms report a 3-point tension drop without changing clothes once!</p>
        </div>
      </div>
      <div class="callout sage" style="margin-top:10px; margin-bottom:0;">
        <strong>Why Speed 3 Counts 100%:</strong> You circulated lymph in tired ankles, opened cramped nursing shoulders, supported pelvic tone, and practiced nervous-system downshift in 4 minutes 40 seconds. Mark your fridge tracker DONE ✓ without apology!
      </div>
    `
    )
  );

  // PAGE 7 — FLOW 2: BABY AWAKE
  pages.push(
    pageWrap(
      7,
      totalPages,
      "Part 1 • Speed 2 Guided Workout",
      `
      <span class="kicker">Guided Workout Card #2 • Zero Floor Mat</span>
      <h1>12-Min &ldquo;Baby Is Awake&rdquo; Upright Routine</h1>
      <p class="lead">When you lie on a mat while baby is awake, most babies climb your face or fuss immediately. Stay upright beside the playmat or kitchen counter so eye contact stays easy.</p>
      <table>
        <thead><tr><th>Phase</th><th>Move (All Standing / Wall)</th><th>Time</th><th>Baby-Friendly Form &amp; Distraction Note</th></tr></thead>
        <tbody>
          <tr><td>Warmup</td><td><strong>March in Place + Shoulder Rolls</strong></td><td>2 min</td><td>Sing a slow nursery rhyme out loud — keeps breath conversational &amp; light!</td></tr>
          <tr><td>Main 1</td><td><strong>Supported Chair Squats</strong></td><td>2 rounds · 55s</td><td>Hold sturdy sofa or chair back; smile down at baby on tummy-time mat each rep.</td></tr>
          <tr><td>Main 2</td><td><strong>Standing Side Leg Lifts</strong></td><td>2 rounds · 50s</td><td>Hold kitchen counter; keep standing knee soft &amp; torso tall (never lean sideways).</td></tr>
          <tr><td>Main 3</td><td><strong>Wall Push-Ups</strong></td><td>2 rounds · 45s</td><td>Keep baby safe near your calves; exhale firmly pressing chest smoothly back off wall.</td></tr>
          <tr><td>Main 4</td><td><strong>Standing Hip Circles</strong></td><td>45s each way</td><td>Big calm circles relaxing stiff low-back muscles after baby wearing or swaying.</td></tr>
          <tr><td>Cooldown</td><td><strong>Neck Reset + 4-6 Breath</strong></td><td>2 min</td><td>Tuck chin gently, drop ear smoothly toward shoulder without lifting opposite ear.</td></tr>
        </tbody>
      </table>
      <h3 style="margin-top:9px;">Adaptations By Child&apos;s Age</h3>
      <div class="grid-3">
        <div class="box"><h4>0–5 Mo Newborn</h4><p class="small">Set crib/lounger facing your counter; narrate each Wall Push-Up slowly for soothing voice contact.</p></div>
        <div class="box"><h4>6–12 Mo Crawler</h4><p class="small">Hand them 2 measuring cups or wooden spoon at baby-safe floor level while holding dining chair.</p></div>
        <div class="box"><h4>1–4 Yr Toddler</h4><p class="small">Ask them to copy your Knee Marches or Side Leg Lifts! Turns guilt into goofy giggles.</p></div>
      </div>
      <div class="box" style="margin-top:8px;">
        <h4>Safety Note on &ldquo;Baby-Wearing&rdquo; Workouts</h4>
        <p class="small">Front-carrier squats feel cute on Instagram, yet add 5–10 kg downward load on healing pelvic floor and knees. Leave baby happily on a safe playmat beside you during your 12-minute standing flow whenever possible.</p>
      </div>
    `
    )
  );

  // PAGE 8 — DIASTASIS BELLY CHECK
  pages.push(
    pageWrap(
      8,
      totalPages,
      "Part 2 • Diastasis Recti Self-Check",
      `
      <span class="kicker">Part 2 • Postpartum Core Check</span>
      <h1>The 60-Second 2-Finger Belly Check</h1>
      <p class="lead">Pregnancy naturally stretches the linea alba connective tissue down the center of your abs. Before starting planks or crunches, take 60 seconds to feel how your center line generates tension.</p>
      ${SVG_BELLY_CHECK}
      <div class="grid-3">
        <div class="box">
          <h4>0–1.5 Fingers (Firm)</h4>
          <p class="small">Midline resists your fingers like a firm trampoline. Calm standard core progressions are usually comfortable.</p>
        </div>
        <div class="box">
          <h4>2+ Fingers or Soft Sink</h4>
          <p class="small">Stay strictly with Level-1 deep core moves (Heel Slides, Pelvic Tilts, Bridges, Wall Push-Ups) while tissue knits back.</p>
        </div>
        <div class="box">
          <h4>Watch for &ldquo;Doming&rdquo;</h4>
          <p class="small">Even with a narrow gap, if the center ridge peaks upward like a bread loaf, scale that exercise down immediately.</p>
        </div>
      </div>
      <div class="grid-2" style="margin-top:8px;">
        <div class="box sage">
          <h4>Why Tension Matters More Than Zero Gap</h4>
          <p class="small">A gentle 1.5-finger gap that feels bouncy and controlled when you exhale is often stronger and more functional than a tight, breath-held 1-finger gap!</p>
        </div>
        <div class="box">
          <h4>My 4-Week Midline Measurement Log</h4>
          <p class="small">Week 1: Above ____ | At ____ | Below ____ (Feel: □ Soft □ Firm)</p>
          <p class="small" style="margin-top:5px;">Week 4: Above ____ | At ____ | Below ____ (Doming? □ Less □ Gone)</p>
        </div>
      </div>
    `
    )
  );

  // PAGE 9 — C-SECTION & RED FLAGS
  pages.push(
    pageWrap(
      9,
      totalPages,
      "Part 2 • C-Section Recovery & Red Flags",
      `
      <span class="kicker">Part 2 • Surgical Healing &amp; Safety</span>
      <h1>C-Section Recovery Rules &amp; Doctor Red Flags</h1>
      <p class="lead">A Cesarean delivery passes through multiple abdominal layers even when skin stitches look healed outside. Respect internal healing for stronger long-term core flatness.</p>
      <div class="grid-2">
        <div class="box sage">
          <h4>The 3 Golden Daily Scar Rules</h4>
          <ul class="bullet-list">
            <li><strong>1. Always Log-Roll Out of Bed:</strong> Roll completely onto your side first, drape legs off the mattress, and press up with your bottom arm instead of crunching straight up.</li>
            <li><strong>2. &ldquo;Hug-a-Pillow&rdquo; Support:</strong> Press a folded towel or small cushion gently over your incision whenever you cough, sneeze, or laugh during early months.</li>
            <li><strong>3. Gentle Mobility Over Intensity:</strong> Short 5–10 minute walks and ankle circles speed circulation safely without pulling numb scar layers.</li>
          </ul>
        </div>
        <div class="box" style="border-color:#E7A5A5; background:#FFF8F8;">
          <h4 style="color:#9B2C2C;">Pause &amp; See a Doctor / Pelvic PT If You Feel:</h4>
          <ul class="bullet-list">
            <li>A heavy, dragging or bulging pressure downward in the pelvis after walks or standing.</li>
            <li>Sharp tugging, redness, heat, or oozing anywhere along your C-section incision line.</li>
            <li>Noticeable urine leakage during coughs, squats, or light marches.</li>
            <li>Visible midline ridge doming even during gentle Heel Slides.</li>
          </ul>
        </div>
      </div>
      <h3 style="margin-top:10px;">Typical C-Section Gentle Progression Roadmap (Confirm With Your OB-GYN First)</h3>
      <table>
        <thead><tr><th>Phase</th><th>Gentle Focus</th><th>What Wait-List Moves Stay Paused</th></tr></thead>
        <tbody>
          <tr><td>Weeks 1–3</td><td>Log-roll bed transitions, ankle pumps, tiny slow home walks, 4-6 rib breaths</td><td>Carrying heavy buckets/toddlers, straining bowel/core</td></tr>
          <tr><td>Weeks 4–8</td><td>Daily stroller walks (10–15 min), gentle shoulder/neck unwinds, doctor clearance visit</td><td>Sit-ups, twists, brisk jogging, lifting heavy floor items</td></tr>
          <tr><td>Weeks 8–12+</td><td>Cleared Speed 1: Pelvic tilts, Heel slides, Wall push-ups, Supported chair squats</td><td>High-impact jumping &amp; full crunches until zero doming</td></tr>
          <tr><td>Scar Comfort (Once closed)</td><td>Ask pelvic PT/OB when gentle soft skin touch/circular massage around numb scar is safe</td><td>Aggressive pulling over raised or tender tissue</td></tr>
        </tbody>
      </table>
    `
    )
  );

  // PAGE 10 — GREEN VS PAUSE MATRIX
  pages.push(
    pageWrap(
      10,
      totalPages,
      "Part 2 • Safe vs. Pause Swaps",
      `
      <span class="kicker">Part 2 • Joint &amp; Belly Swap Matrix</span>
      <h1>What to Pause Briefly (And What to Do Instead)</h1>
      <p class="lead">Random workout videos rarely warn mothers away from aggressive flexion or pounding impact. Use this direct 1-for-1 substitution table anytime a workout shows a move that feels wrong.</p>
      <table>
        <thead><tr><th>Typical Fitness Video Move</th><th>Why Moms Pause It Briefly</th><th>Fit Mom 20 Safe Replacement</th></tr></thead>
        <tbody>
          <tr><td>Full Sit-Ups / Bicycle Crunches</td><td>Spikes belly pressure &amp; triggers midline coning</td><td><strong>Heel Slides (p. 11) + Pelvic Tilts</strong></td></tr>
          <tr><td>Floor Planks &amp; Mountain Climbers</td><td>Gravity pulls loosened abs downward onto scar</td><td><strong>Wall Push-Ups (p. 12) + Bird Dog Toe-Slides</strong></td></tr>
          <tr><td>Jumping Jacks / Burpees / Box Jumps</td><td>Heavy pelvic floor &amp; knee pounding while sleep deprived</td><td><strong>Low-Impact Step-Out Jacks / Slow Marches</strong></td></tr>
          <tr><td>Deep Walking or Reverse Lunges</td><td>Overloads sensitive knees &amp; postpartum SI pelvic joint</td><td><strong>Supported Chair Squats / Glute Bridges</strong></td></tr>
          <tr><td>Heavy Overhead Russian Twists</td><td>Torques tender linea alba &amp; tight nursing mid-back</td><td><strong>Seated Torso &amp; Chest Openers</strong></td></tr>
          <tr><td>Long Cobra / Extreme Backbends</td><td>Stretches healing abdomen overly tight too early</td><td><strong>Gentle Cat-Cow (All Fours or Seated)</strong></td></tr>
        </tbody>
      </table>
      <div class="grid-2" style="margin-top:9px;">
        <div class="box">
          <h4>Knee-Pain Guardrail</h4>
          <p class="small">Keep heels planted, place a thick folded towel or extra cushion atop chair seats so hips bend only halfway down cleanly.</p>
        </div>
        <div class="box">
          <h4>Lower-Back / SI Joint Guardrail</h4>
          <p class="small">Fold a bath towel under stiff tailbone during bridges and prioritize bilateral moves (both legs down) over awkward deep split-lunges.</p>
        </div>
      </div>
      <div class="callout sage" style="margin-top:9px; margin-bottom:0;">
        <strong>Automatic Filtering in Fit Mom 20:</strong> Selecting <em>C-Section</em>, <em>Diastasis</em>, <em>Knee Pain</em>, <em>Back Pain</em>, or <em>Pelvic Heaviness</em> in your app quiz hides those unsafe rows from your daily schedule automatically!
      </div>
    `
    )
  );

  // PAGE 11 — CORE REFERENCE CARDS
  pages.push(
    pageWrap(
      11,
      totalPages,
      "Part 2 • Core & Pelvic Reference Library",
      `
      <span class="kicker">Part 2 • Illustrated Movement Cards (1 of 2)</span>
      <h1>6 Postpartum-Safe Core, Glute &amp; Pelvic Moves</h1>
      <p class="lead">Read every form cue once calmly, notice the gentle exhale timing, and pick the easier variation whenever your body asks for space.</p>
      ${renderExerciseCardGrid(CORE_CARDS_P1)}
      <div class="callout sage" style="margin-top:9px; margin-bottom:0;">
        <strong>Golden Core Progress Cue:</strong> Quality beats quantity every week. Five slow Heel Slides with zero low-back arching beats 30 rushed crunches for flatter, steadier deep-core tone!
      </div>
    `
    )
  );

  // PAGE 12 — STRENGTH REFERENCE CARDS
  pages.push(
    pageWrap(
      12,
      totalPages,
      "Part 2 • Joint-Safe Strength Library",
      `
      <span class="kicker">Part 2 • Illustrated Movement Cards (2 of 2)</span>
      <h1>6 Living-Room Strength &amp; Mobility Moves</h1>
      <p class="lead">Designed to restore carrying stamina, knee support for picking toys/toddlers off floors, and upper-back confidence with zero bulky weights.</p>
      ${renderExerciseCardGrid(STRENGTH_CARDS_P2)}
      <div class="callout peach" style="margin-top:9px; margin-bottom:0;">
        <strong>Ready for Light Dumbbells or Resistance Bands Later?</strong> Once Week 4 moves feel effortless, hold two 500 ml filled water bottles during squats or loop a gentle fabric band above knees during bridges!
      </div>
    `
    )
  );

  // PAGE 13 — MOMMY THUMB WRIST RELIEF
  pages.push(
    pageWrap(
      13,
      totalPages,
      "Part 3 • 2 AM Mommy Thumb Relief",
      `
      <span class="kicker">Part 3 • Wrist &amp; Tendon Rescue</span>
      <h1>Easing &ldquo;Mommy Thumb&rdquo; (De Quervain&apos;s Relief)</h1>
      <p class="lead">Sharp burning at the thumb side of your wrist happens to thousands of mothers after lifting an ever-heavier baby 20 times a day with thumbs hooked wide outward.</p>
      ${SVG_SCOOP_WRIST}
      <div class="grid-2">
        <div class="box sage">
          <h4>30s Soft Thumb &amp; Tendon Tilt</h4>
          <ol class="steps-list">
            <li>Wrap your fingers <strong>loosely</strong> over your thumb — zero tight squeezing.</li>
            <li>Reach arm smoothly out in front with elbow relaxed.</li>
            <li>Gently tilt pinky side downward just 1–2 cm until a soft forearm stretch appears. Hold 15s calm breathing. Never push into sharp pinching!</li>
          </ol>
        </div>
        <div class="box">
          <h4>Daytime Wrist Habits That Heal Fast</h4>
          <ul class="bullet-list">
            <li><strong>Phone Rescue:</strong> Stop scrolling with one hand using only your sore thumb; prop phone on a table or dictate voice notes.</li>
            <li><strong>Wrist Tendon Glide:</strong> Rest forearm on lap and softly bend/extend open hand 10 times before picking up baby.</li>
            <li>If pain radiates intensely or locks your thumb, ask your doctor about a gentle resting thumb splint overnight.</li>
          </ul>
        </div>
      </div>
      <h3 style="margin-top:9px;">5 Wrist-Saving Household Micro-Swaps</h3>
      <table>
        <thead><tr><th>Daily Pain Trigger</th><th>Instant Wrist-Safe Fix</th></tr></thead>
        <tbody>
          <tr><td>Buttoning tiny baby snaps 10x/day</td><td>Use magnetic / two-way zipper sleepsuits during painful flare weeks.</td></tr>
          <tr><td>Pushing heavy 1-hand stroller curbs</td><td>Lock wrists straight like boxing gloves when popping curb wheels upward.</td></tr>
          <tr><td>Pouring full heavy tea kettle/pan</td><td>Use both palms underneath pot handles — never twist a heavy skillet by 1 thumb.</td></tr>
        </tbody>
      </table>
    `
    )
  );

  // PAGE 14 — NURSING NECK & SWOLLEN LEGS
  pages.push(
    pageWrap(
      14,
      totalPages,
      "Part 3 • Nursing Neck & Leg Unwind",
      `
      <span class="kicker">Part 3 • 2 AM Posture Pocket Guide</span>
      <h1>Feeding Neck, Shoulder Knots &amp; Heavy Legs</h1>
      <p class="lead">Hours spent gazing down during nursing, bottle feeding, or rocking pull your head forward like a heavy bowling ball. One tiny pillow setup solves half that stiffness tonight.</p>
      ${SVG_NURSING_POSTURE}
      <div class="grid-3">
        <div class="box">
          <h4>1. Feeding Shoulder Unwind</h4>
          <p class="small">After setting baby down, inhale shoulders slightly upward, sweep wide backward, and drop them completely heavy away from ears 8 times sighing softly out through your mouth.</p>
        </div>
        <div class="box">
          <h4>2. Ear-to-Shoulder Neck Reset</h4>
          <p class="small">Tuck chin back 1 inch (&ldquo;double-chin posture&rdquo;), tilt right ear gently toward right shoulder while reaching left fingertips quietly toward the carpet for 25s/side.</p>
        </div>
        <div class="box">
          <h4>3. Evening Sofa Ankle Pumps</h4>
          <p class="small">Prop heels up across couch cushions for 3–5 minutes after kids sleep. Pump toes forward/back 15 times and trace slow ankle circles to ease standing swelling.</p>
        </div>
      </div>
      <div class="grid-2" style="margin-top:9px;">
        <div class="box sage">
          <h4>Bonus 30s Doorway Chest Opener (Best After Feed!)</h4>
          <p class="small">Stand in any doorframe with forearms resting lightly at shoulder height on frame edges. Step one foot gently through until front shoulders feel an open, airy relief. Breathe slowly 30s.</p>
        </div>
        <div class="box" style="background:#FFFDFB;">
          <h4>Night-Feed Chair Setup Checklist</h4>
          <ul class="bullet-list">
            <li>Footstool or thick cushion under feet (keeps knees level)</li>
            <li>Firm pillow tucked vertically behind sore mid-back</li>
            <li>Second pillow stacked under elbow holding baby&apos;s head</li>
          </ul>
        </div>
      </div>
    `
    )
  );

  // PAGE 15 — MOM ERGONOMICS
  pages.push(
    pageWrap(
      15,
      totalPages,
      "Part 3 • Everyday Lifting Mechanics",
      `
      <span class="kicker">Part 3 • Pain-Proof Your Home Moves</span>
      <h1>Crib Transfers, Stroller Lifting &amp; Hip-Hike Fix</h1>
      <p class="lead">You don&apos;t only lift dumbbells — you lift a squirming 10 kg toddler out of floor bathtubs and car seats. Tiny angle adjustments save your lower back permanently.</p>
      <table>
        <thead><tr><th>Everyday Mom Move</th><th>What Hurts Your Back &amp; Wrists</th><th>Pain-Free Mechanic to Switch To Today</th></tr></thead>
        <tbody>
          <tr><td>Lifting from Crib / Car Seat</td><td>Straight knees, rounded spine hanging forward over rail</td><td>Walk close until belly touches crib rail, widen stance, hinge hips slightly, <strong>EXHALE</strong> as baby clears top rail.</td></tr>
          <tr><td>Toddler on One Hip</td><td>Locking knee &amp; jutting left hip out → twists low back + neck</td><td>Alternate sides every hallway walk, soften both knees slightly, keep shoulders stacked level over pelvis.</td></tr>
          <tr><td>Carrying Groceries / Stroller</td><td>Holding baby in right arm while snatching heavy bag left</td><td>Hug stroller/bucket tight against center navel height so weight shares evenly down both legs.</td></tr>
          <tr><td>Picking Toys Off Rug</td><td>Diving nose-down with locked stiff hamstrings 30x/day</td><td>Take a soft wide-stance mini-squat or kneel on one cushion, keeping chest open.</td></tr>
        </tbody>
      </table>
      <div class="grid-2" style="margin-top:10px;">
        <div class="box">
          <h4>The Car-Seat &ldquo;Elbow Hook&rdquo; Hack</h4>
          <p class="small">Instead of gripping an infant car-seat handle from the top with your wrist cranked sideways, slide your forearm smoothly through the handle arch so your biceps and shoulder share the carry effortlessly!</p>
        </div>
        <div class="box">
          <h4>Bathtub Kneeling Rescue</h4>
          <p class="small">Fold a thick memory-foam bath mat twice under sore knees and rest chest elbows along the tub rim rather than hovering twisted mid-air during bath time.</p>
        </div>
      </div>
      <div class="callout sage" style="margin-top:9px; margin-bottom:0;">
        <strong>Turn Daily Motherhood Into Hidden Strength:</strong> Every chair stand holding baby cleanly (heels planted, exhale upright) builds the exact glutes and legs you want — zero extra schedule slots needed!
      </div>
    `
    )
  );

  // PAGE 16 — DAYS 1-4 WORKOUT SCHEDULE
  pages.push(
    pageWrap(
      16,
      totalPages,
      "Part 4 • 7-Day Workout Plan (Days 1–4)",
      `
      <span class="kicker">Part 4 • Follow-Along Week 1 Blueprint</span>
      <h1>Your Complete 7-Day Home Flow (Days 1–4)</h1>
      <p class="lead">Follow one balanced theme each day. Busy night? Drop down to Speed 2 (Baby Awake) or Speed 3 (5-Min Rescue on p. 6) and still check your fridge box ✓.</p>
      ${WEEKLY_WORKOUTS.slice(0, 4)
        .map(
          (w) => `
      <div class="box" style="margin-bottom:8px; padding:10px 13px;">
        <div class="ex-head"><strong>${esc(w.day)} — ${esc(w.title)}</strong><span class="pill peach">15–20 min Speed 1</span></div>
        <p class="small" style="margin-top:3px;"><strong>Warmup:</strong> ${esc(w.warmup)} &nbsp;|&nbsp; <strong>Main Flow:</strong> ${esc(w.main)}</p>
        <p class="small" style="margin-top:3px;"><strong>Cooldown:</strong> ${esc(w.cooldown)} &nbsp;•&nbsp; <span style="color:#1E5631;"><strong>Baby-Awake Pivot:</strong> ${esc(w.awakeAlt)}</span></p>
      </div>`
        )
        .join("")}
      <div class="callout sage" style="margin-top:4px; margin-bottom:0;">
        <strong>60-Second Pre-Start Living-Room Setup:</strong> Clear a 5×5 ft rug space, keep a sturdy dining chair within reach, set your filled water bottle on a coaster, and press play barefoot or in grip socks!
      </div>
    `
    )
  );

  // PAGE 17 — DAYS 5-7 + REBOOT RULE
  pages.push(
    pageWrap(
      17,
      totalPages,
      "Part 4 • 7-Day Workout Plan & Reboot Rule",
      `
      <span class="kicker">Part 4 • Finishing Strong &amp; Restarting Gracefully</span>
      <h1>Days 5–7 + The &ldquo;Missed 5 Days&rdquo; Zero-Guilt Reboot</h1>
      ${WEEKLY_WORKOUTS.slice(4)
        .map(
          (w) => `
      <div class="box" style="margin-bottom:8px; padding:10px 13px;">
        <div class="ex-head"><strong>${esc(w.day)} — ${esc(w.title)}</strong><span class="pill ${w.day.includes("Sun") ? "sage" : "peach"}">${w.day.includes("Sun") ? "Active Rest" : "15–20 min Speed 1"}</span></div>
        <p class="small" style="margin-top:3px;"><strong>Warmup:</strong> ${esc(w.warmup)} &nbsp;|&nbsp; <strong>Main Flow:</strong> ${esc(w.main)}</p>
        <p class="small" style="margin-top:3px;"><strong>Cooldown:</strong> ${esc(w.cooldown)} &nbsp;•&nbsp; <span style="color:#1E5631;"><strong>Note:</strong> ${esc(w.awakeAlt)}</span></p>
      </div>`
        )
        .join("")}
      <div class="callout peach" style="margin-top:8px;">
        <strong>The &ldquo;Missed 4 Days Because of Baby Cold / Travel&rdquo; Reboot Rule:</strong>
        <ol class="steps-list" style="margin-top:4px;">
          <li><strong>Never &ldquo;Double Up&rdquo; Tomorrow:</strong> Trying to make up 3 missed days in one exhausting workout triggers soreness and quitting.</li>
          <li><strong>Start With Speed 3 First Day Back:</strong> Do ONLY the 5-Min Rescue (p. 6) on your first morning back to re-awaken momentum gently.</li>
          <li><strong>Resume Wherever the Calendar Sits:</strong> You haven&apos;t lost anything — simply continue from Today!</li>
        </ol>
      </div>
      <div class="box sage" style="margin-top:8px;">
        <h4>The &ldquo;Baby Woke Up 6 Minutes Into My Session&rdquo; Save-Progress Rule</h4>
        <p class="small">Did you finish warmup + 2 main exercises before the monitor lit up? Congratulations — that STILL counts as an active session! Do 3 calming neck rolls later over dinner prep and check your box ✓.</p>
      </div>
    `
    )
  );

  // PAGE 18 — ONE-STOVE KITCHEN & NUTRITION
  pages.push(
    pageWrap(
      18,
      totalPages,
      "Part 5 • One-Stove Kitchen & Nutrition",
      `
      <span class="kicker">Part 5 • Real Home Kitchens</span>
      <h1>The One-Stove Family Pot (Zero Separate Meals)</h1>
      <p class="lead">Moms abandon wellness plans when meals demand separate pots, exotic groceries, or guilt over eating traditional rice, rotis, or idlis with family.</p>
      <div class="grid-2">
        <div class="box sage">
          <h4>The &ldquo;Kid-First Extraction&rdquo; Method</h4>
          <ol class="steps-list">
            <li>Cook one wholesome iron- &amp; protein-rich base (dal, khichdi, sambar, chicken stew, minestrone, or eggs).</li>
            <li>Scoop smooth toddler/kid portions cleanly out BEFORE adding green chilies or sharp tempering.</li>
            <li>Add 1 quick topper to YOUR bowl: cucumber/tomato salad, crisp curry-leaf tadka, lemon squeeze (boosts plant iron!), or 1–2 boiled eggs/paneer cubes.</li>
          </ol>
        </div>
        <div class="box">
          <h4>Simple Mom Plate Formula (No Calorie Apps!)</h4>
          <ul class="bullet-list">
            <li><strong>1/4 Protein Anchor:</strong> Dal/rajma, paneer, curd, eggs, tofu, fish, chicken, or Greek yogurt — stops 3 PM energy crashes.</li>
            <li><strong>1/2 Color &amp; Crunch:</strong> Sabzi, poriyal, cucumber/carrot sticks, spinach, roasted broccoli, or salad.</li>
            <li><strong>1/4 Slow Carb + Good Fat:</strong> 1–2 phulkas, brown/white rice, 2 idlis, oats, or sourdough + 1 tsp ghee/olive oil.</li>
          </ul>
        </div>
      </div>
      <h3 style="margin-top:9px;">Real Walkthrough: Turning One Base Pot Into 3 Happy Family Bowls</h3>
      <div class="grid-3">
        <div class="box"><h4>Base Cooker Pot</h4><p class="small">Simmer plain yellow moong dal + turmeric + grated bottle gourd/carrot in 12 mins.</p></div>
        <div class="box"><h4>Scoop Kid Bowls First</h4><p class="small">Mash softly with 1/2 tsp warm ghee &amp; soft rice — mild, creamy, zero chili tears.</p></div>
        <div class="box sage"><h4>Upgrade Mom&apos;s Bowl</h4><p class="small">Stir fresh palak or add 2 boiled eggs + garlic jeera tadka + 1/2 squeeze fresh lemon!</p></div>
      </div>
      <div class="callout peach" style="margin-top:9px; margin-bottom:0;">
        <strong>Postpartum &amp; Nursing Nutrient Focus:</strong> Prioritize daily <strong>Iron + Vitamin C</strong> (palak, chana, eggs + fresh lemon juice), <strong>Calcium</strong> (curd, ragi, sesame, paneer), and <strong>B12/Protein</strong> so your energy recovers alongside milk supply.
      </div>
    `
    )
  );

  // PAGE 19 — HYDRATION BLUEPRINT
  pages.push(
    pageWrap(
      19,
      totalPages,
      "Part 5 • Hydration Blueprint",
      `
      <span class="kicker">Part 5 • Nursing &amp; Energy Hydration</span>
      <h1>The 1-Bottle-Per-Room Hydration Shortcut</h1>
      <p class="lead">Mild dehydration feels identical to brain fog, headache, and sudden 3 PM sugar hunger. Don&apos;t wait until you feel thirsty — pair every glass with a cue you already do daily.</p>
      <div class="grid-2">
        <div class="box" style="background:#FFFDFB;">
          <h4>Daily Habit-Stack Map</h4>
          <table>
            <thead><tr><th>Daily Trigger</th><th>Glass Target</th></tr></thead>
            <tbody>
              <tr><td>Wake up / Kettle boil</td><td>1 tall warm glass (#1)</td></tr>
              <tr><td>Breakfast + Morning feed</td><td>2 glasses (#2–#3)</td></tr>
              <tr><td>Mid-morning / Stroller walk</td><td>1–2 glasses (#4–#5)</td></tr>
              <tr><td>Before &amp; After Lunch</td><td>2 glasses (#6–#7)</td></tr>
              <tr><td>3 PM Chaas / Tea Reset</td><td>1–2 glasses (#8–#9)</td></tr>
              <tr><td>Dinner + Bedside bottle</td><td>1–2 glasses (#10–#11)</td></tr>
            </tbody>
          </table>
        </div>
        <div class="box sage">
          <h4>Nursing vs. Non-Nursing Goals</h4>
          <p class="small"><strong>Nursing Moms:</strong> Aim smoothly for <strong>10–11 glasses (2.5–3 L)</strong> across the day; keep a straw tumbler right next to your favorite nursing pillow.</p>
          <p class="small" style="margin-top:5px;"><strong>Non-Nursing Moms:</strong> Target <strong>8 glasses (2 L)</strong> consistently.</p>
          <h4 style="margin-top:8px;">Zero-Sugar Hydration Boosters</h4>
          <ul class="bullet-list">
            <li>Spiced buttermilk (<em>neer mor / chaas</em>) with roasted jeera &amp; curry leaves</li>
            <li>Fresh tender coconut water (natural potassium boost)</li>
            <li>Warm jeera-ajwain-fennel (<em>saunf</em>) digestive water</li>
            <li>Nimbu pani with pinch rock salt &amp; mint (skip refined sugar)</li>
          </ul>
        </div>
      </div>
      <div class="grid-2" style="margin-top:9px;">
        <div class="box">
          <h4>Thirst Disguised as Hunger Check</h4>
          <p class="small">Darker afternoon urine, dry lips while feeding, or sudden cookie cravings at 3 PM often fade 15 minutes after 1 full glass of chaas or cool lemon water.</p>
        </div>
        <div class="box">
          <h4>Chai &amp; Coffee Timing Without Jitters</h4>
          <p class="small">Pair your morning cup AFTER eating 10g protein (egg/chilla/nuts/curd) and chase every coffee cup with equal plain water so afternoon crashes disappear.</p>
        </div>
      </div>
    `
    )
  );

  // PAGE 20 — 15-MIN SUNDAY PREP
  pages.push(
    pageWrap(
      20,
      totalPages,
      "Part 5 • 15-Minute Sunday Prep",
      `
      <span class="kicker">Part 5 • Zero-Burnout Kitchen Prep</span>
      <h1>The 15-Minute Sunday Prep (4 Micro-Tasks Only)</h1>
      <p class="lead">Forget exhausting 3-hour Sunday meal-prep marathons packing 21 identical plastic boxes. Do these four quick 4-minute tasks while tea boils — your whole week runs 50% smoother.</p>
      <div class="grid-2">
        <div class="box">
          <h4>Task 1 (4 Mins): One Double Pot of Protein</h4>
          <p class="small">Pressure-cook one double batch of plain toor/moong dal, chickpeas, black beans, or shred 400g gently spiced chicken breast. Half stays for Monday–Tuesday dinner; freeze half for Thursday emergencies.</p>
        </div>
        <div class="box">
          <h4>Task 2 (4 Mins): Chop &amp; Box Two Hard Veggies</h4>
          <p class="small">Wash cucumber, carrots, and bell peppers once; box chopped onions/tomatoes in an airtight glass jar so weekday egg bhurji, upma, and omelettes cook in half the time.</p>
        </div>
        <div class="box">
          <h4>Task 3 (3 Mins): Boil 6 Eggs + Jar 1 Snack</h4>
          <p class="small">Boil 6 eggs cleanly in a shell (peel-ready protein for 3 days!). Dry-roast 2 cups makhana or roasted chana into one grab-and-go counter jar away from toddler spills.</p>
        </div>
        <div class="box">
          <h4>Task 4 (4 Mins): Stock One Fermented / Oat Base</h4>
          <p class="small">Refill fresh idli/dosa batter, make 2 berry chia overnight oat jars, or knead whole-wheat atta for 2 days. Morning chaos becomes grab-and-pour!</p>
        </div>
      </div>
      <div class="box" style="margin-top:9px; background:#FFFDFB;">
        <h4>The &ldquo;5 Magic Counter/Fridge Jars&rdquo; That Save Weak Nights</h4>
        <div class="grid-3" style="margin-top:5px;">
          <div class="small"><strong>1. Green Mint-Coriander Chutney:</strong> Turns boring leftover roti/eggs/toast into instant fresh wraps.</div>
          <div class="small"><strong>2. Dry-Roasted Trail Mix Jar:</strong> Almonds, pumpkin seeds &amp; roasted chana at arm&apos;s reach by nursery chair.</div>
          <div class="small"><strong>3. Pre-Grated Carrot/Beet Box:</strong> Toss 1 handful into curd rice, dosa batter, soups, or kids&apos; pasta in 3 secs!</div>
        </div>
      </div>
      <div class="callout sage" style="margin-top:9px; margin-bottom:0;">
        <strong>Emergency Freezer Bank Rule:</strong> Whenever you cook rajma, chole, sambar, or lentil soup cleanly on a calmer evening, ladle 2 extra mugs into freezer zip bags flat. Next sick-baby week = 5-minute dinner!
      </div>
    `
    )
  );

  // PAGE 21 — NORTH INDIAN 7-DAY MENU
  pages.push(
    pageWrap(
      21,
      totalPages,
      "Part 6 • North Indian 7-Day Menu",
      renderRegionalPage1(
        REGIONAL_MENUS.north_indian,
        "Always squeeze 1/2 lemon onto palak paneer, rajma, or poha — Vitamin C doubles plant iron absorption.",
        "Mix left-over boiled dal + whole-wheat atta directly into dough to roll soft, high-protein parathas in 6 mins!"
      )
    )
  );

  // PAGE 22 — NORTH INDIAN GROCERIES
  pages.push(
    pageWrap(
      22,
      totalPages,
      "Part 6 • North Indian Grocery List",
      renderRegionalGroceries(
        "North Indian 7-Day Categorized Shopping List",
        "Check your pantry first — most staples are already sitting in your masala dabba & grain shelf!",
        REGIONAL_MENUS.north_indian.groceries,
        "Pressure-cook double moong dal / rajma once → serve warm chawal Monday + roll leftover rajma into a whole-wheat wrap with curd on Wednesday. Keep dry-roasted makhana with mild rock salt in a visible jar by the microwave.",
        "Out of paneer or fresh greens on Friday? Whisk besan + chopped onion + turmeric into 4-min chillas paired with spiced curd, or toss boiled eggs straight over dal tadka!"
      )
    )
  );

  // PAGE 23 — SOUTH INDIAN 7-DAY MENU
  pages.push(
    pageWrap(
      23,
      totalPages,
      "Part 6 • South Indian 7-Day Menu",
      renderRegionalPage1(
        REGIONAL_MENUS.south_indian,
        "Ragi dosa + sambar + curry leaves deliver natural plant calcium & iron — pair curd rice at a separate meal from high-iron greens.",
        "Keep pre-washed coriander & grated carrot ready to whip cooling, gut-friendly Curd Rice in under 4 minutes!"
      )
    )
  );

  // PAGE 24 — SOUTH INDIAN GROCERIES
  pages.push(
    pageWrap(
      24,
      totalPages,
      "Part 6 • South Indian Grocery List",
      renderRegionalGroceries(
        "South Indian 7-Day Categorized Shopping List",
        "Lightweight probiotic & millet staples built around fermented batters, sambar, curd rice, and easy fish/egg options.",
        REGIONAL_MENUS.south_indian.groceries,
        "Pre-boil 1 cup toor dal with turmeric twice weekly so veggie sambar takes only 8 minutes on weekday mornings. Grate extra carrot right into cool curd rice for sweet crunch toddlers love!",
        "Leftover plain idlis getting dry? Crumble idlis coarsely and sauté 3 minutes with mustard seeds, curry leaves, turmeric & peanuts for instant 5-minute Idli Upma!"
      )
    )
  );

  // PAGE 25 — ALL-INDIA HOME MIX
  pages.push(
    pageWrap(
      25,
      totalPages,
      "Part 6 • All-India Home Mix Menu",
      renderRegionalPage1(
        REGIONAL_MENUS.all_india,
        "Pair morning poha or sprouts with fresh lemon juice & enjoy buttermilk (chaas) with roasted cumin after heavy lunches for calm digestion.",
        "Leftover rajma, dal, or sabzi makes an effortless toasted whole-wheat kathi-style lunch wrap in 5 minutes flat!"
      )
    )
  );

  // PAGE 26 — US / UK / GLOBAL 7-DAY MENU
  pages.push(
    pageWrap(
      26,
      totalPages,
      "Part 6 • US / UK / Global Menu",
      renderRegionalPage1(
        REGIONAL_MENUS.western_global,
        "Top spinach salads or lentil soup with squeezed lemon/bell peppers and pair whole-grain toast with avocado or eggs for steady blood sugar.",
        "Keep pre-washed salad greens + rotisserie chicken or canned chickpeas stocked to assemble zero-stove power bowls in 4 mins!"
      )
    )
  );

  // PAGE 27 — GLOBAL GROCERY + 10-MIN EMERGENCY DINNERS
  pages.push(
    pageWrap(
      27,
      totalPages,
      "Part 6 • Global Grocery & Emergency Meals",
      `
      <span class="kicker">Part 6 • Global Basket &amp; Cross-Region Saves</span>
      <h1>Global Shopping List + 10-Min Emergency Dinners</h1>
      <div class="grid-3">${REGIONAL_MENUS.western_global.groceries
        .map(
          (g) => `<div class="box"><h4>${esc(g.cat)}</h4><ul class="check-list">${g.items
            .map((it) => `<li><span class="chk"></span>${esc(it)}</li>`)
            .join("")}</ul></div>`
        )
        .join("")}</div>
      <h3 style="margin-top:8px;">Cross-Region 10-Minute Emergency Dinner Matrix (When Everyone Is Crying at 7 PM)</h3>
      <table class="tight-table">
        <thead><tr><th>Emergency Meal</th><th>Region</th><th>Time</th><th>Zero-Stress Mom Tip</th></tr></thead>
        <tbody>${EMERGENCY_DINNERS.map(
          (e) => `<tr><td><strong>${esc(e.meal)}</strong></td><td>${esc(e.region)}</td><td>${esc(e.time)}</td><td>${esc(e.tip)}</td></tr>`
        ).join("")}</tbody>
      </table>
      <div class="callout sage" style="margin-top:8px; margin-bottom:0;">
        <strong>Keep This 6-Item &ldquo;Never-Order-Junk&rdquo; Pantry Shield Always Stocked:</strong> Rolled oats · Yellow moong dal · Eggs (or Greek yogurt) · Whole-grain wraps/atta · Frozen peas/spinach · Peanut butter or roasted chana!
      </div>
    `
    )
  );

  // PAGE 28 — EVENING DOWNSHIFT & SLEEP PROTOCOL
  pages.push(
    pageWrap(
      28,
      totalPages,
      "Part 7 • Evening Downshift & Better Sleep",
      `
      <span class="kicker">Part 7 • Recovery Between Night Feeds</span>
      <h1>The 6-Minute Bedtime Nervous-System Downshift</h1>
      <p class="lead">You can&apos;t control when baby wakes — but you CAN control whether your body drops into deep restorative sleep within 10 minutes instead of doom-scrolling &ldquo;tired-but-wired&rdquo; until midnight.</p>
      <div class="grid-2">
        <div class="box sage">
          <h4>6-Minute Floor/Bedside Wind-Down Sequence</h4>
          <ol class="steps-list">
            <li><strong>2 Min Legs-Up Couch / Wall Prop:</strong> Rest calves on sofa cushion or bed pillows to drain heavy ankle swelling and signal lower heart rate.</li>
            <li><strong>1 Min Wide-Knee Child&apos;s Pose Over Pillow:</strong> Rest forehead calmly onto a bed pillow, breathing wide into your sore lower back.</li>
            <li><strong>1 Min Gentle Neck Melt &amp; Jaw Unclench:</strong> Drop tongue off the roof of your mouth and let teeth part slightly.</li>
            <li><strong>2 Min Ten 4-6 Calming Breaths:</strong> Count 4s soft nose inhale → 6s slow sighing exhale before eyes shut.</li>
          </ol>
        </div>
        <div class="box">
          <h4>3 Sleep Protectors for Broken-Night Moms</h4>
          <ul class="bullet-list">
            <li><strong>Swap Doom-Scrolling for Dim Screen / Audio:</strong> Blue light after 10 PM delays melatonin for hours even when eyelids ache.</li>
            <li><strong>2-Minute &ldquo;Closing Kitchen Reset&rdquo;:</strong> Fill tomorrow&apos;s water tumbler + lay out walking shoes so morning decisions drop to zero.</li>
            <li><strong>Magnesium-Rich Bedtime Sip:</strong> Warm milk/almond milk with pinch nutmeg or soaked pumpkin seeds gently settles restless calves.</li>
          </ul>
        </div>
      </div>
      <div class="box" style="margin-top:9px; background:#FFFDFB;">
        <h4>What To Do When Baby Falls Back Asleep at 2:30 AM (But Your Brain Races)</h4>
        <div class="grid-3" style="margin-top:5px;">
          <div class="small"><strong>Zero Clock-Checking Rule:</strong> Never calculate &ldquo;If I sleep now I get 3.5 hrs.&rdquo; Turn phone face down permanently.</div>
          <div class="small"><strong>Progressive Shoulder Drop:</strong> Squeeze fists gently 3 secs then melt arms heavy into mattress + sigh long exhale.</div>
          <div class="small"><strong>Warm Foot Rescue:</strong> Cold feet block sleep onset — slip soft cotton socks on so body drops off 2x faster.</div>
        </div>
      </div>
      <div class="callout peach" style="margin-top:9px; margin-bottom:0;">
        <strong>Remember Tonight:</strong> Lying calmly in a dark room with slow 4-6 nasal breathing still restores your nervous system far better than tense worrying about lost sleep hours.
      </div>
    `
    )
  );

  // PAGE 29 — STOPPING 3 PM CRAVINGS
  pages.push(
    pageWrap(
      29,
      totalPages,
      "Part 7 • Cravings & Guilt Cycles",
      `
      <span class="kicker">Part 7 • Craving Biology, Not Lack of Willpower</span>
      <h1>Stopping the 3 PM Sugar Crash (The &ldquo;Add, Don&apos;t Punish&rdquo; Rule)</h1>
      <p class="lead">Craving biscuits, rusks, chocolates, or fried snacks at 3–4 PM isn&apos;t weakness — it&apos;s your exhausted brain crying for quick fuel after a low-protein morning or skipped water.</p>
      <table>
        <thead><tr><th>Common Afternoon Craving</th><th>Real Biological Trigger</th><th>&ldquo;Add, Don&apos;t Punish&rdquo; Satisfying Upgrade</th></tr></thead>
        <tbody>${CRAVING_SWAPS.map(
          (c) => `<tr><td><strong>${esc(c.craving)}</strong></td><td>${esc(c.why)}</td><td>${esc(c.swap)}</td></tr>`
        ).join("")}</tbody>
      </table>
      <h3 style="margin-top:10px;">6 One-Handed &ldquo;Protein + Fiber&rdquo; Combos (Takes Under 90 Seconds)</h3>
      <div class="grid-3">
        <div class="box"><h4>1. Crisp + Creamy</h4><p class="small">1 sliced apple + 1 tbsp peanut or almond butter + pinch cinnamon.</p></div>
        <div class="box"><h4>2. Savory Indian Crunch</h4><p class="small">Handful roasted chana + spiced buttermilk (<em>chaas</em>) in tall steel glass.</p></div>
        <div class="box"><h4>3. Warm Sweet Comfort</h4><p class="small">Greek yogurt or thick curd + berries/pomegranate + 4 crushed walnuts.</p></div>
        <div class="box"><h4>4. 30-Sec Boiled Power</h4><p class="small">2 chilled pre-boiled eggs dusted with black pepper + rock salt.</p></div>
        <div class="box"><h4>5. Light Crunchy Bowl</h4><p class="small">1 cup ghee-roasted makhana tossed gently with turmeric &amp; chaat masala.</p></div>
        <div class="box"><h4>6. Salty Toddler Share</h4><p class="small">Cucumber &amp; carrot batons dipped into classic hummus or cheese cubes.</p></div>
      </div>
      <div class="callout peach" style="margin-top:9px; margin-bottom:0;">
        <strong>The 10-Second Rule Before Grabbing Kids&apos; Leftovers:</strong> Ask kindly, <em>&ldquo;Am I hungry, dehydrated, or just deeply overstimulated?&rdquo;</em> Drink 1 glass water, sit comfortably for 4 breaths, then eat a real plate of food cleanly — never feel bad about nourishing yourself!
      </div>
    `
    )
  );

  // PAGE 30 — WORKBOOK 1: WEEKLY MENU & GROCERY PLANNER TEMPLATE
  pages.push(
    pageWrap(
      30,
      totalPages,
      "Part 8 • Printable Meal & Grocery Sheet",
      `
      <span class="kicker">Part 8 • Printable Fridge Sheet #1</span>
      <h1>Fill-In Weekly Family Menu &amp; 1×–4× Market Planner</h1>
      <p class="lead">Print multiple copies! Pick 2–3 easy rotating breakfasts and 1–2 repeating batch dinners so weekday grocery lists take under 3 minutes.</p>
      <table class="tight-table">
        <thead><tr><th style="width:11%">Day</th><th style="width:23%">Breakfast</th><th style="width:24%">Lunch (One Pot)</th><th style="width:24%">Dinner</th><th style="width:18%">3 PM Snack</th></tr></thead>
        <tbody>${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
          .map(
            (d) => `<tr style="height:31px;"><td><strong>${d}</strong></td><td></td><td></td><td></td><td></td></tr>`
          )
          .join("")}</tbody>
      </table>
      <div class="grid-3" style="margin-top:9px;">
        <div class="box"><h4>Produce to Buy</h4><div class="lines"></div><div class="lines"></div><div class="lines"></div><div class="lines"></div><div class="lines"></div></div>
        <div class="box"><h4>Grains, Dal &amp; Snacks</h4><div class="lines"></div><div class="lines"></div><div class="lines"></div><div class="lines"></div><div class="lines"></div></div>
        <div class="box"><h4>Curd, Eggs &amp; Protein</h4><div class="lines"></div><div class="lines"></div><div class="lines"></div><div class="lines"></div><div class="lines"></div></div>
      </div>
      <div class="callout sage" style="margin-top:9px; margin-bottom:0;">
        <strong>3-Min Sunday Pantry Check:</strong> Check oil/ghee, spices, curd &amp; egg counts before ordering! Scaling for a household of 4? Simply write <strong>(×2)</strong> beside produce + grains above.
      </div>
    `
    )
  );

  // PAGE 31 — WORKBOOK 2: WEEK 1 ZERO-GUILT FRIDGE TRACKER
  pages.push(
    pageWrap(
      31,
      totalPages,
      "Part 8 • Week 1 Printable Fridge Tracker",
      `
      <span class="kicker">Part 8 • Printable Fridge Sheet #2</span>
      <h1>Week 1 Zero-Guilt Fridge Tracker (Even 5 Mins ✓)</h1>
      <p class="lead">Circle the mode you did each day — Speed 1 (20m), Speed 2 (Awake), Speed 3 (5m Rescue), or Rest — fill water droplets, and jot one tiny daily win.</p>
      <table>
        <thead>
          <tr><th style="width:9%">Day</th><th style="width:32%">Today&apos;s Mode Completed</th><th style="width:24%">Water Glasses (Goal 8–11)</th><th style="width:15%">2 AM Wrist/Neck Care</th><th style="width:20%">One Small Win</th></tr>
        </thead>
        <tbody>${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
          .map(
            (d) => `
          <tr style="height:48px;">
            <td><strong>${d}</strong></td>
            <td class="small">□ 20m &nbsp; □ Awake &nbsp; □ 5m &nbsp; □ Rest</td>
            <td style="letter-spacing:2px; color:#8A6F7B;">○○○○ ○○○○ ○○○</td>
            <td class="small">□ Stretched &amp; Breath</td>
            <td></td>
          </tr>`
          )
          .join("")}</tbody>
      </table>
      <div class="box" style="margin-top:10px;">
        <h4>End-of-Week Reflection (Zero Judgment — Celebrate What Actually Felt Good!):</h4>
        <p class="small">What helped most on my hardest day this week? ____________________________________________________________________</p>
        <p class="small" style="margin-top:6px;">What 1 small support will make Week 2 easier? ____________________________________________________________________</p>
      </div>
      <div class="callout sage" style="margin-top:9px; margin-bottom:0;">
        <strong>Week 1 Rule:</strong> Showing up 4+ days in <em>any</em> mode means Week 1 was a massive victory. Celebrate consistency — intensity can wait!
      </div>
    `
    )
  );

  // PAGE 32 — WORKBOOK 3: WEEKS 2-4 CONTINUITY MOSAIC
  pages.push(
    pageWrap(
      32,
      totalPages,
      "Part 8 • 28-Day Habit Mosaic & Non-Scale Wins",
      `
      <span class="kicker">Part 8 • Printable Fridge Sheet #3</span>
      <h1>Weeks 2–4 Habit Continuity &amp; Non-Scale Wins</h1>
      <p class="lead">Color or checkmark any circle after completing 5–20 minutes of movement, stretching, or mindful recovery across Days 8–28.</p>
      <div class="grid-3">
        ${[
          { wk: "Week 2 • Steady Posture", days: [8, 9, 10, 11, 12, 13, 14] },
          { wk: "Week 3 • Core & Pelvic Ease", days: [15, 16, 17, 18, 19, 20, 21] },
          { wk: "Week 4 • Confident Flow", days: [22, 23, 24, 25, 26, 27, 28] },
        ]
          .map(
            (w) => `
        <div class="box">
          <h4>${esc(w.wk)}</h4>
          <ul class="check-list">
            ${w.days
              .map(
                (n) => `<li><span class="chk"></span><strong>Day ${n}:</strong> □ Done / □ Rest</li>`
              )
              .join("")}
          </ul>
        </div>`
          )
          .join("")}
      </div>
      <div class="box sage" style="margin-top:10px;">
        <h4>Non-Scale Victory Checklist (Check As You Notice Real-Life Changes!)</h4>
        <div class="grid-2" style="margin-top:6px;">
          <ul class="check-list">
            <li><span class="chk"></span>Woke up with less neck &amp; upper-back tightness</li>
            <li><span class="chk"></span>Scooped baby cleanly with softer wrists</li>
            <li><span class="chk"></span>Carried stroller/groceries upstairs without panting</li>
          </ul>
          <ul class="check-list">
            <li><span class="chk"></span>Ate calm protein before 3 PM biscuit crash hit</li>
            <li><span class="chk"></span>Used 5-Min Rescue instead of quitting on hard weeks</li>
            <li><span class="chk"></span>Felt calmer breath when kids melted down</li>
          </ul>
        </div>
      </div>
      <div class="box" style="margin-top:9px;">
        <h4>28-Day Milestone Notes &amp; Clothes/Energy Shift (Optional):</h4>
        <div class="lines"></div><div class="lines"></div>
      </div>
    `
    )
  );

  // PAGE 33 — REFLECTION & ENERGY JOURNAL
  pages.push(
    pageWrap(
      33,
      totalPages,
      "Part 8 • Day 1 vs. Day 28 Progress Journal",
      `
      <span class="kicker">Part 8 • Printable Journal Page #4</span>
      <h1>Personal Strength, Comfort &amp; Energy Check-In</h1>
      <p class="lead">Track what actually improves your quality of motherhood over the next 4 weeks — energy, grip, comfort, digestion, and mood rather than harsh daily scale pressure.</p>
      <table>
        <thead><tr><th style="width:38%">How My Body Feels (1 = Tough · 10 = Great)</th><th style="width:20%">Day 1 Score</th><th style="width:20%">Day 14 Score</th><th style="width:22%">Day 28 Score</th></tr></thead>
        <tbody>
          ${[
            "Morning Energy After Broken Sleep",
            "Thumb / Wrist Comfort Picking Up Baby",
            "Mid-Back & Nursing Neck Ease",
            "Lower Belly Strength & Confidence",
            "3 PM Steady Mood (Less Sugar Crashes)",
            "Pelvic Comfort on Walks & Stairs",
          ]
            .map((m) => `<tr style="height:38px;"><td><strong>${esc(m)}</strong></td><td>_____ / 10</td><td>_____ / 10</td><td>_____ / 10</td></tr>`)
            .join("")}
        </tbody>
      </table>
      <div class="box" style="margin-top:10px;">
        <h4>Favorite One-Stove Family Meals I Want to Repeat Next Month:</h4>
        <div class="lines"></div><div class="lines"></div><div class="lines"></div>
        <h4 style="margin-top:8px;">One Gentle Self-Care Promise I Keep Going Into Month 2:</h4>
        <div class="lines"></div><div class="lines"></div>
      </div>
      <div class="callout peach" style="margin-top:9px; margin-bottom:0;">
        <strong>Celebrate Day 28 Reward Idea:</strong> Pick a non-food celebration right now (solo long hot shower, quiet chai on the balcony, fresh book, or comfortable new loungewear)!
      </div>
    `
    )
  );

  // PAGE 34 — TEAR-OUT 2 AM CRIBSIDE RESCUE POSTER
  pages.push(
    pageWrap(
      34,
      totalPages,
      "Part 8 • Tear-Out 2 AM Relief Poster",
      `
      <div class="poster-wrap">
        <span class="pill dark">TEAR OUT &amp; TAPE BY CRIB OR NURSING CHAIR</span>
        <h1 style="font-size:25px; margin-top:10px;">2 AM 2-Minute Pain Reset Poster</h1>
        <p class="lead" style="font-size:11.5px; margin-bottom:12px;">Done feeding? Don&apos;t go straight back to hunching. Take 90 calm seconds right where you sit:</p>
        <div class="grid-2" style="gap:12px;">
          <div class="box" style="background:#FFFDFB; padding:13px;">
            <span class="pill peach">1 · WRIST LIFT</span>
            <h3 style="margin-top:7px; font-size:14px;">Forearm Scoop Check</h3>
            <p class="small" style="font-size:11px; margin-top:5px;">Keep thumb tucked neatly beside fingers (never hooked out at 90°). Scoop under baby&apos;s back and bottom with straight wrists.</p>
          </div>
          <div class="box" style="background:#FFFDFB; padding:13px;">
            <span class="pill peach">2 · 30s TENDON TILT</span>
            <h3 style="margin-top:7px; font-size:14px;">Soft Thumb Release</h3>
            <p class="small" style="font-size:11px; margin-top:5px;">Curl fingers gently over thumb, reach hand forward, tilt pinky slightly down until soft forearm stretch — never sharp pain.</p>
          </div>
          <div class="box sage" style="padding:13px;">
            <span class="pill sage">3 · 45s CHEST UNWIND</span>
            <h3 style="margin-top:7px; font-size:14px;">Shoulder Drop Loop</h3>
            <p class="small" style="font-size:11px; margin-top:5px;">Sweep both shoulders up, wide back behind you, and drop heavy down away from ears 8 times while sighing gently out.</p>
          </div>
          <div class="box sage" style="padding:13px;">
            <span class="pill sage">4 · 4-6 BREATH</span>
            <h3 style="margin-top:7px; font-size:14px;">Sleep Signal</h3>
            <p class="small" style="font-size:11px; margin-top:5px;">Softly drop jaw, nose inhale 4s → calm slow exhale 6s four times before lying on your side.</p>
          </div>
        </div>
        <div class="callout peach" style="margin-top:14px; text-align:center; font-size:11px;">
          <strong>Water Check Before Returning to Pillow:</strong> Take 4 large sips from your bedside bottle!
        </div>
      </div>
    `
    )
  );

  // PAGE 35 — TEAR-OUT SAFETY & MOVE CHECK CHEAT SHEET
  pages.push(
    pageWrap(
      35,
      totalPages,
      "Part 8 • Tear-Out Safety Cheat Sheet",
      `
      <div class="poster-wrap">
        <span class="pill sage">TAPE BY YOUR WORKOUT MAT OR KITCHEN FRIDGE</span>
        <h1 style="font-size:25px; margin-top:10px;">4-Question Safety Check Before Any Move</h1>
        <div class="box" style="margin-top:10px; padding:15px 17px;">
          <ol class="steps-list" style="font-size:11.5px; line-height:1.6;">
            <li style="margin-bottom:8px;"><strong>Am I Holding My Breath?</strong> If you hold your breath squeezing hard, lower the range and say <em>&ldquo;Exhale on Effort!&rdquo;</em></li>
            <li style="margin-bottom:8px;"><strong>Does My Belly Dome Upward Like a Peak?</strong> Stop crunches or full planks right away and drop down to Wall Push-Ups or Heel Slides.</li>
            <li style="margin-bottom:8px;"><strong>Does My Pelvic Floor Feel Heavy or Leaking?</strong> Pause jumping or deep lunges immediately; prioritize calm seated strength &amp; Kegels with full relaxation.</li>
            <li><strong>Am I Squeezing Sharp Incision or Knee Pinch?</strong> Never &ldquo;push through sharp pinching.&rdquo; Use a cushion behind your chair squat or swap cleanly.</li>
          </ol>
        </div>
        <div class="grid-3" style="margin-top:12px;">
          <div class="box" style="padding:12px;"><h4>C-Section Lift Rule</h4><p class="small" style="font-size:10.5px;">Log-roll side first off any floor mat; press up using hands calmly.</p></div>
          <div class="box" style="padding:12px;"><h4>Minimum Effective Win</h4><p class="small" style="font-size:10.5px;">Five calm pajama minutes beat skipping 20 minutes cleanly.</p></div>
          <div class="box" style="padding:12px;"><h4>Doctor Reminder</h4><p class="small" style="font-size:10.5px;">Confirm physician/OB clearance before new routines postpartum.</p></div>
        </div>
        <div class="callout sage" style="margin-top:12px; text-align:center; font-size:11px; margin-bottom:0;">
          <strong>Daily Permission Slip:</strong> Listening to a tired body today IS discipline — it keeps you showing up for years, not days.
        </div>
      </div>
    `
    )
  );

  // PAGE 36 — NEXT STEP + APP UPGRADE LETTER
  pages.push(
    pageWrap(
      36,
      totalPages,
      "Your Next Step With Fit Mom 20",
      `
      <span class="kicker">Closing Encouragement &amp; Next Step</span>
      <h1>You Don&apos;t Need Perfect Weeks — Just Gentle Next Moves</h1>
      <div class="box" style="padding:13px 15px; background:#FFFDFB;">
        <p class="small" style="font-size:10.8px; line-height:1.55;">Dear Mama,</p>
        <p class="small" style="font-size:10.8px; line-height:1.55; margin-top:5px;">Most fitness guides were built around empty calendars, uninterrupted sleep, and kitchens cooking only for one person. If those plans made you feel behind, please hear this clearly: <strong>you didn&apos;t fail the plan — the plan failed to fit motherhood.</strong></p>
        <p class="small" style="font-size:10.8px; line-height:1.55; margin-top:5px;">Start with just 7 days of this handbook. Print Page 31, stick Page 34 beside your crib, drink your extra glass of water, and celebrate every 5-minute rescue day just as loudly as your 20-minute strength days.</p>
      </div>
      <div class="grid-2" style="margin-top:9px;">
        <div class="box"><h4>Week 1–2 Inside Fit Mom 20</h4><p class="small"><strong>Foundation &amp; Posture:</strong> Gentle breath-synced foundation, shoulder-neck unwind, and safe joint warmup.</p></div>
        <div class="box"><h4>Week 3–4 Inside Fit Mom 20</h4><p class="small"><strong>Core &amp; Confident Flow:</strong> Pelvic floor stability, family meal rhythm, and steady daytime endurance.</p></div>
      </div>
      <div class="callout sage" style="margin-top:9px;">
        <h3 style="margin-bottom:4px;">Want All 28 Days Personalized &amp; Guided Step-by-Step?</h3>
        <p class="small">Inside the interactive <strong>Fit Mom 20</strong> membership (~₹17/day, 1-tap cancel, 7-day guarantee), every tool in this 36-page manual runs automatically for you:</p>
        <ul class="bullet-list" style="margin-top:4px;">
          <li><strong>Auto-Filtered 28-Day Workout Calendar:</strong> Filters C-section, diastasis, knee, back &amp; pelvic moves automatically from your 2-min quiz + includes <strong>58 YouTube-guided form demos</strong>.</li>
          <li><strong>1-Tap Mood Modes:</strong> Instant Guided Timers for <em>Baby Awake</em>, <em>2 AM Wrist/Neck Relief</em>, &amp; <em>5-Min Rescue</em>.</li>
          <li><strong>Regional Family Meals + 1×–4× WhatsApp Groceries:</strong> One-tap regional recipes &amp; scaled market lists.</li>
        </ul>
        <p class="small" style="margin-top:6px;"><strong>Open your personalized plan quiz anytime at:</strong> https://fit-mom-28-aj.vercel.app/onboarding</p>
      </div>
      <p class="small" style="margin-top:7px; color:#7A5C6A; text-align:center;">
        © Fit Mom 20 • Educational wellness guide only — not medical advice. Always confirm postpartum exercise clearance with your doctor.
      </p>
    `
    )
  );

  return pages;
}

function buildHtml() {
  const pagesHtml = buildAllPages().join("\n");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>The Exhausted Mom's 7-Day Comeback Handbook — 36-Page Edition</title>
<style>
  @page { size: letter; margin: 0.42in 0.52in; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif;
    color: #4A2538;
    background: #FFFFFF;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page {
    width: 100%;
    height: 9.96in;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    page-break-after: always;
    break-after: page;
    overflow: hidden;
    background: #FFFAF7;
    border: 1px solid #F6E2D5;
    border-radius: 14px;
    padding: 18px 22px;
  }
  .page:last-child { page-break-after: auto; break-after: auto; }
  .page-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1.5px solid #F3D9C7;
    padding-bottom: 6px;
    margin-bottom: 9px;
    font-size: 8.5px;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: #8A6173;
    text-transform: uppercase;
  }
  .page-body { flex: 1; display: flex; flex-direction: column; }
  .page-foot {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #F3D9C7;
    padding-top: 6px;
    margin-top: 8px;
    font-size: 8.5px;
    color: #8A6173;
  }
  .page-num { font-weight: 700; color: #4A2538; }

  /* Cover */
  .cover-page {
    background: linear-gradient(155deg, #FFF5EE 0%, #FFFFFF 52%, #FDF0F2 100%);
    border: 2px solid #EDBFA6;
    padding: 28px 30px;
    text-align: center;
  }
  .cover-top { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 16px; }
  .cover-badge {
    align-self: center;
    background: #4A2538;
    color: #FFFFFF;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    padding: 6px 16px;
    border-radius: 999px;
  }
  .cover-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; color: #8A6173; margin-bottom: 8px; }
  .cover-title { font-family: Georgia, "Times New Roman", serif; font-size: 36px; line-height: 1.12; color: #4A2538; }
  .cover-sub { font-size: 13.5px; line-height: 1.55; color: #6E495B; max-width: 520px; margin: 10px auto 0; }
  .cover-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; text-align: left; margin-top: 4px; }
  .cover-pill { background: #FFFFFF; border: 1.5px solid #F3D5C3; border-radius: 12px; padding: 11px 14px; }
  .cover-pill strong { display: block; font-size: 11.2px; color: #4A2538; margin-bottom: 2px; }
  .cover-pill span { font-size: 10px; color: #734F61; }
  .cover-quote {
    background: #EEF6EF;
    border: 1px solid #BFDDC5;
    border-radius: 12px;
    padding: 11px 16px;
    font-style: italic;
    font-size: 11px;
    line-height: 1.5;
    color: #365946;
  }
  .cover-foot { margin-top: 10px; }
  .disclaimer-mini { background: #FFF8F4; border: 1px solid #F0D0BD; border-radius: 10px; padding: 8px 12px; font-size: 9px; color: #6E495B; line-height: 1.4; }
  .cover-url { font-size: 10px; color: #4A2538; margin-top: 8px; }

  /* Typography */
  .kicker { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #2D6A4F; margin-bottom: 3px; }
  h1 { font-family: Georgia, "Times New Roman", serif; font-size: 20px; line-height: 1.18; color: #4A2538; margin-bottom: 6px; }
  h3 { font-size: 12.2px; color: #4A2538; margin-bottom: 4px; }
  h4 { font-size: 11px; color: #4A2538; margin-bottom: 4px; }
  .lead { font-size: 10.6px; line-height: 1.45; color: #6B4758; margin-bottom: 9px; }
  .small { font-size: 9.8px; line-height: 1.42; color: #5D3C4C; }

  /* Layouts */
  .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9px; }
  .box { background: #FFFFFF; border: 1px solid #F1D8C9; border-radius: 12px; padding: 10px 12px; }
  .box.sage { background: #F3F8F4; border-color: #C4E0CA; }
  .callout { border-radius: 11px; padding: 9px 12px; font-size: 9.8px; line-height: 1.45; color: #4A2538; margin-bottom: 8px; }
  .callout.peach { background: #FFF1E8; border: 1px solid #F2C9AE; }
  .callout.sage { background: #EEF6EF; border: 1px solid #BFDDC5; }

  .pill { display: inline-block; font-size: 8.5px; font-weight: 700; padding: 3px 8px; border-radius: 999px; }
  .pill.dark { background: #4A2538; color: #FFF; }
  .pill.peach { background: #FBE4D5; color: #4A2538; border: 1px solid #EBC2AA; }
  .pill.sage { background: #DCEEE0; color: #1E5631; border: 1px solid #B5D9BE; }

  /* TOC */
  .toc-block { background: #FFFFFF; border: 1px solid #F1D8C9; border-radius: 10px; padding: 8px 10px; }
  .toc-head { display: flex; justify-content: space-between; font-size: 9.8px; color: #4A2538; border-bottom: 1px solid #F7E5DA; padding-bottom: 3px; margin-bottom: 4px; }
  .toc-head span { color: #2D6A4F; font-weight: 700; font-size: 8.8px; }
  .toc-block ul { list-style: none; font-size: 8.8px; line-height: 1.44; color: #644353; }

  /* Lists */
  .bullet-list, .steps-list { padding-left: 15px; font-size: 9.7px; line-height: 1.44; color: #573647; }
  .bullet-list li, .steps-list li { margin-bottom: 4px; }
  .check-list { list-style: none; font-size: 9.5px; line-height: 1.44; color: #573647; }
  .check-list li { display: flex; align-items: flex-start; gap: 6px; margin-bottom: 4px; }
  .chk { width: 10px; height: 10px; border: 1.3px solid #6E495B; border-radius: 2px; display: inline-block; flex-shrink: 0; margin-top: 2px; }

  /* Tables */
  table { width: 100%; border-collapse: collapse; background: #FFFFFF; border: 1px solid #EED4C4; border-radius: 10px; overflow: hidden; }
  th { background: #FBE9DD; color: #4A2538; font-size: 9px; text-transform: uppercase; letter-spacing: 0.04em; text-align: left; padding: 6px 7px; border-bottom: 1.5px solid #E8C5B0; }
  td { font-size: 9.4px; line-height: 1.36; color: #523242; padding: 6px 7px; border-bottom: 1px solid #F7E8DE; vertical-align: top; }
  .tight-table td, .tight-table th { padding: 4.5px 6px; font-size: 8.8px; line-height: 1.32; }

  /* Exercise cards */
  .ex-card { background: #FFFFFF; border: 1px solid #F1D8C9; border-radius: 11px; padding: 10px 12px; }
  .ex-head { display: flex; justify-content: space-between; align-items: center; gap: 6px; margin-bottom: 3px; }
  .ex-name { font-size: 10.8px; font-weight: 700; color: #4A2538; }
  .ex-focus { font-size: 8.5px; font-weight: 700; text-transform: uppercase; color: #2D6A4F; margin-bottom: 5px; }
  .ex-p { font-size: 9.2px; line-height: 1.38; color: #553545; margin-bottom: 3px; }
  .ex-mod { font-size: 8.9px; color: #7C5869; background: #FFF8F4; border-radius: 6px; padding: 4px 7px; margin-top: 4px; }

  /* Blank lines & posters */
  .lines { height: 22px; border-bottom: 1px dashed #D7B4A2; margin-bottom: 4px; }
  .poster-wrap { border: 2px dashed #4A2538; border-radius: 16px; padding: 18px 20px; background: #FFFFFF; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
</style>
</head>
<body>
${pagesHtml}
</body>
</html>`;
}

function main() {
  const browser = findBrowser();
  const userDataDir = path.join(os.tmpdir(), "fit-mom-pdf-profile");
  fs.mkdirSync(userDataDir, { recursive: true });
  fs.writeFileSync(TMP_HTML, buildHtml(), "utf8");

  execFileSync(
    browser,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--no-pdf-header-footer",
      `--user-data-dir=${userDataDir}`,
      `--print-to-pdf=${OUT_PDF}`,
      `file:///${TMP_HTML.replace(/\\/g, "/")}`,
    ],
    { stdio: "inherit" }
  );

  const bytes = fs.readFileSync(OUT_PDF);
  const raw = bytes.toString("latin1");
  const leafPages = (raw.match(/\/Type\s*\/Page\b(?!s)/g) || []).length;
  console.log(`Generated ${OUT_PDF}`);
  console.log(`Size: ${bytes.length.toLocaleString()} bytes | Detected PDF Pages: ${leafPages}`);
  if (leafPages < 30) {
    throw new Error(`Expected >= 30 PDF pages, got ${leafPages}`);
  }
}

main();
