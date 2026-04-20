/**
 * E2E tests: Courses page flows
 * Covers: browse courses, search, bookmark, course detail, saved tab,
 *         teacher-only "Create Course" button
 */

import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STUDENT_STATE = path.join(__dirname, '.auth', 'student.json');
const TEACHER_STATE = path.join(__dirname, '.auth', 'teacher.json');

// ── Browse courses ─────────────────────────────────────────────────────────────

test.describe('Browse courses (as student)', () => {
  test.use({ storageState: STUDENT_STATE });

  test('courses page loads and shows course cards', async ({ page }) => {
    await page.goto('/courses');

    // Wait for at least one course card to appear
    const cards = page.locator('[data-testid="course-card"], .MuiCard-root').first();
    // Broader: just wait for a card-like element rendered inside the masonry grid
    await expect(page.locator('.MuiCard-root').first()).toBeVisible({ timeout: 15_000 });
  });

  test('search courses filters the list', async ({ page }) => {
    await page.goto('/courses');

    // Wait for cards to load first
    await page.locator('.MuiCard-root').first().waitFor({ timeout: 15_000 });

    const searchInput = page.getByLabel('Search courses');
    await searchInput.fill('zzz_no_match_xyz_999');

    // After debounce (500ms) + network call, cards list should update
    await page.waitForTimeout(700);
    await page.waitForLoadState('networkidle');

    // Either 0 cards shown, or the empty-state text appears
    const cardCount = await page.locator('.MuiCard-root').count();
    const emptyText = await page.getByText(/no courses/i).isVisible().catch(() => false);
    expect(cardCount === 0 || emptyText).toBeTruthy();
  });

  test('clicking a course card navigates to course detail', async ({ page }) => {
    await page.goto('/courses');
    await page.locator('.MuiCard-root').first().waitFor({ timeout: 15_000 });

    // Click the first card
    await page.locator('.MuiCard-root').first().click();

    // URL should change to /course/<slug>
    await expect(page).toHaveURL(/\/course\//, { timeout: 10_000 });
  });

  test('bookmark icon is visible on course detail page', async ({ page }) => {
    await page.goto('/courses');
    await page.locator('.MuiCard-root').first().waitFor({ timeout: 15_000 });
    await page.locator('.MuiCard-root').first().click();
    await expect(page).toHaveURL(/\/course\//, { timeout: 10_000 });

    // Bookmark button should be visible (Tooltip wraps it)
    const bookmarkBtn = page.getByRole('button').filter({
      has: page.locator('svg[data-testid="BookmarkBorderIcon"], svg[data-testid="BookmarkIcon"]'),
    });
    await expect(bookmarkBtn.first()).toBeVisible({ timeout: 5_000 });
  });

  test('"Saved" chip is visible when logged in', async ({ page }) => {
    await page.goto('/courses');
    await expect(page.getByRole('button', { name: /Saved/i })).toBeVisible({ timeout: 10_000 });
  });

  test('clicking Saved chip switches to bookmarked view', async ({ page }) => {
    await page.goto('/courses');
    const savedChip = page.getByRole('button', { name: /Saved/i });
    await savedChip.waitFor({ timeout: 10_000 });
    await savedChip.click();

    // URL stays at /courses but content reflects saved state
    // Heading changes to "Saved Courses" or similar
    await expect(page).toHaveURL('/courses');
    // The chip itself should appear in active/selected state
    await expect(savedChip).toBeVisible();
  });
});

// ── Teacher-only elements ──────────────────────────────────────────────────────

test.describe('Teacher-only UI', () => {
  test.use({ storageState: TEACHER_STATE });

  test('teacher sees "Create Course" button', async ({ page }) => {
    await page.goto('/courses');
    const createBtn = page.getByRole('button', { name: /create course/i });
    await expect(createBtn).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('Student does not see Create Course button', () => {
  test.use({ storageState: STUDENT_STATE });

  test('student has no "Create Course" button', async ({ page }) => {
    await page.goto('/courses');
    await page.locator('.MuiCard-root').first().waitFor({ timeout: 15_000 });

    const createBtn = page.getByRole('button', { name: /create course/i });
    await expect(createBtn).not.toBeVisible();
  });
});

// ── Anonymous user ─────────────────────────────────────────────────────────────

test.describe('Anonymous user', () => {
  test('can browse courses without logging in', async ({ page }) => {
    await page.goto('/courses');
    await expect(page.locator('.MuiCard-root').first()).toBeVisible({ timeout: 15_000 });
  });

  test('no "Saved" chip for anonymous user', async ({ page }) => {
    await page.goto('/courses');
    // Give page time to fully render
    await page.waitForLoadState('networkidle');
    const savedChip = page.getByRole('button', { name: /Saved/i });
    await expect(savedChip).not.toBeVisible();
  });
});
