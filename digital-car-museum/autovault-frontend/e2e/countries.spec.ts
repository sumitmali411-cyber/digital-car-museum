import { test, expect } from '@playwright/test';

const MOCK_COUNTRIES = {
  success: true,
  data: [
    {
      id: 1, name: 'USA', code: 'USA', flagUrl: null,
      continent: 'North America', description: 'United States of America',
      mapLat: 37.09, mapLng: -95.71, displayOrder: 1, manufacturerCount: 3,
    },
    {
      id: 2, name: 'Germany', code: 'DEU', flagUrl: null,
      continent: 'Europe', description: 'Federal Republic of Germany',
      mapLat: 51.16, mapLng: 10.45, displayOrder: 2, manufacturerCount: 5,
    },
    {
      id: 3, name: 'Japan', code: 'JPN', flagUrl: null,
      continent: 'Asia', description: 'Land of the Rising Sun',
      mapLat: 36.20, mapLng: 138.25, displayOrder: 3, manufacturerCount: 4,
    },
  ],
};

test.describe('Countries Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/v1/countries', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_COUNTRIES) })
    );
    await page.goto('/countries');
  });

  test('should display the page heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Country');
  });

  test('should show country cards after API loads', async ({ page }) => {
    await page.waitForSelector('.country-card', { timeout: 10000 });
    const cards = page.locator('.country-card');
    await expect(cards).toHaveCount(3);
  });

  test('should display at least one country card with a name', async ({ page }) => {
    await page.waitForSelector('.country-card', { timeout: 10000 });
    const firstCard = page.locator('.country-card').first();
    await expect(firstCard.locator('.country-card__name')).toContainText('USA');
  });

  test('each country card should show manufacturer count', async ({ page }) => {
    await page.waitForSelector('.country-card', { timeout: 10000 });
    const firstCard = page.locator('.country-card').first();
    await expect(firstCard.locator('.country-card__count')).toContainText('manufacturer');
  });

  test('clicking a country card should navigate to manufacturers page', async ({ page }) => {
    await page.waitForSelector('.country-card', { timeout: 10000 });
    await page.locator('.country-card').first().click();
    await expect(page).toHaveURL(/\/countries\/\d+\/manufacturers/);
  });
});
