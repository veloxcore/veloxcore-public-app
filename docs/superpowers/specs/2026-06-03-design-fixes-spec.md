# Design Fixes — Implementation Spec
**Date:** 2026-06-03  
**Scope:** All 30 findings from the /design-review audit (src/ Astro components only)  
**Approach:** Three severity phases, each on its own branch and PR  
**Font:** Google Sans Flex sitewide (already correct in Astro; no font changes needed)

---

## Pre-conditions / Already Fixed in src/

These three findings from the audit are **already resolved** in the Astro source and require no work:

| Finding | Status | Evidence |
|---------|--------|----------|
| F-001 Mobile nav | ✓ Done | `Nav.astro` has `.nav-burger` + `.nav-mobile` + JS toggle; `system.css` lines 80–125 |
| F-002 Font split | ✓ Done | `about.css` and `contact.css` use inherited `--display`/`--sans` tokens (Google Sans Flex) |
| F-006 focus-visible | ✓ Done | `base.css` lines 21–28: `:focus-visible { outline: 2px solid var(--accent); ... }` |

---

## Phase 1 — High Impact

**Branch:** `fix/design-phase-1`  
**Target PRs:** 1  
**Estimated time:** ~2–3 hours

### F-003: FAQ accordion animation
**File:** `src/styles/system.css`  
**Problem:** `.faq-a { display: none; }` / `.faq-item.open .faq-a { display: block; }` — CSS transitions cannot animate `display`, so the FAQ snaps open with no animation.  
**Fix:**
- Remove `display: none` from `.faq-a`
- Add: `max-height: 0; overflow: hidden; padding-bottom: 0; transition: max-height .28s ease-out, padding-bottom .28s ease-out;`
- In `.faq-item.open .faq-a`: add `max-height: 800px; padding-bottom: 18px;`  
- Remove the existing `padding: 0 0 18px` from `.faq-a` (now managed by the transition)

### F-004: Tech-desc body text too small
**File:** `src/styles/system.css`  
**Problem:** `.tech-desc { font-size: 12px; }` — below the 14px minimum for substantive content.  
**Fix:** Change to `font-size: 14px;`

### F-005: Persona quote border-left (AI slop blacklist)
**File:** `src/styles/system.css` line 463  
**Problem:** `.persona-quote { border-left: 3px solid var(--accent); }` — exact blacklist item.  
**Fix:**
- Remove `border-left: 3px solid var(--accent);`
- Change `border-radius: 0 8px 8px 0` to `border-radius: 8px`
- Change `background: #fff` to `background: rgba(0,0,0,.03)` (subtle inset on the canvas surface)

### F-007: Services page needs anchor navigation
**File:** `src/pages/services/index.astro`  
**Problem:** Six full service sections stacked with no way to jump to a specific one.  
**Fix:**
- Add `id` attributes to each of the 6 service sections: `id="data-analytics"`, `id="data-viz"`, `id="azure"`, `id="machine-learning"`, `id="iot"`, `id="dotnet"`
- Insert a sticky anchor nav below the hero: `position: sticky; top: 68px; z-index: 40; background: rgba(255,255,255,.9); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border)`
- Pills styled to match `.form-tabs` (from contact page): 12px font, 9px 18px padding, border-radius 9999px, active state with white background + shadow
- On mobile (≤640px): `overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch` — horizontally scrollable

### F-008: `transition: all` on FAQ icon
**File:** `src/styles/system.css` line 306  
**Problem:** `.faq-ico { transition: all .2s; }` — transitions all properties including layout.  
**Fix:** Change to `transition: background .2s, box-shadow .2s;`

---

## Phase 2 — Medium Impact

**Branch:** `fix/design-phase-2`  
**Target PRs:** 1  
**Estimated time:** ~3–4 hours

### F-010: Remove false affordance hover on approach steps
**File:** `src/styles/system.css`  
**Problem:** `.ap-step:hover { border-color: var(--border-strong); box-shadow: ...; }` and `.ap-step:hover .ap-num { color: var(--accent); }` — approach steps are static content, not interactive.  
**Fix:** Delete both hover rules entirely.

### F-011: Nav dropdown hover gap
**File:** `src/styles/system.css` line 524  
**Problem:** `top: calc(100% + 10px)` creates a 10px dead zone; cursor drift closes the dropdown.  
**Fix:** Change to `top: calc(100% + 2px)`

### F-012: Wrong team on Contact page
**File:** `src/pages/contact.astro`  
**Problem:** Sidebar shows Karan Shah / Priya Mehta / Rahul Mehta — none of whom are on the About page.  
**Fix:** Replace those three entries with the real team:
- Vinit B Yadav — Founder & CEO
- Parth Patel — Engineering Lead  
- Anju Yadav — Operations & Delivery

