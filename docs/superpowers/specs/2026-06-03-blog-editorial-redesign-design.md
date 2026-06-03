# Blog Editorial Redesign — Design Spec
**Date:** 2026-06-03
**Scope:** Blog listing page redesign + sitewide broadcast ticker above nav

---

## Goal

Make the Veloxcore blog feel like a premium engineering publication (inspired by commandline.microsoft.com) that attracts developers, while keeping the Veloxcore light brand (white bg, Google Sans Flex, gradient accents). Add a sitewide animated "broadcast ticker" above the nav that signals live engineering output.

---

## Part 1: Broadcast Ticker (sitewide, above nav)

A dark scanline bar that sits **above** the existing nav on every page. Shows scrolling article titles like a broadcast news feed.

### Visual
- Dark bar (`#0b0b0e`), 32px tall
- CSS scanline overlay (repeating-linear-gradient, 2px lines) at low opacity
- Left segment: pulsing green "ON AIR" dot + monospace label, with right border divider
- Scrolling track: article titles in JetBrains Mono, infinite horizontal scroll (22s linear), duplicated content for seamless loop
- Category in `--viz` color bold, title in muted white, `///` separators in blue
- Edge fades (left + right gradient masks)
- **Hover pauses** the scroll
- `prefers-reduced-motion`: stop the scroll animation, show static first items

### Placement
- New component `src/components/nav/BroadcastTicker.astro`
- Rendered in `BaseLayout.astro` immediately before `<Nav />`
- The nav is `position: fixed` — ticker must account for this. The ticker is also fixed at `top: 0`, nav moves to `top: 32px`. Body/page top padding adjusts by +32px.
- Data source: pull the same blog collection the blog index uses (titles + tags), cap at ~6 items. Build-time data, no client fetch.

### Component interface
```
BroadcastTicker.astro
- Props: none (reads blog collection internally via getCollection)
- Returns: <div class="ticker"> with duplicated track
```

---

## Part 2: Blog Listing Page (light editorial)

Replace the current dark-hero + 3-col-pill-card layout with a light editorial layout.

### Structure (top to bottom)
1. **Masthead** — light, white bg, 2px solid `--fg1` bottom rule (editorial "front page" feel)
   - Monospace eyebrow with gradient dot: "Veloxcore Engineering"
   - h1: "Ideas on AI, cloud & engineering." (~52px, 800 weight)
   - Subtitle (one line)
   - Right side: monospace decorative text "PROD AI / SHIPPED. / WEEKLY." in `--border-strong` color
2. **Featured article** — wide 2-column card (1.3fr / 1fr)
   - Left: gradient cover (`min-height: 280px`), monospace label bottom-left
   - Right: `--canvas` body, monospace category label, big title, excerpt, avatar+meta row, "Read article ↗" link
3. **Latest** — section label (monospace, hairline rule after) + 3-column card grid
   - Cards: white bg, hairline border, 12px radius, 16/9 gradient cover, monospace category, title, meta with top border
   - Hover: border lightens + subtle shadow + title underline (NO 5px lift)
4. **On the roadmap** (optional, only if upcoming content) — text-only list rows: monospace category (colored) + title + "Upcoming" badge. Keeps the page feeling active when few posts exist.

### Design tokens
- Category labels: plain JetBrains Mono uppercase, NO colored pill background (key change from current)
- Card gap: 20px
- Card radius: 12px
- All colors from existing token system (`--fg1`, `--canvas`, `--border`, `--viz-*`)

### Files
- `src/pages/blog/index.astro` — rewrite markup (remove dark canvas hero, filter pills → keep filter logic but restyle)
- `src/styles/blog.css` — rewrite the listing-page section (`.blog-page-header` → `.masthead`, `.hero-post` → `.featured`, restyle `.bl-card`, add `.ticker`, add `.text-list`)

---

## Out of scope
- Blog post detail pages (PostDefault etc.) — unchanged
- Actual cover image generation — gradient covers remain, image slot already wired
- Real "roadmap" content — use placeholder upcoming titles or hide section if no data

---

## Success criteria
- Broadcast ticker scrolls above nav on every page, pauses on hover, respects reduced-motion
- Blog page is light, editorial, no colored pill tags, 2px masthead rule
- Featured article is a wide 2-column card
- Build passes, no layout shift from the fixed ticker + nav stack
