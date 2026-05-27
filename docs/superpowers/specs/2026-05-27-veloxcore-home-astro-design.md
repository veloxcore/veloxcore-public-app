# Veloxcore Home — Astro + Motion Rebuild (Design Spec)

_Date: 2026-05-27_

## 1. Goal

Recreate the Veloxcore public website starting with the **home page** as a complete
vertical slice, rebuilt in **Astro (static)** with **Motion (motion.dev) + Lenis** for
scroll-driven animation. The slice must stand up the reusable component and brand-motif
system that all later pages will inherit.

## 2. Source of truth

`source/Veloxcore Home.html` + `source/veloxcore.css` are canonical. The bundle README
and chat-transcript prose are **stale** (they describe an earlier "Antigravity Minimalist"
state — Geist font, `#f9f9f9` canvas, no shadows, plain footer). The home page diverged:
Google Sans Flex type, white `#fff` background, real card shadows, and a dark animated
footer. Where prose conflicts with the HTML/CSS, trust the code.

There is **no** smooth-scroll library in the prototypes (the `.smooth-wrapper` class is
defined but unused; "lerp" only appears in the cursor-glow script). Smooth scroll via
Lenis is therefore a new decision, not an existing constraint.

## 3. Decisions

| Area | Decision |
|---|---|
| Framework | Astro, `output: 'static'` (SSG) |
| Motion | Motion (motion.dev) for animation, Lenis for smooth scroll |
| Page scope | Home page only this session; detail pages/templates deferred |
| Content | **Hybrid** — content collections for `blog` + `caseStudies`; marketing pages static `.astro` |
| Styling | **Write-once global stylesheets**, referenced by class. Components are markup-only — **no scoped `<style>` blocks, no per-component duplication** |

## 4. Project structure

```
src/
  styles/
    tokens.css        # :root token layer (veloxcore.css + home inline :root, consolidated)
    base.css          # reset, .wrap, fonts, .reveal base
    system.css        # shared system: nav, dropdown, buttons, tags, eyebrow,
                      #   section-label, covers, footer base, service sections, faq
    home.css          # home section rules (today inline in home.html)
  layouts/
    BaseLayout.astro  # <head>, font links, <Nav>, <Footer>, global CSS imports,
                      #   Lenis init, global reveal pass, cursor-glow island
  components/
    nav/      Nav.astro, NavDropdown.astro
    footer/   Footer.astro, Ticker.astro, FooterWordmark.astro (island)
    hero/     HomeHero.astro, HeroCanvas.astro (island), WordRotator.astro (island),
              DeviceMock.astro, FloatChip.astro
    sections/ TrustBar.astro, WorkPreview.astro, FeatureBlock.astro, CodePanel.astro,
              BlogGrid.astro, CtaSection.astro, DotField.astro (island)
    ui/       ButtonPill.astro, Tag.astro, Eyebrow.astro, SectionLabel.astro,
              BrandMark.astro, KpiCard.astro
  content/
    blog/*.mdx
    case-studies/*.mdx
    config.ts          # collection schemas
  pages/
    index.astro        # Home
public/
  assets/              # veloxcore wordmark SVGs
```

## 5. Styling system

- All CSS in `src/styles/`, imported once in `BaseLayout.astro`. Each rule written once,
  reused by class name everywhere. No Astro scoped styles.
- `tokens.css` ports the `:root` custom-property layer verbatim (surfaces, fg, borders,
  accent, dark system, type families, easing curves, `--w`/`--m`). The redundant inline
  `:root` in `home.html` is consolidated here.
- Class names from the prototype are preserved for near-1:1 visual parity and easy diffing.
- Per-page `--accent` override is a token swap via a class on `<body>` (e.g. service pages
  set `--accent: #6366f1`) — a token override, not a duplicated rule.

## 6. Content model (hybrid)

**`blog` schema:** `title, tag, date, coverTheme, excerpt`, MDX body.
**`caseStudies` schema:** `title, client, category, coverTheme, stats[] ({value,label}),
excerpt, featured (bool), order`, MDX body.

