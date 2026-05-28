# Veloxcore Service Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `[slug].astro` template + `services` content collection that renders all 8 service pages pixel-perfect against the prototype HTML in `source/`.

**Architecture:** Deep-frontmatter MDX collection (`src/content/services/`) drives a single Astro template (`src/pages/services/[slug].astro`). Write-once global CSS in `service.css` + `service-visuals.css`. Per-service accent colour set via `--accent` on `<body style>`. Eight named visual components selected by a `visual` frontmatter key.

**Tech Stack:** Astro 4 (static), MDX, Zod, Motion/Lenis (existing), Playwright (existing). No new deps.

**Source of truth:** `source/Veloxcore Service - *.html` + `source/veloxcore.css`. Read source HTML before implementing any task. Do NOT trust README or comments — trust rendered HTML.

**Critical rules:**
- No `<style>` blocks in `.astro` components — global CSS only
- No `client:*` directives — plain `<script>` tags only
- All section CSS already in `src/styles/system.css`; do not duplicate it

---

### Task 1: CSS — dark hero modifier + pricing + service visuals

**Files:**
- Create: `src/styles/service.css`
- Create: `src/styles/service-visuals.css`
- Modify: `src/layouts/BaseLayout.astro`

`system.css` already has the light hero (`.hero { background: var(--bg) }`) and all service section styles (`.who`, `.deliver`, `.approach`, `.tech`, `.proof`, `.faq`, `.cta-section`, nav dropdown). This task adds only what's missing.

- [ ] **Step 1: Create `src/styles/service.css`**

```css
/* ── DARK HERO MODIFIER ─────────────────────────────────────
   Add class="hero hero--dark" to <section> for dark-bg services
   (Gen AI, AI Agents, RAG, AI Strategy)
   ──────────────────────────────────────────────────────────── */
.hero--dark {
  background: #0a1628;
  border-bottom: none;
}
.hero--dark::before {
  background:
    radial-gradient(ellipse 60% 70% at 88% 68%, rgba(99,102,241,.22) 0%, transparent 55%),
    radial-gradient(ellipse 40% 50% at 10% 82%,  rgba(0,212,232,.10)  0%, transparent 55%);
}
.hero--dark::after {
  background-image: radial-gradient(circle, rgba(173,198,255,.06) 1px, transparent 1px);
  background-size: 28px 28px;
}
.hero--dark .hero-breadcrumb,
.hero--dark .hero-breadcrumb a { color: rgba(255,255,255,.4); }
.hero--dark .hero-breadcrumb a:hover { color: #fff; }
.hero--dark .hero-h1 { color: #fff; }
.hero--dark .hero-sub { color: rgba(255,255,255,.6); }
.hero--dark .svc-badge {
  background: color-mix(in srgb, var(--accent) 15%, transparent);
  border-color: color-mix(in srgb, var(--accent) 25%, transparent);
  color: color-mix(in srgb, var(--accent) 80%, #fff);
}
.hero--dark .h-kpi {
  background: rgba(255,255,255,.06);
  border-color: rgba(255,255,255,.1);
  box-shadow: none;
}
.hero--dark .h-kpi-num { color: #fff; }
.hero--dark .h-kpi-label { color: rgba(255,255,255,.4); }
.hero--dark .btn-ghost-light {
  background: rgba(255,255,255,.07);
  border: 1px solid rgba(255,255,255,.14);
  color: rgba(255,255,255,.7);
}
.hero--dark .btn-ghost-light:hover {
  background: rgba(255,255,255,.12);
  color: #fff;
}
.hero--dark .hero-canvas { opacity: .85; }

/* ── PROOF SECTION LABEL ─────────────────────────────────── */
.proof-h { padding: 0 0 12px; }

/* ── PRICING (AI Strategy only) ─────────────────────────── */
.pricing { padding: 88px 0; background: var(--canvas); border-bottom: 1px solid var(--border); }
.pricing-h { font-family: var(--display); font-size: 44px; font-weight: 700; letter-spacing: -.04em; color: var(--fg1); margin-bottom: 48px; text-wrap: pretty; }
.pricing-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
.price-card { background: #fff; border: 1px solid var(--border); border-radius: 22px; padding: 36px 32px; display: flex; flex-direction: column; transition: border-color .2s, box-shadow .2s; }
.price-card:hover { border-color: var(--border-strong); box-shadow: 0 6px 24px -10px rgba(26,28,28,.1); }
.price-card.featured { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
.price-tag { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--fg3); margin-bottom: 16px; }
.price-tag.accent { color: var(--accent); }
.price-name { font-family: var(--display); font-size: 22px; font-weight: 700; letter-spacing: -.025em; color: var(--fg1); margin-bottom: 6px; }
.price-desc { font-size: 14px; color: var(--fg2); line-height: 22px; margin-bottom: 24px; }
.price-dur { font-family: var(--mono); font-size: 13px; color: var(--fg3); margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--border); }
.price-items { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 32px; }
.price-item { display: flex; align-items: flex-start; gap: 10px; font-size: 13.5px; color: var(--fg2); line-height: 20px; }
.price-item::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: var(--accent); flex-shrink: 0; margin-top: 7px; }
.price-cta { margin-top: auto; display: inline-flex; align-items: center; justify-content: center; padding: 13px 24px; border-radius: 9999px; font-size: 14.5px; font-weight: 500; transition: all .15s; text-align: center; }
.price-cta-dark { background: var(--fg1); color: #fff; }
.price-cta-dark:hover { opacity: .86; }
.price-cta-soft { background: #f1f3f4; color: var(--fg1); }
.price-cta-soft:hover { background: #e8eaed; }
```

- [ ] **Step 2: Create `src/styles/service-visuals.css`**

