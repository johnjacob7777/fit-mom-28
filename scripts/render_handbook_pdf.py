"""
Renders the complete 36-page flagship Fit Mom 20 eBook PDF using ReportLab + Pillow,
consuming JSON exported from `scripts/handbook-data.mjs` and the 5 real editorial
photographs in `public/images/handbook/`.
"""
import json
import os
import sys
from reportlab.platypus import PageBreak, Paragraph, Spacer
from pdf_ui import (
    INNER_W,
    C_PEACH_BG,
    C_PEACH_BORDER,
    C_SAGE_BG,
    C_SAGE_LIGHT,
    C_SAGE_BORDER,
    C_SAGE_DARK,
    C_RED_BG,
    C_RED_BORDER,
    C_WARM_WHITE,
    C_WHITE,
    C_PLUM,
    C_OUTER_BORDER,
    register_fonts,
    styles,
    esc,
    xml_safe,
    CardBox,
    GridRow,
    RoundedPhoto,
    PhotoSplit,
    PillBadge,
    CheckRow,
    BlankLines,
    WaterTrackerCircles,
    ModeCheckboxes,
    make_table,
    HandbookDoc,
)

PAGE_LABELS = [
    "Cover",                                        # 1
    "Table of Contents & Emergency Quick-Find",     # 2
    "Part 1 • Sleep & Stress Physiology",           # 3
    "Part 1 • The 3-Speed Decision Matrix",         # 4
    "Part 1 • Core Breathing Piston",               # 5
    "Part 1 • Speed 3 Guided Workout",              # 6
    "Part 1 • Speed 2 Guided Workout",              # 7
    "Part 2 • Diastasis Recti Self-Check",          # 8
    "Part 2 • C-Section Recovery & Red Flags",      # 9
    "Part 2 • Safe vs. Pause Swaps",                # 10
    "Part 2 • Core & Pelvic Reference Library",     # 11
    "Part 2 • Joint-Safe Strength Library",         # 12
    "Part 3 • 2 AM Mommy Thumb Relief",             # 13
    "Part 3 • Nursing Neck & Leg Unwind",           # 14
    "Part 3 • Everyday Lifting Mechanics",          # 15
    "Part 4 • 7-Day Workout Plan (Days 1–4)",       # 16
    "Part 4 • 7-Day Workout Plan & Reboot Rule",    # 17
    "Part 5 • One-Stove Kitchen & Nutrition",       # 18
    "Part 5 • Hydration Blueprint",                 # 19
    "Part 5 • 15-Minute Sunday Prep",               # 20
    "Part 6 • North Indian 7-Day Menu",             # 21
    "Part 6 • North Indian Grocery List",           # 22
    "Part 6 • South Indian 7-Day Menu",             # 23
    "Part 6 • South Indian Grocery List",           # 24
    "Part 6 • All-India Home Mix Menu",             # 25
    "Part 6 • US / UK / Global Menu",               # 26
    "Part 6 • Global Grocery & Emergency Meals",    # 27
    "Part 7 • Evening Downshift & Better Sleep",    # 28
    "Part 7 • Cravings & Guilt Cycles",             # 29
    "Part 8 • Printable Meal & Grocery Sheet",      # 30
    "Part 8 • Week 1 Printable Fridge Tracker",     # 31
    "Part 8 • 28-Day Habit Mosaic & Non-Scale Wins",# 32
    "Part 8 • Day 1 vs. Day 28 Progress Journal",   # 33
    "Part 8 • Tear-Out 2 AM Relief Poster",         # 34
    "Part 8 • Tear-Out Safety Cheat Sheet",         # 35
    "Your Next Step With Fit Mom 20",               # 36
]


def callout(html, st, kind="peach", pad_y=8):
    bg = C_PEACH_BG if kind == "peach" else C_SAGE_BG
    bd = C_PEACH_BORDER if kind == "peach" else C_SAGE_BORDER
    return CardBox([Paragraph(html, st["small"])], bg=bg, border=bd, pad_x=11, pad_y=pad_y, radius=9)


def header_block(kicker, title, lead, st):
    items = [Paragraph(xml_safe(kicker).upper(), st["kicker"]), Paragraph(xml_safe(title), st["h1"])]
    if lead:
        items.append(Paragraph(xml_safe(lead), st["lead"]))
    return items


def regional_menu_page(reg, iron_tip, swap_tip, st):
    rows = [
        [
            f"<b>{esc(d['day'])}</b>",
            esc(d["b"]),
            esc(d["l"]),
            esc(d["d"]),
            esc(d["s"]),
        ]
        for d in reg["days"]
    ]
    story = []
    story.extend(header_block("Part 6 • Regional Real-Kitchen Menu", reg["title"], reg["subtitle"], st))
    story.append(
        callout(
            "<b>Kid-First Extraction Rule:</b> Prepare one mildly seasoned family base pot. Scoop toddler/kid bowls out first, "
            "then stir chilies, tadka, black pepper, or crunchy greens directly into your bowl so zero extra dishes get dirtied.",
            st,
            kind="sage",
        )
    )
    story.append(Spacer(1, 7))
    story.append(
        make_table(
            ["Day", "Breakfast (Protein + Energy)", "Lunch (One-Stove Family Pot)", "Dinner (Easy Digestion)", "3 PM Snack"],
            rows,
            [38, 124, 126, 124, 88],
            st,
            tight=True,
        )
    )
    story.append(Spacer(1, 9))
    story.append(
        GridRow(
            [
                [
                    Paragraph("Vegetarian Swap Key", st["h4"]),
                    Paragraph(
                        "Keep moong dal, paneer, curd, tofu, roasted chana, and sprouts ready so every plate hits 15–22g protein without relying on shakes.",
                        st["small"],
                    ),
                ],
                [
                    Paragraph("Egg &amp; Non-Veg Shortcut", st["h4"]),
                    Paragraph(
                        "Keep 6 hard-boiled eggs chilled on the middle fridge shelf. Add 1–2 sliced eggs or leftover tandoori/pan chicken directly atop veg dal-rice or dosa.",
                        st["small"],
                    ),
                ],
            ]
        )
    )
    story.append(Spacer(1, 8))
    story.append(
        callout(
            f"<b>Regional Nutrient Pairings &amp; Busy Swaps:</b> {esc(iron_tip)} &nbsp;•&nbsp; <b>Quick 10-Min Backup:</b> {esc(swap_tip)}",
            st,
            kind="peach",
        )
    )
    story.append(PageBreak())
    return story


def regional_grocery_page(title, subtitle, groups, prep_box, budget_box, st):
    story = []
    story.extend(header_block("Part 6 • Weekly Market List", title, subtitle, st))
    story.append(
        callout(
            "<b>1× to 4× Household Multiplier Note:</b> Quantities below match 1–2 adults. Cooking for a family of 4 or joint home? "
            "Double fresh produce + grains cleanly — leave basic oil/ghee spice tempering nearly unchanged.",
            st,
            kind="peach",
        )
    )
    story.append(Spacer(1, 8))
    col_w = (INNER_W - 18) / 3.0 - 20
    cols = []
    for g in groups:
        c_items = [Paragraph(esc(g["cat"]), st["h4"])]
        for it in g["items"]:
            c_items.append(CheckRow(esc(it), st["tiny"], col_w))
        cols.append(c_items)
    story.append(GridRow(cols))
    story.append(Spacer(1, 9))
    story.append(
        GridRow(
            [
                [Paragraph("20-Minute Batch &amp; Fridge Time-Savers", st["h4"]), Paragraph(esc(prep_box), st["small"])],
                [Paragraph("Zero-Waste &amp; Budget Swap Rule", st["h4"]), Paragraph(esc(budget_box), st["small"])],
            ],
            col_configs=[{"bg": C_SAGE_LIGHT, "border": C_SAGE_BORDER}, {"bg": C_WARM_WHITE}],
        )
    )
    story.append(Spacer(1, 9))
    story.append(
        CardBox(
            [Paragraph("Custom Extras / Family Requests For This Week:", st["h4"]), BlankLines(count=3, width=INNER_W - 24)],
        )
    )
    story.append(PageBreak())
    return story


def exercise_cards_page(kicker, title, lead, cards, footer_callout, kind, st):
    story = []
    story.extend(header_block(kicker, title, lead, st))
    pairs = [cards[i : i + 2] for i in range(0, len(cards), 2)]
    for pair in pairs:
        row_cards = []
        for c in pair:
            row_cards.append(
                [
                    Paragraph(f"<b>{esc(c['name'])}</b> &nbsp;<font color='#8A6173'>({esc(c['duration'])})</font>", st["h4"]),
                    Paragraph(f"<font color='#2D6A4F'><b>FOCUS: {esc(c['focus']).upper()}</b></font>", st["tiny"]),
                    Paragraph(f"<b>How:</b> {esc(c['cue'])}", st["tiny"]),
                    Paragraph(f"<b>Breath:</b> {esc(c['breath'])}", st["tiny"]),
                    CardBox(
                        [Paragraph(f"<b>Gentle Swap:</b> {esc(c['mod'])}", st["tiny"])],
                        width=224,
                        bg=C_WARM_WHITE,
                        border=C_PEACH_BORDER,
                        pad_x=6,
                        pad_y=4,
                        radius=6,
                    ),
                ]
            )
        story.append(GridRow(row_cards, pad_x=9, pad_y=8))
        story.append(Spacer(1, 7))
    story.append(callout(footer_callout, st, kind=kind))
    story.append(PageBreak())
    return story


