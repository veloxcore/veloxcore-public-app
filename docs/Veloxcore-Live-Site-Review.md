# Veloxcore — Live Site Review (localhost:4327)

Walked through the live Astro build via Claude in Chrome. Reviewed: Home, Services index, Services/Generative-AI detail, Work index, About, Blog index, Blog post (Cortana Analytics), Contact. Plus dropdown behavior and responsive CSS coverage.

**Headline finding:** the design system has been built beautifully — the visual language (rainbow on black, Geist hero, clean grotesk, generous spacing) is on point and the live build looks like a real AI-forward product. What's failing is **the copy hasn't been updated to match.** Home, About, services detail pages all say "AI." But the Services index, Blog, Contact, page titles, pre-footer CTA, and footer brand line still say "data." The two voices fight each other on every visit.

---

## CRITICAL — fix before any external link is shared

### 1. The site's blog publishes 2026-dated articles about discontinued Microsoft products
Live at `http://localhost:4327/blog/cortana-analytics`:

- Title: **"Cortana Analytics Suite: an end-to-end big data solution for the enterprise"**
- Author: Rahul Mehta
- Date: **May 19, 2026** (one week ago)
- 9 min read
- Featured as **"Editor's Pick"** on `/blog`

Microsoft discontinued Cortana Analytics in 2017. The article presents it as a current Microsoft offering. This is the single worst credibility hit on the site — an enterprise CTO reading this will conclude the team isn't current. Also live: `/blog/azure-hdinsight` (managed Hadoop), `/blog/iot-azure-hub`.

**Only one AI-era post exists:** "Building agents with MCP: notes from Dot Net Day Ahmedabad."

**Fix:** unpublish all four legacy posts before launch. Replace with the six AI-era posts from the strategy doc (production RAG on Azure AI Search, LLM eval harnesses, Azure OpenAI vs OpenAI direct, etc.).

### 2. The `<title>` tag on the homepage is the OLD positioning
The browser tab and Google search result title for the homepage is:

> **Veloxcore — Unleash value of DATA**

This is what AI search engines and Google see. It positions you as a data analytics shop, not an AI engineering studio. Fix to: *"Veloxcore — The studio that ships AI"* or *"Veloxcore — AI engineering for serious companies."*

### 3. Pre-footer CTA section is full old positioning
At the bottom of the home page, before the footer:

- Headline: **"Unleash the value of your data."**
- Sub: *"Be it big or small, we help you understand and act on the data you already possess."*
- CTAs: "Get in touch" / "Explore services"

This is the 2014 brand line, sitting in the most prominent CTA slot on the homepage. Replace headline with something like *"Ship production AI. Sooner."* with a sub that names the AI deliverable.

### 4. Footer brand line is also the old positioning
Every page footer's brand close reads **"Unleash value of DATA."** Replace site-wide. Suggested: *"Production AI, on Azure. By engineers who run their own AI products."* or just *"AI engineering, shipped."*

### 5. /services page hero contradicts the home page
The Services page hero says:

> **"Data services that move at the speed of your business."**
> "From raw event streams to boardroom dashboards — Veloxcore delivers end-to-end data engineering, analytics, and ML on the Azure platform."

The home page says "The studio that ships AI." These two pages — the first two a buyer visits — are pitching different companies. Fix the Services hero to lead with AI delivery; mention data engineering as a supporting capability.

### 6. /blog page hero is also old positioning
Hero: *"Ideas on data, cloud & beyond."* — Subhead mentions "data engineering, Azure architecture, and machine learning." No mention of AI, LLMs, agents, RAG. Filter chips: **All posts / Big Data / Azure / IoT / .NET** — no "AI" chip, no "LLM" chip. Fix headline and add AI-era filters.

### 7. /contact page hero is also old positioning
Hero: **"Let's talk about your data problem."**
Fix: *"Let's talk about your AI project."* or *"Talk to an AI engineer."*

### 8. Contact form has 12 unnamed input fields and no `<form>` wrapper
Detected via DOM probe: 12 `<input>`, `<textarea>`, `<select>` elements, all with `name=""` and no enclosing `<form>` element. This means:

- The form will not submit via standard HTML form submission.
- Screen readers cannot announce fields properly (no labels associated by `name`).
- Browser autofill cannot identify field types.
- Form analytics cannot track field-level abandonment.