### F-014: Vary CTA section headline per service page
**File:** `src/components/sections/CtaSection.astro`  
**Problem:** Identical "Ready to ship your first AI feature?" headline appears on every service page.  
**Fix:**
- Add `headline` and `sub` props to `CtaSection.astro` with defaults to the current copy
- Update each service page's `CtaSection` invocation to pass a service-specific headline variant (e.g., "Ready to ship your first AI agent?" for the agents page)

### F-015: Approach step numbers near-invisible
**File:** `src/styles/system.css` line 482  
**Problem:** `.ap-num { color: var(--border-strong); }` renders `#e6e8ea` on `#F8F9FA` — nearly invisible.  
**Fix:** Change to `color: var(--fg3);`

### F-017: Unify the footer (dark animated footer on all pages)
**Files:** `src/components/footer/Footer.astro`, `src/styles/home.css`, new `src/styles/footer.css`  
**Problem:** Homepage uses dark animated footer; all other pages use a light footer.  
**Fix:**
- Extract the dark footer CSS from `home.css` into a new `src/styles/footer.css` (keeps `system.css` focused on components, not the footer)
- Import `footer.css` in `BaseLayout.astro` so all pages get it
- Update `Footer.astro` to use the dark footer markup that currently only exists on the homepage
- Remove the now-redundant light footer CSS from `system.css`

### F-018: Remove caret color animation
**File:** `src/styles/home.css`  
**Problem:** `@keyframes caret-color` cycles the blinking cursor from blue to red — red carries error semantics.  
**Fix:**
- Delete the `@keyframes caret-color { ... }` block
- In the `.caret` animation property, remove `, caret-color 4s linear infinite`
- Caret remains blue (`var(--accent)`), still blinks

### F-020: Reduce friction on Contact page hero
**File:** `src/pages/contact.astro`  
**Problem:** Two path-cards appear in the hero before the form, forcing users to categorize themselves before they've even started.  
**Fix:**
- Remove path-cards from the hero section
- Hero becomes: page-eyebrow + h1 ("Let's talk about your AI project.") + sub + hero-acts CTA row
- Move the path-card UI into the main content area as a "How can we help?" section directly above the form tabs — styled as a horizontal row of three radio-style option buttons

### F-027: Active nav state
**File:** `src/components/nav/Nav.astro`  
**Problem:** `.nav-link.active` class is defined but never applied — users can't see which section they're in.  
**Fix:**
- Import `Astro.url` in the component front-matter
- For each nav link, add `class:list={["nav-link", { active: Astro.url.pathname.startsWith('/services') }]}` (and matching logic for `/work`, `/about`, `/blog`, `/contact`)
- "Book a call" CTA does not get an active state

---

## Phase 3 — Polish

**Branch:** `fix/design-phase-3`  
**Target PRs:** 1  
**Estimated time:** ~2–3 hours

