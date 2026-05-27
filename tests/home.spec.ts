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
