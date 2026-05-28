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
