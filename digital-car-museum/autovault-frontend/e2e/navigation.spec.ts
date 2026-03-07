import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should load home page at root', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
    await expect(page.locator('.navbar__brand')).toBeVisible();
  });

  test('navbar Countries link navigates to /countries', async ({ page }) => {
    await page.goto('/');
    await page.locator('.navbar__links a[href="/countries"]').click();
    await expect(page).toHaveURL('/countries');
  });

  test('navbar Search link navigates to /search', async ({ page }) => {
    await page.goto('/');
    await page.locator('.navbar__links a[href="/search"]').click();
    await expect(page).toHaveURL('/search');
  });

  test('navbar brand link navigates back to home', async ({ page }) => {
    await page.goto('/countries');
    await page.locator('.navbar__brand').click();
    await expect(page).toHaveURL('/');
  });

  test('Login button should be visible when not authenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('button', { hasText: 'Login' })).toBeVisible();
  });
});