```css
/* ══ PIPELINE VIS (Gen AI) ══════════════════════════════════ */
.pipeline-vis { background: var(--dark-surface); border-radius: 22px; padding: 32px; display: flex; flex-direction: column; gap: 14px; }
.pv-label { font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: var(--dark-fg3); }
.pv-step { background: var(--dark-card); border: 1px solid var(--dark-divider); border-radius: 10px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; }
.pv-step-num { width: 22px; height: 22px; border-radius: 50%; background: rgba(99,102,241,.2); border: 1px solid rgba(99,102,241,.3); font-size: 10px; font-weight: 700; color: #a5b4fc; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.pv-step-name { font-size: 12.5px; font-weight: 600; color: var(--dark-fg1); letter-spacing: -.01em; }
.pv-step-sub { font-size: 10.5px; color: var(--dark-fg3); margin-top: 1px; }
.pv-step-badge { margin-left: auto; font-family: var(--mono); font-size: 9.5px; padding: 2px 8px; border-radius: 9999px; background: rgba(0,221,106,.1); color: #00dd6a; flex-shrink: 0; }
.pv-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
.pv-stat { background: var(--dark-card); border: 1px solid var(--dark-divider); border-radius: 10px; padding: 12px; }
.pv-stat-num { font-family: var(--display); font-size: 18px; font-weight: 700; letter-spacing: -.03em; color: var(--dark-fg1); }
.pv-stat-label { font-size: 10px; color: var(--dark-fg3); margin-top: 2px; }

/* ══ AGENT FLOW (AI Agents) ══════════════════════════════════ */
.agent-vis { background: var(--dark-surface); border-radius: 22px; padding: 32px; display: flex; flex-direction: column; gap: 14px; }
.av-label { font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: var(--dark-fg3); }
.agent-flow { display: flex; flex-direction: column; gap: 8px; }
.agent-node { background: var(--dark-card); border: 1px solid var(--dark-divider); border-radius: 10px; padding: 12px 14px; display: flex; align-items: center; gap: 10px; }
.agent-node-ico { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.agent-node-ico svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.agent-node-name { font-size: 12px; font-weight: 600; color: var(--dark-fg1); letter-spacing: -.01em; }
.agent-node-sub { font-size: 10px; color: var(--dark-fg3); margin-top: 1px; }
.agent-node-status { margin-left: auto; font-family: var(--mono); font-size: 9px; padding: 2px 8px; border-radius: 9999px; }
.status-done { background: rgba(0,221,106,.1); color: #00dd6a; }
.status-run { background: rgba(8,145,178,.15); color: #67e8f9; }
.status-wait { background: rgba(255,255,255,.06); color: var(--dark-fg3); }
.agent-arrow { display: flex; align-items: center; justify-content: center; color: var(--dark-fg3); font-size: 11px; padding: 2px 0; }
.agent-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
.as-cell { background: var(--dark-card); border: 1px solid var(--dark-divider); border-radius: 10px; padding: 12px; }
.as-num { font-family: var(--display); font-size: 18px; font-weight: 700; letter-spacing: -.03em; color: var(--dark-fg1); }
.as-label { font-size: 10px; color: var(--dark-fg3); margin-top: 2px; }

/* ══ RAG DIAGRAM (RAG) ══════════════════════════════════════ */
.rag-vis { background: var(--dark-surface); border-radius: 22px; padding: 32px; display: flex; flex-direction: column; gap: 14px; }
.rv-label { font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: var(--dark-fg3); }
.rv-query { background: var(--dark-card); border: 1px solid var(--dark-divider); border-radius: 10px; padding: 12px 14px; }
.rv-q-label { font-size: 10px; font-weight: 600; color: var(--dark-fg3); text-transform: uppercase; letter-spacing: .06em; margin-bottom: 4px; }
.rv-q-text { font-size: 13px; color: var(--dark-fg1); letter-spacing: -.01em; }
.rv-chunks { display: flex; flex-direction: column; gap: 6px; }
.rv-chunk { background: var(--dark-card); border: 1px solid var(--dark-divider); border-radius: 8px; padding: 10px 12px; display: flex; align-items: flex-start; gap: 8px; }
.rv-chunk-score { font-family: var(--mono); font-size: 10px; padding: 2px 7px; border-radius: 9999px; flex-shrink: 0; margin-top: 1px; }
.score-high { background: rgba(13,148,136,.15); color: #5eead4; }
.score-med { background: rgba(254,188,46,.1); color: #febc2e; }
.rv-chunk-text { font-size: 11.5px; color: var(--dark-fg2); line-height: 18px; }
.rv-chunk-src { font-size: 9.5px; color: var(--dark-fg3); margin-top: 3px; font-family: var(--mono); }
.rv-answer { background: rgba(13,148,136,.08); border: 1px solid rgba(13,148,136,.2); border-radius: 10px; padding: 12px 14px; }
.rv-a-label { font-size: 10px; font-weight: 600; color: #5eead4; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 4px; }
.rv-a-text { font-size: 12.5px; color: var(--dark-fg1); line-height: 20px; letter-spacing: -.005em; }
.rv-a-cite { font-size: 10px; color: var(--dark-fg3); margin-top: 6px; font-family: var(--mono); }

/* ══ SPRINT CANVAS (AI Strategy) ════════════════════════════ */
.sprint-vis { background: var(--dark-surface); border-radius: 22px; padding: 32px; display: flex; flex-direction: column; gap: 16px; }
.sv-label { font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: var(--dark-fg3); }
.sv-title { font-family: var(--display); font-size: 16px; font-weight: 700; color: var(--dark-fg1); letter-spacing: -.025em; margin-bottom: 4px; }
.sv-sub { font-size: 12px; color: var(--dark-fg3); margin-bottom: 12px; }
.use-case-list { display: flex; flex-direction: column; gap: 6px; }
.use-case { background: var(--dark-card); border: 1px solid var(--dark-divider); border-radius: 9px; padding: 10px 13px; display: flex; align-items: center; gap: 10px; }
.uc-priority { width: 20px; height: 20px; border-radius: 6px; font-size: 9px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.uc-p1 { background: rgba(217,119,6,.2); color: #fbbf24; }
.uc-p2 { background: rgba(99,102,241,.15); color: #a5b4fc; }
.uc-p3 { background: rgba(255,255,255,.06); color: var(--dark-fg3); }
.uc-name { font-size: 12px; font-weight: 600; color: var(--dark-fg1); letter-spacing: -.01em; }
.uc-meta { font-size: 10px; color: var(--dark-fg3); margin-top: 1px; }
.uc-type { margin-left: auto; font-family: var(--mono); font-size: 9px; padding: 2px 7px; border-radius: 9999px; background: rgba(255,255,255,.06); color: var(--dark-fg3); flex-shrink: 0; }
.sprint-footer { background: rgba(217,119,6,.08); border: 1px solid rgba(217,119,6,.15); border-radius: 10px; padding: 14px 16px; }
.sf-label { font-size: 10px; font-weight: 600; color: #fbbf24; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 4px; }
.sf-text { font-size: 12.5px; color: var(--dark-fg2); line-height: 20px; }

/* ══ AZURE ARCH (Azure AI) ══════════════════════════════════ */
.arch-vis { background: var(--dark-surface); border-radius: 22px; padding: 32px; display: flex; flex-direction: column; gap: 16px; }
.arch-nodes { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
.a-node { background: var(--dark-card); border: 1px solid var(--dark-divider); border-radius: 10px; padding: 12px 13px; }
.a-node-name { font-size: 11.5px; font-weight: 600; color: var(--dark-fg1); letter-spacing: -.01em; }
.a-node-sub { font-size: 10px; color: var(--dark-fg3); margin-top: 2px; }
.a-node-live { display: flex; align-items: center; gap: 4px; font-size: 9.5px; color: #00dd6a; margin-top: 4px; }
.arch-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }

/* ══ DATA PIPELINE (Data Engineering) ══════════════════════ */
.deliver-visual { background: var(--dark-surface); border-radius: 22px; padding: 32px; display: flex; flex-direction: column; gap: 16px; }
.dv-label { font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: var(--dark-fg3); }
.pipeline-row { display: flex; align-items: center; gap: 8px; }
.p-node { flex: 1; background: var(--dark-card); border: 1px solid var(--dark-divider); border-radius: 10px; padding: 12px 14px; }
.p-node-name { font-size: 11.5px; font-weight: 600; color: var(--dark-fg1); letter-spacing: -.01em; }
.p-node-val { font-size: 10.5px; color: var(--dark-fg3); margin-top: 2px; }
.p-arr { color: var(--dark-fg3); font-size: 12px; flex-shrink: 0; }
.metrics-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
.m-cell { background: var(--dark-card); border: 1px solid var(--dark-divider); border-radius: 10px; padding: 12px; }
.m-num { font-family: var(--display); font-size: 18px; font-weight: 700; letter-spacing: -.03em; color: var(--dark-fg1); }
.m-label { font-size: 10px; color: var(--dark-fg3); margin-top: 2px; }
.live-dot { width: 6px; height: 6px; border-radius: 50%; background: #00dd6a; box-shadow: 0 0 6px rgba(0,221,106,.6); display: inline-block; margin-right: 4px; }

/* ══ MODEL REGISTRY (Machine Learning) ═════════════════════ */
.model-vis { background: var(--dark-surface); border-radius: 22px; padding: 32px; display: flex; flex-direction: column; gap: 14px; }
.mv-label { font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: var(--dark-fg3); }
.model-card { background: var(--dark-card); border: 1px solid var(--dark-divider); border-radius: 12px; padding: 14px 16px; display: flex; gap: 12px; align-items: flex-start; }
.model-ico { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.model-ico svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }
.model-name { font-size: 13px; font-weight: 600; color: var(--dark-fg1); letter-spacing: -.01em; }
.model-type { font-size: 11px; color: var(--dark-fg3); margin-top: 2px; }
.model-metrics { display: flex; gap: 14px; margin-top: 8px; }
.mm { display: flex; flex-direction: column; gap: 1px; }
.mm-val { font-family: var(--display); font-size: 15px; font-weight: 700; letter-spacing: -.025em; color: var(--dark-fg1); }
.mm-label { font-size: 10px; color: var(--dark-fg3); }
.model-prog { height: 3px; background: var(--dark-divider); border-radius: 2px; margin-top: 8px; overflow: hidden; }
.model-prog-fill { height: 100%; border-radius: 2px; }

/* ══ DEVICE VIS (IoT) ══════════════════════════════════════ */
.device-vis { background: #0d1200; border-radius: 22px; padding: 32px; display: flex; flex-direction: column; gap: 14px; }
.dv-label-iot { font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: #8ce800; display: flex; align-items: center; gap: 6px; }
.pulse { width: 6px; height: 6px; border-radius: 50%; background: #8ce800; box-shadow: 0 0 6px rgba(140,232,0,.6); flex-shrink: 0; }
.device-map { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; }
.dev-card { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); border-radius: 9px; padding: 10px 11px; cursor: pointer; transition: border-color .2s; }
.dev-card.alert { border-color: rgba(255,120,80,.35); }
.dev-card:hover { border-color: rgba(140,232,0,.3); }
.dev-id { font-family: var(--mono); font-size: 8.5px; color: rgba(255,255,255,.35); letter-spacing: .05em; }
.dev-val { font-family: var(--display); font-size: 15px; font-weight: 700; color: #fff; letter-spacing: -.02em; }
.dev-unit { font-size: 8.5px; color: rgba(255,255,255,.3); }
.dev-status { font-size: 9px; color: #8ce800; display: flex; align-items: center; gap: 4px; margin-top: 2px; }
.dev-status.alert { color: rgba(255,120,80,.9); }
.dev-status .dot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; }
.summary-row { display: flex; gap: 8px; }
.sum-cell { flex: 1; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07); border-radius: 9px; padding: 12px; }
.sum-num { font-family: var(--display); font-size: 20px; font-weight: 700; letter-spacing: -.03em; color: #fff; }
.sum-label { font-size: 10px; color: rgba(255,255,255,.35); margin-top: 2px; }
```

- [ ] **Step 3: Update `src/layouts/BaseLayout.astro` — add `accent` prop + import new CSS**

Replace the frontmatter block and `<body>` tag:

