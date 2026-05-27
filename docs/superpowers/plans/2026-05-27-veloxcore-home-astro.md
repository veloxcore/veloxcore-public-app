# Veloxcore Home (Astro + Motion) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `source/Veloxcore Home.html` as a static Astro home page with Motion + Lenis scroll animation, write-once global CSS, and content-collection-driven Work/Blog sections.

**Architecture:** Astro `output: 'static'`. All CSS lives in global stylesheets imported once in `BaseLayout.astro`; Astro components are markup-only (no scoped styles). Interactivity ships as small client islands (canvas hero, word rotator, dot field, footer wordmark, cursor glow) plus a Lenis + Motion glue script. `WorkPreview` and `BlogGrid` read from `caseStudies` and `blog` content collections.

**Tech Stack:** Astro, @astrojs/mdx, @astrojs/check + typescript, motion (motion.dev), lenis, @playwright/test.

---

## Conventions for this plan

- **"Port verbatim from `source/…` lines A–B"** means copy those exact lines unchanged (preserving class names). This is a precise content reference, not a placeholder — the prototype is the authoritative source for markup/CSS.
- **Novel code** (config, schemas, island logic, Motion/Lenis glue, tests) is shown in full.
- The working directory is `D:/Projects/Veloxcore Public App` (already a git repo). The prototype lives in `source/`; the new app is built at the repo root.
- Run all commands from the repo root.

## File structure

| File | Responsibility |
|---|---|
| `package.json`, `astro.config.mjs`, `tsconfig.json` | Project scaffold + integrations |
| `src/styles/tokens.css` | `:root` design tokens (ported) |
| `src/styles/base.css` | reset, fonts, `.wrap`, `.reveal` base (ported) |
| `src/styles/system.css` | shared system: nav, dropdown, buttons, tags, eyebrow, section-label, covers, footer base (ported) |
| `src/styles/home.css` | home section rules: hero, trust, pillars, work-preview, feature, code-panel, blog, cta, dark footer (ported) |
| `src/layouts/BaseLayout.astro` | `<head>`, fonts, CSS imports, `<Nav>`, `<Footer>`, motion glue island |
| `src/components/nav/Nav.astro`, `NavDropdown.astro` | Frosted nav + mega-dropdowns |
| `src/components/footer/Footer.astro`, `Ticker.astro`, `FooterWordmark.astro` | Dark animated footer |
| `src/components/hero/HomeHero.astro`, `HeroCanvas.astro`, `WordRotator.astro`, `DeviceMock.astro`, `FloatChip.astro` | Hero |
| `src/components/sections/TrustBar.astro`, `WorkPreview.astro`, `FeatureBlock.astro`, `CodePanel.astro`, `BlogGrid.astro`, `CtaSection.astro`, `DotField.astro` | Page sections |
| `src/components/ui/ButtonPill.astro`, `Tag.astro`, `Eyebrow.astro`, `SectionLabel.astro`, `BrandMark.astro`, `KpiCard.astro` | Primitives |
| `src/components/motion/MotionGlue.astro` | Lenis init + global reveal pass + parallax + cursor glow |
| `src/content/config.ts` | `blog` + `caseStudies` collection schemas |
| `src/content/blog/*.mdx`, `src/content/case-studies/*.mdx` | Seed content |
| `src/pages/index.astro` | Home page composition |
| `public/assets/*.svg` | Wordmark SVGs |
| `tests/home.spec.ts` | Playwright smoke test |

---

## Task 1: Scaffold the Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "veloxcore-web",
  "type": "module",
  "version": "0.1.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "playwright test"
  },
  "dependencies": {
    "astro": "^4.16.0",
    "@astrojs/mdx": "^3.1.0",
    "motion": "^11.11.0",
    "lenis": "^1.1.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "typescript": "^5.6.0",
    "@playwright/test": "^1.48.0"
  }
}
```

- [ ] **Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  output: 'static',
  integrations: [mdx()],
});
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Create `.gitignore`**

```
node_modules/
dist/
.astro/
test-results/
playwright-report/
```

- [ ] **Step 5: Install dependencies**

Run: `npm install`
Expected: dependencies install with no errors; `node_modules/` created.

- [ ] **Step 6: Verify the toolchain builds**

Run: `npm run build`
Expected: build succeeds (it will warn "no pages found" or produce an empty `dist/` — acceptable at this stage).

- [ ] **Step 7: Commit**

```bash
git add package.json astro.config.mjs tsconfig.json .gitignore package-lock.json
git commit -m "chore: scaffold Astro project with mdx, motion, lenis"
```

---

## Task 2: Port global stylesheets

The four stylesheets are written once and imported once (Task 3). Preserve all class names.

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/system.css`, `src/styles/home.css`