def build_pdf(data, out_pdf, img_dir):
    register_fonts()
    st = styles()
    story = []

    img = lambda name: os.path.join(img_dir, name)

    # ── PAGE 1: EDITORIAL COVER ──
    story.append(Spacer(1, 6))
    story.append(PillBadge("FIT MOM 20  •  COMPLETE EDITION (36 PAGES)", bg=C_PLUM, font_size=9, pad_x=16, pad_y=5))
    story.append(Spacer(1, 9))
    story.append(Paragraph("BUILT FOR TIRED MOTHERS, POSTPARTUM HEALING &amp; REAL KITCHENS", st["cover_eyebrow"]))
    story.append(Spacer(1, 4))
    story.append(Paragraph("The Exhausted Mom&apos;s<br/>7-Day Comeback Handbook", st["cover_title"]))
    story.append(Spacer(1, 5))
    story.append(
        Paragraph(
            "Feel steady, stronger, and less stiff in 20 calm minutes a day — without gym commutes, broken-streak guilt, or cooking two separate dinners.",
            st["cover_sub"],
        )
    )
    story.append(Spacer(1, 10))
    story.append(RoundedPhoto(img("cover-hero.jpg"), INNER_W, 180, radius=13, crop_y=0.22))
    story.append(Spacer(1, 10))
    cover_pills = [
        ("3-Speed Energy System", "20-Min, Baby-Awake & 5-Min Rescue"),
        ("Postpartum Safe Checks", "60s 2-Finger DRA & C-Section Rules"),
        ("2 AM Pain Relief Pocket", "Mommy Thumb, Feeding Neck & Swollen Legs"),
        ("4 Regional 7-Day Menus", "North Indian · South Indian · All-India · Global"),
        ("Categorized Grocery Lists", "1× to 4× Family Pot Formulas"),
        ("Printable Fridge Workbook", "Trackers, Journals & 2 AM Posters"),
    ]
    for i in range(0, 6, 2):
        left, right = cover_pills[i], cover_pills[i + 1]
        story.append(
            GridRow(
                [
                    [Paragraph(f"<b>{esc(left[0])}</b>", st["h4"]), Paragraph(esc(left[1]), st["small"])],
                    [Paragraph(f"<b>{esc(right[0])}</b>", st["h4"]), Paragraph(esc(right[1]), st["small"])],
                ],
                pad_y=7,
            )
        )
        story.append(Spacer(1, 6))
    story.append(
        CardBox(
            [
                Paragraph(
                    "&ldquo;You don&apos;t need another grueling bootcamp. You need a calm 5-to-20 minute rhythm that adapts to teething nights, nursing pillows, and your real family kitchen.&rdquo;",
                    st["cover_quote"],
                )
            ],
            bg=C_SAGE_BG,
            border=C_SAGE_BORDER,
            pad_y=8,
        )
    )
    story.append(Spacer(1, 10))
    story.append(
        CardBox(
            [
                Paragraph(
                    "<b>Medical &amp; Safety Notice:</b> This handbook is an educational wellness companion — not personalized medical advice. Always receive clearance from your OB-GYN or doctor before beginning movement after vaginal delivery, C-section surgery, or persistent pain.",
                    st["cover_disc"],
                )
            ],
            bg=C_WARM_WHITE,
            border=C_OUTER_BORDER,
            pad_y=7,
        )
    )
    story.append(Spacer(1, 6))
    story.append(
        Paragraph("Interactive Timers &amp; 58 Guided Videos Inside Fit Mom 20  •  <b>fit-mom-28-aj.vercel.app</b>", st["cover_url"])
    )
    story.append(PageBreak())

    # ── PAGE 2: TOC & EMERGENCY INDEX ──
    story.extend(header_block("How to Use This Manual", "Skip Straight to What Hurts or Helps Tonight", None, st))
    story.append(
        callout(
            "<b>90-Second Mom Quick-Find Index:</b> Zero sleep today? <b>Go to p. 6</b> · Baby refuses crib? <b>p. 7</b> · "
            "Belly coning / C-section worry? <b>p. 8–9</b> · Pain at thumb base? <b>p. 13</b> · Exhausted at 6:30 PM dinner? <b>p. 27</b> · Need 2 AM cribside stretch poster? <b>p. 34</b>",
            st,
            kind="peach",
        )
    )
    story.append(Spacer(1, 6))
    toc = data["TOC_SECTIONS"]
    for i in range(0, len(toc), 2):
        row = []
        for s in toc[i : i + 2]:
            blk = [Paragraph(f"<b>{esc(s['part'])}</b> &nbsp;<font color='#2D6A4F'>({esc(s['pages'])})</font>", st["h4"])]
            for it in s["items"]:
                blk.append(Paragraph(esc(it), st["tiny"]))
            row.append(blk)
        story.append(GridRow(row, pad_y=7, pad_x=9))
        story.append(Spacer(1, 6))
    story.append(
        CardBox(
            [
                Paragraph("Your First 15 Minutes With This Book (3 Tiny Actions)", st["h4"]),
                Paragraph(
                    "<b>1. Print 3 Sheets Today:</b> Print pp. 30, 31 &amp; 34 and magnetize p. 31 to your fridge. &nbsp;•&nbsp; "
                    "<b>2. Do 60s Belly Check:</b> Try p. 8 once on your bedroom rug to know your safe starting baseline. &nbsp;•&nbsp; "
                    "<b>3. Pick Your Stove Menu:</b> Circle 1 menu region (pp. 21–26) for effortless weeknight groceries.",
                    st["small"],
                ),
            ],
            bg=C_SAGE_BG,
            border=C_SAGE_BORDER,
        )
    )
    story.append(PageBreak())

    # ── PAGE 3: WHY MOM FITNESS FAILS ──
    story.extend(
        header_block(
            "Part 1 • Mind & Recovery Science",
            "Why 20 Calm Minutes Beat 60-Minute Workouts",
            "If a fitness plan worked great before kids and now leaves you wiped out by Wednesday, your willpower didn&apos;t break — your recovery bandwidth changed.",
            st,
        )
    )
    story.append(
        GridRow(
            [
                [
                    Paragraph("What Broken Sleep Does to Cortisol", st["h4"]),
                    Paragraph(
                        "Waking twice at 1 AM and 4 AM leaves morning cortisol elevated. Adding high-impact burpees and 1,200-calorie starvation tells a sleep-deprived nervous system to conserve energy and crave fast sugar by 3 PM.",
                        st["small"],
                    ),
                ],
                [
                    Paragraph("Why Calm Strength Restores Energy", st["h4"]),
                    Paragraph(
                        "Controlled living-room resistance (squats, bridges, posture pulls) paired with long slow exhales lowers stress stiffness, pumps blood back out of heavy legs, and boosts mental clarity for the rest of the day.",
                        st["small"],
                    ),
                ],
            ]
        )
    )
    story.append(Spacer(1, 9))
    story.append(Paragraph("Quick Baseline Mom Audit (Check What Applies Today)", st["h3"]))
    audit_w = INNER_W - 24
    story.append(
        CardBox(
            [
                CheckRow("<b>Sleep Reality:</b> I routinely get 4–6 interrupted hours per night and wake stiff around shoulders or lower back.", st["small"], audit_w),
                CheckRow("<b>Streak Quit Cycle:</b> When a baby illness or busy week breaks my plan, I feel &ldquo;off track&rdquo; and abandon the whole month.", st["small"], audit_w),
                CheckRow("<b>Separate Cooking Burnout:</b> Diets asking me to weigh dry oats and cook chicken separately from family dal-rice collapse in 4 days.", st["small"], audit_w),
                CheckRow("<b>Thumb/Wrist &amp; Neck Tension:</b> My thumb base aches lifting baby, or my neck knots scrolling/feeding at 2 AM.", st["small"], audit_w),
            ]
        )
    )
    story.append(Spacer(1, 9))
    story.append(
        GridRow(
            [
                [
                    Paragraph("Old Harsh Bootcamp Rules", st["h4_red"]),
                    Paragraph("• Missing 2 days = broken streak failure", st["small"]),
                    Paragraph("• Sweat &amp; soreness = only proof it worked", st["small"]),
                    Paragraph("• Generic crunches ignoring C-sections or leaks", st["small"]),
                ],
                [
                    Paragraph("Fit Mom 20 Recovery Science", st["h4_sage"]),
                    Paragraph("• Missed days trigger an effortless Speed-3 reset", st["small"]),
                    Paragraph("• Joint ease &amp; afternoon steady energy = true win", st["small"]),
                    Paragraph("• Breath-synced core rebuilds strength from inside", st["small"]),
                ],
            ],
            col_configs=[{"bg": C_RED_BG, "border": C_RED_BORDER}, {"bg": C_SAGE_LIGHT, "border": C_SAGE_BORDER}],
        )
    )
    story.append(Spacer(1, 9))
    story.append(
        callout(
            "<b>The Core Fit Mom 20 Promise:</b> You never &ldquo;restart Monday&rdquo; here. Every day simply picks Speed 1, Speed 2, or Speed 3 based on the energy you actually woke up with.",
            st,
            kind="sage",
        )
    )
    story.append(PageBreak())

    # ── PAGE 4: 3-SPEED MATRIX ──
    story.extend(
        header_block(
            "Part 1 • Anti-Quitting Architecture",
            "The 3-Speed Broken-Sleep Rule",
            "Habit research consistently shows that reducing friction on chaos days protects a 28-day habit far better than white-knuckling a hard plan.",
            st,
        )
    )
    story.append(
        GridRow(
            [
                [
                    PillBadge("Speed 1 • 20 Mins", bg=C_PLUM, align="left"),
                    Spacer(1, 6),
                    Paragraph("<b>Slept Okay Today</b>", st["h3"]),
                    Paragraph("<b>When:</b> 5+ reasonably continuous hours, calm window.", st["small"]),
                    Paragraph("<b>Flow:</b> 3-min warm-up + 12-min gentle strength &amp; core + 5-min deep unwind.", st["small"]),
                    Paragraph("<b>Goal:</b> Build legs, glutes, posture &amp; steady energy.", st["small"]),
                ],
                [
                    PillBadge("Speed 2 • 12–15 Mins", bg=C_PEACH_BG, fg=C_PLUM, border=C_PEACH_BORDER, align="left"),
                    Spacer(1, 6),
                    Paragraph("<b>Baby Is Awake</b>", st["h3"]),
                    Paragraph("<b>When:</b> Toddler wants attention or baby won&apos;t stay in crib.", st["small"]),
                    Paragraph("<b>Flow:</b> 100% standing &amp; wall moves next to baby&apos;s playmat.", st["small"]),
                    Paragraph("<b>Goal:</b> Stay moving while smiling or talking with baby.", st["small"]),
                ],
                [
                    PillBadge("Speed 3 • 5-Min Rescue", bg=C_SAGE_DARK, align="left"),
                    Spacer(1, 6),
                    Paragraph("<b>Zero-Sleep Night</b>", st["h3"]),
                    Paragraph("<b>When:</b> Teething, fever, cluster feeds or work deadline.", st["small"]),
                    Paragraph("<b>Flow:</b> 5 moves in pajamas near kettle or sofa. Zero sweat.", st["small"]),
                    Paragraph("<b>Goal:</b> Protect daily habit identity — still marks DONE!", st["small"]),
                ],
            ],
            col_configs=[
                {"bg": C_WARM_WHITE},
                {"bg": C_PEACH_BG, "border": C_PEACH_BORDER},
                {"bg": C_SAGE_LIGHT, "border": C_SAGE_BORDER},
            ],
        )
    )
    story.append(Spacer(1, 10))
    story.append(Paragraph("Same-Day Matching Cheat Sheet", st["h3"]))
    story.append(
        make_table(
            ["How You Feel at 8 AM", "Wrong Instinct", "Smart 3-Speed Pivot"],
            [
                ["Exhausted after 3 wakeups", "&ldquo;Skip today, try harder next Monday.&rdquo;", "Pick <b>Speed 3 (5-Min Rescue)</b> after tea/coffee."],
                ["Kids fighting / clutter everywhere", "Wait for 45 clean, quiet minutes.", "Pick <b>Speed 2</b> right by the kitchen counter."],
                ["Sore neck &amp; numb lower back", "Do random planks from saved Reels.", "Pick <b>2 AM Posture &amp; Neck Flow (p. 14)</b> instead."],
                ["Energized after good sleep", "Go all-out until sore for 4 days.", "Complete calm <b>Speed 1</b> &amp; finish with tank half full."],
            ],
            [155, 165, 180],
            st,
        )
    )
    story.append(Spacer(1, 10))
    story.append(
        callout(
            "<b>What Makes an &ldquo;A+ Winning Week&rdquo;?</b> Even just <b>3 Speed-1 days + 2 Speed-3 rescues + 1 Sunday rest</b> builds real strength in 4 weeks. Consistency always beats all-or-nothing perfection!",
            st,
            kind="peach",
        )
    )
    story.append(PageBreak())

    # ── PAGE 5: 4-6 CORE BREATH ──
    story.extend(
        header_block(
            "Part 1 • Internal Support Foundation",
            "The 4-6 Core Breath (Before Every Lift)",
            "Your diaphragm and pelvic floor work like an elevator piston: as you inhale, both descend softly; as you exhale, your pelvic floor lifts and your deep belly wraps gently inward.",
            st,
        )
    )
    story.append(
        GridRow(
            [
                [
                    Paragraph("Step-by-Step 360° Rib Breathing", st["h4"]),
                    Paragraph("1. Place one hand gently across side ribs and one below navel.", st["small"]),
                    Paragraph("2. <b>4-Second Nose Inhale:</b> Expand sideways into bottom hands and relax pelvic floor downward.", st["small"]),
                    Paragraph("3. <b>6-Second Calm Exhale:</b> Fog sunglasses / sip through a straw; draw pelvic floor up &amp; lower belly softly inward.", st["small"]),
                    Paragraph("4. Practice 6 breaths before sitting up from bed or lifting baby.", st["small"]),
                ],
                [
                    Paragraph("3 Breathing Mistakes Moms Make", st["h4"]),
                    Paragraph("• <b>All-Day &ldquo;Sucking In&rdquo;:</b> Gripping upper abs pushes internal pressure downward onto pelvic tissue.", st["small"]),
                    Paragraph("• <b>Breath Holding Lifting Baby:</b> Creates bearing-down force — always <i>&ldquo;Exhale on Effort&rdquo;</i> as you lift!", st["small"]),
                    Paragraph("• <b>Squeezing Glutes:</b> Keep tailbone relaxed during calm seated breaths.", st["small"]),
                ],
            ],
            col_configs=[{"bg": C_SAGE_LIGHT, "border": C_SAGE_BORDER}, {"bg": C_WHITE}],
        )
    )
    story.append(Spacer(1, 9))
    story.append(
        CardBox(
            [
                Paragraph("Practice Without Finding &ldquo;Extra Time&rdquo;: 4 Hidden Daily Anchor Spots", st["h4"]),
                Paragraph("• <b>Kettle Boiling / Coffee Drip:</b> 5 slow 4-6 breaths leaning calmly on counter.", st["small"]),
                Paragraph("• <b>Night Feed Settling:</b> Relax shoulders down 4 inches after burping baby.", st["small"]),
                Paragraph("• <b>School Pickup / Traffic Lights:</b> Soften belly off steering wheel grip &amp; exhale long.", st["small"]),
                Paragraph("• <b>Toddler Tantrum Buffer:</b> One 6-sec straw exhale keeps your voice calm &amp; grounded.", st["small"]),
            ],
            bg=C_WARM_WHITE,
        )
    )
    story.append(Spacer(1, 9))
    story.append(
        callout(
            "<b>Golden Cue to Tape Above Crib &amp; Kettle:</b> <i>&ldquo;Inhale to prepare, EXHALE as I stand up, pick up baby, or lift a laundry basket.&rdquo;</i> One simple timing habit protects your midline 20 times every day automatically.",
            st,
            kind="peach",
        )
    )
    story.append(PageBreak())

    # ── PAGE 6: 5-MIN RESCUE ──
    story.extend(
        header_block(
            "Guided Workout Card #1 • Pajama-Friendly",
            "The 5-Minute Zero-Sleep Nap Rescue",
            "Save this exact 5-move timer for your hardest mornings. No yoga mat, shoes, or sweat required — just 5 intentional minutes that reset circulation and stiff joints.",
            st,
        )
    )
    story.append(
        make_table(
            ["Step", "Movement", "Duration", "Exact Form & Breath Cue"],
            [
                ["Warmup", "<b>Shoulder Rolls &amp; Chest Opener</b>", "45 sec", "Roll shoulders up, wide back, drop heavy away from ears; inhale open chest."],
                ["Move 1", "<b>Slow March in Place</b>", "60 sec", "Soft quiet carpet steps; breathe nose 3 steps / exhale 3 steps (or seated)."],
                ["Move 2", "<b>Supported Chair Squats</b>", "55 sec", "Hold dining chair lightly, tap hips gently down toward cushion, exhale tall."],
                ["Move 3", "<b>Pelvic Floor Kegel + Release</b>", "60 sec", "Inhale completely relax pelvis; exhale gentle 4-sec upward hug."],
                ["Unwind", "<b>Deep 4-6 Breathing Reset</b>", "60 sec", "Hands on ribs, drop jaw loose; 5 slow cycles before coffee or baby duty."],
            ],
            [56, 134, 66, 244],
            st,
        )
    )
    story.append(Spacer(1, 9))
    story.append(
        GridRow(
            [
                [
                    Paragraph("Need Even Gentler Swaps Today?", st["h4"]),
                    Paragraph("• <b>Sore Knees:</b> Replace Chair Squats with Seated Leg Extensions while nursing.", st["small"]),
                    Paragraph("• <b>Lightheaded / Dizzy:</b> Keep all 5 moves seated upright against a pillow.", st["small"]),
                    Paragraph("• <b>Sleeping Baby Nearby:</b> Keep heel taps noiseless in warm socks.", st["small"]),
                ],
                [
                    Paragraph("5-Min Energy Shift Test (Try Today)", st["h4"]),
                    Paragraph("Before Move 1, rate stiffness (1–10): <b>____ / 10</b>", st["small"]),
                    Paragraph("After Unwind, rate it again: <b>____ / 10</b>", st["small"]),
                    Paragraph("Most moms report a 3-point tension drop without changing clothes once!", st["small"]),
                ],
            ],
            col_configs=[{"bg": C_WHITE}, {"bg": C_SAGE_LIGHT, "border": C_SAGE_BORDER}],
        )
    )
    story.append(Spacer(1, 9))
    story.append(
        callout(
            "<b>Why Speed 3 Counts 100%:</b> You circulated lymph in tired ankles, opened cramped nursing shoulders, supported pelvic tone, and practiced nervous-system downshift in 4 minutes 40 seconds. Mark your fridge tracker DONE!",
            st,
            kind="sage",
        )
    )
    story.append(PageBreak())

    # ── PAGE 7: BABY IS AWAKE ROUTINE ──
    story.extend(
        header_block(
            "Guided Workout Card #2 • Zero Floor Mat",
            "12-Min &ldquo;Baby Is Awake&rdquo; Upright Routine",
            "When you lie on a mat while baby is awake, most babies climb your face or fuss immediately. Stay upright beside the playmat or kitchen counter so eye contact stays easy.",
            st,
        )
    )
    story.append(
        make_table(
            ["Phase", "Move (All Standing / Wall)", "Time", "Baby-Friendly Form & Distraction Note"],
            [
                ["Warmup", "<b>March in Place + Shoulder Rolls</b>", "2 min", "Sing a slow nursery rhyme out loud — keeps breath conversational &amp; light!"],
                ["Main 1", "<b>Supported Chair Squats</b>", "2 × 55s", "Hold sturdy sofa or chair back; smile down at baby on tummy-time mat."],
                ["Main 2", "<b>Standing Side Leg Lifts</b>", "2 × 50s", "Hold kitchen counter; keep standing knee soft &amp; torso tall (no leaning)."],
                ["Main 3", "<b>Wall Push-Ups</b>", "2 × 45s", "Keep baby safe near calves; exhale firmly pressing chest smoothly off wall."],
                ["Main 4", "<b>Standing Hip Circles</b>", "45s/way", "Big calm circles relaxing stiff low-back muscles after baby wearing."],
                ["Cooldown", "<b>Neck Reset + 4-6 Breath</b>", "2 min", "Tuck chin gently, drop ear smoothly toward shoulder cleanly."],
            ],
            [56, 138, 56, 250],
            st,
        )
    )
    story.append(Spacer(1, 9))
    story.append(Paragraph("Adaptations By Child&apos;s Age", st["h3"]))
    story.append(
        GridRow(
            [
                [Paragraph("0–5 Mo Newborn", st["h4"]), Paragraph("Set crib/lounger facing your counter; narrate each Wall Push-Up slowly for soothing voice contact.", st["small"])],
                [Paragraph("6–12 Mo Crawler", st["h4"]), Paragraph("Hand them 2 measuring cups or wooden spoon at baby-safe floor level while holding dining chair.", st["small"])],
                [Paragraph("1–4 Yr Toddler", st["h4"]), Paragraph("Ask them to copy your Knee Marches or Side Leg Lifts! Turns guilt into goofy giggles.", st["small"])],
            ]
        )
    )
    story.append(Spacer(1, 8))
    story.append(
        CardBox(
            [
                Paragraph("Safety Note on &ldquo;Baby-Wearing&rdquo; Workouts", st["h4"]),
                Paragraph(
                    "Front-carrier squats look cute on social media, yet add 5–10 kg downward load on healing pelvic floor and knees. Leave baby happily on a safe playmat beside you whenever possible.",
                    st["small"],
                ),
            ]
        )
    )
    story.append(PageBreak())

    # ── PAGE 8: 60s 2-FINGER BELLY CHECK (WITH REAL PHOTO) ──
    story.extend(
        header_block(
            "Part 2 • Postpartum Core Check",
            "The 60-Second 2-Finger Belly Check",
            "Pregnancy naturally stretches the linea alba connective tissue down the center of your abs. Before starting planks or crunches, take 60 seconds to feel how your center line generates tension.",
            st,
        )
    )
    story.append(
        PhotoSplit(
            img("belly-check.jpg"),
            [
                Paragraph("STEP-BY-STEP MIDLINE CHECK", st["kicker"]),
                Paragraph("<b>1. Lie Knees Bent:</b> Exhale softly and lift head just 1 inch off the mat.", st["small"]),
                Paragraph("<b>2. Measure Three Midline Spots:</b>", st["small"]),
                Paragraph("• <b>A.</b> 2 inches above belly button<br/>• <b>B.</b> Right at belly button<br/>• <b>C.</b> 2 inches below belly button", st["tiny"]),
                Paragraph("<font color='#2D6A4F'><b>Feel both finger width &amp; firm bounce.</b></font>", st["small"]),
            ],
            height=152,
            img_ratio=0.56,
            crop_y=0.35,
        )
    )
    story.append(Spacer(1, 9))
    story.append(
        GridRow(
            [
                [Paragraph("0–1.5 Fingers (Firm)", st["h4"]), Paragraph("Midline resists your fingers like a firm trampoline. Calm standard core progressions are usually comfortable.", st["small"])],
                [Paragraph("2+ Fingers or Soft Sink", st["h4"]), Paragraph("Stay strictly with Level-1 deep core moves (Heel Slides, Pelvic Tilts, Bridges, Wall Push-Ups) while tissue knits back.", st["small"])],
                [Paragraph("Watch for &ldquo;Doming&rdquo;", st["h4"]), Paragraph("Even with a narrow gap, if the center ridge peaks upward like a bread loaf, scale that exercise down immediately.", st["small"])],
            ]
        )
    )
    story.append(Spacer(1, 9))
    story.append(
        GridRow(
            [
                [
                    Paragraph("Why Tension Matters More Than Zero Gap", st["h4_sage"]),
                    Paragraph(
                        "A gentle 1.5-finger gap that feels bouncy and controlled when you exhale is often stronger and more functional than a tight, breath-held 1-finger gap!",
                        st["small"],
                    ),
                ],
                [
                    Paragraph("My 4-Week Midline Measurement Log", st["h4"]),
                    Paragraph("<b>Week 1:</b> Above ___ | At ___ | Below ___  (□ Soft  □ Firm)", st["small"]),
                    Spacer(1, 4),
                    Paragraph("<b>Week 4:</b> Above ___ | At ___ | Below ___  (Doming? □ Less □ Gone)", st["small"]),
                ],
            ],
            col_configs=[{"bg": C_SAGE_LIGHT, "border": C_SAGE_BORDER}, {"bg": C_WHITE}],
        )
    )
    story.append(PageBreak())

    # ── PAGE 9: C-SECTION & RED FLAGS ──
    story.extend(
        header_block(
            "Part 2 • Surgical Healing & Safety",
            "C-Section Recovery Rules &amp; Doctor Red Flags",
            "A Cesarean delivery passes through multiple abdominal layers even when skin stitches look healed outside. Respect internal healing for stronger long-term core flatness.",
            st,
        )
    )
    story.append(
        GridRow(
            [
                [
                    Paragraph("The 3 Golden Daily Scar Rules", st["h4_sage"]),
                    Paragraph("<b>1. Always Log-Roll Out of Bed:</b> Roll completely onto your side first, drape legs off mattress, and press up with bottom arm.", st["small"]),
                    Paragraph("<b>2. &ldquo;Hug-a-Pillow&rdquo; Support:</b> Press a folded towel gently over incision during coughs, sneezes, or laughs.", st["small"]),
                    Paragraph("<b>3. Gentle Mobility Over Intensity:</b> Short 5–10 min walks &amp; ankle circles speed circulation safely.", st["small"]),
                ],
                [
                    Paragraph("Pause &amp; See a Doctor / Pelvic PT If You Feel:", st["h4_red"]),
                    Paragraph("• A heavy, dragging or bulging pressure downward in the pelvis after walks.", st["small"]),
                    Paragraph("• Sharp tugging, redness, heat, or oozing anywhere along C-section incision.", st["small"]),
                    Paragraph("• Noticeable urine leakage during coughs, squats, or light marches.", st["small"]),
                    Paragraph("• Visible midline ridge doming even during gentle Heel Slides.", st["small"]),
                ],
            ],
            col_configs=[{"bg": C_SAGE_LIGHT, "border": C_SAGE_BORDER}, {"bg": C_RED_BG, "border": C_RED_BORDER}],
        )
    )
    story.append(Spacer(1, 10))
    story.append(Paragraph("Typical C-Section Gentle Progression Roadmap (Confirm With Your OB-GYN First)", st["h3"]))
    story.append(
        make_table(
            ["Phase", "Gentle Focus", "What Wait-List Moves Stay Paused"],
            [
                ["Weeks 1–3", "Log-roll bed transitions, ankle pumps, tiny slow home walks, 4-6 rib breaths", "Carrying heavy buckets/toddlers, straining bowel/core"],
                ["Weeks 4–8", "Daily stroller walks (10–15 min), gentle shoulder/neck unwinds, doctor clearance visit", "Sit-ups, twists, brisk jogging, lifting heavy floor items"],
                ["Weeks 8–12+", "Cleared Speed 1: Pelvic tilts, Heel slides, Wall push-ups, Supported chair squats", "High-impact jumping &amp; full crunches until zero doming"],
                ["Scar Comfort (Once closed)", "Ask pelvic PT/OB when gentle soft skin touch/circular massage around scar is safe", "Aggressive pulling over raised or tender tissue"],
            ],
            [92, 224, 184],
            st,
        )
    )
    story.append(PageBreak())

    # ── PAGE 10: SAFE VS PAUSE SWAPS ──
    story.extend(
        header_block(
            "Part 2 • Joint & Belly Swap Matrix",
            "What to Pause Briefly (And What to Do Instead)",
            "Random workout videos rarely warn mothers away from aggressive flexion or pounding impact. Use this direct 1-for-1 substitution table anytime a workout shows a move that feels wrong.",
            st,
        )
    )
    story.append(
        make_table(
            ["Typical Fitness Video Move", "Why Moms Pause It Briefly", "Fit Mom 20 Safe Replacement"],
            [
                ["Full Sit-Ups / Bicycle Crunches", "Spikes belly pressure &amp; triggers midline coning", "<b>Heel Slides (p. 11) + Pelvic Tilts</b>"],
                ["Floor Planks &amp; Mountain Climbers", "Gravity pulls loosened abs downward onto scar", "<b>Wall Push-Ups (p. 12) + Bird Dog Toe-Slides</b>"],
                ["Jumping Jacks / Burpees / Jumps", "Heavy pelvic floor &amp; knee pounding while sleep deprived", "<b>Low-Impact Step-Out Jacks / Slow Marches</b>"],
                ["Deep Walking or Reverse Lunges", "Overloads sensitive knees &amp; postpartum SI pelvic joint", "<b>Supported Chair Squats / Glute Bridges</b>"],
                ["Heavy Overhead Russian Twists", "Torques tender linea alba &amp; tight nursing mid-back", "<b>Seated Torso &amp; Chest Openers</b>"],
                ["Long Cobra / Extreme Backbends", "Stretches healing abdomen overly tight too early", "<b>Gentle Cat-Cow (All Fours or Seated)</b>"],
            ],
            [155, 175, 170],
            st,
        )
    )
    story.append(Spacer(1, 9))
    story.append(
        GridRow(
            [
                [Paragraph("Knee-Pain Guardrail", st["h4"]), Paragraph("Keep heels planted, place a thick folded towel or extra cushion atop chair seats so hips bend only halfway down cleanly.", st["small"])],
                [Paragraph("Lower-Back / SI Joint Guardrail", st["h4"]), Paragraph("Fold a bath towel under stiff tailbone during bridges and prioritize bilateral moves (both legs down) over deep lunges.", st["small"])],
            ]
        )
    )
    story.append(Spacer(1, 9))
    story.append(
        callout(
            "<b>Automatic Filtering in Fit Mom 20:</b> Selecting <i>C-Section</i>, <i>Diastasis</i>, <i>Knee Pain</i>, <i>Back Pain</i>, or <i>Pelvic Heaviness</i> in your app quiz hides those unsafe rows from your daily schedule automatically!",
            st,
            kind="sage",
        )
    )
    story.append(PageBreak())

    # ── PAGE 11–12: EXERCISE REFERENCE CARDS ──
    story.extend(
        exercise_cards_page(
            "Part 2 • Illustrated Movement Cards (1 of 2)",
            "6 Postpartum-Safe Core, Glute &amp; Pelvic Moves",
            "Read every form cue once calmly, notice the gentle exhale timing, and pick the easier variation whenever your body asks for space.",
            data["CORE_CARDS_P1"],
            "<b>Golden Core Progress Cue:</b> Quality beats quantity every week. Five slow Heel Slides with zero low-back arching beats 30 rushed crunches for flatter, steadier deep-core tone!",
            "sage",
            st,
        )
    )
    story.extend(
        exercise_cards_page(
            "Part 2 • Illustrated Movement Cards (2 of 2)",
            "6 Living-Room Strength &amp; Mobility Moves",
            "Designed to restore carrying stamina, knee support for picking toys/toddlers off floors, and upper-back confidence with zero bulky weights.",
            data["STRENGTH_CARDS_P2"],
            "<b>Ready for Light Dumbbells or Resistance Bands Later?</b> Once Week 4 moves feel effortless, hold two 500 ml filled water bottles during squats or loop a gentle fabric band above knees during bridges!",
            "peach",
            st,
        )
    )

    # ── PAGE 13: MOMMY THUMB WRIST RELIEF (WITH REAL PHOTO) ──
    story.extend(
        header_block(
            "Part 3 • Wrist & Tendon Rescue",
            "Easing &ldquo;Mommy Thumb&rdquo; (De Quervain&apos;s Relief)",
            "Sharp burning at the thumb side of your wrist happens to thousands of mothers after lifting an ever-heavier baby 20 times a day with thumbs hooked wide outward.",
            st,
        )
    )
    story.append(
        PhotoSplit(
            img("wrist-scoop.jpg"),
            [
                CardBox(
                    [
                        Paragraph("<font color='#9B2C2C'><b>AVOID: Tight &ldquo;L-Grip&rdquo; Hook</b></font>", st["tiny"]),
                        Paragraph("<font color='#7A2E2E'>Thumb locks out at 90° under armpits → pinches wrist tendon.</font>", st["tiny"]),
                    ],
                    width=195,
                    bg=C_RED_BG,
                    border=C_RED_BORDER,
                    pad_x=7,
                    pad_y=5,
                    radius=7,
                ),
                Spacer(1, 5),
                CardBox(
                    [
                        Paragraph("<font color='#1E5631'><b>DO THIS: Forearm Scoop Lift</b></font>", st["tiny"]),
                        Paragraph("<font color='#1E5631'>Keep wrists straight &amp; neutral; thumbs stay relaxed beside fingers.</font>", st["tiny"]),
                    ],
                    width=195,
                    bg=C_SAGE_BG,
                    border=C_SAGE_BORDER,
                    pad_x=7,
                    pad_y=5,
                    radius=7,
                ),
            ],
            height=136,
            img_ratio=0.56,
            crop_y=0.35,
        )
    )
    story.append(Spacer(1, 8))
    story.append(
        GridRow(
            [
                [
                    Paragraph("30s Soft Thumb &amp; Tendon Tilt", st["h4"]),
                    Paragraph("1. Wrap fingers <b>loosely</b> over your thumb — zero tight squeezing.", st["small"]),
                    Paragraph("2. Reach arm smoothly out in front with elbow relaxed.", st["small"]),
                    Paragraph("3. Tilt pinky downward 1–2 cm until a soft forearm stretch appears. Hold 15s calmly; never push into sharp pain!", st["small"]),
                ],
                [
                    Paragraph("Daytime Wrist Habits That Heal Fast", st["h4"]),
                    Paragraph("• <b>Phone Rescue:</b> Stop one-handed thumb scrolling; prop phone on table or dictate notes.", st["small"]),
                    Paragraph("• <b>Wrist Tendon Glide:</b> Rest forearm on lap &amp; softly bend/extend open hand 10 times.", st["small"]),
                    Paragraph("• If pain locks your thumb, ask a doctor about a soft overnight resting thumb splint.", st["small"]),
                ],
            ],
            col_configs=[{"bg": C_SAGE_LIGHT, "border": C_SAGE_BORDER}, {"bg": C_WHITE}],
        )
    )
    story.append(Spacer(1, 8))
    story.append(Paragraph("Wrist-Saving Household Micro-Swaps", st["h3"]))
    story.append(
        make_table(
            ["Daily Pain Trigger", "Instant Wrist-Safe Fix"],
            [
                ["Buttoning tiny baby snaps 10x/day", "Use magnetic / two-way zipper sleepsuits during painful flare weeks."],
                ["Pushing heavy 1-hand stroller curbs", "Lock wrists straight like boxing gloves when popping curb wheels upward."],
                ["Pouring full heavy tea kettle/pan", "Use both palms underneath pot handles — never twist a heavy skillet by 1 thumb."],
            ],
            [180, 320],
            st,
        )
    )
    story.append(PageBreak())

    # ── PAGE 14: NURSING NECK & SWOLLEN LEGS (WITH REAL PHOTO) ──
    story.extend(
        header_block(
            "Part 3 • 2 AM Posture Pocket Guide",
            "Feeding Neck, Shoulder Knots &amp; Heavy Legs",
            "Hours spent gazing down during nursing, bottle feeding, or rocking pull your head forward like a heavy bowling ball. One tiny pillow setup solves half that stiffness tonight.",
            st,
        )
    )
    story.append(
        PhotoSplit(
            img("nursing-posture.jpg"),
            [
                CardBox(
                    [
                        Paragraph("<font color='#9B2C2C'><b>BEFORE: Slumping Down to Baby</b></font>", st["tiny"]),
                        Paragraph("<font color='#7A2E2E'>Chin pokes forward → tight neck, upper-back knot &amp; sore ribs.</font>", st["tiny"]),
                    ],
                    width=195,
                    bg=C_RED_BG,
                    border=C_RED_BORDER,
                    pad_x=7,
                    pad_y=5,
                    radius=7,
                ),
                Spacer(1, 5),
                CardBox(
                    [
                        Paragraph("<font color='#1E5631'><b>AFTER: Pillow Stack Upright Lift</b></font>", st["tiny"]),
                        Paragraph("<font color='#1E5631'>Back &amp; nursing cushions keep spine tall and shoulders relaxed.</font>", st["tiny"]),
                    ],
                    width=195,
                    bg=C_SAGE_BG,
                    border=C_SAGE_BORDER,
                    pad_x=7,
                    pad_y=5,
                    radius=7,
                ),
            ],
            height=134,
            img_ratio=0.56,
            crop_y=0.22,
        )
    )
    story.append(Spacer(1, 8))
    story.append(
        GridRow(
            [
                [Paragraph("1. Feeding Shoulder Unwind", st["h4"]), Paragraph("Inhale shoulders upward, sweep wide backward, and drop them heavy away from ears 8 times sighing softly out.", st["small"])],
                [Paragraph("2. Ear-to-Shoulder Neck Reset", st["h4"]), Paragraph("Tuck chin back 1 inch, tilt right ear gently toward right shoulder while reaching left fingertips down for 25s/side.", st["small"])],
                [Paragraph("3. Evening Sofa Ankle Pumps", st["h4"]), Paragraph("Prop heels on couch cushions 3–5 minutes at night. Pump toes 15 times and trace slow ankle circles to ease swelling.", st["small"])],
            ]
        )
    )
    story.append(Spacer(1, 8))
    story.append(
        GridRow(
            [
                [
                    Paragraph("Bonus 30s Doorway Chest Opener", st["h4"]),
                    Paragraph("Stand in any doorframe with forearms resting lightly at shoulder height. Step one foot gently through until front shoulders feel open and airy. Breathe 30s.", st["small"]),
                ],
                [
                    Paragraph("Night-Feed Chair Setup Checklist", st["h4"]),
                    Paragraph("• Footstool or thick cushion under feet<br/>• Firm pillow vertically behind sore mid-back<br/>• Nursing cushion under elbow holding baby&apos;s head", st["small"]),
                ],
            ],
            col_configs=[{"bg": C_SAGE_LIGHT, "border": C_SAGE_BORDER}, {"bg": C_WARM_WHITE}],
        )
    )
    story.append(PageBreak())

    # ── PAGE 15: MOM ERGONOMICS ──
    story.extend(
        header_block(
            "Part 3 • Pain-Proof Your Home Moves",
            "Crib Transfers, Stroller Lifting &amp; Hip-Hike Fix",
            "You don&apos;t only lift dumbbells — you lift a squirming 10 kg toddler out of floor bathtubs and car seats. Tiny angle adjustments save your lower back permanently.",
            st,
        )
    )
    story.append(
        make_table(
            ["Everyday Mom Move", "What Hurts Your Back & Wrists", "Pain-Free Mechanic to Switch To Today"],
            [
                ["Lifting from Crib / Car Seat", "Straight knees, rounded spine hanging forward over rail", "Walk belly close to rail, widen stance, hinge hips, <b>EXHALE</b> as baby clears top rail."],
                ["Toddler on One Hip", "Locking knee &amp; jutting hip out → twists low back + neck", "Alternate sides every hallway walk, soften knees slightly, keep shoulders level."],
                ["Carrying Groceries / Stroller", "Holding baby right arm while snatching heavy bag left", "Hug stroller/bucket tight against center navel height so weight shares evenly."],
                ["Picking Toys Off Rug", "Diving nose-down with locked hamstrings 30x/day", "Take a soft wide mini-squat or kneel on one cushion with open chest."],
            ],
            [118, 165, 217],
            st,
        )
    )
    story.append(Spacer(1, 9))
    story.append(
        GridRow(
            [
                [Paragraph("The Car-Seat &ldquo;Elbow Hook&rdquo; Hack", st["h4"]), Paragraph("Instead of gripping an infant car-seat handle with a cranked wrist, slide your forearm through the handle arch so biceps &amp; shoulder carry it smoothly!", st["small"])],
                [Paragraph("Bathtub Kneeling Rescue", st["h4"]), Paragraph("Fold a thick memory-foam bath mat twice under sore knees and rest chest elbows along tub rim rather than hovering twisted mid-air.", st["small"])],
            ]
        )
    )
    story.append(Spacer(1, 9))
    story.append(
        callout(
            "<b>Turn Daily Motherhood Into Hidden Strength:</b> Every chair stand holding baby cleanly (heels planted, exhale upright) builds the exact glutes and legs you want — zero extra schedule slots needed!",
            st,
            kind="sage",
        )
    )
    story.append(PageBreak())

    # ── PAGE 16: DAYS 1-4 WORKOUTS ──
    story.extend(
        header_block(
            "Part 4 • Follow-Along Week 1 Blueprint",
            "Your Complete 7-Day Home Flow (Days 1–4)",
            "Follow one balanced theme each day. Busy night? Drop down to Speed 2 (Baby Awake) or Speed 3 (5-Min Rescue on p. 6) and still check your fridge box.",
            st,
        )
    )
    for w in data["WEEKLY_WORKOUTS"][:4]:
        story.append(
            CardBox(
                [
                    Paragraph(f"<b>{esc(w['day'])} — {esc(w['title'])}</b> &nbsp;<font color='#8A6173'>(15–20 min Speed 1)</font>", st["h4"]),
                    Paragraph(f"<b>Warmup:</b> {esc(w['warmup'])} &nbsp;|&nbsp; <b>Main Flow:</b> {esc(w['main'])}", st["small"]),
                    Paragraph(
                        f"<b>Cooldown:</b> {esc(w['cooldown'])} &nbsp;•&nbsp; <font color='#1E5631'><b>Baby-Awake Pivot:</b> {esc(w['awakeAlt'])}</font>",
                        st["small"],
                    ),
                ],
                pad_y=8,
            )
        )
        story.append(Spacer(1, 7))
    story.append(
        callout(
            "<b>60-Second Pre-Start Living-Room Setup:</b> Clear a 5×5 ft rug space, keep a sturdy dining chair within reach, set your filled water bottle on a coaster, and press play barefoot or in grip socks!",
            st,
            kind="sage",
        )
    )
    story.append(PageBreak())

    # ── PAGE 17: DAYS 5-7 & REBOOT ──
    story.extend(
        header_block(
            "Part 4 • Finishing Strong & Restarting Gracefully",
            "Days 5–7 + The &ldquo;Missed 5 Days&rdquo; Zero-Guilt Reboot",
            None,
            st,
        )
    )
    for w in data["WEEKLY_WORKOUTS"][4:]:
        is_sun = "Sun" in w["day"]
        tag = "Active Rest" if is_sun else "15–20 min Speed 1"
        story.append(
            CardBox(
                [
                    Paragraph(f"<b>{esc(w['day'])} — {esc(w['title'])}</b> &nbsp;<font color='#8A6173'>({tag})</font>", st["h4"]),
                    Paragraph(f"<b>Warmup:</b> {esc(w['warmup'])} &nbsp;|&nbsp; <b>Main Flow:</b> {esc(w['main'])}", st["small"]),
                    Paragraph(
                        f"<b>Cooldown:</b> {esc(w['cooldown'])} &nbsp;•&nbsp; <font color='#1E5631'><b>Note:</b> {esc(w['awakeAlt'])}</font>",
                        st["small"],
                    ),
                ],
                bg=C_SAGE_LIGHT if is_sun else C_WHITE,
                border=C_SAGE_BORDER if is_sun else C_OUTER_BORDER,
                pad_y=8,
            )
        )
        story.append(Spacer(1, 7))
    story.append(
        callout(
            "<b>The &ldquo;Missed 4 Days Because of Baby Cold / Travel&rdquo; Reboot Rule:</b><br/>"
            "1. <b>Never &ldquo;Double Up&rdquo; Tomorrow:</b> Making up 3 missed days in one exhausting session triggers soreness and quitting.<br/>"
            "2. <b>Start With Speed 3 First Day Back:</b> Do ONLY the 5-Min Rescue (p. 6) on your first morning back.<br/>"
            "3. <b>Resume Wherever the Calendar Sits:</b> You haven&apos;t lost anything — simply continue from Today!",
            st,
            kind="peach",
        )
    )
    story.append(Spacer(1, 7))
    story.append(
        CardBox(
            [
                Paragraph("The &ldquo;Baby Woke Up 6 Minutes Into My Session&rdquo; Save-Progress Rule", st["h4"]),
                Paragraph(
                    "Did you finish warmup + 2 main exercises before the monitor lit up? Congratulations — that STILL counts as an active session! Do 3 calming neck rolls later over dinner prep and check your box.",
                    st["small"],
                ),
            ],
            bg=C_SAGE_LIGHT,
            border=C_SAGE_BORDER,
        )
    )
    story.append(PageBreak())

    # ── PAGE 18: ONE-STOVE KITCHEN (WITH REAL PHOTO) ──
    story.extend(
        header_block(
            "Part 5 • Real Home Kitchens",
            "The One-Stove Family Pot (Zero Separate Meals)",
            "Moms abandon wellness plans when meals demand separate pots, exotic groceries, or guilt over eating traditional rice, rotis, or idlis with family.",
            st,
        )
    )
    story.append(RoundedPhoto(img("one-stove-meals.jpg"), INNER_W, 120, radius=11, crop_y=0.45))
    story.append(Spacer(1, 7))
    story.append(
        GridRow(
            [
                [
                    Paragraph("The &ldquo;Kid-First Extraction&rdquo; Method", st["h4_sage"]),
                    Paragraph("1. Cook one iron- &amp; protein-rich family base pot (dal, khichdi, sambar, stew, eggs).", st["tiny"]),
                    Paragraph("2. Scoop smooth kid portions cleanly BEFORE adding chilies or sharp tempering.", st["tiny"]),
                    Paragraph("3. Add 1 topper to YOUR bowl: salad, tadka, fresh lemon squeeze, or 1–2 boiled eggs/paneer.", st["tiny"]),
                ],
                [
                    Paragraph("Simple Mom Plate Formula (No Apps!)", st["h4"]),
                    Paragraph("• <b>1/4 Protein Anchor:</b> Dal, paneer, curd, eggs, tofu, fish, chicken — stops 3 PM crashes.", st["tiny"]),
                    Paragraph("• <b>1/2 Color &amp; Crunch:</b> Sabzi, poriyal, cucumber/carrots, spinach, or salad.", st["tiny"]),
                    Paragraph("• <b>1/4 Slow Carb + Good Fat:</b> Phulkas, rice, idlis, oats + 1 tsp ghee/olive oil.", st["tiny"]),
                ],
            ],
            col_configs=[{"bg": C_SAGE_LIGHT, "border": C_SAGE_BORDER}, {"bg": C_WHITE}],
            pad_y=7,
        )
    )
    story.append(Spacer(1, 7))
    story.append(Paragraph("Real Walkthrough: Turning One Base Pot Into 3 Happy Family Bowls", st["h3"]))
    story.append(
        GridRow(
            [
                [Paragraph("Base Cooker Pot", st["h4"]), Paragraph("Simmer plain yellow moong dal + turmeric + grated lauki/carrot in 12 mins.", st["tiny"])],
                [Paragraph("Scoop Kid Bowls First", st["h4"]), Paragraph("Mash softly with 1/2 tsp warm ghee &amp; soft rice — creamy, zero chili tears.", st["tiny"])],
                [Paragraph("Upgrade Mom&apos;s Bowl", st["h4_sage"]), Paragraph("Stir fresh palak or 2 boiled eggs + garlic tadka + 1/2 squeeze lemon!", st["tiny"])],
            ],
            col_configs=[{}, {}, {"bg": C_SAGE_LIGHT, "border": C_SAGE_BORDER}],
            pad_y=7,
        )
    )
    story.append(Spacer(1, 7))
    story.append(
        callout(
            "<b>Postpartum &amp; Nursing Nutrient Focus:</b> Prioritize daily <b>Iron + Vitamin C</b> (palak, chana, eggs + lemon), <b>Calcium</b> (curd, ragi, paneer), and <b>B12/Protein</b>.",
            st,
            kind="peach",
            pad_y=7,
        )
    )
    story.append(PageBreak())

    # ── PAGE 19: HYDRATION BLUEPRINT ──
    story.extend(
        header_block(
            "Part 5 • Nursing & Energy Hydration",
            "The 1-Bottle-Per-Room Hydration Shortcut",
            "Mild dehydration feels identical to brain fog, headache, and sudden 3 PM sugar hunger. Pair every glass with a cue you already do daily.",
            st,
        )
    )
    left_tbl = make_table(
        ["Daily Trigger", "Glass Target"],
        [
            ["Wake up / Kettle boil", "1 tall warm glass (#1)"],
            ["Breakfast + Morning feed", "2 glasses (#2–#3)"],
            ["Mid-morning / Walk", "1–2 glasses (#4–#5)"],
            ["Before &amp; After Lunch", "2 glasses (#6–#7)"],
            ["3 PM Chaas / Tea Reset", "1–2 glasses (#8–#9)"],
            ["Dinner + Bedside bottle", "1–2 glasses (#10–#11)"],
        ],
        [128, 108],
        st,
        tight=True,
    )
    story.append(
        GridRow(
            [
                [Paragraph("Daily Habit-Stack Map", st["h4"]), left_tbl],
                [
                    Paragraph("Nursing vs. Non-Nursing Goals", st["h4"]),
                    Paragraph("<b>Nursing Moms:</b> Target <b>10–11 glasses (2.5–3 L)</b> across the day; keep a straw tumbler by your nursing pillow.", st["small"]),
                    Paragraph("<b>Non-Nursing Moms:</b> Target <b>8 glasses (2 L)</b> consistently.", st["small"]),
                    Spacer(1, 4),
                    Paragraph("Zero-Sugar Hydration Boosters", st["h4"]),
                    Paragraph("• Spiced buttermilk (<i>neer mor / chaas</i>) with jeera<br/>• Fresh tender coconut water<br/>• Warm jeera-ajwain-saunf water<br/>• Nimbu pani with rock salt &amp; mint", st["small"]),
                ],
            ],
            col_configs=[{"bg": C_WARM_WHITE}, {"bg": C_SAGE_LIGHT, "border": C_SAGE_BORDER}],
        )
    )
    story.append(Spacer(1, 10))
    story.append(
        GridRow(
            [
                [Paragraph("Thirst Disguised as Hunger Check", st["h4"]), Paragraph("Darker urine, dry lips while feeding, or sudden cookie cravings at 3 PM often fade 15 minutes after 1 full glass of chaas or cool lemon water.", st["small"])],
                [Paragraph("Chai &amp; Coffee Timing Without Jitters", st["h4"]), Paragraph("Pair your morning cup AFTER eating 10g protein (egg/chilla/nuts/curd) and chase every cup with equal plain water so afternoon crashes disappear.", st["small"])],
            ]
        )
    )
    story.append(PageBreak())

    # ── PAGE 20: 15-MIN SUNDAY PREP ──
    story.extend(
        header_block(
            "Part 5 • Zero-Burnout Kitchen Prep",
            "The 15-Minute Sunday Prep (4 Micro-Tasks Only)",
            "Forget exhausting 3-hour Sunday meal-prep marathons packing 21 identical plastic boxes. Do these four quick 4-minute tasks while tea boils.",
            st,
        )
    )
    story.append(
        GridRow(
            [
                [Paragraph("Task 1 (4 Mins): Double Pot of Protein", st["h4"]), Paragraph("Pressure-cook double moong/toor dal, chickpeas, or shred 400g gently spiced chicken. Half feeds Mon–Tue; freeze half for Thu emergencies.", st["small"])],
                [Paragraph("Task 2 (4 Mins): Chop &amp; Box Veggies", st["h4"]), Paragraph("Wash cucumber &amp; carrots once; box chopped onions/tomatoes airtight so weekday egg bhurji, upma, and omelettes cook in half the time.", st["small"])],
            ]
        )
    )
    story.append(Spacer(1, 8))
    story.append(
        GridRow(
            [
                [Paragraph("Task 3 (3 Mins): Boil 6 Eggs + 1 Jar", st["h4"]), Paragraph("Boil 6 eggs cleanly in shells for 3 days of instant peel protein. Dry-roast 2 cups makhana or chana into one reach-away counter jar.", st["small"])],
                [Paragraph("Task 4 (4 Mins): Stock Base Jar/Batter", st["h4"]), Paragraph("Refill fresh idli/dosa batter, make 2 berry chia overnight oat jars, or knead atta for 2 days. Morning chaos becomes grab-and-pour!", st["small"])],
            ]
        )
    )
    story.append(Spacer(1, 9))
    story.append(Paragraph("The &ldquo;Magic Counter/Fridge Jars&rdquo; That Save Weak Nights", st["h3"]))
    story.append(
        GridRow(
            [
                [Paragraph("1. Mint-Coriander Chutney", st["h4"]), Paragraph("Turns boring leftover roti/eggs/toast into instant fresh wraps.", st["small"])],
                [Paragraph("2. Roasted Trail Mix Jar", st["h4"]), Paragraph("Almonds, pumpkin seeds &amp; roasted chana right beside nursery chair.", st["small"])],
                [Paragraph("3. Pre-Grated Carrot Box", st["h4"]), Paragraph("Toss 1 handful into curd rice, dosa batter, soups, or pasta in 3 secs!", st["small"])],
            ]
        )
    )
    story.append(Spacer(1, 9))
    story.append(
        callout(
            "<b>Emergency Freezer Bank Rule:</b> Whenever you cook rajma, chole, sambar, or lentil soup cleanly on a calmer evening, ladle 2 extra mugs into freezer zip bags flat. Next sick-baby week = 5-minute dinner!",
            st,
            kind="sage",
        )
    )
    story.append(PageBreak())

    # ── PAGES 21–27: ALL 4 REGIONAL MENUS & GROCERIES ──
    menus = data["REGIONAL_MENUS"]
    story.extend(
        regional_menu_page(
            menus["north_indian"],
            "Always squeeze 1/2 lemon onto palak paneer, rajma, or poha — Vitamin C doubles plant iron absorption.",
            "Mix leftover boiled dal + whole-wheat atta directly into dough to roll soft, high-protein parathas in 6 mins!",
            st,
        )
    )
    story.extend(
        regional_grocery_page(
            "North Indian 7-Day Categorized Shopping List",
            "Check your pantry first — most staples are already sitting in your masala dabba & grain shelf!",
            menus["north_indian"]["groceries"],
            "Pressure-cook double moong dal / rajma once → serve warm chawal Monday + roll leftover rajma into a whole-wheat wrap with curd on Wednesday.",
            "Out of paneer or fresh greens on Friday? Whisk besan + chopped onion + turmeric into 4-min chillas paired with spiced curd, or toss boiled eggs over dal tadka!",
            st,
        )
    )
    story.extend(
        regional_menu_page(
            menus["south_indian"],
            "Ragi dosa + sambar + curry leaves deliver natural plant calcium & iron — pair curd rice at a separate meal from high-iron greens.",
            "Keep pre-washed coriander & grated carrot ready to whip cooling, gut-friendly Curd Rice in under 4 minutes!",
            st,
        )
    )
    story.extend(
        regional_grocery_page(
            "South Indian 7-Day Categorized Shopping List",
            "Lightweight probiotic & millet staples built around fermented batters, sambar, curd rice, and easy fish/egg options.",
            menus["south_indian"]["groceries"],
            "Pre-boil 1 cup toor dal with turmeric twice weekly so veggie sambar takes only 8 minutes on weekday mornings. Grate extra carrot into curd rice!",
            "Leftover plain idlis getting dry? Crumble idlis coarsely and sauté 3 minutes with mustard seeds, curry leaves, turmeric & peanuts for instant Idli Upma!",
            st,
        )
    )
    story.extend(
        regional_menu_page(
            menus["all_india"],
            "Pair morning poha or sprouts with fresh lemon juice & enjoy buttermilk (chaas) with roasted cumin after heavy lunches for calm digestion.",
            "Leftover rajma, dal, or sabzi makes an effortless toasted whole-wheat kathi-style lunch wrap in 5 minutes flat!",
            st,
        )
    )
    story.extend(
        regional_menu_page(
            menus["western_global"],
            "Top spinach salads or lentil soup with squeezed lemon/bell peppers and pair whole-grain toast with avocado or eggs for steady blood sugar.",
            "Keep pre-washed salad greens + rotisserie chicken or canned chickpeas stocked to assemble zero-stove power bowls in 4 mins!",
            st,
        )
    )

    # PAGE 27: GLOBAL GROCERY + EMERGENCY DINNERS
    story.extend(
        header_block(
            "Part 6 • Global Basket & Cross-Region Saves",
            "Global Shopping List + 10-Min Emergency Dinners",
            None,
            st,
        )
    )
    gcol_w = (INNER_W - 18) / 3.0 - 20
    g_cols = []
    for g in menus["western_global"]["groceries"]:
        c_items = [Paragraph(esc(g["cat"]), st["h4"])]
        for it in g["items"]:
            c_items.append(CheckRow(esc(it), st["tiny"], gcol_w))
        g_cols.append(c_items)
    story.append(GridRow(g_cols, pad_y=7))
    story.append(Spacer(1, 8))
    story.append(Paragraph("Cross-Region 10-Minute Emergency Dinner Matrix (When Everyone Is Crying at 7 PM)", st["h3"]))
    erows = [[f"<b>{esc(e['meal'])}</b>", esc(e["region"]), esc(e["time"]), esc(e["tip"])] for e in data["EMERGENCY_DINNERS"]]
    story.append(make_table(["Emergency Meal", "Region", "Time", "Zero-Stress Mom Tip"], erows, [155, 75, 45, 225], st, tight=True))
    story.append(Spacer(1, 8))
    story.append(
        callout(
            "<b>Keep This 6-Item &ldquo;Never-Order-Junk&rdquo; Pantry Shield Always Stocked:</b> Rolled oats · Yellow moong dal · Eggs (or Greek yogurt) · Whole-grain wraps/atta · Frozen peas/spinach · Peanut butter or roasted chana!",
            st,
            kind="sage",
        )
    )
    story.append(PageBreak())

    # ── PAGE 28: EVENING DOWNSHIFT ──
    story.extend(
        header_block(
            "Part 7 • Recovery Between Night Feeds",
            "The 6-Minute Bedtime Nervous-System Downshift",
            "You can&apos;t control when baby wakes — but you CAN control whether your body drops into deep restorative sleep within 10 minutes instead of doom-scrolling &ldquo;tired-but-wired&rdquo; until midnight.",
            st,
        )
    )
    story.append(
        GridRow(
            [
                [
                    Paragraph("6-Minute Floor/Bedside Wind-Down", st["h4_sage"]),
                    Paragraph("<b>1. 2 Min Legs-Up Couch Prop:</b> Rest calves on sofa cushion or bed pillows to drain heavy ankle swelling.", st["small"]),
                    Paragraph("<b>2. 1 Min Wide-Knee Child&apos;s Pose:</b> Rest forehead calmly onto bed pillow, breathing wide into lower back.", st["small"]),
                    Paragraph("<b>3. 1 Min Neck Melt &amp; Jaw Drop:</b> Drop tongue off roof of mouth and let teeth part slightly.", st["small"]),
                    Paragraph("<b>4. 2 Min Ten 4-6 Calming Breaths:</b> 4s soft nose inhale → 6s slow sighing exhale before eyes shut.", st["small"]),
                ],
                [
                    Paragraph("3 Sleep Protectors for Broken-Night Moms", st["h4"]),
                    Paragraph("• <b>Swap Scrolling for Audio:</b> Blue light after 10 PM delays melatonin for hours even when eyelids ache.", st["small"]),
                    Paragraph("• <b>2-Min Closing Kitchen Reset:</b> Fill tomorrow&apos;s tumbler + set out walking shoes so morning decisions drop to zero.", st["small"]),
                    Paragraph("• <b>Magnesium Bedtime Sip:</b> Warm milk/almond milk with pinch nutmeg or pumpkin seeds settles calves.", st["small"]),
                ],
            ],
            col_configs=[{"bg": C_SAGE_LIGHT, "border": C_SAGE_BORDER}, {"bg": C_WHITE}],
        )
    )
    story.append(Spacer(1, 9))
    story.append(Paragraph("What To Do When Baby Falls Back Asleep at 2:30 AM (But Your Brain Races)", st["h3"]))
    story.append(
        GridRow(
            [
                [Paragraph("Zero Clock-Checking Rule", st["h4"]), Paragraph("Never calculate &ldquo;If I sleep now I get 3.5 hrs.&rdquo; Turn phone face down permanently.", st["small"])],
                [Paragraph("Progressive Shoulder Drop", st["h4"]), Paragraph("Squeeze fists gently 3 secs then melt arms heavy into mattress + sigh long exhale.", st["small"])],
                [Paragraph("Warm Foot Rescue", st["h4"]), Paragraph("Cold feet block sleep onset — slip soft cotton socks on so body drops off 2x faster.", st["small"])],
            ]
        )
    )
    story.append(Spacer(1, 9))
    story.append(
        callout(
            "<b>Remember Tonight:</b> Lying calmly in a dark room with slow 4-6 nasal breathing still restores your nervous system far better than tense worrying about lost sleep hours.",
            st,
            kind="peach",
        )
    )
    story.append(PageBreak())

    # ── PAGE 29: 3 PM CRAVINGS ──
    story.extend(
        header_block(
            "Part 7 • Craving Biology, Not Lack of Willpower",
            "Stopping the 3 PM Sugar Crash (The &ldquo;Add, Don&apos;t Punish&rdquo; Rule)",
            "Craving biscuits, rusks, chocolates, or fried snacks at 3–4 PM isn&apos;t weakness — it&apos;s your exhausted brain crying for quick fuel after a low-protein morning or skipped water.",
            st,
        )
    )
    crows = [[f"<b>{esc(c['craving'])}</b>", esc(c["why"]), esc(c["swap"])] for c in data["CRAVING_SWAPS"]]
    story.append(make_table(["Common Afternoon Craving", "Real Biological Trigger", "\"Add, Don't Punish\" Satisfying Upgrade"], crows, [145, 130, 225], st))
    story.append(Spacer(1, 9))
    story.append(Paragraph("6 One-Handed &ldquo;Protein + Fiber&rdquo; Combos (Takes Under 90 Seconds)", st["h3"]))
    combos = [
        ("1. Crisp + Creamy", "1 sliced apple + 1 tbsp peanut or almond butter + pinch cinnamon."),
        ("2. Savory Indian Crunch", "Handful roasted chana + spiced buttermilk (chaas) in tall steel glass."),
        ("3. Warm Sweet Comfort", "Greek yogurt or thick curd + berries/pomegranate + 4 crushed walnuts."),
        ("4. 30-Sec Boiled Power", "2 chilled pre-boiled eggs dusted with black pepper + rock salt."),
        ("5. Light Crunchy Bowl", "1 cup ghee-roasted makhana tossed gently with turmeric & chaat masala."),
        ("6. Salty Toddler Share", "Cucumber & carrot batons dipped into classic hummus or cheese cubes."),
    ]
    for i in range(0, 6, 3):
        story.append(
            GridRow([[Paragraph(esc(t), st["h4"]), Paragraph(esc(d), st["small"])] for t, d in combos[i : i + 3]], pad_y=7)
        )
        story.append(Spacer(1, 7))
    story.append(
        callout(
            "<b>The 10-Second Rule Before Grabbing Kids&apos; Leftovers:</b> Ask kindly, <i>&ldquo;Am I hungry, dehydrated, or just deeply overstimulated?&rdquo;</i> Drink 1 glass water, sit comfortably for 4 breaths, then eat a real plate cleanly!",
            st,
            kind="peach",
        )
    )
    story.append(PageBreak())

    # ── PAGE 30: BLANK MENU & GROCERY PLANNER ──
    story.extend(
        header_block(
            "Part 8 • Printable Fridge Sheet #1",
            "Fill-In Weekly Family Menu &amp; 1×–4× Market Planner",
            "Print multiple copies! Pick 2–3 easy rotating breakfasts and 1–2 repeating batch dinners so weekday grocery lists take under 3 minutes.",
            st,
        )
    )
    blank_rows = [[f"<b>{d}</b>", Spacer(1, 20), Spacer(1, 20), Spacer(1, 20), Spacer(1, 20)] for d in ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]]
    story.append(make_table(["Day", "Breakfast", "Lunch (One Pot)", "Dinner", "3 PM Snack"], blank_rows, [45, 112, 120, 120, 103], st, tight=True))
    story.append(Spacer(1, 9))
    g_w = (INNER_W - 18) / 3.0 - 20
    story.append(
        GridRow(
            [
                [Paragraph("Produce to Buy", st["h4"]), BlankLines(count=5, width=g_w)],
                [Paragraph("Grains, Dal &amp; Snacks", st["h4"]), BlankLines(count=5, width=g_w)],
                [Paragraph("Curd, Eggs &amp; Protein", st["h4"]), BlankLines(count=5, width=g_w)],
            ]
        )
    )
    story.append(Spacer(1, 9))
    story.append(
        callout(
            "<b>3-Min Sunday Pantry Check:</b> Check oil/ghee, spices, curd &amp; egg counts before ordering! Scaling for a household of 4? Simply write <b>(×2)</b> beside produce + grains above.",
            st,
            kind="sage",
        )
    )
    story.append(PageBreak())

    # ── PAGE 31: WEEK 1 ZERO-GUILT FRIDGE TRACKER ──
    story.extend(
        header_block(
            "Part 8 • Printable Fridge Sheet #2",
            "Week 1 Zero-Guilt Fridge Tracker (Even 5 Mins Count!)",
            "Circle or tick the mode you did each day — Speed 1 (20m), Speed 2 (Awake), Speed 3 (5m Rescue), or Rest — fill water circles, and jot one tiny daily win.",
            st,
        )
    )
    f_rows = [
        [
            f"<b>{d}</b>",
            ModeCheckboxes(),
            WaterTrackerCircles(11),
            CheckRow("Stretched", st["tiny"], 72),
            Spacer(1, 18),
        ]
        for d in ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    ]
    story.append(
        make_table(
            ["Day", "Today's Mode Completed", "Water Glasses (8–11)", "2 AM Care", "One Small Win"],
            f_rows,
            [36, 166, 130, 74, 94],
            st,
        )
    )
    story.append(Spacer(1, 9))
    story.append(
        CardBox(
            [
                Paragraph("End-of-Week Reflection (Zero Judgment — Celebrate What Actually Felt Good!)", st["h4"]),
                Paragraph("What helped most on my hardest day this week? __________________________________________________________", st["small"]),
                Spacer(1, 4),
                Paragraph("What 1 small support will make Week 2 easier? __________________________________________________________", st["small"]),
            ]
        )
    )
    story.append(Spacer(1, 9))
    story.append(
        callout(
            "<b>Week 1 Rule:</b> Showing up 4+ days in <i>any</i> mode means Week 1 was a massive victory. Celebrate consistency — intensity can wait!",
            st,
            kind="sage",
        )
    )
    story.append(PageBreak())

    # ── PAGE 32: WEEKS 2-4 CONTINUITY MOSAIC ──
    story.extend(
        header_block(
            "Part 8 • Printable Fridge Sheet #3",
            "Weeks 2–4 Habit Continuity &amp; Non-Scale Wins",
            "Check any box after completing 5–20 minutes of movement, stretching, or mindful recovery across Days 8–28.",
            st,
        )
    )
    w_col_w = (INNER_W - 18) / 3.0 - 20
    story.append(
        GridRow(
            [
                [Paragraph("Week 2 • Steady Posture", st["h4"])]
                + [CheckRow(f"<b>Day {n}:</b> [ ] Done / [ ] Rest", st["tiny"], w_col_w) for n in range(8, 15)],
                [Paragraph("Week 3 • Core &amp; Pelvic Ease", st["h4"])]
                + [CheckRow(f"<b>Day {n}:</b> [ ] Done / [ ] Rest", st["tiny"], w_col_w) for n in range(15, 22)],
                [Paragraph("Week 4 • Confident Flow", st["h4"])]
                + [CheckRow(f"<b>Day {n}:</b> [ ] Done / [ ] Rest", st["tiny"], w_col_w) for n in range(22, 29)],
            ]
        )
    )
    story.append(Spacer(1, 9))
    v_w = (INNER_W - 30) / 2.0
    story.append(
        CardBox(
            [
                Paragraph("Non-Scale Victory Checklist (Check As You Notice Real-Life Changes!)", st["h4_sage"]),
                Spacer(1, 3),
                GridRow(
                    [
                        CardBox(
                            [
                                CheckRow("Woke up with less neck &amp; upper-back tightness", st["tiny"], v_w),
                                CheckRow("Scooped baby cleanly with softer wrists", st["tiny"], v_w),
                                CheckRow("Carried stroller/groceries upstairs without panting", st["tiny"], v_w),
                            ],
                            width=v_w,
                            bg=None,
                            border=None,
                            pad_x=0,
                            pad_y=0,
                        ),
                        CardBox(
                            [
                                CheckRow("Ate calm protein before 3 PM biscuit crash hit", st["tiny"], v_w),
                                CheckRow("Used 5-Min Rescue instead of quitting on hard weeks", st["tiny"], v_w),
                                CheckRow("Felt calmer breath when kids melted down", st["tiny"], v_w),
                            ],
                            width=v_w,
                            bg=None,
                            border=None,
                            pad_x=0,
                            pad_y=0,
                        ),
                    ],
                    width=INNER_W - 22,
                    gap=8,
                ),
            ],
            bg=C_SAGE_LIGHT,
            border=C_SAGE_BORDER,
        )
    )
    story.append(Spacer(1, 9))
    story.append(
        CardBox([Paragraph("28-Day Milestone Notes &amp; Clothes/Energy Shift (Optional):", st["h4"]), BlankLines(count=3, width=INNER_W - 24)])
    )
    story.append(PageBreak())

    # ── PAGE 33: DAY 1 VS DAY 28 PROGRESS JOURNAL ──
    story.extend(
        header_block(
            "Part 8 • Printable Journal Page #4",
            "Personal Strength, Comfort &amp; Energy Check-In",
            "Track what actually improves your quality of motherhood over the next 4 weeks — energy, grip, comfort, digestion, and mood rather than harsh daily scale pressure.",
            st,
        )
    )
    jrows = [
        [f"<b>{esc(m)}</b>", "_____ / 10", "_____ / 10", "_____ / 10"]
        for m in [
            "Morning Energy After Broken Sleep",
            "Thumb / Wrist Comfort Picking Up Baby",
            "Mid-Back & Nursing Neck Ease",
            "Lower Belly Strength & Confidence",
            "3 PM Steady Mood (Less Sugar Crashes)",
            "Pelvic Comfort on Walks & Stairs",
        ]
    ]
    story.append(make_table(["How My Body Feels (1 = Tough · 10 = Great)", "Day 1 Score", "Day 14 Score", "Day 28 Score"], jrows, [230, 90, 90, 90], st))
    story.append(Spacer(1, 10))
    story.append(
        CardBox(
            [
                Paragraph("Favorite One-Stove Family Meals I Want to Repeat Next Month:", st["h4"]),
                BlankLines(count=3, width=INNER_W - 24),
                Spacer(1, 6),
                Paragraph("One Gentle Self-Care Promise I Keep Going Into Month 2:", st["h4"]),
                BlankLines(count=2, width=INNER_W - 24),
            ]
        )
    )
    story.append(Spacer(1, 9))
    story.append(
        callout(
            "<b>Celebrate Day 28 Reward Idea:</b> Pick a non-food celebration right now (solo long hot shower, quiet chai on the balcony, fresh book, or comfortable new loungewear)!",
            st,
            kind="peach",
        )
    )
    story.append(PageBreak())

    # ── PAGE 34: TEAR-OUT 2 AM POSTER ──
    poster1 = CardBox(
        [
            PillBadge("TEAR OUT & TAPE BY CRIB OR NURSING CHAIR", bg=C_PLUM, align="left"),
            Spacer(1, 10),
            Paragraph("2 AM 2-Minute Pain Reset Poster", st["h1"]),
            Paragraph("Done feeding? Don&apos;t go straight back to hunching. Take 90 calm seconds right where you sit:", st["lead"]),
            Spacer(1, 6),
            GridRow(
                [
                    [
                        PillBadge("1 · WRIST LIFT", bg=C_PEACH_BG, fg=C_PLUM, border=C_PEACH_BORDER, align="left"),
                        Spacer(1, 6),
                        Paragraph("Forearm Scoop Check", st["h3"]),
                        Paragraph("Keep thumb tucked neatly beside fingers (never hooked out at 90°). Scoop under baby&apos;s back and bottom with straight wrists.", st["small"]),
                    ],
                    [
                        PillBadge("2 · 30s TENDON TILT", bg=C_PEACH_BG, fg=C_PLUM, border=C_PEACH_BORDER, align="left"),
                        Spacer(1, 6),
                        Paragraph("Soft Thumb Release", st["h3"]),
                        Paragraph("Curl fingers gently over thumb, reach hand forward, tilt pinky slightly down until soft forearm stretch — never sharp pain.", st["small"]),
                    ],
                ],
                col_configs=[{"bg": C_WARM_WHITE}, {"bg": C_WARM_WHITE}],
                width=INNER_W - 32,
                pad_y=12,
            ),
            Spacer(1, 10),
            GridRow(
                [
                    [
                        PillBadge("3 · 45s CHEST UNWIND", bg=C_SAGE_BG, fg=C_SAGE_DARK, border=C_SAGE_BORDER, align="left"),
                        Spacer(1, 6),
                        Paragraph("Shoulder Drop Loop", st["h3"]),
                        Paragraph("Sweep both shoulders up, wide back behind you, and drop heavy down away from ears 8 times while sighing gently out.", st["small"]),
                    ],
                    [
                        PillBadge("4 · 4-6 BREATH", bg=C_SAGE_BG, fg=C_SAGE_DARK, border=C_SAGE_BORDER, align="left"),
                        Spacer(1, 6),
                        Paragraph("Sleep Signal", st["h3"]),
                        Paragraph("Softly drop jaw, nose inhale 4s → calm slow exhale 6s four times before lying on your side.", st["small"]),
                    ],
                ],
                col_configs=[{"bg": C_SAGE_LIGHT, "border": C_SAGE_BORDER}, {"bg": C_SAGE_LIGHT, "border": C_SAGE_BORDER}],
                width=INNER_W - 32,
                pad_y=12,
            ),
            Spacer(1, 14),
            CardBox(
                [Paragraph("<b>Water Check Before Returning to Pillow:</b> Take 4 large sips from your bedside bottle!", st["small"])],
                width=INNER_W - 32,
                bg=C_PEACH_BG,
                border=C_PEACH_BORDER,
                pad_y=10,
            ),
        ],
        width=INNER_W,
        bg=C_WHITE,
        border=C_PLUM,
        border_width=1.6,
        dashed=True,
        radius=14,
        pad_x=16,
        pad_y=18,
        fixed_height=636,
        valign="center",
    )
    story.append(poster1)
    story.append(PageBreak())

    # ── PAGE 35: TEAR-OUT SAFETY CHEAT SHEET ──
    poster2 = CardBox(
        [
            PillBadge("TAPE BY YOUR WORKOUT MAT OR KITCHEN FRIDGE", bg=C_SAGE_BG, fg=C_SAGE_DARK, border=C_SAGE_BORDER, align="left"),
            Spacer(1, 10),
            Paragraph("4-Question Safety Check Before Any Move", st["h1"]),
            Spacer(1, 6),
            CardBox(
                [
                    Paragraph("1. <b>Am I Holding My Breath?</b> If you hold your breath squeezing hard, lower the range and say <i>&ldquo;Exhale on Effort!&rdquo;</i>", st["lead"]),
                    Paragraph("2. <b>Does My Belly Dome Upward Like a Peak?</b> Stop crunches or full planks right away and drop down to Wall Push-Ups or Heel Slides.", st["lead"]),
                    Paragraph("3. <b>Does My Pelvic Floor Feel Heavy or Leaking?</b> Pause jumping or deep lunges immediately; prioritize calm seated strength &amp; Kegels with full relaxation.", st["lead"]),
                    Paragraph("4. <b>Am I Squeezing Sharp Incision or Knee Pinch?</b> Never &ldquo;push through sharp pinching.&rdquo; Use a cushion behind your chair squat or swap cleanly.", st["lead"]),
                ],
                width=INNER_W - 32,
                bg=C_WARM_WHITE,
                pad_x=14,
                pad_y=12,
            ),
            Spacer(1, 12),
            GridRow(
                [
                    [Paragraph("C-Section Lift Rule", st["h4"]), Paragraph("Log-roll side first off any floor mat; press up using hands calmly.", st["small"])],
                    [Paragraph("Minimum Effective Win", st["h4"]), Paragraph("Five calm pajama minutes beat skipping 20 minutes cleanly.", st["small"])],
                    [Paragraph("Doctor Reminder", st["h4"]), Paragraph("Confirm physician/OB clearance before new routines postpartum.", st["small"])],
                ],
                width=INNER_W - 32,
                pad_y=10,
            ),
            Spacer(1, 12),
            CardBox(
                [Paragraph("<b>Daily Permission Slip:</b> Listening to a tired body today IS discipline — it keeps you showing up for years, not days.", st["small"])],
                width=INNER_W - 32,
                bg=C_SAGE_BG,
                border=C_SAGE_BORDER,
                pad_y=10,
            ),
        ],
        width=INNER_W,
        bg=C_WHITE,
        border=C_PLUM,
        border_width=1.6,
        dashed=True,
        radius=14,
        pad_x=16,
        pad_y=18,
        fixed_height=636,
        valign="center",
    )
    story.append(poster2)
    story.append(PageBreak())

    # ── PAGE 36: CLOSING & NEXT STEP ──
    story.extend(
        header_block(
            "Closing Encouragement & Next Step",
            "You Don&apos;t Need Perfect Weeks — Just Gentle Next Moves",
            None,
            st,
        )
    )
    story.append(
        CardBox(
            [
                Paragraph("Dear Mama,", st["lead"]),
                Paragraph(
                    "Most fitness guides were built around empty calendars, uninterrupted sleep, and kitchens cooking only for one person. "
                    "If those plans made you feel behind, please hear this clearly: <b>you didn&apos;t fail the plan — the plan failed to fit motherhood.</b>",
                    st["lead"],
                ),
                Paragraph(
                    "Start with just 7 days of this handbook. Print Page 31, stick Page 34 beside your crib, drink your extra glass of water, "
                    "and celebrate every 5-minute rescue day just as loudly as your 20-minute strength days.",
                    st["lead"],
                ),
            ],
            bg=C_WARM_WHITE,
            pad_x=14,
            pad_y=12,
        )
    )
    story.append(Spacer(1, 10))
    story.append(
        GridRow(
            [
                [Paragraph("Week 1–2 Inside Fit Mom 20", st["h4"]), Paragraph("<b>Foundation &amp; Posture:</b> Gentle breath-synced foundation, shoulder-neck unwind, and safe joint warmup.", st["small"])],
                [Paragraph("Week 3–4 Inside Fit Mom 20", st["h4"]), Paragraph("<b>Core &amp; Confident Flow:</b> Pelvic floor stability, family meal rhythm, and steady daytime endurance.", st["small"])],
            ]
        )
    )
    story.append(Spacer(1, 10))
    story.append(
        CardBox(
            [
                Paragraph("Want All 28 Days Personalized &amp; Guided Step-by-Step?", st["h3"]),
                Paragraph(
                    "Inside the interactive <b>Fit Mom 20</b> membership (~₹17/day, 1-tap cancel, 7-day guarantee), every tool in this 36-page manual runs automatically for you:",
                    st["small"],
                ),
                Paragraph("• <b>Auto-Filtered 28-Day Workout Calendar:</b> Filters C-section, diastasis, knee, back &amp; pelvic moves from your quiz + <b>58 YouTube-guided form demos</b>.", st["small"]),
                Paragraph("• <b>1-Tap Mood Modes:</b> Instant Guided Timers for <i>Baby Awake</i>, <i>2 AM Wrist/Neck Relief</i>, &amp; <i>5-Min Rescue</i>.", st["small"]),
                Paragraph("• <b>Regional Family Meals + 1×–4× WhatsApp Groceries:</b> One-tap regional recipes &amp; scaled market lists.", st["small"]),
                Spacer(1, 5),
                Paragraph("<b>Open your personalized plan quiz anytime at:</b> https://fit-mom-28-aj.vercel.app/onboarding", st["small"]),
            ],
            bg=C_SAGE_BG,
            border=C_SAGE_BORDER,
            pad_x=13,
            pad_y=11,
        )
    )
    story.append(Spacer(1, 10))
    story.append(
        Paragraph(
            "© Fit Mom 20 • Educational wellness guide only — not medical advice. Always confirm postpartum exercise clearance with your doctor.",
            st["cover_disc"],
        )
    )

    doc = HandbookDoc(out_pdf, PAGE_LABELS)
    doc.build(story)
    print(f"ReportLab rendered {doc.page} pages to {out_pdf} cleanly.")
    if doc.page != 36:
        raise RuntimeError(f"Expected strictly 36 pages, got {doc.page} (adjust vertical spacing!)")


if __name__ == "__main__":
    json_path, out_pdf, img_dir = sys.argv[1], sys.argv[2], sys.argv[3]
    with open(json_path, "r", encoding="utf-8") as f:
        payload = json.load(f)
    build_pdf(payload, out_pdf, img_dir)
