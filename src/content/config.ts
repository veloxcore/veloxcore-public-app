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

export const collections = { blog, 'case-studies': caseStudies };
