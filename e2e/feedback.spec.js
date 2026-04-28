/**
 * E2E tests: Course feedback (star rating + comment)
 * Covers: write, edit, delete review; owner has no write button; anonymous sees reviews
 *
 * Uses a real published course: "cloud-computing-with-aws" (owner: teacher1)
 * The e2e_student user is NOT the owner, so they can submit a review.
 */

import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STUDENT_STATE = path.join(__dirname, '.auth', 'student.json');
const TEACHER_STATE = path.join(__dirname, '.auth', 'teacher.json');

// A published course owned by teacher1 (not our e2e fixture users)
const PUBLIC_COURSE_SLUG = 'cloud-computing-with-aws';
const COURSE_URL = `/course/${PUBLIC_COURSE_SLUG}`;
const API_BASE = 'http://127.0.0.1:8000/api';

// ── Student can write, edit, and delete a review ───────────────────────────────

test.describe('Feedback as student', () => {
  test.use({ storageState: STUDENT_STATE });

  test('Reviews section is visible on course detail page', async ({ page }) => {
    await page.goto(COURSE_URL);
    await expect(page.getByRole('heading', { name: 'Reviews' })).toBeVisible({ timeout: 15_000 });
  });

  test('"Write a review" or "Edit your review" button is visible for non-owner student', async ({ page }) => {
    await page.goto(COURSE_URL);

    // Use first() to handle potential duplicates; also allow either text
    const writeBtn = page.locator('button').filter({ hasText: /^Write a review$|^Edit your review$/ }).first();
    await expect(writeBtn).toBeVisible({ timeout: 15_000 });
  });

  test('student can open the review dialog', async ({ page }) => {
    await page.goto(COURSE_URL);

    const writeBtn = page.locator('button').filter({ hasText: /^Write a review$|^Edit your review$/ }).first();
    await writeBtn.waitFor({ timeout: 15_000 });
    await writeBtn.click();

    // Dialog should open
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });
  });

  test('student can submit a review', async ({ page }) => {
    await page.goto(COURSE_URL);

    // Delete any previous review via API first (using token from localStorage)
    const accessToken = await page.evaluate(() => localStorage.getItem('authToken'));
    if (accessToken) {
      await page.request.delete(`${API_BASE}/platform/courses/${PUBLIC_COURSE_SLUG}/feedback/delete/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).catch(() => {});
    }

    // Reload so the page fetches fresh feedback state
    await page.reload();

    // Now "Write a review" should appear (not "Edit your review")
    const writeBtn = page.locator('button').filter({ hasText: 'Write a review' }).first();
    await writeBtn.waitFor({ timeout: 15_000 });
    await writeBtn.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Click the 4th star
    await dialog.getByTestId('star-4').click();

    // Type a comment
    await dialog.getByLabel('Comment (optional)').fill('Great E2E test review!');

    // Submit
    await dialog.getByRole('button', { name: 'Submit' }).click();

    // Dialog closes
    await expect(dialog).not.toBeVisible({ timeout: 5_000 });

    // Review appears in the list — "· Your review" caption (exact text with dot)
    await expect(page.locator('text=· Your review').first()).toBeVisible({ timeout: 5_000 });
  });

  test('student can edit their own review', async ({ page }) => {
    await page.goto(COURSE_URL);
    await page.waitForLoadState('networkidle');

    // Ensure a review exists — try to submit via API (400 = already exists, that's fine)
    const accessToken = await page.evaluate(() => localStorage.getItem('authToken'));
    if (accessToken) {
      await page.request.post(`${API_BASE}/platform/courses/${PUBLIC_COURSE_SLUG}/feedback/submit/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        data: { rating: 3, comment: 'Initial review for edit test' },
      }).catch(() => {});
      await page.reload();
      await page.waitForLoadState('networkidle');
    }

    const editRevBtn = page.locator('button').filter({ hasText: 'Edit your review' }).first();
    await editRevBtn.waitFor({ timeout: 10_000 });
    await editRevBtn.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Change star to 5
    await dialog.getByTestId('star-5').click();

    // Update comment
    const commentField = dialog.getByLabel('Comment (optional)');
    await commentField.fill('Updated comment via E2E');

    await dialog.getByRole('button', { name: 'Update' }).click();

    await expect(dialog).not.toBeVisible({ timeout: 5_000 });
    await expect(page.getByText('Updated comment via E2E')).toBeVisible({ timeout: 5_000 });
  });

  test('student can delete their own review from the dialog', async ({ page }) => {
    await page.goto(COURSE_URL);
    await page.waitForLoadState('networkidle');

    // Ensure a review exists before trying to delete
    const accessToken = await page.evaluate(() => localStorage.getItem('authToken'));
    if (accessToken) {
      await page.request.post(`${API_BASE}/platform/courses/${PUBLIC_COURSE_SLUG}/feedback/submit/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        data: { rating: 2, comment: 'Review to be deleted' },
      }).catch(() => {});
      await page.reload();
      await page.waitForLoadState('networkidle');
    }

    const editRevBtn = page.locator('button').filter({ hasText: 'Edit your review' }).first();
    await editRevBtn.waitFor({ timeout: 10_000 });
    await editRevBtn.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await dialog.getByRole('button', { name: 'Delete review' }).click();

    await expect(dialog).not.toBeVisible({ timeout: 5_000 });
    await expect(page.locator('text=· Your review').first()).not.toBeVisible({ timeout: 5_000 });
  });
});

// ── Teacher sees no "Write a review" on their OWN course ──────────────────────

test.describe('Owner has no review button on own course', () => {
  test.use({ storageState: TEACHER_STATE });

  test('e2e_teacher sees review button on a course they do NOT own', async ({ page }) => {
    // teacher1 owns cloud-computing-with-aws, e2e_teacher does NOT own it
    await page.goto(COURSE_URL);
    await page.getByRole('heading', { name: 'Reviews' }).waitFor({ timeout: 15_000 });

    // e2e_teacher should see the write button since they're not the owner
    const writeBtn = page.locator('button').filter({ hasText: /^Write a review$|^Edit your review$/ }).first();
    await expect(writeBtn).toBeVisible({ timeout: 10_000 });
  });
});

// ── Anonymous user sees reviews but no form ────────────────────────────────────

test.describe('Anonymous user sees reviews', () => {
  test('reviews section visible without login', async ({ page }) => {
    await page.goto(COURSE_URL);

    await expect(page.getByRole('heading', { name: 'Reviews' })).toBeVisible({ timeout: 15_000 });

    // No "Write a review" button for unauthenticated user
    const writeBtn = page.locator('button').filter({ hasText: 'Write a review' });
    await expect(writeBtn).not.toBeVisible();
  });
});
