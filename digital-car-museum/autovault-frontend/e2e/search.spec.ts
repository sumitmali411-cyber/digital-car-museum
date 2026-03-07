import { test, expect } from '@playwright/test';

const MOCK_MANUFACTURERS = {
  success: true,
  data: [
    { id: 1, name: 'Aston Martin', slug: 'aston-martin', countryId: 4, countryName: 'UK', countryCode: 'GBR', carCount: 6 },
    { id: 2, name: 'BMW', slug: 'bmw', countryId: 2, countryName: 'Germany', countryCode: 'DEU', carCount: 8 },
    { id: 3, name: 'Ford', slug: 'ford', countryId: 1, countryName: 'USA', countryCode: 'USA', carCount: 7 },
  ],
};

const MOCK_SEARCH_RESULT = {
  success: true,
  data: {
    content: [
      {
        id: 1, modelName: 'Mustang', slug: 'mustang', year: 1965,
        bodyType: 'Coupe', fuelType: 'Gasoline', horsepower: 271,
        manufacturerId: 3, manufacturerName: 'Ford', manufacturerSlug: 'ford',
        countryId: 1, countryName: 'USA', countryCode: 'USA',
        has3dModel: false, colors: [],
      },
    ],
    totalElements: 1, totalPages: 1, size: 20, number: 0, first: true, last: true,
  },
};

const EMPTY_SEARCH = {
  success: true,
  data: { content: [], totalElements: 0, totalPages: 0, size: 20, number: 0, first: true, last: true },
};

test.describe('Search Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/v1/manufacturers', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_MANUFACTURERS) })
    );
    await page.route('**/api/v1/cars/search**', route => {
      const url = route.request().url();
      const hasQuery = url.includes('q=');
      route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify(hasQuery ? MOCK_SEARCH_RESULT : EMPTY_SEARCH),
      });
    });
    await page.goto('/search');
  });

  test('should display search heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Search Cars');
  });

  test('should render search input', async ({ page }) => {
    await expect(page.locator('.search-input')).toBeVisible();
  });

  test('should render fuel type dropdown', async ({ page }) => {
    const fuelSelect = page.locator('select').filter({ hasText: 'All Fuel Types' });
    await expect(fuelSelect).toBeVisible();
  });

  test('should render body type dropdown', async ({ page }) => {
    const bodySelect = page.locator('select').filter({ hasText: 'All Body Types' });
    await expect(bodySelect).toBeVisible();
  });

  test('should render manufacturer filter dropdown', async ({ page }) => {
    const mfrSelect = page.locator('select').filter({ hasText: 'All Manufacturers' });
    await expect(mfrSelect).toBeVisible();
  });

  test('should load manufacturers into dropdown', async ({ page }) => {
    const mfrSelect = page.locator('select').filter({ hasText: 'All Manufacturers' });
    await expect(mfrSelect).toBeVisible();
    // Wait for the mocked API to populate the options
    await expect(mfrSelect.locator('option')).toHaveCount(4); // 1 default + 3 mocked
  });

  test('typing in search box should trigger search and show results-info', async ({ page }) => {
    await page.locator('.search-input').fill('mustang');
    await expect(page.locator('.results-info')).toBeVisible({ timeout: 5000 });
  });

  test('search results should display car cards', async ({ page }) => {
    await page.locator('.search-input').fill('mustang');
    await page.waitForSelector('app-car-card', { timeout: 5000 });
    await expect(page.locator('app-car-card')).toHaveCount(1);
  });

  test('should navigate to car detail when result card is clicked', async ({ page }) => {
    await page.locator('.search-input').fill('mustang');
    await page.waitForSelector('app-car-card a', { timeout: 5000 });
    await page.locator('app-car-card a').first().click();
    await expect(page).toHaveURL(/\/cars\/\d+/);
  });
});