```astro
---
import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/system.css';
import '../styles/home.css';
import '../styles/service.css';
import '../styles/service-visuals.css';
import Nav from '../components/nav/Nav.astro';
import Footer from '../components/footer/Footer.astro';
import MotionGlue from '../components/motion/MotionGlue.astro';

interface Props { title: string; description?: string; accent?: string; }
const { title, description = 'Production-grade AI for enterprise and growth-stage teams.', accent } = Astro.props;
---
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" type="image/svg+xml" href="/assets/veloxcore-logo-mark.svg" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:ital,wght@0,100..900;1,100..900&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
</head>
<body style={accent ? `--accent:${accent}` : undefined}>
  <Nav />
  <slot />
  <Footer />
  <MotionGlue />
</body>
</html>
```

- [ ] **Step 4: Verify build**

```
npm run build
```

Expected: exits 0, no type errors.

- [ ] **Step 5: Commit**

```bash
git add src/styles/service.css src/styles/service-visuals.css src/layouts/BaseLayout.astro
git commit -m "feat: add service.css, service-visuals.css, accent prop to BaseLayout"
```

---

### Task 2: Content collection schema

**Files:**
- Modify: `src/content/config.ts`

- [ ] **Step 1: Add services collection to `src/content/config.ts`**

Replace the entire file with:

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
    coverTheme: z.string(),
    stats: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
    excerpt: z.string(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    shortTag: z.string().optional(),
  }),
});

const kpi = z.object({ num: z.string(), label: z.string() });
const persona = z.object({ role: z.string(), title: z.string(), pain: z.string(), quote: z.string() });
const deliverItem = z.object({ label: z.string(), detail: z.string() });
const apStep = z.object({ num: z.string(), title: z.string(), desc: z.string(), dur: z.string() });
const techCard = z.object({
  name: z.string(), desc: z.string(),
  iconBg: z.string(), iconColor: z.string(),
  iconKey: z.string(),
});
const proofStat = z.object({ val: z.string(), label: z.string() });
const quoteObj = z.object({ text: z.string(), name: z.string(), role: z.string() });
const faqItem = z.object({ q: z.string(), a: z.string() });
const priceCard = z.object({
  tag: z.string(),
  featured: z.boolean().optional(),
  name: z.string(),
  desc: z.string(),
  dur: z.string(),
  items: z.array(z.string()),
  ctaLabel: z.string(),
  ctaStyle: z.enum(['dark', 'soft']),
});

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    badge: z.string(),
    accent: z.string(),
    ctaGradient: z.string(),
    visual: z.enum(['pipeline','agent','rag','strategy','azure','data','ml','iot']),
    heroTheme: z.enum(['dark','light']),
    heroH1: z.string(),
    heroSub: z.string(),
    kpis: z.array(kpi).max(4),
    whoH: z.string(),
    whoSub: z.string(),
    who: z.array(persona).length(3),
    deliverH: z.string(),
    deliverSub: z.string(),
    deliver: z.array(deliverItem),
    approachH: z.string(),
    approach: z.array(apStep).length(4),
    techH: z.string(),
    techSub: z.string(),
    tech: z.array(techCard).max(8),
    proofH: z.string(),
    proof: z.object({
      category: z.string(),
      title: z.string(),
      stats: z.array(proofStat),
      quote1: quoteObj,
      quote2: quoteObj,
    }),
    faqSub: z.string().optional(),
    faqs: z.array(faqItem),
    ctaH: z.string(),
    ctaSub: z.string(),
    pricingH: z.string().optional(),
    pricing: z.array(priceCard).optional(),
  }),
});

export const collections = { blog, 'case-studies': caseStudies, services };
```

- [ ] **Step 2: Run type-check**

```
npm run astro check
```

Expected: no errors (no MDX files yet, that's fine).

- [ ] **Step 3: Commit**

```bash
git add src/content/config.ts
git commit -m "feat: add services content collection schema"
```

---

### Task 3: Update Nav hrefs to Astro routes

**Files:**
- Modify: `src/components/nav/Nav.astro`

The Nav already has the full dropdown HTML. Only the `href` attributes need updating to Astro routes.

- [ ] **Step 1: Replace `Nav.astro` content**

```astro
---
import BrandMark from '../ui/BrandMark.astro';
---
<nav class="nav">
  <div class="nav-inner">
    <BrandMark href="/" />
    <div class="nav-links">
      <div class="nav-item has-dropdown">
        <a class="nav-link" href="/services">Services <span class="chev"></span></a>
        <div class="nav-dropdown">
          <div class="nd-section">
            <span class="nd-label">AI Services</span>
            <a class="nd-link" href="/services/generative-ai"><span class="nd-name">Generative AI &amp; LLMs</span><span class="nd-desc">LLM apps, copilots, evaluation harnesses</span></a>
            <a class="nd-link" href="/services/ai-agents"><span class="nd-name">AI Agents &amp; Automation</span><span class="nd-desc">Multi-step agents, tool-calling, human-in-loop</span></a>
            <a class="nd-link" href="/services/rag"><span class="nd-name">RAG &amp; Knowledge Systems</span><span class="nd-desc">Retrieval pipelines with citations &amp; hybrid search</span></a>
            <a class="nd-link" href="/services/ai-strategy"><span class="nd-name">AI Strategy &amp; Discovery</span><span class="nd-desc">2-week sprint to your AI roadmap</span></a>
          </div>
          <div class="nd-section">
            <span class="nd-label">Platform &amp; Data</span>
            <a class="nd-link" href="/services/azure-ai"><span class="nd-name">Azure AI &amp; Cloud</span><span class="nd-desc">Azure OpenAI, AI Foundry, migrations</span></a>
            <a class="nd-link" href="/services/data-engineering"><span class="nd-name">Data Engineering</span><span class="nd-desc">Pipelines, lakehouses, real-time analytics</span></a>
            <a class="nd-link" href="/services/machine-learning"><span class="nd-name">Machine Learning</span><span class="nd-desc">Custom models, MLOps, evaluation</span></a>
            <a class="nd-link" href="/services/iot"><span class="nd-name">IoT &amp; Edge Intelligence</span><span class="nd-desc">Device fleets, edge ML, Azure IoT Hub</span></a>
          </div>
        </div>
      </div>
      <a class="nav-link" href="/products">Products</a>
      <a class="nav-link" href="/work">Work</a>
      <div class="nav-item has-dropdown">
        <a class="nav-link" href="/about">Company <span class="chev"></span></a>
        <div class="nav-dropdown nd-small">
          <div class="nd-section">
            <a class="nd-link" href="/about"><span class="nd-name">About</span><span class="nd-desc">Story, team &amp; values</span></a>
            <a class="nd-link" href="/blog"><span class="nd-name">Blog</span><span class="nd-desc">Insights on AI, Azure &amp; data</span></a>
            <a class="nd-link" href="/contact"><span class="nd-name">Contact</span><span class="nd-desc">Get in touch with our team</span></a>
          </div>
        </div>
      </div>
    </div>
    <a class="nav-cta" href="/contact">Book a call<span class="nav-cta-ico"><svg viewBox="0 0 8 8"><polyline points="1 4 4 7 7 4"></polyline><line x1="4" y1="1" x2="4" y2="7"></line></svg></span></a>
  </div>
</nav>
```

- [ ] **Step 2: Build and verify nav renders on home page**

```
npm run build && npm run preview
```

Navigate to `http://localhost:4321` — hover "Services" in nav, confirm dropdown appears with 8 links.

- [ ] **Step 3: Commit**

```bash
git add src/components/nav/Nav.astro
git commit -m "feat: update nav dropdown hrefs to Astro routes"
```

---

### Task 4: Visual components (8 components + index.ts)

**Files (all create):**
- `src/components/services/visuals/PipelineVis.astro`
- `src/components/services/visuals/AgentFlow.astro`
- `src/components/services/visuals/RagDiagram.astro`
- `src/components/services/visuals/StrategyCanvas.astro`
- `src/components/services/visuals/AzureArch.astro`
- `src/components/services/visuals/DataPipeline.astro`
- `src/components/services/visuals/MlCycle.astro`
- `src/components/services/visuals/IotEdge.astro`
- `src/components/services/visuals/index.ts`

Each component is markup-only — no frontmatter, no `<style>`. All CSS comes from `service-visuals.css`.

- [ ] **Step 1: Create `PipelineVis.astro`** (Gen AI)

