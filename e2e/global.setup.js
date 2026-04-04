/**
 * Global setup: creates fixture users on the backend (idempotent),
 * logs them in, and saves storageState (JWT tokens in localStorage)
 * so individual test files can skip the login step.
 */

import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_BASE = 'http://127.0.0.1:8000/api';
const FRONTEND_URL = 'http://localhost:5173';

const USERS = [
  {
    username: 'e2e_student',
    email: 'e2e_student@test.com',
    password: 'E2eTest!99',
    role: 'student',
    stateFile: path.join(__dirname, '.auth', 'student.json'),
  },
  {
    username: 'e2e_teacher',
    email: 'e2e_teacher@test.com',
    password: 'E2eTest!99',
    role: 'teacher',
    stateFile: path.join(__dirname, '.auth', 'teacher.json'),
  },
];

async function registerUser(user) {
  const form = new FormData();
  form.append('username', user.username);
  form.append('email', user.email);
  form.append('password', user.password);
  form.append('password2', user.password);
  form.append('role', user.role);

  const res = await fetch(`${API_BASE}/users/auth/registration/`, {
    method: 'POST',
    body: form,
  });
  // 400 = already exists — that's fine
  if (!res.ok && res.status !== 400) {
    const body = await res.text();
    throw new Error(`Registration failed for ${user.email}: ${res.status} ${body}`);
  }
}

async function loginUser(user) {
  const res = await fetch(`${API_BASE}/users/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: user.email, password: user.password }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Login failed for ${user.email}: ${res.status} ${body}`);
  }
  return res.json(); // { access, refresh }
}

async function fetchProfile(accessToken) {
  const res = await fetch(`${API_BASE}/users/profile/me/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function globalSetup() {
  // Register users (ignore if already exist)
  for (const user of USERS) {
    await registerUser(user);
  }

  // Force-verify emails via Django management command so tests work with verified users
  const { execSync } = await import('child_process');
  try {
    execSync(
      `/Users/I750598/PycharmProjects/erudite-django-web-clone/.venv/bin/python ` +
      `/Users/I750598/Documents/erudite-claude-version/erudite-django-web-clone/manage.py shell ` +
      `-c "from authentication.models import User; ` +
      `User.objects.filter(email__in=['e2e_student@test.com','e2e_teacher@test.com']).update(email_verified=True)"`,
      { stdio: 'ignore' }
    );
  } catch {
    // Non-fatal — tests will still run, some may fail if email not verified
  }

  // For each user: log in, save storageState via a real browser context
  const browser = await chromium.launch();

  for (const user of USERS) {
    const tokens = await loginUser(user);
    const profile = await fetchProfile(tokens.access);

    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to the app so localStorage origin is set correctly
    await page.goto(FRONTEND_URL);

    // Inject tokens + user object into localStorage (matches authStore keys)
    await page.evaluate(
      ({ access, refresh, userObj }) => {
        localStorage.setItem('authToken', access);
        localStorage.setItem('refreshToken', refresh);
        if (userObj) {
          localStorage.setItem('user', JSON.stringify(userObj));
        }
      },
      { access: tokens.access, refresh: tokens.refresh, userObj: profile }
    );

    await context.storageState({ path: user.stateFile });
    await context.close();
  }

  await browser.close();
}