- [ ] **Step 1: Create `src/styles/tokens.css`**

Port verbatim the `:root { … }` block from `source/veloxcore.css` lines 10–53 (tokens: surfaces, fg, borders, accent, dark system, type families, easing, `--w`/`--m`). Also keep the `@import` Google Fonts line from `source/veloxcore.css` line 7 at the top of this file. The home page's inline `:root` (`source/Veloxcore Home.html` lines 12–41) is identical in values — do not duplicate it; tokens.css is the single source.

- [ ] **Step 2: Create `src/styles/base.css`**

Port verbatim from `source/veloxcore.css`: the reset (lines 56–67), `.wrap` (line 70), and `.reveal` / `.reveal.visible` (lines 73–78). Add the home page's extra reveal variants from `source/Veloxcore Home.html` lines 95–102 (`.pillar.reveal`, `.blog-card.reveal`, `.scale-enter`).

- [ ] **Step 3: Create `src/styles/system.css`**

Port verbatim from `source/veloxcore.css` these shared blocks (preserve order): nav (80–152), page-eyebrow (154–164), sec-label (166–173), section headings (175–185), buttons (187–250), tags (252–269), cover themes (271–284), avatar (286–291), dark CTA section (335–353), faq (355–389), hero system (391–518), service sections (520–587), dropdown nav (589–619). Skip the old `.footer` block (293–333) — the home page uses its own dark footer (Task 2 Step 4).

- [ ] **Step 4: Create `src/styles/home.css`**

Port verbatim from `source/Veloxcore Home.html` `<style>` these home-specific blocks: keyframes + entrance animations (60–123), nav overrides (125–140), hero (142–191), trust (193–200), section/pillars (202–224), work-preview + `cov-*` (226–252), dark feature (254–265), code panel (267–275), blog (277–295), cta (297–303), dark animated footer (305–331), responsive media queries (333–348). Omit the `.smooth-wrapper` rules (51) — Lenis replaces them.

- [ ] **Step 5: Verify CSS is valid (no build yet — visual check deferred)**

Run: `npx astro check` (will report no `.astro` errors yet; CSS is not type-checked but confirms toolchain). 
Expected: command runs without crashing. (CSS correctness is verified visually in Task 11.)

- [ ] **Step 6: Commit**

```bash
git add src/styles/
git commit -m "feat: port global stylesheets (tokens, base, system, home)"
```

---

## Task 3: BaseLayout + global CSS wiring + brand assets

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Copy: `source/assets/veloxcore-wordmark.svg`, `veloxcore-wordmark-inverse.svg` → `public/assets/`

- [ ] **Step 1: Copy wordmark SVGs into `public/assets/`**

Run: `mkdir -p public/assets && cp "source/assets/veloxcore-wordmark.svg" "source/assets/veloxcore-wordmark-inverse.svg" public/assets/`
Expected: two SVGs present in `public/assets/`.

- [ ] **Step 2: Create `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/system.css';
import '../styles/home.css';
import Nav from '../components/nav/Nav.astro';
import Footer from '../components/footer/Footer.astro';
import MotionGlue from '../components/motion/MotionGlue.astro';

interface Props { title: string; description?: string; }
const { title, description = 'Production-grade AI for enterprise and growth-stage teams.' } = Astro.props;
---
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:ital,wght@0,100..900;1,100..900&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
</head>
<body>
  <Nav />
  <slot />
  <Footer />
  <MotionGlue client:idle />
</body>
</html>
```

- [ ] **Step 3: Create a temporary minimal `MotionGlue.astro` so the layout compiles**

Create `src/components/motion/MotionGlue.astro` with a no-op script (full version in Task 10):

```astro
<script>
  // Motion + Lenis glue is implemented in Task 10.
</script>
```

- [ ] **Step 4: Create temporary minimal `Nav.astro` and `Footer.astro` stubs so the layout compiles**

`src/components/nav/Nav.astro`:
```astro
<nav class="nav"><div class="nav-inner"></div></nav>
```
`src/components/footer/Footer.astro`:
```astro
<footer class="footer"></footer>
```

- [ ] **Step 5: Verify type-check passes**

Run: `npx astro check`
Expected: 0 errors (stubs + layout compile).

- [ ] **Step 6: Commit**

```bash
git add src/layouts/ src/components/ public/assets/
git commit -m "feat: add BaseLayout, global CSS wiring, brand SVGs, component stubs"
```

---

