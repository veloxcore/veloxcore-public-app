# Design Spec: Veloxcore Service Pages — Astro

**Date:** 2026-05-28  
**Status:** Approved  
**Scope:** Service page template + content collection + all 8 service MDX files + Nav dropdown

---

## 1. Source of Truth

Canonical HTML files in `source/`:

| Service | File | Accent |
|---|---|---|
| Generative AI | `Veloxcore Service - Generative AI.html` | `#6366f1` |
| AI Agents | `Veloxcore Service - AI Agents.html` | `#0891b2` |
| RAG | `Veloxcore Service - RAG.html` | `#0d9488` |
| AI Strategy | `Veloxcore Service - AI Strategy.html` | `#d97706` |
| Azure AI | `Veloxcore Service - Azure AI.html` | `#1a73e8` |
| Data Engineering | `Veloxcore Service - Data Engineering.html` | `#137333` |
| Machine Learning | `Veloxcore Service - Machine Learning.html` | `#7c3aed` |
| IoT | `Veloxcore Service - IoT.html` | `#a06000` |

Each prototype page defines `--accent` at `:root` and per-service bespoke visual CSS in an inline `<style>` block. Port these to global CSS files — never per-component `<style>` blocks.

---

## 2. Architecture Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Routing | `src/pages/services/[slug].astro` | Single template, 8 slugs from collection |
| Content | `src/content/services/` collection | Deep frontmatter, empty MDX body |
| Styling | Write-once global CSS | `service.css` + `service-visuals.css` imported in BaseLayout |
| Accent colour | `--accent` via `<body style>` | Frontmatter field flows to CSS custom property on body |
| Per-service visual | Named Astro component per service | Bespoke visuals differ structurally; data-driven would force one shape |
| Scripts | Plain `<script>` only | No `client:*` directives (Windows Vite null-byte rule) |
| Nav dropdown | Ported in `Nav.astro` | Dropdown HTML is the same across all prototype pages |

---

## 3. File Structure

```
src/
  content/
    services/
      generative-ai.mdx
      ai-agents.mdx
      rag.mdx
      ai-strategy.mdx
      azure-ai.mdx
      data-engineering.mdx
      machine-learning.mdx
      iot.mdx
  pages/
    services/
      [slug].astro          ← template
  components/
    services/
      ServiceHero.astro
      ServiceWho.astro
      ServiceDeliver.astro
      ServiceApproach.astro
      ServiceTech.astro
      ServiceProof.astro
      ServiceFaq.astro
      ServicePricing.astro  ← AI Strategy only (conditional render)
      visuals/
        PipelineVis.astro   ← Gen AI
        AgentFlow.astro     ← AI Agents
        RagDiagram.astro    ← RAG
        StrategyCanvas.astro← AI Strategy
        AzureArch.astro     ← Azure AI
        DataPipeline.astro  ← Data Engineering
        MlCycle.astro       ← Machine Learning
        IotEdge.astro       ← IoT
  styles/
    service.css             ← new: shared service-page section rules
    service-visuals.css     ← new: all 8 bespoke visual block CSS
```

`BaseLayout.astro` gains an optional `accent?: string` prop that sets `style` on `<body>`.

---

## 4. Content Model

### Zod Schema (added to `src/content/config.ts`)

