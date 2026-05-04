# Health Sherpa — Project Documentation

> **Last updated:** May 4, 2026
> **Owner:** Scotty (cameron.palmer741@gmail.com)
> **Files:** `C:\Users\camer\OneDrive\Desktop\Claude Saves (Client)\Health Sherpa\`

---

## 1. Vision & Purpose

Health Sherpa is a comprehensive, interactive HTML document that serves as a **personal nutrition, structure, and sustainability plan**. It is designed as a progressive, phased guide that walks a single user (Scotty) through transitioning from a DoorDash-heavy, unstructured eating pattern to a self-sustaining Mediterranean + Indian fusion cooking lifestyle.

**Core design philosophy:**
- "Food you actually want to eat" — not restriction, not default chaos, but a deliberate northstar
- Two cuisines, one grocery list — Mediterranean and Indian share enough ingredient overlap (olive oil, chickpeas, cumin, tomatoes, yogurt, chicken thighs) to minimize waste and cost
- Progressive complexity — start with breakfast swaps and build toward full batch cooking over ~4 phases
- ADHD-aware — the plan accounts for executive function challenges with pre-built schedules, depression-day floor plans, and minimal decision points
- Financial sustainability — reducing from ~$2,200/mo (DoorDash + Instacart waste) to $650-800/mo

---

## 2. File Architecture

```
Health Sherpa/
├── index.html          (~6,000+ lines) — All content, phases, and structure
├── styles.css          (~950+ lines)   — All styling, theming, component CSS
├── script.js           (~148 lines)    — Toggle, navigation, print, theme functions
└── merged_complete.html                — Backup of the original single-file version
```

The project was originally a single monolithic HTML file. It was split into the three-file architecture during this project's development. The `merged_complete.html` is the pre-split backup.

---

## 3. Technical Architecture

### 3.1 Theming System
CSS custom properties power the entire visual system:

```css
--bg: #0F1117;           /* Background */
--card: #1A1D27;         /* Card surfaces */
--sidebar: #0B0D14;      /* Sidebar background */
--border: #2A2D3A;       /* Borders */
--text: #E2E8F0;         /* Primary text */
--text-muted: #94A3B8;   /* Secondary text */
--text-dim: #64748B;     /* Tertiary/dim text */

/* Phase colors (used for borders, badges, accents) */
--phase0: #64748B;       /* Gray — Setup */
--phase1: #3B82F6;       /* Blue — Foundation */
--phase2: #10B981;       /* Green — Movement + Lunch */
--phase3: #F59E0B;       /* Amber — Batch Cook */
--phase4: #EF4444;       /* Red — Full Northstar */

/* Cuisine colors */
--mediterranean: #22D3EE;  /* Cyan */
--indian: #FB923C;         /* Orange */
--northstar: #A78BFA;      /* Purple */
--accent: #6C63FF;         /* Indigo */
```

Light/dark theme toggle is supported via `[data-theme="light"]` CSS overrides and `toggleTheme()` in JS. Theme preference is persisted in `localStorage`.

### 3.2 Section / Sub-Section Collapsible System

**Sections** are the major content areas (phases, reference sections). They use:
```html
<div class="section" id="phase1">
  <div class="section-header" onclick="toggleSection(this)">...</div>
  <div class="section-body">
    <!-- sub-sections go here -->
  </div>
</div>
```

**Sub-sections** are collapsible content blocks within a section. They use:
```html
<div class="sub-section sub-open">  <!-- sub-open = starts expanded -->
  <div class="sub-header" onclick="toggleSub(this.parentElement)">
    <span class="sub-icon">emoji</span> Title
  </div>
  <div class="sub-content">
    <!-- content here -->
  </div>