This is a launch-blocker for the primary lead capture path on the site.

### 9. 404 page is the unbranded default Astro error page
Any mistyped URL hits Astro's default "404: Not found" page with the white Astro "A" logo and a pink dot. There's no Veloxcore nav, no footer, no brand. Add a custom 404 — and use it as a real conversion surface (link to top services, search box, sample CTA).

---

## SHOULD-FIX — before launch but won't block

### 10. "Microsoft Solutions Partner" vs "Microsoft Gold Partner" inconsistency
- Hero badge says: "Microsoft Solutions Partner — Data & AI"
- About page card says: "Microsoft Solutions Partner · Data & AI · Digital & App Innovation · Certified"
- Strategy doc and earlier design system README still say "Microsoft Gold Partner"

Microsoft did rename the program (Gold → Solutions Partner with designations) in late 2022. If you actually have the Solutions Partner certification (and the designations listed), this is the correct, current branding — keep it and retire all "Gold Partner" references in older HTML and the design system README.

### 11. Founded date inconsistency: 2012 vs 2013
- About page hero card: **"2012 — Year founded"**
- About page Story narrative (from original HTML): **"Veloxcore was founded in 2013"**

Pick one and propagate. If 2012 is correct, also update the About story prose.

### 12. Unverified hard numbers everywhere
Across home, services, and About pages:
- 98.3% eval pass rate · Production LLM · last 30 days (home hero chip + GenAI service)
- 99.97% uptime · 12-month rolling (home + services + work)
- 42ms p99 LLM latency (GenAI service)
- 8 wks avg time to production (GenAI service)
- 60% token cost reduction (GenAI service)
- 38% average cloud cost reduction (services index)
- 140M+ daily transactions (services + retail case study)
- 2,400+ active pipelines (services + PMI case study)

If sourced (Veloxhire.AI metrics + named client engagements), great — add a footnote naming the source. If placeholders, replace with defensible numbers. Specific-looking numbers are worse than no numbers when prospects start asking which clients and which deployments.

### 13. Service detail pages drift to per-service accent colors
- Home / Services index / Work / About: blue accent
- Generative AI service: **purple** ("Generative AI & LLM Applications" tag in purple, "Book a free call" button in purple gradient)
- Per the design system review, also: AI Agents = cyan, IoT = brown, ML = purple, RAG = teal, Data Eng = green, AI Strategy = amber

The README says "Blue is the only chromatic accent." Either (a) enforce the spec — single blue everywhere, service distinction comes from layout and content, not hue — or (b) formally codify the per-service palette in `colors_and_type.css` and update the README. Right now the system has the per-page colors without the documentation, which reads as drift rather than intent.

### 14. Marquee ticker has "United Nations" listed twice
The ticker above the footer reads:
> VELOXHIRE.AI · MICROSOFT SOLUTIONS PARTNER · UNITED NATIONS · AZURE OPENAI · LLM PIPELINES · RAG SYSTEMS · PMI PIA · UNITED NATIONS · DATA ENGINEERING · IOT & EDGE · MCP AGENTS · GENERATIVE AI

UN appears twice. Probably an oversight (the marquee duplicates content to create the infinite scroll, but the source list should still be unique). Verify and dedupe.

### 15. Hero badge dropdown spacing/cropping
When the Services dropdown opens, the "AI SERVICES" eyebrow label on the first column appears to be missing/cropped — only "PLATFORM & DATA" eyebrow is visible. Could be a CSS sectioning issue or scroll-clip. Worth a closer look.

### 16. /work page case study card mentions "from legacy Hadoop"
This is actually OK — framing legacy stack as "what we migrate away from" is a legitimate AI-forward narrative. Worth keeping IF the case study itself follows through with the AI/modern outcome. If it just describes a Hadoop-to-streaming migration without AI relevance, reframe.

### 17. About page narrative still leans heavily on Azure data history
The hero is great ("The engineering studio that ships AI for serious companies."), but the body narrative (HDInsight, Data Factory, etc.) reads more "we used to do Azure data work" than "we ship AI." That's actually fine as origin story — but make sure the principles + leadership sections lean forward. Currently scrolling further into About reveals the legacy Azure depth more prominently than the AI present.

---

## NICE-TO-HAVE — quality polish

### 18. No `<meta description>` and no Open Graph tags
Detected on the services index page (`hasOpenGraph: false`, no meta description either). Required for:
- Google search snippet quality
- LinkedIn / X / Slack link previews
- AI search engines that read structured metadata