```ts
const kpi = z.object({ num: z.string(), label: z.string() });
const persona = z.object({ role: z.string(), title: z.string(), pain: z.string(), quote: z.string() });
const deliverItem = z.object({ label: z.string(), detail: z.string() });
const apStep = z.object({ num: z.string(), title: z.string(), desc: z.string(), dur: z.string() });
const techCard = z.object({
  name: z.string(), desc: z.string(),
  iconBg: z.string(), iconColor: z.string(),
  iconKey: z.string(),   // maps to SVG in ServiceTech.astro switch
});
const proofStat = z.object({ val: z.string(), label: z.string() });
const quoteObj = z.object({ text: z.string(), name: z.string(), role: z.string() });
const faqItem = z.object({ q: z.string(), a: z.string() });
const priceCard = z.object({
  tag: z.string(), featured: z.boolean().optional(),
  name: z.string(), desc: z.string(), dur: z.string(),
  items: z.array(z.string()),
  ctaLabel: z.string(), ctaStyle: z.enum(['dark', 'soft']),
});

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    badge: z.string(),
    accent: z.string(),
    ctaGradient: z.string(),         // used in .cs-cover background
    visual: z.enum(['pipeline','agent','rag','strategy','azure','data','ml','iot']),
    heroH1: z.string(),
    heroSub: z.string(),
    kpis: z.array(kpi).max(4),
    who: z.array(persona).length(3),
    whoH: z.string(),
    whoSub: z.string(),
    deliverH: z.string(),
    deliverSub: z.string(),
    deliver: z.array(deliverItem),
    approachH: z.string(),
    approach: z.array(apStep).length(4),
    techH: z.string(),
    techSub: z.string(),
    tech: z.array(techCard).max(8),
    proof: z.object({
      category: z.string(),
      title: z.string(),
      stats: z.array(proofStat),
      quote1: quoteObj,
      quote2: quoteObj,
    }),
    proofH: z.string(),
    faqs: z.array(faqItem),
    faqSub: z.string().optional(),
    ctaH: z.string(),
    ctaSub: z.string(),
    pricing: z.array(priceCard).optional(),  // AI Strategy only
    pricingH: z.string().optional(),
  }),
});
```

All content verbatim-ported from prototype HTML. No invented copy.

---

## 5. Page Template (`[slug].astro`)

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ServiceHero from '../../components/services/ServiceHero.astro';
// ... all section imports
import { visualMap } from '../../components/services/visuals/index.ts';

export async function getStaticPaths() {
  const services = await getCollection('services');
  return services.map(s => ({ params: { slug: s.slug }, props: { service: s } }));
}

const { service } = Astro.props;
const { data: d } = service;
const Visual = visualMap[d.visual];
---
<BaseLayout title={d.title} accent={d.accent}>
  <ServiceHero {d} />
  <ServiceWho {d} />
  <ServiceDeliver {d} Visual={Visual} />
  <ServiceApproach {d} />
  <ServiceTech {d} />
  {d.pricing && <ServicePricing pricing={d.pricing} pricingH={d.pricingH} accent={d.accent} />}
  <ServiceProof {d} />
  <ServiceFaq {d} />
  <!-- CTA section inline (simple enough) -->
</BaseLayout>
```

`visualMap` is `src/components/services/visuals/index.ts` — a plain object `{ pipeline: PipelineVis, agent: AgentFlow, ... }`.

---

## 6. CSS Strategy

### `src/styles/service.css`

Ports all service-page structural CSS from `veloxcore.css` not yet in `system.css`:
- `.hero-breadcrumb`, `.sep` — breadcrumb link + separator
- `.svc-badge`, `.svc-badge-dot` — service badge pill
- `.hero-inner` grid layout for service hero (2-column: left content + right KPIs)
- `.hero-right`, `.h-kpi`, `.h-kpi-num`, `.h-kpi-label` — KPI grid right panel
- `.persona-grid`, `.persona`, `.persona-role`, `.persona-title`, `.persona-pain`, `.persona-quote`
- `.deliver-grid`, `.deliver-list`, `.deliver-item`, `.d-check`, `.d-text`
- Hero canvas positioning (same 4 rules as home.css: `canvas.hero-canvas { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }` + `.hero { position:relative; }`)
- Pricing section: `.pricing`, `.pricing-grid`, `.price-card`, `.price-card.featured`, `.price-tag`, `.price-name`, `.price-desc`, `.price-dur`, `.price-items`, `.price-item`, `.price-cta`, `.price-cta-dark`, `.price-cta-soft`

### `src/styles/service-visuals.css`

All 8 visual block CSS blocks, each namespaced by its root class:
- `.pipeline-vis` + child rules (Gen AI)
- `.agent-vis` + `.agent-flow`, `.agent-node`, `.agent-stats` (AI Agents)
- `.rag-vis` + `.rv-*` (RAG)
- `.sprint-vis` + `.sv-*`, `.use-case-list`, `.uc-*`, `.sprint-footer` (AI Strategy)
- Azure AI visual classes (TBD — read prototype)
- Data Engineering visual classes (TBD — read prototype)
- ML visual classes (TBD — read prototype)
- IoT visual classes (TBD — read prototype)

These are ported verbatim. Per-service accent variants (e.g. `.score-high` uses `rgba(13,148,136,...)`) are hardcoded in the visual CSS since each visual belongs to one service. The `--accent` variable on body handles hover states and badge dots globally.

### `BaseLayout.astro` change

```astro
interface Props { title: string; description?: string; accent?: string; }
const { title, description = '...', accent } = Astro.props;
---
<body style={accent ? `--accent:${accent}` : undefined}>
```

Both `service.css` and `service-visuals.css` are imported in `BaseLayout.astro` alongside `home.css`.

---

## 7. Nav Dropdown

`Nav.astro` is updated to include the full two-column Services dropdown and the Company dropdown (both present in prototype):

```html
<div class="nav-item has-dropdown">
  <a class="nav-link" href="/services">Services <span class="chev"></span></a>
  <div class="nav-dropdown">
    <div class="nd-section">
      <span class="nd-label">AI Services</span>
      <a class="nd-link" href="/services/generative-ai">...</a>
      <!-- × 4 -->
    </div>
    <div class="nd-section">
      <span class="nd-label">Platform & Data</span>
      <!-- × 4 -->
    </div>
  </div>