</div><!-- /sub-section -->
```

**Critical rule:** Every `<div class="sub-section">` must have matching `</div><!-- /sub-section -->` closers WITHIN its parent `section-body`. Sub-sections must never bleed across section boundaries. This was a major bug that was fixed — see Section 6.

**State conventions:**
- `class="sub-section sub-open"` = starts expanded (used for new/current-phase content)
- `class="sub-section"` (no `sub-open`) = starts collapsed (used for carried-forward content from earlier phases)

### 3.3 Card Systems

The document uses several distinct card component patterns:

**Breakfast cards** (`bf-meal`, `bf-meal-yogurt`, `bf-meal-eggs`):
```html
<div class="bf-meal bf-meal-eggs">
  <div class="bf-meal-top">
    <span class="bf-meal-icon">emoji</span>
    <div class="bf-meal-header">
      <div class="bf-meal-name">Name <span class="bf-badge-new">NEW</span></div>
      <div class="bf-meal-days">Mon, Wed</div>
    </div>
  </div>
  <div class="bf-badges">
    <span class="bf-badge bf-badge-time">time</span>
    <span class="bf-badge bf-badge-cal">calories</span>
  </div>
  <div class="bf-ingredients-label">What goes in</div>
  <div class="bf-ingredients">
    <span class="bf-ingredient">ingredient</span>
  </div>
  <div class="bf-note">Optional note</div>
</div>
```

**Recipe cards** (expandable, grid-based with row-toggle):
```html
<div class="recipe-grid">
  <div class="recipe-card" onclick="toggleRecipe(this)">
    <div class="recipe-card-header">
      <span class="recipe-icon">emoji</span>
      <div>
        <div class="recipe-name">Name</div>
        <div class="recipe-tags">
          <span class="recipe-tag recipe-tag-med">Mediterranean</span>
          <span class="recipe-tag recipe-tag-new">NEW</span>
        </div>
      </div>
    </div>
    <div class="recipe-details">
      <!-- Expanded content: time, servings, ingredients, instructions -->
    </div>
  </div>