```astro
<div class="pipeline-vis reveal" style="transition-delay:.1s">
  <div class="pv-label">LLM pipeline · production</div>
  <div class="pv-step">
    <div class="pv-step-num">1</div>
    <div><div class="pv-step-name">User input</div><div class="pv-step-sub">Input validation · PII detection · rate limit</div></div>
    <div class="pv-step-badge">guarded</div>
  </div>
  <div class="pv-step">
    <div class="pv-step-num">2</div>
    <div><div class="pv-step-name">Retrieval</div><div class="pv-step-sub">Azure AI Search · vector + keyword hybrid</div></div>
    <div class="pv-step-badge">live</div>
  </div>
  <div class="pv-step">
    <div class="pv-step-num">3</div>
    <div><div class="pv-step-name">LLM call</div><div class="pv-step-sub">Azure OpenAI GPT-4o · private endpoint</div></div>
    <div class="pv-step-badge">42ms p99</div>
  </div>
  <div class="pv-step">
    <div class="pv-step-num">4</div>
    <div><div class="pv-step-name">Output filter</div><div class="pv-step-sub">Content filter · groundedness check · log</div></div>
    <div class="pv-step-badge">98.3%</div>
  </div>
  <div class="pv-stats">
    <div class="pv-stat"><div class="pv-stat-num">2.4M</div><div class="pv-stat-label">Req/month</div></div>
    <div class="pv-stat"><div class="pv-stat-num">60%</div><div class="pv-stat-label">Cost saving</div></div>
    <div class="pv-stat"><div class="pv-stat-num">0</div><div class="pv-stat-label">Data leaks</div></div>
  </div>
</div>
```

- [ ] **Step 2: Create `AgentFlow.astro`** (AI Agents)

Read `source/Veloxcore Service - AI Agents.html` — find the `<div class="agent-vis">` block (inside `<section class="deliver">`). Port it verbatim. The block contains: `av-label`, `agent-flow` with 4 `agent-node` divs (Orchestrator, Tool Call, Sub-agent, Output Validator) each with `agent-node-ico`, `agent-node-name`, `agent-node-sub`, `agent-node-status`, plus `agent-arrow` separators and `agent-stats` grid.

- [ ] **Step 3: Create `RagDiagram.astro`** (RAG)

Read `source/Veloxcore Service - RAG.html` — find `<div class="rag-vis">`. Port verbatim: `rv-label`, `rv-query`, `rv-chunks` (3 chunks with score-high/score-med badges), `rv-answer` with citation.

- [ ] **Step 4: Create `StrategyCanvas.astro`** (AI Strategy)

Read `source/Veloxcore Service - AI Strategy.html` — find `<div class="sprint-vis">`. Port verbatim: `sv-label`, `sv-title`, `sv-sub`, `use-case-list` (5 use-cases with `uc-p1`/`uc-p2`/`uc-p3` badges), `sprint-footer`.

- [ ] **Step 5: Create `AzureArch.astro`** (Azure AI)

Port the `<div class="arch-vis">` block from `source/Veloxcore Service - Azure AI.html` (line 301):
```astro
<div class="arch-vis reveal" style="transition-delay:.1s">
  <div class="av-label">Azure topology · Client tenant</div>
  <div class="arch-nodes">
    <div class="a-node"><div class="a-node-name">Hub VNet</div><div class="a-node-sub">Private endpoints</div><div class="a-node-live"><div class="live-dot"></div>Active</div></div>
    <div class="a-node"><div class="a-node-name">OpenAI</div><div class="a-node-sub">GPT-4o deployed</div><div class="a-node-live"><div class="live-dot"></div>Live</div></div>
    <div class="a-node"><div class="a-node-name">AI Foundry</div><div class="a-node-sub">3 projects</div><div class="a-node-live"><div class="live-dot"></div>Live</div></div>
    <div class="a-node"><div class="a-node-name">Key Vault</div><div class="a-node-sub">128 secrets</div><div class="a-node-live"><div class="live-dot"></div>Secured</div></div>
    <div class="a-node"><div class="a-node-name">Defender</div><div class="a-node-sub">Score 94%</div><div class="a-node-live"><div class="live-dot"></div>Active</div></div>
    <div class="a-node"><div class="a-node-name">Monitor</div><div class="a-node-sub">All green</div><div class="a-node-live"><div class="live-dot"></div>Active</div></div>
  </div>
  <div class="arch-stats">
    <div class="as-cell"><div class="as-num">12 wks</div><div class="as-label">Avg migration</div></div>
    <div class="as-cell"><div class="as-num">0</div><div class="as-label">Downtime</div></div>
    <div class="as-cell"><div class="as-num">40%</div><div class="as-label">Cost saved</div></div>
  </div>
</div>
```

- [ ] **Step 6: Create `DataPipeline.astro`** (Data Engineering)

Port the `<div class="deliver-visual">` block from `source/Veloxcore Service - Data Engineering.html` (line 316):
```astro
<div class="deliver-visual reveal" style="transition-delay:.1s">
  <div class="dv-label"><span class="live-dot"></span>Live pipeline · Production</div>
  <div class="pipeline-row">
    <div class="p-node"><div class="p-node-name">Event Hubs</div><div class="p-node-val">32 partitions</div></div>
    <div class="p-arr">→</div>
    <div class="p-node"><div class="p-node-name">Stream Analytics</div><div class="p-node-val">5-min window</div></div>
    <div class="p-arr">→</div>
    <div class="p-node"><div class="p-node-name">Data Lake</div><div class="p-node-val">Delta format</div></div>
  </div>
  <div class="pipeline-row">
    <div class="p-node"><div class="p-node-name">Synapse</div><div class="p-node-val">Nightly enrich</div></div>
    <div class="p-arr">→</div>
    <div class="p-node"><div class="p-node-name">Power BI</div><div class="p-node-val">DirectQuery</div></div>
  </div>
  <div class="metrics-row">
    <div class="m-cell"><div class="m-num" style="color:#00dd6a">1.62M</div><div class="m-label">events/sec</div></div>
    <div class="m-cell"><div class="m-num">48ms</div><div class="m-label">p99 latency</div></div>
    <div class="m-cell"><div class="m-num" style="color:#00dd6a">99.97%</div><div class="m-label">uptime</div></div>
  </div>
</div>
```

- [ ] **Step 7: Create `MlCycle.astro`** (Machine Learning)

Port `<div class="model-vis">` from `source/Veloxcore Service - Machine Learning.html` (line 320):
```astro
<div class="model-vis reveal" style="transition-delay:.1s">
  <div class="mv-label">Azure ML — Model Registry · Live</div>
  <div class="model-card">
    <div class="model-ico" style="background:rgba(192,132,252,.15);color:#c084fc"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
    <div style="flex:1">
      <div class="model-name">Demand Forecasting v3.2</div>
      <div class="model-type">GradientBoostingRegressor · Deployed</div>
      <div class="model-metrics">
        <div class="mm"><div class="mm-val">94.3%</div><div class="mm-label">Accuracy</div></div>
        <div class="mm"><div class="mm-val">0.041</div><div class="mm-label">MAE</div></div>
        <div class="mm"><div class="mm-val">12ms</div><div class="mm-label">Latency</div></div>
      </div>
      <div class="model-prog"><div class="model-prog-fill" style="width:94.3%;background:linear-gradient(90deg,#7c3aed,#a855f7)"></div></div>
    </div>
  </div>
  <div class="model-card">
    <div class="model-ico" style="background:rgba(61,126,255,.12);color:#82baff"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg></div>
    <div style="flex:1">
      <div class="model-name">Churn Predictor v2.0</div>
      <div class="model-type">XGBoostClassifier · Staging</div>
      <div class="model-metrics">
        <div class="mm"><div class="mm-val">89.6%</div><div class="mm-label">AUC-ROC</div></div>
        <div class="mm"><div class="mm-val">0.88</div><div class="mm-label">F1</div></div>
        <div class="mm"><div class="mm-val">18ms</div><div class="mm-label">Latency</div></div>
      </div>
      <div class="model-prog"><div class="model-prog-fill" style="width:89.6%;background:linear-gradient(90deg,#1a73e8,#00d4e8)"></div></div>
    </div>
  </div>
  <div class="model-card">
    <div class="model-ico" style="background:rgba(0,221,106,.1);color:#00dd6a"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
    <div style="flex:1">
      <div class="model-name">Anomaly Detection v1.8</div>
      <div class="model-type">IsolationForest · Deployed</div>
      <div class="model-metrics">
        <div class="mm"><div class="mm-val">97.1%</div><div class="mm-label">Precision</div></div>
        <div class="mm"><div class="mm-val">0.003</div><div class="mm-label">FPR</div></div>
        <div class="mm"><div class="mm-val">8ms</div><div class="mm-label">Latency</div></div>
      </div>
      <div class="model-prog"><div class="model-prog-fill" style="width:97.1%;background:linear-gradient(90deg,#137333,#00dd6a)"></div></div>
    </div>
  </div>
</div>
```

- [ ] **Step 8: Create `IotEdge.astro`** (IoT)

