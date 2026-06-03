# Design Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 21 design audit findings across three phases, working only in `src/` Astro components and CSS files.

**Architecture:** Three sequential Git branches (`fix/design-phase-1`, `fix/design-phase-2`, `fix/design-phase-3`), each merged before the next starts. Most fixes are CSS-only edits to `src/styles/system.css` plus targeted changes to specific page components.

**Tech Stack:** Astro, CSS custom properties, vanilla JS (inline `<script is:inline>` blocks)

---

## Pre-flight: Already Fixed

Before starting, verify these findings are resolved in the built site so they don't appear in the commit log as open items:

| Finding | File | Evidence |
|---------|------|----------|
| F-001 Mobile nav | `src/components/nav/Nav.astro` | `.nav-burger` button + `.nav-mobile` + JS toggle exist |
| F-002 Font split | `src/styles/tokens.css` | `--display` and `--sans` use Google Sans Flex; `about.css` and `contact.css` do not override |
| F-006 focus-visible | `src/styles/base.css:21-28` | `:focus-visible { outline: 2px solid var(--accent); ... }` present |
| F-014 CTA variation | `src/content/services/*.mdx` | Each service has a distinct `ctaH:` value |
| F-017 Footer dark | `src/layouts/BaseLayout.astro` | `home.css` imported globally, overrides `.footer` to dark for all pages |

---

## Phase 1 — High Impact

**Branch:** `fix/design-phase-1`

```bash
git checkout -b fix/design-phase-1
```

---

### Task 1: Fix FAQ accordion animation (F-003 + F-008)

**Files:**
- Modify: `src/styles/system.css` (`.faq-ico`, `.faq-a`, `.faq-item.open .faq-a`)

- [ ] **Step 1: Open system.css and find the FAQ section**

Run: `grep -n "faq-ico\|faq-a\|faq-item" src/styles/system.css`

Expected output includes lines around 302–320:
```
302: .faq-ico {
306:   transition: all .2s; margin-top: 1px;
...
317: .faq-a {
318:   font-size: 14px; line-height: 24px; color: var(--fg2);
319:   padding: 0 0 18px; display: none; letter-spacing: -.005em;
320: }
321: .faq-item.open .faq-a { display: block; }
```

- [ ] **Step 2: Fix `transition: all` on `.faq-ico` (F-008)**

In `src/styles/system.css`, find:
```css
.faq-ico {
  width: 22px; height: 22px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%; background: var(--border);
  transition: all .2s; margin-top: 1px;
}
```

Change `transition: all .2s;` to `transition: background .2s, box-shadow .2s;`:
```css
.faq-ico {
  width: 22px; height: 22px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%; background: var(--border);
  transition: background .2s, box-shadow .2s; margin-top: 1px;
}
```

- [ ] **Step 3: Replace display:none toggle with max-height animation (F-003)**

Find:
```css
.faq-a {
  font-size: 14px; line-height: 24px; color: var(--fg2);
  padding: 0 0 18px; display: none; letter-spacing: -.005em;
}
.faq-item.open .faq-a { display: block; }
```

Replace with:
```css
.faq-a {
  font-size: 14px; line-height: 24px; color: var(--fg2);
  max-height: 0; overflow: hidden;
  padding: 0; letter-spacing: -.005em;
  transition: max-height .28s ease-out, padding .28s ease-out;
}
.faq-item.open .faq-a {
  max-height: 800px;
  padding-bottom: 18px;
}
```

- [ ] **Step 4: Verify the build compiles**

