/**
 * E2E tests: Authentication flows
 * Covers: login, wrong-password error, register, logout
 */

import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STUDENT_STATE = path.join(__dirname, '.auth', 'student.json');

// ── Registration ───────────────────────────────────────────────────────────────

test.describe('Registration', () => {
  test('new student can register', async ({ page }) => {
    // Username: max 20 chars, alphanumeric only; use last 6 digits of timestamp
    const suffix = String(Date.now()).slice(-6);
    await page.goto('/sign-up');

    await page.locator('#username').fill(`tuser${suffix}`);
    await page.locator('#email').fill(`tuser${suffix}@example.com`);
    await page.locator('#password').fill('E2eTest!99');
    await page.locator('#password-repeat').fill('E2eTest!99');

    // MUI Select for role — click the div[role=combobox] inside the FormControl
    await page.locator('[role="combobox"]').click();
    await page.getByRole('option', { name: 'Student' }).click();

    // Submit form
    await page.locator('button[type="submit"]').click();

    // After successful registration (2.65s delay) navigates to /sign-in
    await expect(page).toHaveURL('/sign-in', { timeout: 15_000 });
  });

  test('mismatched passwords shows error', async ({ page }) => {
    await page.goto('/sign-up');

    await page.locator('#username').fill('mismatchuser');
    await page.locator('#email').fill('mismatch@example.com');
    await page.locator('#password').fill('E2eTest!99');
    await page.locator('#password-repeat').fill('Different!99');

    await page.locator('[role="combobox"]').click();
    await page.getByRole('option', { name: 'Student' }).click();

    await page.locator('button[type="submit"]').click();

    // Should stay on sign-up page
    await expect(page).toHaveURL('/sign-up');
  });
});

// ── Login ──────────────────────────────────────────────────────────────────────

test.describe('Login', () => {
  test('valid credentials logs user in and redirects', async ({ page }) => {
    await page.goto('/sign-in');

    await page.locator('#email').fill('e2e_student@test.com');
    await page.locator('#password').fill('E2eTest!99');
    await page.locator('button[type="submit"]').click();

    // After login user should be redirected away from sign-in
    await expect(page).not.toHaveURL('/sign-in', { timeout: 10_000 });
  });

  test('wrong password shows error', async ({ page }) => {
    await page.goto('/sign-in');

    await page.locator('#email').fill('e2e_student@test.com');
    await page.locator('#password').fill('WrongPass!00');
    await page.locator('button[type="submit"]').click();

    // Should stay on sign-in — wait for network to finish
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/sign-in');
  });

  test('non-existent email shows error', async ({ page }) => {
    await page.goto('/sign-in');

    await page.locator('#email').fill('nobody_xyz@test.com');
    await page.locator('#password').fill('E2eTest!99');
    await page.locator('button[type="submit"]').click();

    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/sign-in');
  });
});

// ── Logout ─────────────────────────────────────────────────────────────────────

test.describe('Logout', () => {
  test.use({ storageState: STUDENT_STATE });

  test('logged-in user can log out', async ({ page }) => {
    await page.goto('/courses');

    // Open user menu (AccountCircle or avatar icon in the AppBar with Tooltip "Open menu")
    await page.getByRole('button', { name: 'Open menu' }).click();

    // Click "Log out" menu item
    await page.getByRole('menuitem', { name: 'Log out' }).click();

    // After logout navigates to '/'
    await expect(page).toHaveURL('/', { timeout: 10_000 });
  });
});
