import { test, expect } from '@playwright/test';

test('login page renders correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await expect(page.locator('text=Sign In').first()).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
  await expect(page.getByText('Powered by TheMealDB')).toBeVisible();
});

test('can toggle between sign in and register', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.getByRole('button', { name: /Register/ }).click();
  await expect(page.locator('text=Create Account').first()).toBeVisible();
  await page.getByRole('button', { name: /Sign in/ }).click();
  await expect(page.locator('text=Sign In').first()).toBeVisible();
});

test('navbar renders on login page', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await expect(page.locator('h1:has-text("Dinner Ideas")')).toBeVisible();
});

test('discover page renders suggestions', async ({ page }) => {
  await page.goto('http://localhost:3000/discover');
  await expect(page.locator('text=Discover New Recipes').first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'chicken' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'pasta' })).toBeVisible();
});

test('generate page has two tabs', async ({ page }) => {
  await page.goto('http://localhost:3000/generate');
  await expect(page.getByText('From My Collection')).toBeVisible();
  await expect(page.getByText('Discover New')).toBeVisible();
});

test('email and password fields are required', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.locator('input[type="email"]')).toHaveAttribute('required', '');
});