Run: `npm run build` (or `bun run build`)  
Expected: build completes with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/styles/system.css
git commit -m "style: animate FAQ accordion with max-height; fix transition:all on faq-ico (F-003, F-008)"
```

---

### Task 2: Fix tech-desc font size (F-004)

**Files:**
- Modify: `src/styles/system.css` (`.tech-desc`)

- [ ] **Step 1: Find and update `.tech-desc`**

In `src/styles/system.css`, find:
```css
.tech-desc { font-size: 12px; color: var(--dark-fg3); line-height: 19px; }
```

Change to:
```css
.tech-desc { font-size: 14px; color: var(--dark-fg3); line-height: 20px; }
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/system.css
git commit -m "style: raise tech-desc body text from 12px to 14px (F-004)"
```

---

### Task 3: Remove persona quote border-left (F-005)

**Files:**
- Modify: `src/styles/system.css` (`.persona-quote`)

- [ ] **Step 1: Find and update `.persona-quote`**

In `src/styles/system.css`, find:
```css
.persona-quote { font-size: 14px; color: var(--fg1); font-style: italic; padding: 10px 14px; background: #fff; border-left: 3px solid var(--accent); border-radius: 0 8px 8px 0; }
```

Replace with:
```css
.persona-quote { font-size: 14px; color: var(--fg1); padding: 10px 14px; background: rgba(0,0,0,.03); border-radius: 8px; }
```

(Removes `border-left`, `font-style: italic`, changes `background` and `border-radius`.)

- [ ] **Step 2: Commit**

```bash
git add src/styles/system.css
git commit -m "style: remove border-left from persona-quote, soften background (F-005)"
```

---

### Task 4: Add sticky anchor navigation to Services page (F-007)

**Files:**
- Modify: `src/pages/services/index.astro`

The services page has 6 sections. Each needs an `id` and the sticky nav added below the hero.

- [ ] **Step 1: Add `id` attributes to the 6 service sections**

In `src/pages/services/index.astro`, find each `<section class="service-section"` tag and add the matching `id`:

```html
<!-- DATA ANALYTICS — line ~69 -->
<section class="service-section" id="data-analytics" data-screen-label="02 Data Analytics">

<!-- DATA VISUALISATION — find its data-screen-label -->
<section class="service-section" id="data-viz" data-screen-label="03 Data Visualisation">

<!-- AZURE ARCHITECTURE — find its data-screen-label -->
<section class="service-section" id="azure" data-screen-label="04 Azure Architecture">

<!-- MACHINE LEARNING — find its data-screen-label -->
<section class="service-section" id="machine-learning" data-screen-label="05 Machine Learning">

<!-- IOT — find its data-screen-label -->
<section class="service-section" id="iot" data-screen-label="06 IoT">

<!-- .NET — find its data-screen-label -->
<section class="service-section" id="dotnet" data-screen-label="07 .NET">
```

- [ ] **Step 2: Insert the sticky anchor nav after the closing `</section>` of the hero**

After the `</section>` that closes the hero (the one containing `.page-hero`), insert:

```html
<!-- STICKY ANCHOR NAV -->
<nav class="svc-anchor-nav" aria-label="Jump to service">
  <div class="svc-anchor-inner">
    <a class="svc-anchor-pill" href="#data-analytics">Data Analytics</a>
    <a class="svc-anchor-pill" href="#data-viz">Data Viz</a>
    <a class="svc-anchor-pill" href="#azure">Azure</a>
    <a class="svc-anchor-pill" href="#machine-learning">Machine Learning</a>
    <a class="svc-anchor-pill" href="#iot">IoT</a>
    <a class="svc-anchor-pill" href="#dotnet">.NET</a>
  </div>
</nav>
```

- [ ] **Step 3: Add CSS for the anchor nav**

In `src/styles/services-page.css`, append:

```css
/* ── SERVICE ANCHOR NAV ─────────────────────────────────── */
.svc-anchor-nav {
  position: sticky;
  top: 68px;
  z-index: 40;
  background: rgba(255,255,255,.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
.svc-anchor-inner {
  max-width: var(--w);
  margin: 0 auto;
  padding: 8px var(--m);
  display: flex;
  gap: 4px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.svc-anchor-inner::-webkit-scrollbar { display: none; }
.svc-anchor-pill {
  flex-shrink: 0;
  padding: 7px 16px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 500;
  color: var(--fg2);
  letter-spacing: -.005em;
  transition: background .15s, color .15s;
  white-space: nowrap;
}
.svc-anchor-pill:hover {
  background: var(--canvas);
  color: var(--fg1);
}
.svc-anchor-pill.active {
  background: var(--fg1);
  color: #fff;
}
```

- [ ] **Step 4: Add a scroll-spy script to highlight the active anchor**

In `src/pages/services/index.astro`, at the bottom of the file before the closing `</BaseLayout>`, add:

```html
<script is:inline>
(function () {
  var sections = ['data-analytics','data-viz','azure','machine-learning','iot','dotnet']
    .map(function(id) { return document.getElementById(id); })
    .filter(Boolean);
  var pills = document.querySelectorAll('.svc-anchor-pill');
  function update() {
    var active = sections[0];
    sections.forEach(function(s) {
      if (s.getBoundingClientRect().top <= 120) active = s;
    });
    pills.forEach(function(p) {
      p.classList.toggle('active', p.getAttribute('href') === '#' + active.id);
    });
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
</script>
```

- [ ] **Step 5: Build and verify**

Run: `npm run build`  
Expected: no errors. Navigate to `/services/` and confirm the sticky nav appears below the hero and highlights correctly on scroll.

- [ ] **Step 6: Commit**

```bash
git add src/pages/services/index.astro src/styles/services-page.css
git commit -m "feat: add sticky anchor nav to services page (F-007)"
```

---

### Task 5: Open Phase 1 PR

- [ ] **Step 1: Push and open PR**

```bash
git push -u origin fix/design-phase-1
```

Open a PR: `fix/design-phase-1 → main`  
Title: `style: design fixes phase 1 — FAQ animation, text sizes, persona quote, services anchor nav`  
Body:
```
Fixes: F-003, F-004, F-005, F-007, F-008

- FAQ accordion now animates smoothly (max-height transition, not display toggle)
- FAQ icon transition no longer uses `transition: all`
- tech-desc body text raised from 12px to 14px
- persona-quote border-left removed; background softened
- Services page has sticky anchor nav with scroll-spy active state
```

---

## Phase 2 — Medium Impact

**Branch:** `fix/design-phase-2`

```bash
git checkout main
git pull
git checkout -b fix/design-phase-2
```

---

### Task 6: Remove false affordance from approach step cards (F-010)

**Files:**
- Modify: `src/styles/system.css`

- [ ] **Step 1: Delete hover rules from `.ap-step`**

In `src/styles/system.css`, find and remove these two blocks:

```css
.ap-step:hover { border-color: var(--border-strong); box-shadow: 0 6px 24px -10px rgba(26,28,28,.1); }
```
and:
```css
.ap-step:hover .ap-num { color: var(--accent); }
```

Also remove `transition: border-color .2s, box-shadow .2s;` from `.ap-step` (since there's nothing to transition to anymore):

Find:
```css
.ap-step { background: var(--canvas); border: 1px solid var(--border); border-radius: 20px; padding: 28px; transition: border-color .2s, box-shadow .2s; }
```
Change to:
```css
.ap-step { background: var(--canvas); border: 1px solid var(--border); border-radius: 20px; padding: 28px; }
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/system.css
git commit -m "style: remove hover state from approach step cards — static content, not interactive (F-010)"
```

---

### Task 7: Fix nav dropdown hover gap (F-011)

**Files:**
- Modify: `src/styles/system.css`

- [ ] **Step 1: Update `.nav-dropdown` top offset**

In `src/styles/system.css`, find:
```css
.nav-dropdown {
  position: absolute;
  top: calc(100% + 10px); left: 50%;
```

Change to:
```css
.nav-dropdown {
  position: absolute;
  top: calc(100% + 2px); left: 50%;
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/system.css
git commit -m "style: reduce nav dropdown hover gap from 10px to 2px (F-011)"
```

---

### Task 8: Fix approach step number visibility (F-015)

**Files:**
- Modify: `src/styles/system.css`

- [ ] **Step 1: Update `.ap-num` default color**

In `src/styles/system.css`, find:
```css
.ap-num { font-family: var(--display); font-size: 48px; font-weight: 900; letter-spacing: -.06em; color: var(--border-strong); line-height: 1; margin-bottom: 16px; transition: color .2s; }
```

Change `color: var(--border-strong)` to `color: var(--fg3)` and remove the `transition` (since we removed the hover state in Task 6):
```css
.ap-num { font-family: var(--display); font-size: 48px; font-weight: 900; letter-spacing: -.06em; color: var(--fg3); line-height: 1; margin-bottom: 16px; }
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/system.css
git commit -m "style: make approach step numbers visible by default with fg3 color (F-015)"
```

---

### Task 9: Remove caret color animation (F-018)

**Files:**
- Modify: `src/styles/home.css`

- [ ] **Step 1: Delete the `@keyframes caret-color` block**

In `src/styles/home.css`, find and delete:
```css
@keyframes caret-color{ 0%{background:var(--accent)} 50%{background:#ea4335} 100%{background:var(--accent)} }
```

- [ ] **Step 2: Remove `caret-color` from the `.caret` animation**

In `src/styles/home.css`, find:
```css
.caret { display:inline-block; width:4px; height:.78em; background:var(--accent); vertical-align:-.05em; margin-left:4px; animation:blink 1s step-end infinite, caret-color 4s linear infinite; }
```

Change to:
```css
.caret { display:inline-block; width:4px; height:.78em; background:var(--accent); vertical-align:-.05em; margin-left:4px; animation:blink 1s step-end infinite; }
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/home.css
git commit -m "style: remove caret-color animation — cursor stays accent blue (F-018)"
```

---

### Task 10: Fix wrong team members on Contact page (F-012)

**Files:**
- Modify: `src/pages/contact.astro`

- [ ] **Step 1: Replace the team block in the sidebar**

In `src/pages/contact.astro`, find the `<!-- Who you'll talk to -->` sidebar block (around line 276):

```html
<div class="tp-person">
  <div class="tp-ava" style="background:linear-gradient(135deg,#1a73e8,#00d4e8)"></div>
  <div>
    <div class="tp-name">Karan Shah</div>
    <div class="tp-role">Co-Founder &amp; CEO</div>
    <div class="tp-resp">Responds within 4 hrs</div>
  </div>
</div>
<div class="tp-person">
  <div class="tp-ava" style="background:linear-gradient(135deg,#7c3aed,#a855f7)"></div>
  <div>
    <div class="tp-name">Priya Mehta</div>
    <div class="tp-role">Co-Founder &amp; CTO</div>
    <div class="tp-resp">For technical questions</div>
  </div>
</div>
<div class="tp-person">
  <div class="tp-ava" style="background:linear-gradient(135deg,#137333,#00dd6a)"></div>
  <div>
    <div class="tp-name">Rahul Mehta</div>
    <div class="tp-role">Lead Data Architect</div>
    <div class="tp-resp">For data engineering</div>
  </div>
</div>
```

Replace with the real team from the About page:

```html
<div class="tp-person">
  <div class="tp-ava" style="background:var(--fg1);color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center">VY</div>
  <div>
    <div class="tp-name">Vinit B Yadav</div>
    <div class="tp-role">Founder &amp; CEO</div>
    <div class="tp-resp">Responds within 4 hrs</div>
  </div>
</div>
<div class="tp-person">
  <div class="tp-ava" style="background:var(--fg1);color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center">PP</div>
  <div>
    <div class="tp-name">Parth Patel</div>
    <div class="tp-role">Engineering Lead</div>
    <div class="tp-resp">For technical questions</div>
  </div>
</div>
<div class="tp-person">
  <div class="tp-ava" style="background:var(--fg1);color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center">AY</div>
  <div>
    <div class="tp-name">Anju Yadav</div>
    <div class="tp-role">Operations &amp; Delivery</div>
    <div class="tp-resp">For delivery questions</div>
  </div>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/contact.astro
git commit -m "fix: replace placeholder team on contact page with real team (F-012)"
```

---

### Task 11: Reduce friction on Contact page hero (F-020)

**Files:**
- Modify: `src/pages/contact.astro`

The hero currently has path-cards before the form. We'll clean the hero and move a simplified path selector into the content area above the form tabs.

- [ ] **Step 1: Strip path-cards from the hero**

In `src/pages/contact.astro`, find the hero section. Replace the hero's `<p class="hero-sub">` and the entire `<div class="path-cards">` block with a cleaner CTA row:

Find (in the hero `<div class="hero-inner">`):
```html
<p class="hero-sub">Pick your path. Book a quick call with one of our engineers — or send us the details and we'll come back with a project estimate within 48 hours.</p>
<div class="path-cards">
  ...entire path-cards div...
</div>
```

Replace with:
```html
<p class="hero-sub">Book a free call with a senior engineer, or send us your brief and we'll come back with a project estimate within 48 hours.</p>
<div class="hero-acts">
  <a class="btn-dark" href="#contact-form">Get in touch</a>
  <a class="btn-soft" href="#contact-form">Request an estimate</a>
</div>
```

- [ ] **Step 2: Add a "How can we help?" selector above the form tabs**

In `src/pages/contact.astro`, find the `<div class="form-wrap reveal">` block. Before `<div class="form-tabs">`, insert:

```html
<div class="contact-intent">
  <p class="contact-intent-label">How can we help?</p>
  <div class="intent-row">
    <button type="button" class="intent-opt active" data-tab="call">
      <span class="intent-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.27 10a19.79 19.79 0 01-3.07-8.67A2 2 0 013.18 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.91 7.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/></svg>
      </span>
      <span class="intent-label">Book a call</span>
      <span class="intent-desc">45 min with an engineer</span>
    </button>
    <button type="button" class="intent-opt" data-tab="estimate">
      <span class="intent-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      </span>
      <span class="intent-label">Get an estimate</span>
      <span class="intent-desc">Project brief + written quote</span>
    </button>
    <button type="button" class="intent-opt" data-tab="general">
      <span class="intent-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
      </span>
      <span class="intent-label">General enquiry</span>
      <span class="intent-desc">Press, partnerships, other</span>
    </button>
  </div>
</div>
```

- [ ] **Step 3: Add CSS for the intent selector**

In `src/styles/contact.css`, append:

```css
/* ── CONTACT INTENT SELECTOR ──────────────────────────────── */
.contact-intent { margin-bottom: 32px; }
.contact-intent-label {
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: .09em;
  color: var(--fg3); margin-bottom: 12px;
}
.intent-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
.intent-opt {
  display: flex; flex-direction: column; align-items: flex-start; gap: 4px;
  padding: 14px 16px; border-radius: 14px;
  border: 1.5px solid var(--border-strong);
  background: var(--bg); cursor: pointer;
  transition: border-color .15s, background .15s;
  text-align: left;
}
.intent-opt:hover { border-color: var(--fg1); }
.intent-opt.active { border-color: var(--accent); background: rgba(26,115,232,.03); }
.intent-icon svg { width: 18px; height: 18px; stroke: var(--fg3); margin-bottom: 4px; }
.intent-opt.active .intent-icon svg { stroke: var(--accent); }
.intent-label { font-size: 13px; font-weight: 600; color: var(--fg1); letter-spacing: -.01em; }
.intent-desc { font-size: 11px; color: var(--fg3); line-height: 15px; }
@media (max-width: 640px) {
  .intent-row { grid-template-columns: 1fr; }
}
```

- [ ] **Step 4: Wire intent buttons to the existing tab system**

The existing form already has `#tab-call`, `#tab-estimate`, `#tab-general` buttons. Add a script at the bottom of `contact.astro` to sync the intent buttons with the form tabs:

```html
<script is:inline>
(function () {
  var intentBtns = document.querySelectorAll('.intent-opt');
  intentBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      intentBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var tab = btn.dataset.tab;
      // click the matching form tab
      var formTab = document.getElementById('tab-' + tab);
      if (formTab) formTab.click();
    });
  });
})();
</script>
```

- [ ] **Step 5: Build and verify**

Run: `npm run build`  
Expected: no errors. The contact hero should show the clean headline + two action buttons. Below the hero, the intent selector appears above the form tabs.

- [ ] **Step 6: Commit**

```bash
git add src/pages/contact.astro src/styles/contact.css
git commit -m "ux: move contact hero path-cards to content area as intent selector (F-020)"
```

---

### Task 12: Add active state to nav links (F-027)

**Files:**
- Modify: `src/components/nav/Nav.astro`

- [ ] **Step 1: Import `Astro.url` and add active logic**

In `src/components/nav/Nav.astro`, replace the front-matter (the `---` block):

```astro
---
import BrandMark from '../ui/BrandMark.astro';
const { pathname } = Astro.url;
const isServices = pathname.startsWith('/services');
const isWork     = pathname === '/work' || pathname.startsWith('/work/');
const isCompany  = pathname.startsWith('/about') || pathname.startsWith('/blog') || pathname.startsWith('/contact');
---
```

- [ ] **Step 2: Apply `active` class to nav links**

Update each nav link to use `class:list`:

```astro
<!-- Services link -->
<a class:list={["nav-link", { active: isServices }]} href="/services">Services <span class="chev"></span></a>

<!-- Work link -->
<a class:list={["nav-link", { active: isWork }]} href="/work">Work</a>

<!-- Company link -->
<a class:list={["nav-link", { active: isCompany }]} href="/about">Company <span class="chev"></span></a>
```

The "Products" link opens in a new tab (external), so it never gets an active state — leave it as-is.

- [ ] **Step 3: Build and verify**

Run: `npm run build`  
Expected: no errors. Navigate to `/services/` — "Services" nav link should have a slightly darker background.

- [ ] **Step 4: Commit**

```bash
git add src/components/nav/Nav.astro
git commit -m "feat: highlight active nav section on all pages (F-027)"
```

---

### Task 13: Clean up dead footer CSS from system.css (F-017 cleanup)

The dark footer is already applied globally via `home.css` overriding `system.css`. The light footer CSS in `system.css` is now dead code.

**Files:**
- Modify: `src/styles/system.css`

- [ ] **Step 1: Remove the dead light footer block**

In `src/styles/system.css`, find and delete the entire light `.footer` block:

```css
/* ── FOOTER ────────────────────────────────────────────────── */
.footer {
  background: #F8F9FA;
  border-top: 1px solid var(--border);
  padding: 96px 0 48px;
}
.foot-cols {
  display: grid;
  grid-template-columns: 1.4fr repeat(4,1fr);
  gap: 64px;
}
.foot-brand .logo-row {
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 24px;
}
.foot-brand p {
  font-size: 15px; color: var(--fg2);
  max-width: 36ch; line-height: 24px; letter-spacing: -.005em;
}
.foot-h { font-size: 14px; font-weight: 600; color: var(--fg1); margin-bottom: 20px; }
.foot-list { list-style: none; display: flex; flex-direction: column; gap: 14px; }
.foot-list a { font-size: 14px; color: var(--fg2); cursor: pointer; }
.foot-list a:hover { color: var(--fg1); }
.foot-bottom {
  display: flex; align-items: center; gap: 24px;
  margin-top: 72px; padding-top: 32px;
  border-top: 1px solid var(--border);
}
.foot-bottom .copy { font-size: 13px; color: var(--fg2); }
.foot-bottom .right {
  margin-left: auto; display: flex;
  align-items: center; gap: 24px;
  font-size: 13px; color: var(--fg2);
}
.locale {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--border-strong); border-radius: 9999px;
  background: #fff; cursor: pointer;
  font-size: 12px; color: var(--fg1);
}
```

- [ ] **Step 2: Build and verify footer still looks correct**

Run: `npm run build`  
Expected: no errors. Footer remains dark on all pages (the `home.css` rules still apply).

- [ ] **Step 3: Commit**

```bash
git add src/styles/system.css
git commit -m "chore: remove dead light footer CSS from system.css — dark footer already global via home.css"
```

---

### Task 14: Open Phase 2 PR

- [ ] **Step 1: Push and open PR**

```bash
git push -u origin fix/design-phase-2
```

Open a PR: `fix/design-phase-2 → main`  
Title: `style: design fixes phase 2 — hover states, nav, contact page, active nav`  
Body:
```
Fixes: F-010, F-011, F-012, F-015, F-018, F-020, F-027

- Approach step cards no longer have fake hover affordance
- Nav dropdown gap reduced from 10px to 2px
- Approach step numbers visible by default (fg3 instead of border color)
- Caret color no longer cycles to red
- Contact page sidebar shows real team (Vinit, Parth, Anju)
- Contact page hero cleaned up; intent selector moved to content area
- Active nav link highlighted on all pages
- Dead light footer CSS removed from system.css
```

---

## Phase 3 — Polish

**Branch:** `fix/design-phase-3`

```bash
git checkout main
git pull
git checkout -b fix/design-phase-3
```

---

### Task 15: Replace gradient avatars with initials (F-019)

**Files:**
- Modify: `src/styles/system.css` (`.avatar`)
- Modify: `src/styles/blog.css` (`.hero-avatar`, `.bp-avatar`)
- Modify: `src/pages/blog/index.astro` (`.hero-avatar` element)
- Modify: `src/components/blog/PostDefault.astro`, `PostBroadsheet.astro`, `PostSidebar.astro` (`.bp-avatar` elements)

The contact sidebar `.tp-ava` elements were already updated to initials in Task 10. This task covers the blog avatar variants and the shared `.avatar` class in system.css.

Note: `about.astro` uses an SVG illustration (`.founder-avatar`), not the gradient circle — leave it alone.

- [ ] **Step 1: Update the shared `.avatar` CSS in system.css**

In `src/styles/system.css`, find:
```css
.avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: linear-gradient(135deg,var(--viz-blue),var(--viz-green));
  flex-shrink: 0;
}
```

Replace with:
```css
.avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--fg1); color: #fff;
  font-size: 10px; font-weight: 700; letter-spacing: .01em;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
```

- [ ] **Step 2: Update blog avatar CSS in `blog.css`**

In `src/styles/blog.css`, find and update both:

```css
/* hero-avatar — used on blog index page */
.hero-avatar {
  width: 26px; height: 26px; border-radius: 50%;
  background: var(--fg1); color: #fff;
  font-size: 10px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

/* bp-avatar — used in blog post templates */
.bp-avatar {
  width: 30px; height: 30px; border-radius: 50%;
  background: var(--fg1); color: #fff;
  font-size: 10px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
```

- [ ] **Step 3: Add initials to blog index `.hero-avatar`**

In `src/pages/blog/index.astro`, find:
```astro
<div class="hero-avatar"></div>
<span>{hero.data.author}</span>
```

The `hero.data.author` is a string like "Veloxcore Team" or "Vinit B Yadav". Extract initials using:
```astro
{(() => {
  const parts = (hero.data.author ?? '').split(' ');
  return parts.length >= 2 ? parts[0][0] + parts[1][0] : (parts[0]?.[0] ?? '?');
})()}
```

Replace the avatar element:
```astro
<div class="hero-avatar">{(() => {
  const parts = (hero.data.author ?? '').split(' ');
  return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
})()}</div>
<span>{hero.data.author}</span>
```

- [ ] **Step 4: Add initials to `.bp-avatar` in blog post components**

For each of `PostDefault.astro`, `PostBroadsheet.astro`, `PostSidebar.astro`, find the empty `<div class="bp-avatar"></div>` and add initials from `post.data.author` (available in each component's props):

```astro
<!-- The `post` prop is available in each component front-matter -->
<div class="bp-avatar">{(() => {
  const parts = (post.data.author ?? '').split(' ');
  return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
})()}</div>
```

- [ ] **Step 5: Build and verify**

Run: `npm run build`  
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/styles/system.css src/styles/blog.css src/pages/blog/index.astro \
        src/components/blog/PostDefault.astro src/components/blog/PostBroadsheet.astro \
        src/components/blog/PostSidebar.astro
git commit -m "style: replace gradient avatar placeholders with author initials (F-019)"
```

---

### Task 16: Remove trust bar opacity (F-021)

**Files:**
- Modify: `src/styles/home.css`

- [ ] **Step 1: Update `.trust-item`**

In `src/styles/home.css`, find:
```css
.trust-item { font-family:var(--display); font-size:24px; font-weight:700; color:var(--fg1); letter-spacing:-.025em; opacity:.7; user-select:none; transition:opacity .2s; }
.trust-item:hover { opacity:1; }
```

Replace with:
```css
.trust-item { font-family:var(--display); font-size:24px; font-weight:700; color:var(--fg1); letter-spacing:-.025em; user-select:none; }
```

(Removes `opacity:.7`, `transition:opacity .2s`, and the `:hover` rule.)

- [ ] **Step 2: Commit**

```bash
git add src/styles/home.css
git commit -m "style: trust bar items at full opacity — remove opacity:.7 default (F-021)"
```

---

### Task 17: Add reading progress bar to blog posts (F-022)

**Files:**
- Modify: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Add the progress bar element and script**

In `src/pages/blog/[slug].astro`, before the closing `</BaseLayout>` tag, add:

```html
<div id="read-progress" aria-hidden="true" style="position:fixed;top:68px;left:0;width:0;height:2px;background:var(--accent);z-index:49;pointer-events:none;transition:width .1s linear;"></div>

<script is:inline>
(function () {
  var el = document.getElementById('read-progress');
  if (!el) return;
  function update() {
    var scrollable = document.body.scrollHeight - window.innerHeight;
    if (scrollable <= 0) { el.style.width = '100%'; return; }
    var pct = Math.min(window.scrollY / scrollable * 100, 100);
    el.style.width = pct + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/blog/[slug].astro
git commit -m "feat: add 2px reading progress bar to blog post pages (F-022)"
```

---

### Task 18: Add `color-mix()` fallbacks for `.svc-badge` (F-023)

**Files:**
- Modify: `src/styles/system.css`

- [ ] **Step 1: Add rgba fallbacks**

In `src/styles/system.css`, find the `.svc-badge` rule:
```css
.svc-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 5px 14px;
  background: color-mix(in srgb, var(--accent) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
  border-radius: 9999px;
  font-size: 12px; font-weight: 600; color: var(--accent);
  margin-bottom: 20px;
  animation: hero-up .6s .18s var(--eqt) both;
}
```

Replace with:
```css
.svc-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 5px 14px;
  background: rgba(26,115,232,.10);
  background: color-mix(in srgb, var(--accent) 10%, transparent);
  border: 1px solid rgba(26,115,232,.20);
  border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
  border-radius: 9999px;
  font-size: 12px; font-weight: 600; color: var(--accent);
  margin-bottom: 20px;
  animation: hero-up .6s .18s var(--eqt) both;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/system.css
git commit -m "style: add rgba() fallbacks before color-mix() in .svc-badge (F-023)"
```

---

### Task 19: Add border-radius tokens (F-024)

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/system.css`

- [ ] **Step 1: Add radius tokens to `tokens.css`**

In `src/styles/tokens.css`, after the `--space-8` line (end of the spacing scale), add:

```css
  /* Border-radius scale */
  --radius-sm:  8px;
  --radius-md:  14px;
  --radius-lg:  20px;
  --radius-xl:  28px;
```

- [ ] **Step 2: Replace hardcoded radius values in `system.css`**

Run search to find the most common values: `grep -n "border-radius: 20px\|border-radius: 14px\|border-radius: 28px\|border-radius: 8px" src/styles/system.css`

Apply substitutions:
- `border-radius: 20px` → `border-radius: var(--radius-lg)` — for `.persona`, `.ap-step`, `.quote-card`, `.cs-tile`
- `border-radius: 14px` → `border-radius: var(--radius-md)` — for `.tech-card`, `.nd-link`
- `border-radius: 8px`  → `border-radius: var(--radius-sm)` — for `.persona-quote`, `.faq-ico` (50% stays as 50%)

Pills (`border-radius: 9999px`) and element-specific radii (`6px` for `.mark`, `50%` for circles) stay as-is.

- [ ] **Step 3: Build and verify**

Run: `npm run build`  
Expected: no errors. No visual change expected — values are the same numbers.

- [ ] **Step 4: Commit**

```bash
git add src/styles/tokens.css src/styles/system.css
git commit -m "style: add --radius-sm/md/lg/xl tokens; adopt in system.css (F-024)"
```

---

### Task 20: Remove italic from persona quotes and testimonials (F-025)

**Files:**
- Modify: `src/styles/system.css`

- [ ] **Step 1: Remove `font-style: italic` from `.quote-text`**

In `src/styles/system.css`, find:
```css
.quote-text { font-size: 14px; line-height: 24px; color: var(--fg2); margin-bottom: 14px; font-style: italic; }
```

Change to:
```css
.quote-text { font-size: 14px; line-height: 24px; color: var(--fg2); margin-bottom: 14px; }
```

Note: `.persona-quote` already had `font-style: italic` removed in Task 3 (Phase 1).

- [ ] **Step 2: Commit**

```bash
git add src/styles/system.css
git commit -m "style: remove italic from testimonial quote text (F-025)"
```

---

### Task 21: Fix homepage page title (F-026)

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Update the BaseLayout title prop**

In `src/pages/index.astro`, find the `<BaseLayout` opening tag. Change the `title` prop:

```astro
<!-- Before -->
<BaseLayout title="Veloxcore — Unleash value of DATA" ...>

<!-- After -->
<BaseLayout title="Veloxcore — The studio that ships AI" ...>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/index.astro
git commit -m "fix: update homepage title tag from stale copy (F-026)"
```

---

### Task 22: Add Products nav dropdown (F-028)

**Files:**
- Modify: `src/components/nav/Nav.astro`

- [ ] **Step 1: Convert Products link to a dropdown nav item**

In `src/components/nav/Nav.astro`, find:
```astro
<a class="nav-link" href="https://veloxhire.ai" target="_blank" rel="noopener">Products</a>
```

Replace with:
```astro
<div class="nav-item has-dropdown">
  <a class="nav-link" href="https://veloxhire.ai" target="_blank" rel="noopener">Products <span class="chev"></span></a>
  <div class="nav-dropdown nd-small">
    <div class="nd-section">
      <a class="nd-link" href="https://veloxhire.ai" target="_blank" rel="noopener">
        <span class="nd-name">Veloxhire.AI</span>
        <span class="nd-desc">Intelligent hiring for data-driven teams</span>
      </a>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/nav/Nav.astro
git commit -m "feat: give Products nav link a dropdown with Veloxhire.AI entry (F-028)"
```

---

### Task 23: Hide blog filter at fewer than 5 posts (F-029)

**Files:**
- Modify: `src/pages/blog/index.astro`

- [ ] **Step 1: Wrap the filter bar in a conditional**

In `src/pages/blog/index.astro`, find:
```astro
<div class="filter-bar" id="filter-bar">
  <button class="filter-pill active" data-filter="all">All posts</button>
  {cats.map(slug => (
    <button class="filter-pill" data-filter={slug}>
      {posts.find(p => tagOf(p.data.tag).slug === slug)?.data.tag}
    </button>
  ))}
</div>
```

Wrap with a conditional:
```astro
{posts.length >= 5 && (
  <div class="filter-bar" id="filter-bar">
    <button class="filter-pill active" data-filter="all">All posts</button>
    {cats.map(slug => (
      <button class="filter-pill" data-filter={slug}>
        {posts.find(p => tagOf(p.data.tag).slug === slug)?.data.tag}
      </button>
    ))}
  </div>
)}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "feat: hide blog filter bar when fewer than 5 posts exist (F-029)"
```

---

### Task 24: Remove dot-grid from service page heroes (F-030)

**Files:**
- Modify: `src/styles/system.css`

The `.hero::after` rule in `system.css` applies the dot-grid to all `.hero` elements (service pages, about, contact). The home page already overrides `.hero::after` in `home.css` to be a fade-gradient instead, so it won't be affected.

- [ ] **Step 1: Remove the dot-grid `::after` from `.hero` in system.css**

In `src/styles/system.css`, find:
```css
.hero::after {
  content: ''; position: absolute; inset: 0;
  background-image: radial-gradient(circle, rgba(26,28,28,.055) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
}
```

Delete the entire block.

- [ ] **Step 2: Add dot-grid back specifically for contact hero**

In `src/styles/contact.css`, after the existing `.contact-hero::after` rule (if present), add or update:

```css
.contact-hero::after {
  content: '';
  position: absolute; inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,.04) 1px, transparent 1px);
  background-size: 30px 30px;
  pointer-events: none;
}
```

(This keeps the dot-grid on the contact page hero only. The home page hero already has its own `::after` fade-gradient in `home.css`.)

- [ ] **Step 3: Build and verify**

Run: `npm run build`  
Expected: no errors. Service page heroes should look clean without the dot texture. Home page hero unchanged (its `::after` in `home.css` overrides).

- [ ] **Step 4: Commit**

```bash
git add src/styles/system.css src/styles/contact.css
git commit -m "style: remove dot-grid texture from service page heroes; keep on contact only (F-030)"
```

---

### Task 25: Wire blog cover image slot (F-013)

**Files:**
- Modify: `src/components/blog/PostDefault.astro`

The blog page already handles `coverImage` in the card grid (`blog/index.astro` checks `p.data.coverImage`). This task wires the field in `PostDefault.astro`.

- [ ] **Step 1: Read the current PostDefault component**

Run: `cat src/components/blog/PostDefault.astro | head -60`  
Identify where the article cover is rendered.

- [ ] **Step 2: Add `coverImage` prop handling**

In `src/components/blog/PostDefault.astro`, find the cover `<div>` or `<figure>` element. Add a conditional:

```astro
{post.data.coverImage
  ? <img
      src={post.data.coverImage}
      alt=""
      loading="eager"
      class="post-cover-img"
      style="width:100%;height:100%;object-fit:cover;"
    />
  : null
}
```

Place this inside the existing cover container so the CSS gradient shows as a fallback when the `src` attribute is absent.

- [ ] **Step 3: Commit**

```bash
git add src/components/blog/PostDefault.astro
git commit -m "feat: render coverImage in PostDefault when present; gradient stays as fallback (F-013)"
```

---

### Task 26: Open Phase 3 PR

- [ ] **Step 1: Push and open PR**

```bash
git push -u origin fix/design-phase-3
```

Open a PR: `fix/design-phase-3 → main`  
Title: `style: design fixes phase 3 — polish pass`  
Body:
```
Fixes: F-013, F-019, F-021, F-022, F-023, F-024, F-025, F-026, F-028, F-029, F-030

- Avatar placeholders replaced with initials
- Trust bar items at full opacity
- Blog posts show reading progress bar
- color-mix() has rgba() fallback in svc-badge
- Border-radius token system added (--radius-sm/md/lg/xl)
- Italic removed from quote text
- Homepage title tag updated to brand voice
- Products nav has Veloxhire.AI dropdown
- Blog filter hidden when fewer than 5 posts
- Dot-grid removed from service page heroes
- Blog post cover image slot wired (generation deferred)
```

---

## File Change Summary

| File | Phase | Changes |
|------|-------|---------|
| `src/styles/system.css` | 1, 2, 3 | FAQ animation, tech-desc, persona-quote, ap-step hover, nav dropdown gap, ap-num color, avatar CSS, svc-badge fallback, radius tokens, quote italic, dead footer removed, dot-grid removed |
| `src/styles/home.css` | 2, 3 | Caret color animation, trust bar opacity |
| `src/styles/services-page.css` | 1 | Anchor nav CSS |
| `src/styles/contact.css` | 2, 3 | Intent selector CSS, contact dot-grid |
| `src/styles/tokens.css` | 3 | Radius tokens |
| `src/pages/services/index.astro` | 1 | Section ids, anchor nav HTML + scroll-spy script |
| `src/pages/contact.astro` | 2 | Team members, path-cards removed, intent selector |
| `src/pages/blog/index.astro` | 3 | Filter bar conditional |
| `src/pages/blog/[slug].astro` | 3 | Reading progress bar |
| `src/pages/index.astro` | 3 | Title tag |
| `src/components/nav/Nav.astro` | 2, 3 | Active nav state, Products dropdown |
| `src/components/blog/PostDefault.astro` | 3 | Cover image slot |