Port `<div class="device-vis">` from `source/Veloxcore Service - IoT.html` (line 323):
```astro
<div class="device-vis reveal" style="transition-delay:.1s">
  <div class="dv-label-iot"><div class="pulse"></div>IoT Hub · Live fleet · 10,842 devices</div>
  <div class="device-map">
    <div class="dev-card"><div class="dev-id">DEV-001</div><div class="dev-val">72.4°</div><div class="dev-unit">Celsius</div><div class="dev-status"><div class="dot"></div>Online</div></div>
    <div class="dev-card"><div class="dev-id">DEV-002</div><div class="dev-val">68.1°</div><div class="dev-unit">Celsius</div><div class="dev-status"><div class="dot"></div>Online</div></div>
    <div class="dev-card alert"><div class="dev-id">DEV-003</div><div class="dev-val">94.7°</div><div class="dev-unit">Celsius</div><div class="dev-status alert"><div class="dot"></div>Alert</div></div>
    <div class="dev-card"><div class="dev-id">DEV-004</div><div class="dev-val">71.3°</div><div class="dev-unit">Celsius</div><div class="dev-status"><div class="dot"></div>Online</div></div>
    <div class="dev-card"><div class="dev-id">DEV-005</div><div class="dev-val">1024</div><div class="dev-unit">kPa</div><div class="dev-status"><div class="dot"></div>Online</div></div>
    <div class="dev-card"><div class="dev-id">DEV-006</div><div class="dev-val">3.14</div><div class="dev-unit">m/s²</div><div class="dev-status"><div class="dot"></div>Online</div></div>
    <div class="dev-card"><div class="dev-id">DEV-007</div><div class="dev-val">2.98</div><div class="dev-unit">m/s²</div><div class="dev-status"><div class="dot"></div>Online</div></div>
    <div class="dev-card"><div class="dev-id">DEV-008</div><div class="dev-val">0.44</div><div class="dev-unit">V drop</div><div class="dev-status"><div class="dot"></div>Online</div></div>
  </div>
  <div class="summary-row">
    <div class="sum-cell"><div class="sum-num">10,842</div><div class="sum-label">Provisioned</div></div>
    <div class="sum-cell"><div class="sum-num" style="color:#8ce800">10,841</div><div class="sum-label">Online now</div></div>
    <div class="sum-cell"><div class="sum-num" style="color:rgba(255,120,80,.9)">1</div><div class="sum-label">Alert active</div></div>
  </div>
</div>
```

- [ ] **Step 9: Create `src/components/services/visuals/index.ts`**

```ts
import PipelineVis from './PipelineVis.astro';
import AgentFlow from './AgentFlow.astro';
import RagDiagram from './RagDiagram.astro';
import StrategyCanvas from './StrategyCanvas.astro';
import AzureArch from './AzureArch.astro';
import DataPipeline from './DataPipeline.astro';
import MlCycle from './MlCycle.astro';
import IotEdge from './IotEdge.astro';

export const visualMap = {
  pipeline: PipelineVis,
  agent: AgentFlow,
  rag: RagDiagram,
  strategy: StrategyCanvas,
  azure: AzureArch,
  data: DataPipeline,
  ml: MlCycle,
  iot: IotEdge,
} as const;

export type VisualKey = keyof typeof visualMap;
```

- [ ] **Step 10: Build and verify no type errors**

```
npm run build
```

- [ ] **Step 11: Commit**

```bash
git add src/components/services/
git commit -m "feat: add 8 service visual components + visualMap index"
```

---

### Task 5: Section components

**Files (all create):**
- `src/components/services/ServiceHero.astro`
- `src/components/services/ServiceWho.astro`
- `src/components/services/ServiceDeliver.astro`
- `src/components/services/ServiceApproach.astro`
- `src/components/services/ServiceTech.astro`
- `src/components/services/ServiceProof.astro`
- `src/components/services/ServiceFaq.astro`
- `src/components/services/ServicePricing.astro`

All components are markup-only — no `<style>` blocks.

Tech cards use an `iconKey` string to select inline SVGs. The switch is handled inline in `ServiceTech.astro`.

- [ ] **Step 1: Create `ServiceHero.astro`**