</div>
```

**Spice cards** (`sc-card`, `sc-grid`) — expandable with row-toggle, contain flavor chips and usage info.

**Action cards** (Phase 0 setup) — visual task cards with icons and descriptions.

### 3.4 Badge / Tag System

```css
/* NEW badge (green, pulses 3 times) */
.bf-badge-new, .recipe-tag-new { background: rgba(16,185,129,0.18); color: #34d399; }
@keyframes pulse-new { 0%,100% { opacity:1 } 50% { opacity:0.7 } }

/* CARRIED badge (dim gray) */
.bf-badge-carried, .recipe-tag-carried { background: rgba(100,116,139,0.12); color: var(--text-dim); }

/* Cuisine tags */
.recipe-tag-med { /* Mediterranean - cyan */ }
.recipe-tag-indian { /* Indian - orange */ }
```

### 3.5 JavaScript Functions

| Function | Purpose |
|---|---|
| `toggleSection(header)` | Expand/collapse a main section |
| `toggleSub(subSection)` | Expand/collapse a sub-section |
| `toggleSpiceRow(card)` | Toggle all spice cards in the same grid row |
| `toggleRecipe(card)` | Toggle all recipe cards in the same grid row |
| `toggleGrocery(header)` | Toggle grocery section visibility |
| `toggleTheme()` | Switch light/dark mode |
| `printSection(el, e)` | Print a specific sub-section |
| `printRecipe(btn, e)` | Print a single recipe card |
| `smoothNav(id)` | Scroll to section with sidebar active state |

Row-toggle logic: Both `toggleSpiceRow` and `toggleRecipe` detect the number of CSS grid columns via `getComputedStyle(grid).gridTemplateColumns.split(' ').length`, then toggle all cards in the same row for a clean expand/collapse visual.

### 3.6 Grocery Section Pattern
```html
<div class="grocery-section">
  <div class="grocery-header" onclick="toggleGrocery(this)">
    <span>Grocery heading</span>
    <button onclick="printSection(...)">Print</button>
  </div>
  <div class="grocery-content">
    <!-- grocery items -->
  </div>
</div>
```

---

## 4. Content Structure — Current State

### Document Sections (in order)

1. **Sidebar Navigation** — Fixed left panel with section links
2. **Hero / TL;DR Dashboard** — 4-card overview (what you eat, how it feels, cost, timeline)
3. **Eating Framework** — Core principles (Med + Indian, DoorDash bridge, 80/20 rule)
4. **Phase 0 — Setup** (gray): Setup Actions, Pantry & Spices, Amazon Cart
5. **Phase 1 — Foundation** (blue): Changes, Daily Schedule, Breakfast, Dessert, Grocery
6. **Phase 2 — Movement + Lunch** (green): Changes, Daily Schedule, Breakfast, Dessert (carried P1), Lunch, Lunch Recipes, Batch Cook Recipes, Movement, Grocery
7. **Phase 3 — Batch Cook** (amber): Changes, Daily Schedule, Breakfast (carried P2), Lunch (carried P2), Lunch Recipes (carried P2), Batch Cook Recipes (carried P2), Kitchen Equipment, Weekly Rotation, Dinner Assembly, Sunday Batch Recipes, Sauces & Staples, Crock Pot Dinners, Crock Pot Recipes, Food Exploration, Dessert (carried P1), Movement (carried P2), Grocery
8. **Phase 4 — Full Northstar** (red): Changes, Daily Schedule, Breakfast (carried P2), Lunch (carried P2), Lunch Recipes (carried P2), Dessert (carried P1), Movement (carried P2), Strength Training, Med Expansion, Indian Expansion, Expansion Recipes, Sunday Batch Recipes (carried P3), Sauces & Staples (carried P3), Crock Pot Recipes (carried P3), Grocery Order, Depression-Day Floor
9. **Northstar Day** — The ideal daily pattern
10. **Weight Loss** — What went wrong last time / this time
11. **N-of-1 Experiments** — Self-experimentation framework
12. **Decision Thresholds** — Lipid, Mental Health, Lab, Weight, Safety, Financial triggers
13. **Flavor Toppers** — Pantry staples, spice rack, sauces & condiments
14. **Supplements** — Verified cart, dose corrections, vitamin D, audit, skip list, caffeine
15. **Fermented Foods** — Target 4-6 servings/day by Phase 4
16. **Polyphenols** — Berry/plant compound guide
17. **Sleep + Cannabis** — ADHD sleep priorities, cannabis harm reduction, protocol
18. **Tracking** — Monitoring framework
19. **Financial Framework** — Current spend breakdown, cost-per-meal, phase projections, setup costs
20. **Baseline Labs** — Flags, normal results, panel interpretation, missing tests
21. **Caveats** — Disclaimers and limitations

### Carried-Forward Content Pattern

Each phase is designed to be **self-contained** — you should never need to flip back to a previous phase. Carried content from earlier phases appears as collapsed sub-sections with a dim "Phase N" badge. These contain the full recipe/content (not just a reference), so printing any single phase gives you everything you need.

---

## 5. Completed Work (Sessions 1-3)

### Session 1: Visual Redesign
- Redesigned Eating Framework section with visual layout
- Redesigned Phase 0 with action cards, pantry/spice overhaul, expandable spice cards
- Added research hyperlinks (SMILES, PREDIMED, HELFIMED studies)
- Split monolithic HTML into 3-file architecture (index.html, styles.css, script.js)
- Redesigned spice cards with richer visuals, flavor chips

### Session 2: Component Design
- Redesigned Dessert section with visual cards and warmer tone
- Redesigned Breakfast section with visual meal cards (bf-meal pattern)
- Redesigned Lunch Rescue Bowl section with visual component cards
- Redesigned Movement section with exercise cards and cardio options

### Session 3: Structure & Inheritance
- Standardized all sub-header names across the document
- Added collapsible sub-sections to every content block (~68 sub-sections)
- **Fixed sub-section boundary bleeding** — Setup Actions in Phase 0 was collapsing 685 lines of unrelated content; Phase 3's Food Exploration bled into Phase 4; orphaned close tags in 7 post-phase sections
- Audited all phases for content inheritance gaps
- Added carried-forward content to Phases 2, 3, and 4 with collapsed recipe cards
- Added NEW/CARRIED badge system
- Converted Phase 2 Breakfast from table to visual bf-meal cards
- Researched and planned the meal section restructure (see Section 7)

---

## 6. Key Bugs Fixed & Lessons Learned

### Sub-Section Boundary Bleeding (Critical)
**Problem:** When a sub-section's `</div><!-- /sub-content -->` and `</div><!-- /sub-section -->` close tags were missing or misplaced, clicking to collapse that sub-section would collapse everything below it — sometimes hundreds of lines of unrelated content across multiple sub-sections.

**Root cause:** A Python script that added sub-sections in Session 2 left orphaned close tags and missed some close tags at section boundaries.

**Fix methodology:**
1. Count all `sub-section` opens vs closes (found 68 opens / 62 closes = 6 imbalanced)
2. Audit each section boundary to ensure no sub-section spans across a `</div><!-- /section-body -->`
3. Remove orphaned close-tag pairs (7 found in post-phase sections)
4. Add missing close-tag pairs before section-body closes (6 added)
5. Verify count balanced at 68/68

**Lesson:** Always verify sub-section open/close balance after any batch edit. Use comments (`<!-- /sub-section -->`, `<!-- /sub-content -->`) on every close tag to make debugging easier.

### Edit String Matching
**Problem:** Edits would fail when the search string didn't exactly match the file content, particularly with HTML entities (`&amp;` vs `&`) or whitespace differences.

**Lesson:** Always re-read the file to get the exact text before attempting edits. Never assume entity encoding from memory.

### Carried Content Completeness
**Problem:** If carried-forward recipe cards only contain a name/reference, they're useless when a phase is printed standalone.

**Rule:** Carried content must contain the FULL recipe (ingredients, instructions, times) — just collapsed by default. The user should be able to print any single phase and have a complete cookbook.

---

## 7. Pending Work — Meal Section Restructure

### Status: PLANNED, NOT YET IMPLEMENTED (was about to begin when context ran out)
Tasks #25, #26, #27 are pending. The research and design phase is complete (Task #24). Implementation had just been finalized and Claude was about to begin executing — the backup hadn't been created yet and no restructuring edits have been made to the HTML. The next session should pick up exactly here.

### The Problem
Phase 3 currently has 6+ fragmented dinner-related sub-sections that should be combined:
- Kitchen Equipment
- Weekly Rotation
- Dinner Assembly
- Sunday Batch Recipes
- Sauces & Staples
- Crock Pot Dinners
- Crock Pot Recipes
- Food Exploration

This is confusing and breaks the daily meal order flow. Sub-sections across all phases should follow: **Breakfast → Lunch → Dinner → Dessert** (then Movement, Grocery as utility sections).

### The Plan

**Step 1: Back up** the current index.html before restructuring.

**Step 2: Restructure Phase 2** (green)
Current order: Changes, Schedule, Breakfast, Dessert (carried), Lunch, Lunch Recipes, Batch Cook Recipes, Movement, Grocery
Target order: Changes, Schedule, **Breakfast**, **Lunch** (merge Lunch + Lunch Recipes + Batch Cook Recipes into one section), **Dessert** (carried), Movement, Grocery

Phase 2's Lunch merges the current Lunch + Lunch Recipes + Batch Cook Recipes into one section. Internal flow: Sunday Batch Cook intro → Batch recipe cards → Rescue bowl formula → Lunch bowl recipe cards.

**Step 3: Restructure Phase 3** (amber)
Current order: Changes, Schedule, carried-B, carried-L, carried-LR, carried-BCR, Kitchen Equip, Weekly Rotation, Dinner Assembly, Sunday Batch, Sauces, Crock Pot Dinners, Crock Pot Recipes, Food Exploration, carried-Dessert, carried-Movement, Grocery
Target order: Changes, Schedule, **Breakfast** (carried P2), **Lunch** (carried P2, merged), **Dinner** (ONE comprehensive section combining: weekly rotation plan, kitchen equipment callout, expanded Sunday batch cook, plate assembly guide, ALL dinner recipe cards, food exploration tips, ingredient overlap visual), **Dessert** (carried P1), Movement (carried P2), Grocery

Phase 3's Dinner combines everything into one flowing section. Internal flow: Weekly rotation → Kitchen equipment → Sunday batch cook → Plate assembly → ALL recipe cards (batch proteins, batch sides, crock pot, sauces) → Food exploration → Ingredient overlap.

**Step 4: Restructure Phase 4** (red)
Target order: Changes, Schedule, Breakfast (carried), Lunch (carried), **Dinner** (carried P3 + 6 NEW expansion recipes), Dessert (carried), Movement (carried + NEW strength), Grocery, Depression Floor

Phase 4's Dinner carries Phase 3 forward + adds the 6 expansion recipes with NEW badges.

### Recipe Inventory

**Phase 2 — Lunch (5 bowls + 3 batch proteins):**
- Shawarma Bowl, Tikka Bowl, Daal Bowl, Med Plate, Indian Plate
- Za'atar Chicken, Masala Chicken, Air Fryer Veg (batch cook)

**Phase 3 — Dinner (new recipes):**
- Daal Tadka, Chana Masala (batch)
- Crock Pot Tikka Curry, Crock Pot Med Chicken + Chickpeas
- Tahini Sauce, Pickled Red Onions, Miso Dressing (sauces)

**Phase 4 — Dinner Expansion (6 new):**
- Air Fryer Chicken Shawarma, Lamb Kofta, Shakshuka
- Mujaddara, Aloo Gobi, Keema Matar

### Design Principles for the Restructure
1. **Multiple recipe variety per week** — never the same dinner twice in a week
2. **At least 1 Med + 1 Indian batch cooked per week** from Phase 2 onward
3. **Strong ingredient overlap** to reduce waste (chicken thighs, olive oil, canned tomatoes, onions, rice shared across 4+ recipes)
4. **Daily meal order in sub-sections:** Breakfast → Lunch → Dinner → Dessert
5. **Each phase self-contained** — carry forward everything, collapse it, badge it

### Implementation Execution Order (for next session)

1. **Back up** `index.html` → `index_backup_prerestructure.html`
2. **Phase 2 restructure:**
   - Move Dessert (carried P1) sub-section to AFTER Lunch (currently it's between Breakfast and Lunch — violates B/L/D/Dessert order)
   - Merge "Lunch", "Lunch Recipes", and "Batch Cook Recipes" sub-sections into a single "Lunch" sub-section
   - Internal content order within merged Lunch: batch cook intro → batch recipe cards → rescue bowl formula → lunch bowl recipe cards
3. **Phase 3 restructure:**
   - Remove the 8 fragmented dinner sub-sections (Kitchen Equipment, Weekly Rotation, Dinner Assembly, Sunday Batch Recipes, Sauces & Staples, Crock Pot Dinners, Crock Pot Recipes, Food Exploration)
   - Build one comprehensive "Dinner" sub-section with `sub-open` class
   - Internal flow: weekly rotation → kitchen equipment → Sunday batch cook → plate assembly → ALL recipe cards → food exploration → ingredient overlap
   - Move carried Dessert and Movement to correct position (after Dinner)
   - Merge carried Lunch + Lunch Recipes + Batch Cook Recipes into single carried "Lunch"
4. **Phase 4 restructure:**
   - Same merge pattern for carried Lunch
   - Move existing dinner-related content (Expansion Recipes, Sunday Batch carried, Sauces carried, Crock Pot carried) into one "Dinner" section
   - Carried P3 dinner content collapsed, 6 new expansion recipes get NEW badges
   - Ensure Movement (carried) + Strength Training are adjacent or merged
5. **Verify** sub-section open/close count is balanced across the whole document
6. **Verify** each phase renders correctly when opened standalone

---

## 8. Design Guidelines for Future Work

### Visual Consistency Rules
- Use the existing CSS component patterns (bf-meal, recipe-card, sc-card) — don't invent new ones
- New content in a phase gets `sub-open` class and `NEW` badge
- Carried content gets no `sub-open` (starts collapsed) and `Phase N` badge
- Phase colors are consistent: gray (P0), blue (P1), green (P2), amber (P3), red (P4)
- Mediterranean content uses `--mediterranean` (cyan), Indian uses `--indian` (orange)

### Structural Rules
- Every sub-section needs both `sub-content` and `sub-section` close tags with comments
- Sub-sections never span across section boundaries
- Grocery sections use their own `toggleGrocery` mechanism, separate from sub-section toggle
- Print buttons go in the sub-header, using `printSection()` or `printRecipe()`

### Content Rules
- Recipes must include: name, cuisine tag, prep time, servings, full ingredients list, full instructions
- Breakfast cards include: icon, name, day assignment, prep time, calories, ingredient list, optional note
- Each phase should be printable as a standalone document
- DoorDash is not a failure — it's an intentional bridge during transition phases

### Tone & Voice
- Warm, practical, non-judgmental
- "This is about building something sustainable, not about restriction"
- ADHD-aware language — clear steps, minimal decisions, "depression-day floor" as safety net
- Mediterranean + Indian framed as complementary, not competing

---

## 9. CSS Class Reference (Key Components)

### Layout
| Class | Purpose |
|---|---|
| `.sidebar` | Fixed left navigation |
| `.main` | Content area (margin-left: 280px) |
| `.section` | Collapsible major section |
| `.section-header` | Clickable section title bar |
| `.section-body` | Section content container |
| `.sub-section` | Collapsible sub-section (add `sub-open` to start expanded) |
| `.sub-header` | Clickable sub-section title |
| `.sub-content` | Sub-section content container |

### Cards
| Class | Purpose |
|---|---|
| `.bf-meal` | Breakfast meal card (variants: `bf-meal-yogurt`, `bf-meal-eggs`) |
| `.recipe-card` | Expandable recipe card (add `recipe-open` when expanded) |
| `.recipe-grid` | Grid container for recipe cards |
| `.sc-card` | Expandable spice card |
| `.sc-grid` | Grid container for spice cards |
| `.tldr-dash-card` | Dashboard overview card |

### Badges & Tags
| Class | Purpose |
|---|---|
| `.bf-badge-new` | Green "NEW" badge on breakfast cards |
| `.bf-badge-carried` | Dim "Phase N" badge on carried breakfast cards |
| `.recipe-tag-new` | Green NEW tag on recipe cards (pulses) |
| `.recipe-tag-carried` | Dim PHASE N tag on carried recipe cards |
| `.recipe-tag-med` | Mediterranean cuisine tag |
| `.recipe-tag-indian` | Indian cuisine tag |

### Grocery
| Class | Purpose |
|---|---|
| `.grocery-section` | Grocery container (add `grocery-open` when expanded) |
| `.grocery-header` | Clickable grocery section title |
| `.grocery-content` | Grocery items container |

---

## 10. User Preferences & Working Style

- Scotty prefers to give high-level direction and let Claude run with implementation
- Wants visual, card-based layouts over tables or plain text
- Values progressive disclosure (collapsed by default, expand on interest)
- Prefers thorough research before implementation ("take your time and significantly think through this")
- Wants logical ordering (daily meal sequence: B/L/D/Dessert)
- Expects each phase to be fully self-contained (no flipping back)
- Comfortable with Claude making backup files before major restructures
- Will often "go to bed" and let Claude work autonomously on larger tasks

---

## 11. Key Ingredient Overlap Map

This overlap is central to the cost/waste reduction strategy:

| Ingredient | Recipes Using It |
|---|---|
| Chicken thighs | Za'atar Chicken, Masala Chicken, Tikka Curry, Med Chicken+Chickpeas, Shawarma |
| Olive oil | ALL Mediterranean recipes, dressings, sauces |
| Canned tomatoes | Daal, Chana Masala, Tikka Curry, Med Chicken |
| Onions | Nearly every recipe across both cuisines |
| Rice (basmati) | All bowls, daal, curries |
| Chickpeas | Chana Masala, Med Chicken+Chickpeas, hummus, bowls |
| Yogurt (Greek) | Breakfast, tikka marinade, raita, dessert base |
| Cumin | Shared spice foundation across Med + Indian |
| Garlic | Universal |
| Ginger | Indian curries, some Med dressings |
| Lemon | Med dressings, Indian finishing, tahini sauce |

---

## 12. Financial Model Summary

| Phase | Monthly Cost | DoorDash Role |
|---|---|---|
| Current | ~$2,200 | Primary food source |
| Phase 1 | ~$1,600 | Still primary, breakfast at home |
| Phase 2 | ~$1,100 | Lunch replaced, some dinners |
| Phase 3 | ~$800 | Weeknight backup only |
| Phase 4 | ~$650-800 | Weekend treat, not dependency |

---

*This document should be updated as the project evolves. It serves as the canonical reference for any future Claude session working on this project.*
