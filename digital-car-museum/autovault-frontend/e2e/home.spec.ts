import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the AutoVault brand in navbar', async ({ page }) => {
    await expect(page.locator('.navbar__brand')).toContainText('AutoVault');
  });

  test('should render hero title with Auto and Vault spans', async ({ page }) => {
    const title = page.locator('.hero__title');
    await expect(title).toContainText('Auto');
    await expect(title).toContainText('Vault');
  });

  test('should have Explore Museum CTA link to /countries', async ({ page }) => {
    const cta = page.locator('a.hero__cta');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/countries');
  });

  test('should have Search Cars button', async ({ page }) => {
    const searchBtn = page.locator('a[routerLink="/search"]').first();
    await expect(searchBtn).toBeVisible();
  });

  test('should have Countries and Search links in navbar', async ({ page }) => {
    await expect(page.locator('.navbar__links a[href="/countries"]')).toBeVisible();
    await expect(page.locator('.navbar__links a[href="/search"]')).toBeVisible();
  });

  test('should navigate to /countries when Explore Museum is clicked', async ({ page }) => {
    await page.locator('a.hero__cta').click();
    await expect(page).toHaveURL('/countries');
  });
});