## Task 4: Content collections (schemas + seed entries)

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/blog/cortana-analytics.mdx`, `azure-hdinsight.mdx`, `iot-azure-hub.mdx`
- Create: `src/content/case-studies/veloxhire.mdx`, `pmi-pia.mdx`, `un-document-bot.mdx`, `retail-analytics.mdx`
- Test: `tests/collections.test.ts` (build-time validation via `astro check` + `getCollection`)

- [ ] **Step 1: Create `src/content/config.ts`**

```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tag: z.string(),
    date: z.coerce.date(),
    coverTheme: z.enum(['cover-a', 'cover-b', 'cover-c']),
    excerpt: z.string().optional(),
  }),
});

const caseStudies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    client: z.string(),
    category: z.string(),
    coverTheme: z.string(), // e.g. 'cov-veloxhire', 'cov-pmi'
    stats: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
    excerpt: z.string(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

export const collections = { blog, 'case-studies': caseStudies };
```

- [ ] **Step 2: Create the 3 blog seed files**

`src/content/blog/cortana-analytics.mdx`:
```mdx
---
title: "Cortana Analytics Suite: an end-to-end big data solution for the enterprise"
tag: "Big Data"
date: 2026-05-19
coverTheme: "cover-a"
excerpt: "How the Cortana Analytics Suite connects data ingestion to insight."
---
Body content placeholder for the standalone post (detail page is out of scope this session).
```

`src/content/blog/azure-hdinsight.mdx`:
```mdx
---
title: "Microsoft Azure HDInsight and why every enterprise should care about managed Hadoop"
tag: "Azure"
date: 2026-04-28
coverTheme: "cover-b"
excerpt: "Managed Hadoop on Azure, without the operational overhead."
---
Body content placeholder for the standalone post (detail page is out of scope this session).
```

`src/content/blog/iot-azure-hub.mdx`:
```mdx
---
title: "Internet of Things opportunities: where Azure IoT Hub changes the game"
tag: "IoT"
date: 2026-03-12
coverTheme: "cover-c"
excerpt: "From device fleets to edge intelligence with Azure IoT Hub."
---
Body content placeholder for the standalone post (detail page is out of scope this session).
```

- [ ] **Step 3: Create the 4 case-study seed files**

`src/content/case-studies/veloxhire.mdx`:
```mdx
---
title: "AI video interviewer that cuts hiring from 15 days to 2"
client: "Veloxhire.AI"
category: "Hiring Tech · AI Product · Azure OpenAI"
coverTheme: "cov-veloxhire"
stats:
  - { value: "5×", label: "Faster hiring" }
  - { value: "80%", label: "Time saved" }
  - { value: "100+", label: "Companies" }
excerpt: "We built and run Veloxhire.AI on Azure OpenAI + RAG. 100+ enterprise clients use it today. So do we."
featured: true
order: 1
---
Case study body placeholder (detail page out of scope this session).
```

`src/content/case-studies/pmi-pia.mdx`:
```mdx
---
title: "Portfolio intelligence across 2,400+ live project portfolios"
client: "PMI"
category: "Enterprise · AI Agents"
coverTheme: "cov-pmi"
stats: []
excerpt: "AI agents surfacing risk, budget variance, and timeline drift for PMI's global project network in real time."
featured: false
order: 2
---
Case study body placeholder (detail page out of scope this session).
```

`src/content/case-studies/un-document-bot.mdx`:
```mdx
---
title: "Multi-lingual RAG across 40 years of UN resolutions and reports"
client: "United Nations"
category: "Government · RAG"
coverTheme: "cov-un"
stats: []
excerpt: "1.2M documents, 18 languages, cited answers in under 3 seconds. Built on Azure AI Search + GPT-4o."
featured: false
order: 3
---
Case study body placeholder (detail page out of scope this session).
```

`src/content/case-studies/retail-analytics.mdx`:
```mdx
---
title: "140M daily transactions. 6 countries. 99.97% uptime."
client: "Retail Co."
category: "Retail · Data Engineering"
coverTheme: "cov-retail-home"
stats: []
excerpt: "End-to-end Azure pipeline redesign for a national retailer — from legacy Hadoop to streaming in 14 weeks."
featured: false
order: 4
---
Case study body placeholder (detail page out of scope this session).
```

- [ ] **Step 4: Verify schemas validate**

Run: `npx astro sync && npx astro check`
Expected: `astro sync` generates collection types with no schema errors; `astro check` reports 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/content/
git commit -m "feat: add blog + caseStudies collections with seed content"
```

---

## Task 5: UI primitives

**Files:**
- Create: `src/components/ui/BrandMark.astro`, `ButtonPill.astro`, `Tag.astro`, `Eyebrow.astro`, `SectionLabel.astro`, `KpiCard.astro`

- [ ] **Step 1: Create `BrandMark.astro`**

```astro
---
interface Props { withWordmark?: boolean; href?: string; }
const { withWordmark = true, href = '/' } = Astro.props;
---
<a class="brand" href={href}>
  <span class="mark"></span>
  {withWordmark && <span class="logo">Veloxcore</span>}
</a>
```

- [ ] **Step 2: Create `ButtonPill.astro`**

```astro
---
interface Props { variant?: 'dark' | 'soft' | 'accent' | 'white' | 'ghost'; href?: string; arrow?: boolean; }
const { variant = 'dark', href = '#', arrow = false } = Astro.props;
---
<a class={`btn-pill btn-${variant}`} href={href}>
  <slot />{arrow && <span class="arr">→</span>}
</a>
```

- [ ] **Step 3: Create `Tag.astro`**

```astro
---
interface Props { kind: string; } // e.g. 'azure', 'ml', 'ai'
const { kind } = Astro.props;
---
<span class={`tag tag-${kind}`}><slot /></span>
```

- [ ] **Step 4: Create `Eyebrow.astro`**

```astro
<span class="sec-eyebrow"><slot /></span>
```

- [ ] **Step 5: Create `SectionLabel.astro`**

```astro
<div class="sec-label"><slot /></div>
```

- [ ] **Step 6: Create `KpiCard.astro`**

```astro
---
interface Props { num: string; label: string; }
const { num, label } = Astro.props;
---
<div class="h-kpi">
  <div class="h-kpi-num">{num}</div>
  <div class="h-kpi-label">{label}</div>
</div>
```

- [ ] **Step 7: Verify type-check**

Run: `npx astro check`
Expected: 0 errors.

- [ ] **Step 8: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add UI primitives (brand mark, button, tag, eyebrow, label, kpi)"
```

---

## Task 6: Nav + Footer (full)

**Files:**
- Modify: `src/components/nav/Nav.astro` (replace stub)
- Create: `src/components/nav/NavDropdown.astro`
- Modify: `src/components/footer/Footer.astro` (replace stub)
- Create: `src/components/footer/Ticker.astro`, `src/components/footer/FooterWordmark.astro`

- [ ] **Step 1: Implement `Nav.astro`**

Port the nav markup verbatim from `source/Veloxcore Home.html` lines 353–391 into the component body. Replace the brand anchor (lines 355) with `<BrandMark />` (import it). Keep dropdown markup inline (it's small); links keep their `.html` targets for now but rewrite hrefs to root-relative routes where the page exists (`/` for Home) and leave others as-is (those pages are out of scope). Add `import BrandMark from '../ui/BrandMark.astro';` to the frontmatter.

- [ ] **Step 2: Implement `Footer.astro`**

Port the footer markup verbatim from `source/Veloxcore Home.html` lines 639–697. Replace the `.foot-ticker` block (640–667) with `<Ticker />` and the `.foot-wm-wrap` block (686–688) with `<FooterWordmark />`. Import both in frontmatter.

- [ ] **Step 3: Implement `Ticker.astro`**

Port the `.foot-ticker` markup verbatim from `source/Veloxcore Home.html` lines 640–667. It is pure CSS (animation defined in `home.css`) — no script.

- [ ] **Step 4: Implement `FooterWordmark.astro` (island shell, logic in Task 10)**

```astro
<div class="foot-wm-wrap">
  <span class="foot-wm" aria-hidden="true" data-foot-wm>Veloxcore</span>
</div>
```
(The letter-stagger + fit-to-width script is added in Task 10 via `MotionGlue`, keyed off `[data-foot-wm]`.)

- [ ] **Step 5: Create a throwaway probe page to verify nav/footer render**

Create `src/pages/index.astro` temporarily:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Veloxcore — probe">
  <main style="min-height:120vh"></main>
</BaseLayout>
```

- [ ] **Step 6: Verify build + visual**

Run: `npm run build` then `npm run preview`
Expected: build succeeds. Open the preview URL — the frosted nav (with working Services/Company dropdowns on hover) and the dark footer (ticker scrolling, "Veloxcore" wordmark visible, legal row) render.

- [ ] **Step 7: Commit**

```bash
git add src/components/nav/ src/components/footer/ src/pages/index.astro
git commit -m "feat: implement nav with dropdowns and dark animated footer"
```

---

## Task 7: Hero (static structure)

**Files:**
- Create: `src/components/hero/HomeHero.astro`, `DeviceMock.astro`, `FloatChip.astro`
- Create island shells: `HeroCanvas.astro`, `WordRotator.astro` (logic in Task 9/10)

- [ ] **Step 1: Create `DeviceMock.astro`**

Port the `.hero-device` inner markup verbatim from `source/Veloxcore Home.html` lines 407–445 (the `.device-shell` … through `.device-content`). Exclude the outer `.hero-device` wrapper and the `.float-chip` (those belong to `HomeHero` / `FloatChip`).

- [ ] **Step 2: Create `FloatChip.astro`**

Port the `.float-chip` markup verbatim from `source/Veloxcore Home.html` lines 446–449.

- [ ] **Step 3: Create `HeroCanvas.astro` (island shell)**

```astro
<canvas id="hero-canvas" aria-hidden="true" data-hero-canvas></canvas>
<script>
  // Particle network implemented in Task 9.
</script>
```

- [ ] **Step 4: Create `WordRotator.astro` (island shell)**

```astro
---
interface Props { words?: string[]; }
const { words = ['AI', 'agents', 'copilots', 'RAG'] } = Astro.props;
---
<span style="white-space:nowrap"><span class="typed" data-word-rotator data-words={JSON.stringify(words)}>AI</span><span class="caret"></span></span>
<script>
  // Word rotator implemented in Task 9.
</script>
```

- [ ] **Step 5: Create `HomeHero.astro`**

Compose the hero. Port the surrounding structure from `source/Veloxcore Home.html` lines 393–453, replacing: the `<canvas id="hero-canvas">` (394) with `<HeroCanvas client:load />`; the typed-word span inside the `<h1>` (399) with `<WordRotator client:visible />`; the device-shell block with `<DeviceMock />`; and the float-chip with `<FloatChip />`. Keep `.hero`, `.hero-grid`, `.hero-tag`, `.hero-h1`, `.hero-sub`, `.hero-acts` markup verbatim. Import the four sub-components in frontmatter.

- [ ] **Step 6: Wire hero into `index.astro` (replace probe)**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import HomeHero from '../components/hero/HomeHero.astro';
---
<BaseLayout title="Veloxcore — Unleash value of DATA">
  <HomeHero />
</BaseLayout>
```

- [ ] **Step 7: Verify build + visual**

Run: `npm run build && npm run preview`
Expected: hero renders with tag pill, headline (static "AI" + caret for now), subtext, two CTA pills, device mock, and float chip. Canvas is empty (logic pending).

- [ ] **Step 8: Commit**

```bash
git add src/components/hero/ src/pages/index.astro
git commit -m "feat: add home hero structure (device mock, float chip, island shells)"
```

---

## Task 8: Content sections (Trust, Work, Feature, Blog, CTA)

**Files:**
- Create: `src/components/sections/TrustBar.astro`, `WorkPreview.astro`, `FeatureBlock.astro`, `CodePanel.astro`, `BlogGrid.astro`, `CtaSection.astro`, `DotField.astro`

- [ ] **Step 1: Create `TrustBar.astro`**

Port verbatim from `source/Veloxcore Home.html` lines 455–468.

- [ ] **Step 2: Create `WorkPreview.astro` (reads `caseStudies`)**

```astro
---
import { getCollection } from 'astro:content';
import ButtonPill from '../ui/ButtonPill.astro';

const all = (await getCollection('case-studies')).sort((a, b) => a.data.order - b.data.order);
const featured = all.find((c) => c.data.featured)!;
const rest = all.filter((c) => !c.data.featured).slice(0, 3);
---
<section class="section" data-screen-label="02 Selected Work">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="sec-eyebrow">Selected work</span>
      <h2 class="sec-h2">Proof, not promises.</h2>
      <p class="sec-sub">Real clients. Production systems. Measurable outcomes.</p>
    </div>

    <a class="wp-featured reveal" href="#">
      <div class={`wp-feat-cover ${featured.data.coverTheme}`}>
        <div style="position:absolute;bottom:0;left:0;right:0;padding:36px;background:linear-gradient(to top,rgba(55,48,163,.88),transparent)">
          <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.09em;color:rgba(255,255,255,.55);margin-bottom:6px">Our own product · in production</div>
          <div style="font-family:var(--display);font-size:30px;font-weight:800;letter-spacing:-.045em;color:#fff">{featured.data.client}</div>
        </div>
      </div>
      <div class="wp-feat-body">
        <div class="wp-eyebrow">{featured.data.category}</div>
        <h3 class="wp-feat-h">{featured.data.title}</h3>
        <p class="wp-feat-desc">{featured.data.excerpt}</p>
        <div class="wp-stats">
          {featured.data.stats.map((s) => (
            <div><div class="wp-stat-val">{s.value}</div><div class="wp-stat-label">{s.label}</div></div>
          ))}
        </div>
        <span class="pillar-link">View case study →</span>
      </div>
    </a>

    <div class="wp-grid">
      {rest.map((c, i) => (
        <a class="wp-card reveal" style={`transition-delay:${i * 0.07}s`} href="#">
          <div class={`wp-card-cover ${c.data.coverTheme}`}>
            <div style="position:absolute;bottom:20px;left:24px;font-family:var(--display);font-size:15px;font-weight:700;letter-spacing:-.025em;color:rgba(255,255,255,.9)">{c.data.client}</div>
          </div>
          <div class="wp-card-body">
            <div class="wp-eyebrow">{c.data.category}</div>
            <h3 class="wp-card-h">{c.data.title}</h3>
            <p class="wp-card-desc">{c.data.excerpt}</p>
            <div class="wp-card-foot">
              <span class="wp-card-tag">{c.data.category.split('·').pop()?.trim()}</span><span class="wp-dot"></span><span class="wp-client">{c.data.client}</span>
            </div>
          </div>
        </a>
      ))}
    </div>

    <div class="wp-cta"><ButtonPill variant="soft" href="#" arrow>View all work</ButtonPill></div>
  </div>
</section>
```

- [ ] **Step 3: Create `CodePanel.astro`**

Port the `.code-panel` markup verbatim from `source/Veloxcore Home.html` lines 569–586.

- [ ] **Step 4: Create `FeatureBlock.astro`**

Port the `<section data-screen-label="03 Pipeline">` markup verbatim from `source/Veloxcore Home.html` lines 555–589, replacing the `.code-panel` block with `<CodePanel />` (import it).

- [ ] **Step 5: Create `BlogGrid.astro` (reads `blog`)**

```astro
---
import { getCollection } from 'astro:content';
import ButtonPill from '../ui/ButtonPill.astro';

const posts = (await getCollection('blog'))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  .slice(0, 3);
const fmt = (d: Date) => d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
---
<section class="section" data-screen-label="04 Blog">
  <div class="wrap">
    <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:56px;gap:24px">
      <div class="reveal">
        <span class="sec-eyebrow">From the blog</span>
        <h2 class="sec-h2" style="margin-bottom:0">Latest thinking on data &amp; cloud</h2>
      </div>
      <ButtonPill variant="soft" href="#" arrow>View all posts</ButtonPill>
    </div>
    <div class="blog-grid">
      {posts.map((p, i) => (
        <article class="blog-card reveal" style={`transition-delay:${i * 0.08}s`}>
          <div class={`blog-cover ${p.data.coverTheme}`}></div>
          <div class="blog-meta"><span class="tag-text">{p.data.tag}</span><span>·</span><span>{fmt(p.data.date)}</span></div>
          <h3 class="blog-title">{p.data.title}</h3>
          <span class="blog-link">Read blog ›</span>
        </article>
      ))}
    </div>
    <div class="blog-controls">
      <button class="blog-btn" aria-label="Previous"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
      <button class="blog-btn" aria-label="Next"><svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"></polyline></svg></button>
    </div>
  </div>
</section>
```

- [ ] **Step 6: Create `DotField.astro` (island shell)**

```astro
<canvas id="dot-canvas" aria-hidden="true" data-dot-canvas></canvas>
<script>
  // Dot field implemented in Task 9.
</script>
```

- [ ] **Step 7: Create `CtaSection.astro`**

Port the `<section class="cta">` markup verbatim from `source/Veloxcore Home.html` lines 627–637, replacing `<canvas id="dot-canvas">` (628) with `<DotField client:visible />`. Import `DotField`.

- [ ] **Step 8: Compose all sections into `index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import HomeHero from '../components/hero/HomeHero.astro';
import TrustBar from '../components/sections/TrustBar.astro';
import WorkPreview from '../components/sections/WorkPreview.astro';
import FeatureBlock from '../components/sections/FeatureBlock.astro';
import BlogGrid from '../components/sections/BlogGrid.astro';
import CtaSection from '../components/sections/CtaSection.astro';
---
<BaseLayout title="Veloxcore — Unleash value of DATA">
  <HomeHero />
  <TrustBar />
  <WorkPreview />
  <FeatureBlock />
  <BlogGrid />
  <CtaSection />
</BaseLayout>
```

- [ ] **Step 9: Verify build + visual**

Run: `npm run build && npm run preview`
Expected: full page renders top to bottom. Work-preview shows Veloxhire featured tile + PMI/UN/Retail cards (from collections); blog shows the 3 seeded posts with correct dates; feature block + code panel + CTA render.

- [ ] **Step 10: Commit**

```bash
git add src/components/sections/ src/pages/index.astro
git commit -m "feat: add content sections (trust, work, feature, blog, cta)"
```

---

## Task 9: Hero/CTA canvas + word rotator island logic

Port the prototype's IIFE scripts (`source/Veloxcore Home.html` lines 703, 706, 720) into the island component `<script>` tags, adapted to query the `data-*` hooks.

**Files:**
- Modify: `src/components/hero/HeroCanvas.astro`, `WordRotator.astro`, `src/components/sections/DotField.astro`

- [ ] **Step 1: Implement `HeroCanvas.astro` script**

Replace the placeholder script with the particle-network code from `source/Veloxcore Home.html` line 703, changed only so it selects `document.querySelector('[data-hero-canvas]')` instead of `getElementById('hero-canvas')`. Keep the `id="hero-canvas"` on the element so existing CSS (`#hero-canvas` in `home.css`) still applies. Guard with `prefers-reduced-motion`:

```astro
<canvas id="hero-canvas" aria-hidden="true" data-hero-canvas></canvas>
<script>
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const c = document.querySelector('[data-hero-canvas]');
    // … paste the particle IIFE body from source line 703 here, using `c` as the canvas …
  }
</script>
```

- [ ] **Step 2: Implement `DotField.astro` script**

Same pattern: paste the dot-field IIFE from `source/Veloxcore Home.html` line 706, selecting `[data-dot-canvas]`, keep `id="dot-canvas"`. (Dot field is static dots — no reduced-motion guard needed, but only draw once on load/resize as the original does.)

- [ ] **Step 3: Implement `WordRotator.astro` script**

Paste the word-rotator IIFE from `source/Veloxcore Home.html` line 720, but read the word list from the element's `data-words` attribute instead of the hardcoded array, and select `[data-word-rotator]`:

```js
const el = document.querySelector('[data-word-rotator]');
if (el) {
  const words = JSON.parse(el.dataset.words || '["AI"]');
  // … paste rotator loop from source line 720, using `el` and `words` …
}
```

- [ ] **Step 4: Verify build + visual**

Run: `npm run build && npm run preview`
Expected: hero canvas shows the connected-particle network reacting to the mouse; the headline word cycles AI → agents → copilots → RAG; the CTA section shows the faint dot grid.

- [ ] **Step 5: Verify reduced-motion**

In the browser devtools, enable "prefers-reduced-motion: reduce" (Rendering tab) and reload.
Expected: hero canvas does not animate (stays blank), page still renders fully.

- [ ] **Step 6: Commit**

```bash
git add src/components/hero/ src/components/sections/DotField.astro
git commit -m "feat: implement hero/cta canvas and word-rotator island logic"
```

---

## Task 10: Motion + Lenis glue (smooth scroll, reveals, parallax, cursor glow, footer wordmark)

**Files:**
- Modify: `src/components/motion/MotionGlue.astro`

- [ ] **Step 1: Implement the glue script**

```astro
<script>
  import Lenis from 'lenis';
  import { inView, animate, scroll } from 'motion';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Smooth scroll (skip when reduced motion)
  if (!reduce) {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  // 2. Global reveal pass — replaces the prototype's per-page IntersectionObserver
  const revealEls = document.querySelectorAll<HTMLElement>('.reveal');
  if (reduce) {
    revealEls.forEach((el) => el.classList.add('visible'));
  } else {
    revealEls.forEach((el) => {
      inView(el, () => { el.classList.add('visible'); }, { margin: '0px 0px -8% 0px' });
    });
  }

  // 3. Scroll-linked parallax on hero device + float chip (skip when reduced)
  if (!reduce) {
    const device = document.querySelector<HTMLElement>('.hero-device');
    if (device) {
      scroll(animate(device, { y: [0, -40] }, { ease: 'linear' }),
        { target: device, offset: ['start end', 'end start'] });
    }
  }

  // 4. Footer wordmark — letter stagger + fit-to-width
  const wm = document.querySelector<HTMLElement>('[data-foot-wm]');
  if (wm) {
    const text = wm.textContent!.trim();
    wm.innerHTML = [...text].map((ch) => `<span class="letter">${ch}</span>`).join('');
    const fit = () => {
      wm.style.fontSize = '100px'; wm.style.width = 'max-content';
      const tw = wm.offsetWidth; wm.style.width = '';
      wm.style.fontSize = Math.floor(100 * wm.parentElement!.clientWidth / tw) + 'px';
    };
    if (document.fonts?.ready) document.fonts.ready.then(fit);
    setTimeout(fit, 200); fit();
    window.addEventListener('resize', fit);
    const letters = wm.querySelectorAll<HTMLElement>('.letter');
    if (reduce) {
      wm.classList.add('revealed');
    } else {
      inView(wm, () => {
        letters.forEach((l, i) => { (l.style as any).transitionDelay = `${i * 62}ms`; });
        wm.classList.add('revealed');
      }, { amount: 0.1 });
    }
  }

  // 5. Cursor glow (hover-capable, non-reduced only)
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    let cx = -9999, cy = -9999, tx = -9999, ty = -9999;
    const glow = document.createElement('div');
    glow.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:1;opacity:0;transition:opacity .5s;will-change:background;';
    document.body.appendChild(glow);
    document.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; glow.style.opacity = '1'; });
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    (function tick() {
      requestAnimationFrame(tick);
      if (tx < -999) return;
      cx += (tx - cx) * 0.09; cy += (ty - cy) * 0.09;
      glow.style.background = `radial-gradient(circle 700px at ${Math.round(cx)}px ${Math.round(cy)}px, rgba(61,126,255,0.13) 0%, rgba(61,126,255,0.08) 25%, rgba(61,126,255,0.03) 55%, transparent 78%)`;
    })();
  }
</script>
```

- [ ] **Step 2: Verify build + visual**

Run: `npm run build && npm run preview`
Expected: page scrolls smoothly (Lenis); `.reveal` sections fade/translate in on scroll; hero device drifts slightly on scroll; footer "Veloxcore" letters stagger up when scrolled into view; a soft blue glow trails the cursor.

- [ ] **Step 3: Verify reduced-motion**

Enable "prefers-reduced-motion: reduce" and reload.
Expected: no smooth scroll, no cursor glow, no parallax; all `.reveal` content is visible immediately; footer wordmark is shown without stagger.

- [ ] **Step 4: Commit**

```bash
git add src/components/motion/MotionGlue.astro
git commit -m "feat: add Lenis smooth scroll, Motion reveals, parallax, cursor glow, footer wordmark"
```

---

## Task 11: Playwright smoke test + final parity pass

**Files:**
- Create: `playwright.config.ts`, `tests/home.spec.ts`

- [ ] **Step 1: Create `playwright.config.ts`**

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: { baseURL: 'http://localhost:4321' },
});
```

- [ ] **Step 2: Write the smoke test**

```ts
import { test, expect } from '@playwright/test';