```astro
---
interface Props {
  badge: string; heroTheme: 'dark' | 'light'; heroH1: string; heroSub: string;
  kpis: { num: string; label: string }[];
}
const { badge, heroTheme, heroH1, heroSub, kpis } = Astro.props;
---
<section class={`hero${heroTheme === 'dark' ? ' hero--dark' : ''}`} data-screen-label="01 Hero">
  <canvas class="hero-canvas" aria-hidden="true"></canvas>
  <div class="wrap">
    <div class="hero-inner">
      <div>
        <div class="hero-breadcrumb"><a href="/services">Services</a><span class="sep">›</span><span set:html={badge}></span></div>
        <div class="svc-badge"><span class="svc-badge-dot"></span>{badge}</div>
        <h1 class="hero-h1">{heroH1}</h1>
        <p class="hero-sub">{heroSub}</p>
        <div class="hero-acts">
          <a class="btn-accent" href="/contact">Book a free call</a>
          <a class="btn-ghost-light" href="/work">See our work →</a>
        </div>
      </div>
      <div class="hero-right">
        {kpis.map(k => (
          <div class="h-kpi">
            <div class="h-kpi-num">{k.num}</div>
            <div class="h-kpi-label">{k.label}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
<script>
(function(){
  const c = document.querySelector('.hero-canvas') as HTMLCanvasElement;
  if (!c) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = c.getContext('2d')!;
  const N = 72, MAXD = 150;
  const accent = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#6366f1';
  const COLS = [`rgba(${hexToRgb(accent)},`, 'rgba(139,92,246,', 'rgba(167,139,250,', `rgba(${hexToRgb(accent)},`];
  function hexToRgb(hex: string): string {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `${r},${g},${b}`;
  }
  let W: number, H: number, pts: any[] = [], mouse = {x:-9999, y:-9999};
  function resize() { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; }
  function init() {
    pts = Array.from({length:N}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      vx: (Math.random()-.5)*.28, vy: (Math.random()-.5)*.28,
      r: Math.random()*1.6+0.6, col: COLS[Math.floor(Math.random()*COLS.length)]
    }));
  }
  function draw() {
    ctx.clearRect(0,0,W,H);
    for (let i=0;i<pts.length;i++) {
      for (let j=i+1;j<pts.length;j++) {
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.hypot(dx,dy);
        if (d<MAXD) { ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.strokeStyle=`rgba(99,102,241,${(1-d/MAXD)*0.1})`; ctx.lineWidth=.6; ctx.stroke(); }
        const dm=Math.hypot(pts[i].x-mouse.x,pts[i].y-mouse.y);
        if (dm<MAXD*1.6) { ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(mouse.x,mouse.y); ctx.strokeStyle=`rgba(99,102,241,${(1-dm/(MAXD*1.6))*0.18})`; ctx.lineWidth=.7; ctx.stroke(); }
      }
      ctx.beginPath(); ctx.arc(pts[i].x,pts[i].y,pts[i].r,0,Math.PI*2); ctx.fillStyle=pts[i].col+'0.6)'; ctx.fill();
    }
  }
  function loop() { pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;}); draw(); requestAnimationFrame(loop); }
  window.addEventListener('resize',()=>{resize();init();});
  document.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;});
  resize(); init(); loop();
})();
</script>
```

- [ ] **Step 2: Create `ServiceWho.astro`**

```astro
---
interface Props {
  whoH: string; whoSub: string;
  who: { role: string; title: string; pain: string; quote: string }[];
}
const { whoH, whoSub, who } = Astro.props;
---
<section class="who" data-screen-label="02 Who">
  <div class="wrap">
    <div class="sec-label">Who this is for</div>
    <h2 class="sec-h reveal">{whoH}</h2>
    <p class="sec-sub reveal">{whoSub}</p>
    <div class="persona-grid">
      {who.map((p, i) => (
        <div class="persona reveal" style={i > 0 ? `transition-delay:${i * 0.07}s` : ''}>
          <div class="persona-role">{p.role}</div>
          <div class="persona-title">{p.title}</div>
          <div class="persona-pain">{p.pain}</div>
          <div class="persona-quote">{p.quote}</div>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 3: Create `ServiceDeliver.astro`**

```astro
---
import type { ComponentProps } from 'astro/types';
interface Props {
  deliverH: string; deliverSub: string;
  deliver: { label: string; detail: string }[];
  Visual: any;
}
const { deliverH, deliverSub, deliver, Visual } = Astro.props;
---
<section class="deliver" data-screen-label="03 Deliver">
  <div class="wrap">
    <div class="deliver-grid">
      <div>
        <div class="sec-label">What you get</div>
        <h2 class="sec-h reveal">{deliverH}</h2>
        <p class="sec-sub reveal" style="margin-bottom:0">{deliverSub}</p>
        <div class="deliver-list reveal">
          {deliver.map(item => (
            <div class="deliver-item">
              <div class="d-check"><svg viewBox="0 0 12 9"><polyline points="1.5 4.5 4.5 7.5 10.5 1.5"/></svg></div>
              <div class="d-text"><strong>{item.label}</strong><span>{item.detail}</span></div>
            </div>
          ))}
        </div>
      </div>
      <Visual />
    </div>
  </div>
</section>
```

- [ ] **Step 4: Create `ServiceApproach.astro`**

```astro
---
interface Props {
  approachH: string;
  approach: { num: string; title: string; desc: string; dur: string }[];
}
const { approachH, approach } = Astro.props;
---
<section class="approach" data-screen-label="04 Approach">
  <div class="wrap">
    <div class="sec-label">Our approach</div>
    <h2 class="sec-h reveal">{approachH}</h2>
    <div class="approach-grid">
      {approach.map((s, i) => (
        <div class="ap-step reveal" style={i > 0 ? `transition-delay:${i * 0.06}s` : ''}>
          <div class="ap-num">{s.num}</div>
          <div class="ap-title">{s.title}</div>
          <div class="ap-desc">{s.desc}</div>
          <div class="ap-dur">{s.dur}</div>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 5: Create `ServiceTech.astro`**

The `iconKey` field maps to an inline SVG. Create a lookup inside the component:

```astro
---
interface TechCard { name: string; desc: string; iconBg: string; iconColor: string; iconKey: string; }
interface Props { techH: string; techSub: string; tech: TechCard[]; }
const { techH, techSub, tech } = Astro.props;
const icons: Record<string, string> = {
  cube: '<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  layers: '<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>',
  grid: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>',
  activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  file: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
  bar: '<path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>',
  cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3S3 13.66 3 12"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
  coffee: '<path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>',
  check: '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  wifi: '<path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><circle cx="12" cy="20" r="1"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  users: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>',
};
---
<section class="tech" data-screen-label="05 Tech">
  <div class="wrap">
    <h2 class="tech-h reveal">{techH}</h2>
    <p class="tech-sub reveal">{techSub}</p>
    <div class="tech-grid">
      {tech.map((card, i) => (
        <div class="tech-card reveal" style={i % 4 !== 0 ? `transition-delay:${(i % 4) * 0.05}s` : ''}>
          <div class="tech-ico" style={`background:${card.iconBg};color:${card.iconColor}`}>
            <svg viewBox="0 0 24 24" set:html={icons[card.iconKey] ?? icons.cube}></svg>
          </div>
          <div class="tech-name">{card.name}</div>
          <div class="tech-desc">{card.desc}</div>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 6: Create `ServiceProof.astro`**

```astro
---
interface Stat { val: string; label: string; }
interface QuoteObj { text: string; name: string; role: string; }
interface Props {
  proofH: string; ctaGradient: string;
  proof: { category: string; title: string; stats: Stat[]; quote1: QuoteObj; quote2: QuoteObj; };
}
const { proofH, ctaGradient, proof } = Astro.props;
---
<section class="proof" data-screen-label="06 Proof">
  <div class="wrap">
    <div class="sec-label">Proof</div>
    <h2 class="sec-h reveal">{proofH}</h2>
    <div class="proof-grid reveal">
      <div class="cs-tile" onclick="location.href='/work'">
        <div class="cs-cover" style={`background:${ctaGradient}`}></div>
        <div class="cs-body">
          <div class="cs-cat">{proof.category}</div>
          <div class="cs-title">{proof.title}</div>
          <div class="cs-nums">
            {proof.stats.map(s => (
              <div class="cs-n"><div class="cs-n-val">{s.val}</div><div class="cs-n-label">{s.label}</div></div>
            ))}
          </div>
        </div>
      </div>
      <div class="quotes">
        {[proof.quote1, proof.quote2].map((q, i) => (
          <div class="quote-card reveal" style={i > 0 ? 'transition-delay:.08s' : ''}>
            <div class="quote-text">"{q.text}"</div>
            <div class="quote-foot">
              <div class="q-ava" style={`background:linear-gradient(135deg,${i === 0 ? '#6366f1,#a5b4fc' : '#0f0a2e,#6366f1'})`}></div>
              <div><div class="q-name">{q.name}</div><div class="q-role">{q.role}</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 7: Create `ServiceFaq.astro`**

```astro
---
interface Props { faqSub?: string; faqs: { q: string; a: string }[]; }
const { faqSub, faqs } = Astro.props;
---
<section class="faq" data-screen-label="07 FAQ">
  <div class="wrap">
    <div class="faq-grid">
      <div>
        <div class="sec-label">FAQ</div>
        <h2 class="sec-h reveal">Common questions.</h2>
        {faqSub && <p class="sec-sub reveal" style="margin-bottom:0;max-width:36ch">{faqSub}</p>}
      </div>
      <div class="faq-list reveal">
        {faqs.map((item, i) => (
          <div class={`faq-item${i === 0 ? ' open' : ''}`}>
            <div class="faq-q" onclick="this.parentElement.classList.toggle('open')">
              <span class="faq-q-text">{item.q}</span>
              <div class="faq-ico"><svg viewBox="0 0 12 12"><line x1="6" y1="1" x2="6" y2="11"/><line x1="1" y1="6" x2="11" y2="6"/></svg></div>
            </div>
            <div class="faq-a">{item.a}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 8: Create `ServicePricing.astro`** (AI Strategy only)

```astro
---
interface PriceCard { tag: string; featured?: boolean; name: string; desc: string; dur: string; items: string[]; ctaLabel: string; ctaStyle: 'dark' | 'soft'; }
interface Props { pricingH?: string; pricing: PriceCard[]; }
const { pricingH = 'Engagement options.', pricing } = Astro.props;
---
<section class="pricing" data-screen-label="Pricing">
  <div class="wrap">
    <h2 class="pricing-h reveal">{pricingH}</h2>
    <div class="pricing-grid">
      {pricing.map(card => (
        <div class={`price-card${card.featured ? ' featured' : ''} reveal`}>
          <div class={`price-tag${card.featured ? ' accent' : ''}`}>{card.tag}</div>
          <div class="price-name">{card.name}</div>
          <div class="price-desc">{card.desc}</div>
          <div class="price-dur">{card.dur}</div>
          <ul class="price-items">
            {card.items.map(item => <li class="price-item">{item}</li>)}
          </ul>
          <a class={`price-cta price-cta-${card.ctaStyle}`} href="/contact">{card.ctaLabel}</a>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 9: Build**

```
npm run build
```

Expected: exits 0.

- [ ] **Step 10: Commit**

```bash
git add src/components/services/
git commit -m "feat: add service section components (Hero, Who, Deliver, Approach, Tech, Proof, Faq, Pricing)"
```

---

### Task 6: Page template

**Files:**
- Create: `src/pages/services/[slug].astro`

- [ ] **Step 1: Create the template**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ServiceHero from '../../components/services/ServiceHero.astro';
import ServiceWho from '../../components/services/ServiceWho.astro';
import ServiceDeliver from '../../components/services/ServiceDeliver.astro';
import ServiceApproach from '../../components/services/ServiceApproach.astro';
import ServiceTech from '../../components/services/ServiceTech.astro';
import ServiceProof from '../../components/services/ServiceProof.astro';
import ServiceFaq from '../../components/services/ServiceFaq.astro';
import ServicePricing from '../../components/services/ServicePricing.astro';
import { visualMap } from '../../components/services/visuals/index.ts';

export async function getStaticPaths() {
  const services = await getCollection('services');
  return services.map(s => ({ params: { slug: s.slug }, props: { service: s } }));
}

const { service } = Astro.props;
const d = service.data;
const Visual = visualMap[d.visual];
---
<BaseLayout title={`${d.title} — Veloxcore`} accent={d.accent}>
  <ServiceHero badge={d.badge} heroTheme={d.heroTheme} heroH1={d.heroH1} heroSub={d.heroSub} kpis={d.kpis} />
  <ServiceWho whoH={d.whoH} whoSub={d.whoSub} who={d.who} />
  <ServiceDeliver deliverH={d.deliverH} deliverSub={d.deliverSub} deliver={d.deliver} Visual={Visual} />
  <ServiceApproach approachH={d.approachH} approach={d.approach} />
  <ServiceTech techH={d.techH} techSub={d.techSub} tech={d.tech} />
  {d.pricing && <ServicePricing pricingH={d.pricingH} pricing={d.pricing} />}
  <ServiceProof proofH={d.proofH} ctaGradient={d.ctaGradient} proof={d.proof} />
  <ServiceFaq faqSub={d.faqSub} faqs={d.faqs} />
  <section class="cta-section" data-screen-label="08 CTA">
    <div class="wrap">
      <div class="cta-inner">
        <div>
          <h2 class="cta-h reveal">{d.ctaH}</h2>
          <p class="cta-sub reveal">{d.ctaSub}</p>
        </div>
        <div class="cta-acts reveal">
          <a class="btn-white" href="/contact">Book a free call</a>
          <a class="btn-ghost" href="/work">See our work →</a>
        </div>
      </div>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Build (will fail — no MDX files yet, that's expected)**

```
npm run build 2>&1 | head -20
```

Expected: error like "No content entries found" or 0 static paths — that's fine.

- [ ] **Step 3: Commit**

```bash
git add src/pages/services/
git commit -m "feat: add service page template [slug].astro"
```

---

### Task 7: Seed content — Generative AI MDX

**Files:**
- Create: `src/content/services/generative-ai.mdx`

All content verbatim-ported from `source/Veloxcore Service - Generative AI.html`. Tech card `iconKey` values must match keys in `ServiceTech.astro`'s `icons` lookup (see Task 5 Step 5).

- [ ] **Step 1: Create `src/content/services/generative-ai.mdx`**

```mdx
---
title: "Generative AI & LLM Applications"
badge: "Generative AI & LLM Applications"
accent: "#6366f1"
ctaGradient: "linear-gradient(130deg,#0f0a2e,#6366f1,#a5b4fc)"
visual: pipeline
heroTheme: dark
heroH1: "From prompt to production LLM application."
heroSub: "We build customer-facing copilots, internal knowledge assistants, and document-intelligence systems on Azure OpenAI — with evaluation harnesses, guardrails, and the observability stack to keep them honest in production."
kpis:
  - num: "98.3%"
    label: "Avg eval pass rate in production"
  - num: "42ms"
    label: "p99 LLM response latency"
  - num: "8 wks"
    label: "Avg time to production"
  - num: "60%"
    label: "Token cost reduction post-optimisation"
whoH: "Three buyers who come to us."
whoSub: "You don't need to know which LLM to use. You need to recognise the problem."
who:
  - role: "Head of AI / Digital Product"
    title: "The prototype owner"
    pain: "You built a compelling demo with ChatGPT or Azure OpenAI. Leadership loved it. Now you need to ship it to 50,000 users — with logging, guardrails, latency SLAs, and no hallucinations reaching customers."
    quote: "\"We've built the demo. We have no idea how to productionise it.\""
  - role: "CTO / VP Engineering"
    title: "The engineering decision-maker"
    pain: "Your team wants to add AI to your product. You've reviewed the options — Azure OpenAI, open-source, fine-tune vs RAG. You need a partner who's shipped real LLM products, not someone who'll experiment on your runway."
    quote: "\"I need to know what we're actually building, not what we're exploring.\""
  - role: "Enterprise Architect / CISO"
    title: "The governance owner"
    pain: "You have internal pressure to adopt AI. You have external pressure to keep data secure. You need a production LLM system that doesn't send customer data to OpenAI's training, has content filtering, and produces audit trails."
    quote: "\"We can't ship anything that touches customer data without a security review.\""
deliverH: "A production LLM app.<br>Not a chatbot prototype."
deliverSub: "Every engagement ends with a live, evaluated, monitored LLM application — not a Jupyter notebook and a Streamlit demo."
deliver:
  - label: "Production LLM application"
    detail: "Deployed to Azure App Service or Container Apps, behind a private endpoint, with versioned prompt management and model fallback routing."
  - label: "Evaluation harness"
    detail: "A test suite of 200+ cases covering correctness, groundedness, toxicity, and latency — run on every deployment so regressions never reach users."
  - label: "Prompt management system"
    detail: "Versioned system prompts, A/B testing infrastructure, and a rollback mechanism so prompt changes are as safe as code changes."
  - label: "Observability & cost controls"
    detail: "Request-level logging with PII redaction, token usage dashboards, budget alerts, and rate-limit handling — in Azure Monitor and Application Insights."
  - label: "Security & compliance baseline"
    detail: "Content filtering, Azure Private Link (no public internet), data residency configuration, and an AI Use Policy document for your procurement team."
approachH: "8 weeks from scoping to production."
approach:
  - num: "01"
    title: "Scoping"
    desc: "We define the use case, success criteria, and evaluation metrics before writing a line of code. RAG or fine-tune? GPT-4o or a smaller model? We decide with data, not opinion."
    dur: "Week 1"
  - num: "02"
    title: "Prototype & evaluate"
    desc: "We build a working prototype with a minimal eval harness. This is the fastest way to find the failure modes — hallucination patterns, retrieval gaps, latency spikes — before they reach users."
    dur: "Weeks 2–3"
  - num: "03"
    title: "Harden & integrate"
    desc: "Production hardening: private endpoints, content filtering, logging, cost controls, auth, and integration with your existing systems. The eval suite grows to 200+ cases."
    dur: "Weeks 4–6"
  - num: "04"
    title: "Deploy & hand over"
    desc: "Go-live with a phased rollout — 5% of traffic first. We monitor the first two weeks in production and hand over runbooks, prompt management docs, and the eval pipeline."
    dur: "Weeks 7–8"
techH: "Our production LLM stack."
techSub: "The tools we've shipped with — not the ones we've only benchmarked."
tech:
  - name: "Azure OpenAI Service"
    desc: "GPT-4o, GPT-4o-mini, o1 — deployed on private endpoints with BYOD (bring your own data) patterns."
    iconBg: "rgba(99,102,241,.12)"
    iconColor: "#a5b4fc"
    iconKey: cube
  - name: "Azure AI Search"
    desc: "Hybrid retrieval — vector similarity + BM25 keyword — with semantic ranker for RAG pipelines."
    iconBg: "rgba(61,126,255,.1)"
    iconColor: "#82baff"
    iconKey: search
  - name: "Semantic Kernel"
    desc: "Microsoft's open-source SDK for orchestrating LLM calls, plugins, planners, and memory in .NET and Python."
    iconBg: "rgba(0,212,232,.1)"
    iconColor: "#00d4e8"
    iconKey: layers
  - name: "Azure AI Foundry"
    desc: "Model catalogues, prompt flows, evaluation pipelines, and deployment management — the control plane for AI projects."
    iconBg: "rgba(139,92,246,.12)"
    iconColor: "#c084fc"
    iconKey: grid
  - name: "Application Insights"
    desc: "Request-level tracing, token usage dashboards, latency histograms, and alert rules for LLM applications."
    iconBg: "rgba(0,221,106,.1)"
    iconColor: "#00dd6a"
    iconKey: activity
  - name: "LangChain / LlamaIndex"
    desc: "When Semantic Kernel isn't the right fit — Python-native orchestration for complex retrieval and agent pipelines."
    iconBg: "rgba(254,188,46,.12)"
    iconColor: "#febc2e"
    iconKey: file
  - name: "Azure Content Safety"
    desc: "Input and output filtering — hate speech, self-harm, sexual content, violence — with custom blocklists."
    iconBg: "rgba(255,120,80,.1)"
    iconColor: "#ff7850"
    iconKey: shield
  - name: "Azure Key Vault"
    desc: "All API keys, connection strings, and model endpoints stored as secrets — no hardcoded credentials, ever."
    iconBg: "rgba(192,132,252,.12)"
    iconColor: "#c084fc"
    iconKey: info
proofH: "From a real LLM deployment."
proof:
  category: "SaaS · Generative AI"
  title: "Customer support copilot handling 2.4M requests/month with 98.3% eval pass rate."
  stats:
    - val: "2.4M"
      label: "Requests/month"
    - val: "98.3%"
      label: "Eval pass rate"
    - val: "60%"
      label: "Token cost saved"
  quote1:
    text: "We had a working demo in two weeks with ChatGPT. Getting it to production-grade took Veloxcore eight weeks — and now I understand why that work mattered."
    name: "Arjun Nair"
    role: "Head of AI · SaaS Co."
  quote2:
    text: "The eval harness was the thing I didn't know I needed. We caught three regression patterns in testing that would have been a PR disaster if they'd reached customers."
    name: "Priya Menon"
    role: "CTO · Product Co."
faqSub: "Questions we get on almost every LLM discovery call."
faqs:
  - q: "RAG or fine-tuning — which should we use?"
    a: "For the vast majority of enterprise use cases, RAG is the right answer: it keeps your data in your control, requires no retraining when your knowledge base changes, and gives you citation-level traceability. Fine-tuning is useful for style and format adaptation, not knowledge injection. We start every engagement with an evaluation of both and recommend based on your specific success criteria."
  - q: "How do you prevent hallucinations?"
    a: "You can't eliminate hallucinations entirely, but you can make them detectable and catchable. We build an evaluation harness that runs groundedness checks on every response against your source documents — anything that fails is flagged before it reaches the user. In production, we log every response with its retrieved context so you can audit any failure."
  - q: "Does our data get used to train OpenAI's models?"
    a: "No. Azure OpenAI Service does not use your prompts or completions to train OpenAI's models — this is a core data protection commitment from Microsoft. We deploy all models in your Azure subscription, behind private endpoints, with no public internet exposure. Your data stays in your tenant."
  - q: "What does an evaluation harness actually do?"
    a: "It's a test suite — like a unit test suite but for LLM behaviour. We define 200+ test cases that cover correctness (does it give the right answer?), groundedness (is the answer supported by retrieved documents?), format compliance, and safety. It runs automatically on every prompt change or model upgrade, giving you a pass/fail signal before anything reaches production."
ctaH: "Ready to ship your LLM app?"
ctaSub: "Book a free 45-minute architecture review. We'll tell you what production-grade actually requires for your use case."
---
```

- [ ] **Step 2: Build and preview**

```
npm run build && npm run preview
```

Navigate to `http://localhost:4321/services/generative-ai` — verify page renders with dark hero, indigo accent, 4 KPI cards, pipeline visual, 8 tech cards, 4 FAQs.

- [ ] **Step 3: Commit**

```bash
git add src/content/services/generative-ai.mdx
git commit -m "feat: seed generative-ai service page content"
```

---

### Task 8: Seed content — AI Agents, RAG, AI Strategy

**Files:**
- Create: `src/content/services/ai-agents.mdx`
- Create: `src/content/services/rag.mdx`
- Create: `src/content/services/ai-strategy.mdx`

For each file: read the corresponding `source/Veloxcore Service - *.html`, extract all section content, and write the MDX following the same schema as `generative-ai.mdx`.

- [ ] **Step 1: Read source HTML files**

Read these files fully before writing MDX:
- `source/Veloxcore Service - AI Agents.html`
- `source/Veloxcore Service - RAG.html`
- `source/Veloxcore Service - AI Strategy.html`

- [ ] **Step 2: Create `src/content/services/ai-agents.mdx`**

Key metadata:
```yaml
accent: "#0891b2"
ctaGradient: "linear-gradient(130deg,#021d26,#0891b2,#67e8f9)"
visual: agent
heroTheme: dark
```
Extract all sections (who personas ×3, deliver items, approach steps ×4, tech cards ×8, proof tile + 2 quotes, faqs ×4) verbatim from the source HTML. Use `iconKey` values from the `icons` lookup in `ServiceTech.astro`.

- [ ] **Step 3: Create `src/content/services/rag.mdx`**

Key metadata:
```yaml
accent: "#0d9488"
ctaGradient: "linear-gradient(130deg,#021a17,#0d9488,#5eead4)"
visual: rag
heroTheme: dark
```
Extract all sections verbatim from source HTML.

- [ ] **Step 4: Create `src/content/services/ai-strategy.mdx`**

Key metadata:
```yaml
accent: "#d97706"
ctaGradient: "linear-gradient(130deg,#1a0e00,#d97706,#fbbf24)"
visual: strategy
heroTheme: dark
```

This service has a `pricing` section (3 cards). Extract from the `<section class="pricing">` block in the source HTML. The 3 cards are: "Discovery only" (soft CTA), "Discovery + Build" (featured, dark CTA), "Full sprint team" (soft CTA). Port `pricingH`, `pricing[].tag`, `.name`, `.desc`, `.dur`, `.items[]`, `.ctaLabel`, `.ctaStyle`.

- [ ] **Step 5: Build and verify all 3 routes**

```
npm run build && npm run preview
```

Check:
- `http://localhost:4321/services/ai-agents` — cyan accent, agent flow visual
- `http://localhost:4321/services/rag` — teal accent, RAG diagram visual
- `http://localhost:4321/services/ai-strategy` — amber accent, pricing section visible, strategy canvas visual

- [ ] **Step 6: Commit**

```bash
git add src/content/services/ai-agents.mdx src/content/services/rag.mdx src/content/services/ai-strategy.mdx
git commit -m "feat: seed ai-agents, rag, ai-strategy service pages"
```

---

### Task 9: Seed content — Azure AI, Data Engineering, Machine Learning, IoT

**Files:**
- Create: `src/content/services/azure-ai.mdx`
- Create: `src/content/services/data-engineering.mdx`
- Create: `src/content/services/machine-learning.mdx`
- Create: `src/content/services/iot.mdx`

These four services all use `heroTheme: light` (white background hero, dark text).

- [ ] **Step 1: Read all 4 source HTML files**

Read fully before writing:
- `source/Veloxcore Service - Azure AI.html`
- `source/Veloxcore Service - Data Engineering.html`
- `source/Veloxcore Service - Machine Learning.html`
- `source/Veloxcore Service - IoT.html`

- [ ] **Step 2: Create `src/content/services/azure-ai.mdx`**

```yaml
accent: "#1a73e8"
ctaGradient: "linear-gradient(130deg,#0d3d8a,#1a73e8,#00d4e8)"
visual: azure
heroTheme: light
```
Extract all sections verbatim.

- [ ] **Step 3: Create `src/content/services/data-engineering.mdx`**

```yaml
accent: "#137333"
ctaGradient: "radial-gradient(circle at 25% 65%,#3d7eff 0%,#00d4e8 28%,#00dd6a 58%,#8ce800 100%)"
visual: data
heroTheme: light
```

- [ ] **Step 4: Create `src/content/services/machine-learning.mdx`**

```yaml
accent: "#7c3aed"
visual: ml
heroTheme: light
```
Extract `ctaGradient` from the `<div class="cs-cover">` background in the source HTML.

- [ ] **Step 5: Create `src/content/services/iot.mdx`**

```yaml
accent: "#a06000"
visual: iot
heroTheme: light
```
Extract `ctaGradient` from `<div class="cs-cover">` in source HTML.

- [ ] **Step 6: Build and verify all 4 routes**

```
npm run build && npm run preview
```

Check all 4 light-hero pages render with correct accent colour and visual block.

- [ ] **Step 7: Commit**

```bash
git add src/content/services/azure-ai.mdx src/content/services/data-engineering.mdx src/content/services/machine-learning.mdx src/content/services/iot.mdx
git commit -m "feat: seed azure-ai, data-engineering, machine-learning, iot service pages"
```

---

### Task 10: Playwright tests + visual parity

**Files:**
- Modify: `tests/home.spec.ts` (add service tests)

- [ ] **Step 1: Add service page tests to `tests/home.spec.ts`**

Append these tests:

```ts
test('service page renders core structure', async ({ page }) => {
  await page.goto('/services/generative-ai');
  await expect(page.locator('.svc-badge')).toContainText('Generative AI');
  await expect(page.locator('.hero-h1')).toContainText('From prompt to production');
  await expect(page.locator('.pipeline-vis')).toBeVisible();
  await expect(page.locator('.ap-step')).toHaveCount(4);
  await expect(page.locator('.tech-card')).toHaveCount(8);
  await expect(page.locator('.faq-item')).toHaveCount(4);
});

test('service page dark hero has no seam with nav', async ({ page }) => {
  await page.goto('/services/generative-ai');
  const nav = await page.locator('nav.nav').boundingBox();
  const hero = await page.locator('section.hero').boundingBox();
  expect(nav).not.toBeNull();
  expect(hero).not.toBeNull();
  // hero top should be at y=0 (behind fixed nav)
  expect(hero!.y).toBe(0);
});

test('service page light hero renders on azure-ai', async ({ page }) => {
  await page.goto('/services/azure-ai');
  await expect(page.locator('.svc-badge')).toContainText('Azure AI');
  await expect(page.locator('.arch-vis')).toBeVisible();
  // light hero should NOT have hero--dark class
  const heroClass = await page.locator('section.hero').getAttribute('class');
  expect(heroClass).not.toContain('hero--dark');
});

test('ai-strategy page shows pricing section', async ({ page }) => {
  await page.goto('/services/ai-strategy');
  await expect(page.locator('.pricing')).toBeVisible();
  await expect(page.locator('.price-card')).toHaveCount(3);
});

test('service nav dropdown links to correct routes', async ({ page }) => {
  await page.goto('/');
  const dropdown = page.locator('.nav-dropdown').first();
  await expect(dropdown.locator('a[href="/services/generative-ai"]')).toBeVisible();
  await expect(dropdown.locator('a[href="/services/iot"]')).toBeVisible();
});

test('service page canvas renders full-bleed', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/services/generative-ai');
  const canvas = await page.locator('.hero-canvas').boundingBox();
  expect(canvas).not.toBeNull();
  // canvas should not be default 300×150
  expect(canvas!.width).toBeGreaterThan(300);
  expect(canvas!.height).toBeGreaterThan(150);
});

test('service reveals visible under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/services/generative-ai');
  await expect(page.locator('.sec-h.reveal').first()).toHaveClass(/visible/);
});
```

- [ ] **Step 2: Run all tests**

```
npm run build && npx playwright test
```

Expected: all tests pass including the 5 existing home tests + 7 new service tests.

- [ ] **Step 3: Screenshot parity check**

```
npx playwright test --reporter=html
```

Open the report and visually compare the Gen AI service page screenshot against `source/Veloxcore Service - Generative AI.html` opened in a browser. Verify:
- Dark hero with indigo accent, no seam with nav
- Pipeline visual visible and full-width (not 300×150 box)
- 4 KPI cards in 2×2 grid on right
- Reveal animations fire after scroll
- Tech section dark background with 8 cards

- [ ] **Step 4: Fix any parity issues found, re-screenshot**

Common issues:
- Canvas defaulting to 300×150 → check `position:absolute` on `.hero-canvas` in `service.css` (it should already be there from the `hero--dark` block — but also verify the light-hero services)
- Reveal content permanently invisible → verify MotionGlue IntersectionObserver fires on service page elements

- [ ] **Step 5: Commit**

```bash
git add tests/home.spec.ts
git commit -m "test: add service page Playwright tests (7 tests)"
```

- [ ] **Step 6: Final build verification**

```
npm run build
```

Expected: exits 0, 8 service routes generated, home page unchanged.

- [ ] **Step 7: Merge to master**

```bash
git checkout master
git merge --no-ff -m "Merge feature/services-astro: service pages template + 8 pages" HEAD
```

Wait for user confirmation before pushing.
