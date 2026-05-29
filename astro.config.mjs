import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

// Staging on GitHub Pages serves from a sub-path; production (veloxcore.com)
// serves from root. Only the staging CI build sets BASE_PATH; local dev and the
// production build leave it unset, so base stays '/' and the rewriter is a no-op.
const BASE_PATH = process.env.BASE_PATH || '';
const base = BASE_PATH || '/';
const site = BASE_PATH ? 'https://veloxcore.github.io' : 'https://veloxcore.com';

// When a sub-path base is set, Astro prefixes its own pipeline output (_astro/*)
// but NOT author-written root-absolute paths (href/src/action="/..."). This
// integration rewrites those in the built HTML. Skips protocol-relative (//),
// external URLs, and paths already under the base. No-op when serving from root.
function basePathRewrite(prefix) {
  return {
    name: 'base-path-rewrite',
    hooks: {
      'astro:build:done': ({ dir }) => {
        if (!prefix) return;
        const seg = prefix.replace(/^\//, '').replace(/\/$/, '');
        const root = fileURLToPath(dir);
        const pattern = new RegExp(`(\\s(?:href|src|action)=")\\/(?!\\/)(?!${seg}\\b)`, 'g');
        const walk = (d) => {
          for (const entry of readdirSync(d)) {
            const p = join(d, entry);
            if (statSync(p).isDirectory()) walk(p);
            else if (entry.endsWith('.html')) {
              const html = readFileSync(p, 'utf8');
              const out = html.replace(pattern, `$1/${seg}/`);
              if (out !== html) writeFileSync(p, out);
            }
          }
        };
        walk(root);
      },
    },
  };
}

export default defineConfig({
  site,
  base,
  output: 'static',
  integrations: [mdx(), basePathRewrite(BASE_PATH)],
  vite: {
    optimizeDeps: { include: ['lenis', 'motion'] },
  },
});