Add a default OG image + per-page meta description across all pages. This was on the strategy doc launch checklist; not done yet.

### 19. Logo wordmark — the "K-style" mark next to "Veloxcore"
The nav brand mark is a rainbow-gradient square with a white triangular shape inside that reads ambiguously like a "K" or a "play button." If unintentional ("K" doesn't match "Veloxcore"), reconsider; if intentional (the upside-down K as a custom monogram), make sure it's documented in the brand guidelines so it's not interpreted as a placeholder.

### 20. Performance — particle field in hero
The home hero has an animated particle field (visible cyan/blue dots drifting). On the desktop preview it looks great and stays smooth. On mobile (when viewport actually scales) the particle count likely needs reducing for 60fps. Test on a real mid-tier Android device before launch.

### 21. Cross-browser
This whole review was Chrome on Windows. The earlier design review noted typography quirks for Geist on Windows ClearType (8% slower reading at 16px). Worth a manual pass through Safari (Mac + iOS) and Edge (Windows) before launch — at minimum on Home, Services, Generative AI detail, and Contact.

### 22. Animation
Smooth-scroll feel is excellent. Typewriter caret on the hero "AI" works. Reveals on scroll work. No obvious animation jank. Keep what's there.

### 23. Console
Single warning from the React DevTools browser extension — that's the user's extension, not site code. Clean console otherwise.

---

## What's working — protect it

Six things you got right that you should not regress on:

1. **Home hero** — "The studio that ships AI" + rotating word caret + Azure OpenAI/GPT-4o/AI Foundry/RAG device mock. This is your single best 5-second pitch. Don't touch.
2. **About page hero** — "The engineering studio that ships AI for serious companies." with the rainbow gradient on "AI" is genuinely beautiful. The stat cards (2012, UN, 10+ yrs, 1 AI product shipped) tell the story cleanly.
3. **Trust strip on home** — "Microsoft Solutions Partner · Azure OpenAI Production deployments · United Nations Document RAG 2023 · Veloxhire.AI Our own AI product · MCP Dot Net Day 2025" is real, varied, credible proof. Major upgrade vs the previous version.
4. **Generative AI service detail page** — "From prompt to production LLM application" hero + four hard-number cards (98.3%, 42ms, 8 wks, 60%) + the "evaluation harnesses, guardrails, observability" copy is exactly the AI-engineering-not-AI-marketing voice you want. Replicate this pattern across all 8 service pages (if it isn't already).
5. **Case study covers** — the rainbow geometric shapes (pyramid, ribbon checkmark, downward triangle) on black are on-brand and distinctive. They look like the Antigravity blog cards we discussed.
6. **Two-CTA Contact pattern** — "Book a free call" (Fastest, blue gradient) + "Get a project estimate" (Fill in the brief) is exactly the right intake split for enterprise vs SMB. Fix the form internals (item #8) but keep this UX pattern.

---

## Suggested fix order

**Day 1 — block-level copy fixes (1 designer + 1 copywriter, 4 hours):**
1. Home `<title>` tag
2. Pre-footer CTA headline + sub
3. Footer brand line (replace site-wide)
4. /services hero
5. /blog hero + filter chips
6. /contact hero

**Day 2 — content / blog (1 person, 1 day):**
7. Unpublish all four legacy blog posts
8. Publish at least 2 AI-era posts using existing templates (RAG on Azure AI Search + LLM eval harness — the most defensible)

**Day 3 — functional fixes (1 dev, half day):**
9. Fix Contact form: wrap inputs in `<form>`, add `name` attributes, add `<label>` elements
10. Custom 404 page with nav, brand, and top-5 services link grid

**Day 4 — polish (1 dev + 1 designer, half day):**
11. SEO: meta descriptions, OG images per top page, JSON-LD organization schema
12. Verify or replace the seven unverified metrics
13. Resolve 2012 vs 2013 founding date
14. Dedupe "United Nations" in marquee
15. Decide accent color policy (single blue vs documented per-service palette)

**Day 5 — manual QA (1 person, half day):**
16. Mobile pass on a real Android + iPhone
17. Safari + Edge cross-browser
18. Verify the AI Services dropdown eyebrow label
19. Click every nav link and CTA on every page

That's a week of focused work. Doable.