Home consumption:
- `BlogGrid` renders the latest 3 entries from `blog` (by `date`).
- `WorkPreview` renders the `featured` case study as the large tile, then the next 3 by
  `order` as the grid.

Seed content this session (so Home renders from real data):
- 3 blog entries (Cortana Analytics, Azure HDInsight, IoT/Azure IoT Hub — matching the
  prototype copy).
- 4 case studies: Veloxhire.AI (`featured`), PMI PIA, UN Document Bot, Retail Analytics.

Blog/case-study **detail pages and the 4 blog-post layouts** (Broadsheet, Cinematic,
Sidebar, Typographic) are out of scope this session and deferred.

## 7. Home component composition

Render order in `pages/index.astro` (all components markup-only, classes from global CSS):

`Nav` → `HomeHero` (+ islands `HeroCanvas`, `WordRotator`; statics `DeviceMock`,
`FloatChip`) → `TrustBar` → `WorkPreview` (reads `caseStudies`) → `FeatureBlock` +
`CodePanel` → `BlogGrid` (reads `blog`) → `CtaSection` (+ island `DotField`) → `Footer`
(+ `Ticker`, island `FooterWordmark`).

## 8. Motion architecture

- `BaseLayout` boots Lenis smooth-scroll on a rAF loop, and runs **one** global Motion
  `inView()` pass over all `.reveal` elements to add `.visible` (replaces the prototype's
  per-page IntersectionObserver script — written once).
- Islands hydrate only as needed:
  - `HeroCanvas` — `client:load`; connected-particle canvas, mouse-linked.
  - `WordRotator` — `client:visible`; cycles AI / agents / copilots / RAG with caret.
  - `DotField` — `client:visible`; CTA dot-grid canvas.
  - `FooterWordmark` — `client:visible`; letter-stagger reveal + fit-to-width sizing.
  - `CursorGlow` — `client:idle`; lerp-trailing radial glow, hover-capable devices only.
  - `Ticker` — pure CSS marquee, no JS, not an island.
  - Feature/stat entrances — Motion `inView` with stagger.
- **Scroll-motion upgrade** (the payoff of choosing Motion over the vanilla prototype):
  Motion `scroll()` drives subtle scroll-linked parallax on the hero device + float-chip,
  and a scrubbed reveal on the dark feature block.
- `prefers-reduced-motion`: Lenis disabled, canvases/parallax skipped, reveals snap in.

## 9. On-brand element system (carried across all future pages)

The motif tiers become reusable assets so every new page inherits the brand for free.

**Tier-1 (every page)** — markup + global CSS:
- Aurora rainbow gradient `#3d7eff → #00d4e8 → #00dd6a → #8ce800` (brand mark, eyebrow dot,
  `cov-aurora`).
- Frosted `Nav` + dark animated `Footer` as page bookends.
- `Reveal` (translateY + fade on scroll).
- Eyebrow-with-gradient-dot + section-label-with-trailing-rule typographic system.
- Full pill geometry (`9999px` radius) on every interactive element.
- Primitives: `BrandMark`, `Eyebrow`, `SectionLabel`, `ButtonPill`, `Tag`.

**Tier-2 (selective)** — drop-in islands:
- `HeroCanvas`, `DotField`, `FooterWordmark`, `CursorGlow`, `WordRotator`, `Ticker`.

## 10. Out of scope (this session)

- Blog and case-study detail pages; the 4 blog-post layout variants.
- Service pages, About, Contact, Work, Services overview, Veloxhire.AI product page.
- CMS/authoring UI beyond file-based content collections.
- Analytics, forms backend, i18n/locale switching.

## 11. Success criteria

- Home page renders statically, visually matching `Veloxcore Home.html` (same layout,
  type, color, spacing, shadows, dark footer).
- All CSS is global and written once; no component carries scoped styles.
- Hero canvas, word-rotator, reveals, dot-field, footer wordmark, ticker, and cursor glow
  all function, with Lenis smooth scroll and scroll-linked parallax added.
- `WorkPreview` and `BlogGrid` render from content collections, not hardcoded markup.
- `prefers-reduced-motion` is honored.
- Tier-1 primitives and Tier-2 islands are structured for reuse by future pages.
```
