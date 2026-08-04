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

test('login page has sign in form', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
});

test('discover page redirects to login when unauthenticated', async ({ page }) => {
  await page.goto('http://localhost:3000/discover');
  // Protected route redirects to /login
  await expect(page).toHaveURL(/\/login/);
});

test('generate page redirects to login when unauthenticated', async ({ page }) => {
  await page.goto('http://localhost:3000/generate');
  await expect(page).toHaveURL(/\/login/);
});

test('email and password fields are required', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.locator('input[type="email"]')).toHaveAttribute('required', '');
});
