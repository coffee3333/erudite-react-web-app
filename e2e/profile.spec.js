/**
 * E2E tests: Profile page
 * Covers: view profile, edit bio, saved courses section, teacher section
 */

import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STUDENT_STATE = path.join(__dirname, '.auth', 'student.json');
const TEACHER_STATE = path.join(__dirname, '.auth', 'teacher.json');

// ── Student profile ────────────────────────────────────────────────────────────

test.describe('Student profile', () => {
  test.use({ storageState: STUDENT_STATE });

  test('profile page loads and shows username', async ({ page }) => {
    await page.goto('/my-profile');
    // Username appears as h5 heading — use heading role to be specific
    await expect(page.getByRole('heading', { name: 'e2e_student' })).toBeVisible({ timeout: 15_000 });
  });

  test('profile page shows email', async ({ page }) => {
    await page.goto('/my-profile');
    // Email appears multiple times; just check it's somewhere on page
    await expect(page.locator('text=e2e_student@test.com').first()).toBeVisible({ timeout: 15_000 });
  });

  test('profile page shows stats section', async ({ page }) => {
    await page.goto('/my-profile');
    await expect(page.getByText(/Total Points/i)).toBeVisible({ timeout: 15_000 });
  });

  test('edit button opens the inline edit form', async ({ page }) => {
    await page.goto('/my-profile');

    // Wait for profile to load — heading is the most specific selector
    await page.getByRole('heading', { name: 'e2e_student' }).waitFor({ timeout: 15_000 });

    // Click the edit button — Tooltip title "Edit profile" becomes the accessible name
    const editBtn = page.getByRole('button', { name: 'Edit profile' });
    await editBtn.waitFor({ timeout: 5_000 });
    await editBtn.click();

    // Bio TextField should now be visible
    await expect(page.getByLabel('Bio')).toBeVisible({ timeout: 5_000 });
  });

  test('can save updated bio', async ({ page }) => {
    await page.goto('/my-profile');
    await page.getByRole('heading', { name: 'e2e_student' }).waitFor({ timeout: 15_000 });

    await page.getByRole('button', { name: 'Edit profile' }).click();

    const bioField = page.getByLabel('Bio');
    await bioField.waitFor({ timeout: 5_000 });
    await bioField.fill('E2E test bio updated');

    await page.getByRole('button', { name: 'Save' }).click();

    // Wait for save to complete
    await page.waitForLoadState('networkidle');

    // Bio should be visible on the page
    await expect(page.getByText('E2E test bio updated')).toBeVisible({ timeout: 10_000 });
  });
});

// ── Unauthenticated redirect ───────────────────────────────────────────────────

test.describe('Unauthenticated profile redirect', () => {
  // No storageState — runs as anonymous
  test('redirects to sign-in when not logged in', async ({ page }) => {
    await page.goto('/my-profile');
    await expect(page).toHaveURL('/sign-in', { timeout: 10_000 });
  });
});

// ── Teacher profile ────────────────────────────────────────────────────────────

test.describe('Teacher profile', () => {
  test.use({ storageState: TEACHER_STATE });

  test('teacher profile shows username heading', async ({ page }) => {
    await page.goto('/my-profile');
    await expect(page.getByRole('heading', { name: 'e2e_teacher' })).toBeVisible({ timeout: 15_000 });
  });

  test('teacher sees "My Courses" section in dashboard', async ({ page }) => {
    await page.goto('/my-profile');
    await expect(page.getByText(/My Courses/i)).toBeVisible({ timeout: 15_000 });
  });
});