test('home renders core structure', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('nav.nav .logo')).toHaveText('Veloxcore');
  await expect(page.locator('.hero-h1')).toContainText('The studio that ships');
  // Work preview is collection-driven
  await expect(page.locator('.wp-featured')).toContainText('Veloxhire.AI');
  await expect(page.locator('.wp-card')).toHaveCount(3);
  // Blog grid is collection-driven
  await expect(page.locator('.blog-card')).toHaveCount(3);
  await expect(page.locator('footer.footer .foot-wm')).toBeVisible();
});

test('reveal content becomes visible after scroll', async ({ page }) => {
  await page.goto('/');
  const work = page.locator('.sec-head.reveal').first();
  await work.scrollIntoViewIfNeeded();
  await expect(work).toHaveClass(/visible/);
});

test('honors reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  // reveals are forced visible immediately
  await expect(page.locator('.sec-head.reveal').first()).toHaveClass(/visible/);
});
```

- [ ] **Step 3: Install Playwright browser + run tests**

Run: `npx playwright install chromium && npm test`
Expected: all three tests pass.

- [ ] **Step 4: Final visual parity pass against the prototype**

Open `source/Veloxcore Home.html` and the built preview side by side. Verify: nav, hero (tag pill, headline, rotator, device, float chip), trust bar, work preview, dark feature + code panel, blog, dark CTA, animated footer all match in layout, type, color, spacing, and shadows. Note any drift and fix in the relevant component/CSS.

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts tests/ package.json
git commit -m "test: add Playwright smoke tests and finalize home parity"
```

---

## Self-review notes

- **Spec coverage:** scaffold (T1) · global write-once CSS (T2) · BaseLayout + assets (T3) · hybrid collections + seed (T4) · primitives (T5) · nav/footer with tier-1 motifs (T6) · hero structure (T7) · collection-driven Work/Blog + sections (T8) · canvas/rotator islands tier-2 (T9) · Lenis + Motion reveals/parallax/glow/wordmark (T10) · reduced-motion honored (T9 S5, T10 S3, T11) · tests (T11). All §11 success criteria map to a task.
- **No scoped styles:** every component references global classes only — consistent with the spec's write-once rule.
- **Type consistency:** collection key `'case-studies'`, `coverTheme`, `stats[].value/label`, `featured`, `order` are used identically in `config.ts` (T4) and `WorkPreview.astro` (T8). `data-hero-canvas` / `data-dot-canvas` / `data-word-rotator` / `data-foot-wm` hooks match between island shells (T6–T8) and their logic (T9–T10).