### F-013: Wire up blog cover image slot (image generation deferred)
**Files:** Blog post frontmatter, `src/components/blog/PostDefault.astro` (and variants)  
**Problem:** Blog covers are CSS pseudo-elements with hardcoded text — not tied to posts.  
**Fix (Phase 3 scope — structural wiring only):**
- Add optional `cover` field to blog post frontmatter (string path or URL)
- Update `PostDefault.astro` to render `<img src={cover} alt="" loading="lazy">` inside the cover slot when `cover` is present
- Keep CSS gradient as `background` fallback when `cover` is absent
- Actual image generation runs separately via the veloxcore-image-generator skill (out of this plan's scope)

### F-019: Replace gradient avatars with initials avatars
**File:** `src/styles/system.css`, `src/pages/contact.astro`, quote card components  
**Problem:** `.avatar { background: linear-gradient(...) }` — anonymous gradient circles look like placeholders.  
**Fix:**
- Update `.avatar` to use `background: var(--fg1); color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center;`
- Where avatars are rendered, pass the initials as text content (e.g., `<span class="avatar">VY</span>`)
- This applies to: quote cards on service pages, contact sidebar team block, any `.q-ava` usage

### F-021: Trust bar full opacity
**File:** `src/components/sections/TrustBar.astro` or `src/styles/home.css`  
**Problem:** `.trust-item { opacity: .7; }` makes partner logos look unimportant.  
**Fix:** Remove `opacity: .7` from `.trust-item`. Remove the hover `opacity: 1` jump.

### F-022: Blog post reading progress bar
**File:** `src/pages/blog/[slug].astro`  
**Problem:** No scroll progress indicator on long-form articles.  
**Fix:**
- Add `<div id="read-progress" aria-hidden="true"></div>` to the page, styled: `position: fixed; top: 68px; left: 0; width: 0; height: 2px; background: var(--accent); z-index: 49; pointer-events: none; transition: width .1s linear;`
- Add inline script: `const el = document.getElementById('read-progress'); window.addEventListener('scroll', () => { const pct = scrollY / (document.body.scrollHeight - innerHeight) * 100; el.style.width = Math.min(pct, 100) + '%'; }, { passive: true });`

### F-023: `color-mix()` fallback
**File:** `src/styles/system.css`  
**Problem:** `.svc-badge` uses `color-mix(in srgb, ...)` with no fallback — transparent background in very old browsers.  
**Fix:** Add explicit `rgba()` fallback before each `color-mix()` call using the same effective value:
```css
background: rgba(26,115,232,.10);
background: color-mix(in srgb, var(--accent) 10%, transparent);
```

### F-024: Border-radius tokens
**File:** `src/styles/tokens.css`  
**Problem:** Nine ad-hoc radius values across the codebase with no token names.  
**Fix:**
- Add to `tokens.css`: `--radius-sm: 8px; --radius-md: 14px; --radius-lg: 20px; --radius-xl: 28px;`
- Audit the most common radius values in `system.css` and update: `border-radius: 20px` → `var(--radius-lg)`, `border-radius: 14px` → `var(--radius-md)`, etc.
- Pills (`9999px`) stay as-is — that's intentional and not part of the scale

### F-025: Remove italic from persona and quote text
**File:** `src/styles/system.css`  
**Problem:** `font-style: italic` on `.persona-quote` and `.quote-text` is hard to read at 14px.  
**Fix:** Remove `font-style: italic` from both `.persona-quote` and `.quote-text`.

### F-026: Fix homepage page title
**File:** `src/pages/index.astro`  
**Problem:** Title is "Veloxcore — Unleash value of DATA" — stale copy, odd capitalisation.  
**Fix:** Change `<title>` to "Veloxcore — The studio that ships AI"

### F-028: Products nav dropdown
**File:** `src/components/nav/Nav.astro`  
**Problem:** "Products" link has no dropdown while "Services" and "Company" do — underscores Veloxhire's importance.  
**Fix:**
- Convert `<a class="nav-link" href="...">Products</a>` to a `.nav-item has-dropdown`
- Add a `.nav-dropdown.nd-small` with a single entry: Veloxhire.AI + tagline "Intelligent hiring for data-driven teams"
- `target="_blank" rel="noopener"` on the link inside the dropdown

### F-029: Hide blog filter at fewer than 5 posts
**File:** `src/pages/blog/index.astro`  
**Problem:** Filter UI renders with only 2 posts — one per category. The filter adds no value.  
**Fix:** Wrap the filter bar in a conditional: only render when `posts.length >= 5`

### F-030: Reduce dot-grid texture to 2 page types
**File:** `src/styles/system.css`  
**Problem:** Dot-grid `::after` appears on every hero — home, all service pages, about, contact. It should be a distinctive texture, not sitewide default.  
**Fix:**
- Remove the `::after` dot-grid from `.hero` in `system.css` (affects all service page heroes)
- Keep it in: home page hero (scoped in `home.css`) and contact page hero (scoped in `contact.css`)
- Service page heroes use the accent gradient only — cleaner and lets the accent color carry the differentiation

---

## Out of Scope

These findings from the audit are intentionally deferred:

| Finding | Reason |
|---------|--------|
| F-009 (icon-in-box card grid is AI slop pattern) | Requires a full structural redesign of service page sections — too large for a polish-fix pass |
| F-016 (hero color inconsistency) | About hero is already light in Astro (`about.css: background: var(--bg)`); may be a non-issue |
| F-013 image generation | Dependent on veloxcore-image-generator availability and per-post content approval |

---

## Success Criteria

Phase 1 done when:
- FAQ accordion animates smoothly on expand/collapse
- Tech-desc text is 14px
- Persona quote card has no left border
- Services page has working sticky anchor nav
- FAQ icon uses explicit transition properties

Phase 2 done when:
- Approach steps have no hover state
- Nav dropdown gap is ≤2px
- Contact page shows real team members
- Each service page CTA has a unique headline
- Approach step numbers are visible at rest (`var(--fg3)`)
- All pages use the dark animated footer
- Hero caret stays blue (no red cycle)
- Contact page hero is clean (path-cards moved to main content)
- Current nav item shows `.active` state

Phase 3 done when:
- Blog posts have real cover images or fallback gradients
- Avatars show initials instead of anonymous gradient
- Trust bar items at full opacity
- Blog posts show reading progress bar
- `color-mix()` has `rgba()` fallback
- Border-radius tokens defined and adopted in `system.css`
- No italic text in persona/quote blocks
- Homepage title tag updated
- Products nav has a dropdown
- Blog filter hidden at <5 posts
- Dot-grid removed from service page heroes