</div>
```

Dropdown behaviour is CSS-only: `system.css` already has `.nav-item:hover .nav-dropdown` and `.nav-item:focus-within .nav-dropdown` rules that show the dropdown. No JS needed. The nav dropdown CSS (`.nav-dropdown`, `.nd-section`, `.nd-label`, `.nd-link`, `.nd-name`, `.nd-desc`, `.nd-small`) is already in `system.css`. The implementer only needs to add the HTML markup to `Nav.astro`.

---

## 8. Motion

All service pages reuse the existing `MotionGlue.astro` reveal system unchanged. Every `.reveal` element in the prototype is ported as-is.

Hero canvas: each service has the same particle animation IIFE from the prototype (72 particles, `--accent`-colored, mouse-attract). This lives as a plain `<script>` in `ServiceHero.astro`. The particle colours are hardcoded to use `--accent` (already done in prototype via the `COLS` array per service) — they will automatically use the body-level `--accent` value.

FAQ accordion: `toggleFaq()` IIFE ported verbatim into `ServiceFaq.astro` as a plain `<script>`.

`prefers-reduced-motion`: MotionGlue already handles `.reveal` elements. The hero canvas IIFE checks `window.matchMedia('(prefers-reduced-motion: reduce)')` and skips the animation loop if true (matching prototype behaviour).

---

## 9. Per-Service Visual Components

Each visual component is a markup-only `.astro` file referencing global CSS classes. No local `<style>` block.

| Key | Component | Visual |
|---|---|---|
| `pipeline` | `PipelineVis.astro` | 4-step LLM pipeline with numbered steps + stats grid |
| `agent` | `AgentFlow.astro` | Agent node flow (Orchestrator → Tool → Sub-agent → Output) with status badges |
| `rag` | `RagDiagram.astro` | Query → chunks with relevance scores → grounded answer |
| `strategy` | `StrategyCanvas.astro` | Sprint output: prioritised use-case list with P1/P2/P3 badges + sprint footer |
| `azure` | `AzureArch.astro` | (read prototype before implementing) |
| `data` | `DataPipeline.astro` | (read prototype before implementing) |
| `ml` | `MlCycle.astro` | (read prototype before implementing) |
| `iot` | `IotEdge.astro` | (read prototype before implementing) |

The implementer reads the prototype HTML for each visual before building its component.

---

## 10. Success Criteria

1. `npm run build` exits 0 with no type errors
2. All 8 routes (`/services/generative-ai`, etc.) render — verified via `npm run preview`
3. Each page shows the correct accent colour (badge dot, hover states, visual block accents)
4. Hero canvas renders full-bleed (not 300×150 block) — same check as home page
5. All `.reveal` elements become visible after scroll (or immediately under `prefers-reduced-motion: reduce`)
6. Nav Services dropdown opens on hover and links to correct Astro routes
7. Playwright screenshot at 1440px confirms visual parity with prototype for Generative AI page (canonical check)
8. AI Strategy page shows pricing section; other 7 pages do not

---

## 11. Out of Scope

- Services overview hub page (`/services`) — this is item #7 in the build order, after Work/Case Studies/Blog
- Mobile nav (hamburger) — not present in prototype, deferred
- Animations within visual blocks (nodes animating in sequence) — prototype is static; keep static
