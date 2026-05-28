import { test, expect } from '@playwright/test';

test('home renders core structure', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('nav.nav .brand-name')).toHaveAttribute('alt', 'Veloxcore');
  await expect(page.locator('.hero-h1')).toContainText('The studio that ships');
  await expect(page.locator('.wp-featured')).toContainText('Veloxhire.AI');
  await expect(page.locator('.wp-card')).toHaveCount(3);
  await expect(page.locator('.blog-card')).toHaveCount(3);
  await expect(page.locator('footer.footer .foot-wm')).toBeVisible();
});

test('reveal content becomes visible after scroll', async ({ page }) => {
  await page.goto('/');
  const work = page.locator('.sec-head.reveal').first();
  await work.scrollIntoViewIfNeeded();
  await expect(work).toHaveClass(/visible/, { timeout: 5000 });
});

test('honors reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.sec-head.reveal').first()).toHaveClass(/visible/);
});

test('feature stats animate in after scroll', async ({ page }) => {
  await page.goto('/');
  const stat = page.locator('.stat-num').first();
  await stat.scrollIntoViewIfNeeded();
  await expect(stat).toHaveClass(/anim-in/, { timeout: 5000 });
});

test('feature stats are visible under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.stat-num').first()).toHaveClass(/anim-in/, { timeout: 5000 });
});

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
  await expect(dropdown.locator('a[href="/services/generative-ai"]')).toBeAttached();
  await expect(dropdown.locator('a[href="/services/iot"]')).toBeAttached();
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
