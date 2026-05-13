# Test Plan — Erudite React Web App

## Table of Contents

- [1. Introduction](#1-introduction)
  - [1.1 Purpose](#11-purpose)
  - [1.2 Scope](#12-scope)
  - [1.3 Intended Audience](#13-intended-audience)
  - [1.4 Document Terminology and Acronyms](#14-document-terminology-and-acronyms)
  - [1.5 References](#15-references)
  - [1.6 Document Structure](#16-document-structure)
- [2. Evaluation Mission and Test Motivation](#2-evaluation-mission-and-test-motivation)
  - [2.1 Background](#21-background)
  - [2.2 Evaluation Mission](#22-evaluation-mission)
  - [2.3 Test Motivators](#23-test-motivators)
- [3. Target Test Items](#3-target-test-items)
- [4. Outline of Planned Tests](#4-outline-of-planned-tests)
  - [4.1 Outline of Test Inclusions](#41-outline-of-test-inclusions)
  - [4.2 Outline of Other Candidates for Potential Inclusion](#42-outline-of-other-candidates-for-potential-inclusion)
  - [4.3 Outline of Test Exclusions](#43-outline-of-test-exclusions)
- [5. Test Approach](#5-test-approach)
  - [5.1 Initial Test-Idea Catalogs and Other Reference Sources](#51-initial-test-idea-catalogs-and-other-reference-sources)
  - [5.2 Testing Techniques and Types](#52-testing-techniques-and-types)
    - [5.2.1 Data and Database Integrity Testing](#521-data-and-database-integrity-testing)
    - [5.2.2 Functional Testing](#522-functional-testing)
    - [5.2.3 Business Cycle Testing](#523-business-cycle-testing)
    - [5.2.4 User Interface Testing](#524-user-interface-testing)
    - [5.2.5 Security and Access Control Testing](#525-security-and-access-control-testing)
- [6. Entry and Exit Criteria](#6-entry-and-exit-criteria)
  - [6.1 Test Plan Entry/Exit Criteria](#61-test-plan-entryexit-criteria)
  - [6.2 Test Cycle Entry/Exit Criteria](#62-test-cycle-entryexit-criteria)
- [7. Deliverables](#7-deliverables)
- [8. Testing Workflow](#8-testing-workflow)
- [9. Environmental Needs](#9-environmental-needs)
  - [9.1 Base System Hardware](#91-base-system-hardware)
  - [9.2 Base Software Elements in the Test Environment](#92-base-software-elements-in-the-test-environment)
  - [9.3 Productivity and Support Tools](#93-productivity-and-support-tools)
- [10. Responsibilities, Staffing, and Training Needs](#10-responsibilities-staffing-and-training-needs)
- [11. Iteration Milestones](#11-iteration-milestones)
- [12. Risks, Dependencies, Assumptions, and Constraints](#12-risks-dependencies-assumptions-and-constraints)

---

## 1. Introduction

### 1.1 Purpose

This Test Plan defines the testing strategy, scope, and approach for the **Erudite React Web App** — the frontend application of the Erudite e-learning platform. The purpose of this document is to plan and control the test effort, identify what will be tested, and define success criteria for the frontend codebase.

### 1.2 Scope

This plan covers:
- **Unit testing** of core utility logic (`errorHandler`) and state management (`authStore`)
- **End-to-end testing** of key user flows using Playwright (manual trigger only)
- **Continuous Integration** via GitHub Actions

It does not cover backend API logic, server-side rendering, or third-party library internals.

### 1.3 Intended Audience

This document is intended for:
- The development team maintaining the frontend
- The course lecturer evaluating the testing deliverable
- Any contributor wishing to understand the testing setup before contributing

### 1.4 Document Terminology and Acronyms

| Term | Definition |
|------|-----------|
| API | Application Programming Interface |
| CI | Continuous Integration |
| E2E | End-to-End testing |
| JWT | JSON Web Token — used for authentication |
| RUP | Rational Unified Process |
| SUT | System Under Test |
| DOM | Document Object Model |
| MUI | Material UI — the component library used |
| Zustand | Lightweight state management library used for `authStore` |

### 1.5 References

| Document | Location |
|----------|----------|
| GitHub Repository | https://github.com/coffee3333/erudite-react-web-app |
| Test code (unit) | `src/test/` |
| Dependency file | `package.json` |
| CI workflow | `.github/workflows/` |
| SonarCloud dashboard | https://sonarcloud.io/project/overview?id=erudite_erudite-react-web-app |

### 1.6 Document Structure

- Sections 1–2: purpose, background, and motivation
- Section 3: what is being tested
- Sections 4–5: what tests are planned and how they are executed
- Sections 6–7: criteria for starting/stopping testing and deliverables
- Sections 8–12: environment, responsibilities, milestones, and risks

---

## 2. Evaluation Mission and Test Motivation

### 2.1 Background

The Erudite React frontend is a single-page application built with React 19, Material UI 7, and Zustand for state management. It communicates with the Django backend via a JWT-authenticated REST API. The frontend handles user authentication state, error display, routing, and all UI interactions. Correctness of the auth store and error handling logic is critical — bugs here can lead to users being stuck in invalid states or receiving no feedback on failed operations.

### 2.2 Evaluation Mission

The mission of the test effort is to verify that:
- Core utility functions (error handler) correctly map API error responses to user-facing messages
- The authentication state store correctly manages tokens, user data, and login state across all operations
- End-to-end user flows (sign up, sign in, course management) work correctly in a real browser environment

### 2.3 Test Motivators

- **Correctness** — ensure error messages are shown for the right conditions and not shown for others
- **State integrity** — verify that login/logout operations leave the store in a consistent state
- **Regression prevention** — catch breaking changes to auth logic or error handling via CI
- **Confidence for deployment** — tests must pass before any merge to `main`

---

## 3. Target Test Items

The following frontend components are the primary targets of this test plan:

- **`src/utils/errorHandler.jsx`** — maps API error responses to toast notifications per endpoint
- **`src/stores/authStore.jsx`** — Zustand store managing JWT tokens, user object, and login state
- **E2E flows** (Playwright, manual): sign up, sign in, sign out, course browsing, feedback, profile editing

---

## 4. Outline of Planned Tests

### 4.1 Outline of Test Inclusions

| Test Type | Framework | Location | Count |
|-----------|-----------|----------|-------|
| Unit (Vitest) | Vitest + jsdom | `src/test/errorHandler.test.js` | 14 tests |
| Unit (Vitest) | Vitest + jsdom | `src/test/authStore.test.js` | 8 tests |
| E2E (Playwright) | Playwright + Chromium | `e2e/` | 4 spec files (manual trigger) |

**Covered areas:**
- Error handler: registration, login, profile update, password reset request, password reset confirm
- Auth store: token storage, user persistence, login state, logout, loading/error flags
- E2E: full authentication flow, course management, feedback submission, profile editing

### 4.2 Outline of Other Candidates for Potential Inclusion

The following areas are candidates for future test coverage but are not included in the current iteration:

- API client (`apiClient.jsx`) — token attachment and refresh logic
- Individual React component rendering tests (CourseCard, ChallengeCard, etc.)
- Hook unit tests (`useSignIn`, `useSignUp`, `useGetCourses`, etc.)
- Form validation behaviour in course creation / update forms

### 4.3 Outline of Test Exclusions

The following are explicitly excluded from this test plan:

- Backend API logic — covered by the Django test plan
- Third-party library internals (MUI components, React Router, Zustand internals)
- Performance, load, and stress testing — out of scope for this iteration
- Browser compatibility testing across multiple browsers (only Chromium is used)

---

## 5. Test Approach

### 5.1 Initial Test-Idea Catalogs and Other Reference Sources

- Vitest documentation: https://vitest.dev/
- React Testing Library documentation: https://testing-library.com/docs/react-testing-library/intro/
- Playwright documentation: https://playwright.dev/
- Zustand testing guide: https://docs.pmnd.rs/zustand/guides/testing

### 5.2 Testing Techniques and Types

#### 5.2.1 Data and Database Integrity Testing

Not applicable for the frontend. The frontend does not directly access a database. All data persistence is handled either by the backend API or by `localStorage` (for JWT tokens and user object).

`localStorage` behaviour is verified within the `authStore` unit tests by asserting that tokens and user data are correctly written and removed on each store action.

#### 5.2.2 Functional Testing

| | |
|---|---|
| **Technique Objective** | Verify that each function performs its intended logic for all relevant input scenarios — correct outputs, side effects (toast messages, localStorage writes), and return values |
| **Technique** | Call functions directly with controlled inputs; mock external dependencies (toast, localStorage); assert on return values and mock call arguments |
| **Oracles** | Return value (`true`/`false`), toast mock call arguments, store state after each action, localStorage values |
| **Required Tools** | Vitest, jsdom, `vi.mock` for mocking `react-hot-toast` |
| **Success Criteria** | All 22 unit tests pass |
| **Special Considerations** | `react-hot-toast` is mocked to prevent actual DOM rendering; localStorage is replaced with an in-memory mock object |

**Functional test cases — `errorHandler.test.js`:**

| # | Route | Test | Expected |
|---|-------|------|----------|
| 1 | `/users/auth/registration/` | 400 with `email` field | `toast.error("Email: …")`, returns `true` |
| 2 | `/users/auth/registration/` | 400 with `username` field | `toast.error("Username: …")`, returns `true` |
| 3 | `/users/auth/registration/` | 400 with `password` field | `toast.error("Password: …")`, returns `true` |
| 4 | `/users/auth/registration/` | 400 with no known fields | Generic toast, returns `true` |
| 5 | `/users/auth/registration/` | 500 status | No toast, returns `false` |
| 6 | `/users/auth/registration/` | 400 with `non_field_errors` | Shows first error message, returns `true` |
| 7 | `/users/auth/login/` | 400 status | "Invalid email or password." toast, returns `true` |
| 8 | `/users/auth/login/` | 401 status | No toast, returns `false` |
| 9 | `/users/users/me/update/` | 400 with `username` field | Shows username error, returns `true` |
| 10 | `/users/users/me/update/` | 500 status | No toast, returns `false` |
| 11 | `/users/auth/password/reset/request/` | 404 status | Returns `true` |
| 12 | `/users/auth/password/reset/request/` | 500 status | Returns `false` |
| 13 | `/users/auth/password/reset/confirm/` | 400 status | Returns `true` |
| 14 | `/users/auth/password/reset/confirm/` | 500 status | Returns `false` |

**Functional test cases — `authStore.test.js`:**

| # | Test | Action | Expected |
|---|------|--------|----------|
| 1 | Initial state | Read initial store | `user=null`, `isLoggedIn=false`, `accessToken=null` |
| 2 | Set access token | `setAccessToken('abc123')` | `accessToken='abc123'`, `isLoggedIn=true`, `localStorage.authToken` set |
| 3 | Clear access token | `setAccessToken(null)` | `accessToken=null`, `isLoggedIn=false`, `localStorage.authToken` removed |
| 4 | Set refresh token | `setRefreshToken('refresh123')` | `refreshToken` in store + `localStorage.refreshToken` set |
| 5 | Set user | `setUser({id, username})` | `user` in store + `localStorage.user` as JSON |
| 6 | Logout | `logout()` | All state null, all 3 localStorage keys removed |
| 7 | Set loading | `setIsLoading(true/false)` | `isLoading` toggles correctly |
| 8 | Set error | `setError('msg')` | `error` set to string |

#### 5.2.3 Business Cycle Testing

| | |
|---|---|
| **Technique Objective** | Verify complete end-to-end user flows in a real browser against a live backend |
| **Technique** | Playwright scripts automate browser interactions: navigate, fill forms, click, assert DOM state |
| **Oracles** | Page URL after navigation, visible text in the DOM, element presence/absence |
| **Required Tools** | Playwright, Chromium, running frontend (port 5173) and backend (port 8000) |
| **Success Criteria** | All E2E specs pass when triggered manually |
| **Special Considerations** | E2E tests require a live backend with seeded fixture users (`e2e_student@test.com`, `e2e_teacher@test.com`). They are triggered manually via `workflow_dispatch` only — not on every PR — to avoid CI failures when no backend is available |

**E2E test files:**

| File | Scenarios Covered |
|------|-------------------|
| `e2e/auth.spec.js` | Sign up, sign in, sign out |
| `e2e/courses.spec.js` | Browse courses, create, update, delete |
| `e2e/feedback.spec.js` | Submit and view course ratings/feedback |
| `e2e/profile.spec.js` | View and edit user profile |

#### 5.2.4 User Interface Testing

| | |
|---|---|
| **Technique Objective** | Verify that the UI renders correctly and responds to user interactions as expected |
| **Technique** | Playwright E2E tests interact with the rendered DOM — clicking buttons, filling inputs, asserting visible text and navigation |
| **Oracles** | Correct page title/URL after navigation, correct text rendered after form submission, correct toast/error messages displayed |
| **Required Tools** | Playwright, Chromium (headless) |
| **Success Criteria** | All E2E specs pass |
| **Special Considerations** | MUI Select components require targeting `[role="combobox"]` rather than `#id` selectors; submit buttons are targeted with `button[type="submit"]` |

#### 5.2.5 Security and Access Control Testing

| | |
|---|---|
| **Technique Objective** | Verify that the frontend correctly handles authentication state — that tokens are stored and cleared at the right times, and that unauthenticated states are handled without exposing protected data |
| **Technique** | Unit test the `authStore` to assert that `logout()` removes all tokens from both store and localStorage; verify that `setAccessToken(null)` sets `isLoggedIn=false` |
| **Oracles** | `isLoggedIn=false` after logout; `localStorage.authToken=null` after logout; `localStorage.refreshToken=null` after logout |
| **Required Tools** | Vitest, localStorage mock |
| **Success Criteria** | Tests 2, 3, 6 in `authStore.test.js` pass |
| **Special Considerations** | JWT tokens are stored in localStorage; this is by design for this project's architecture |

---

## 6. Entry and Exit Criteria

### 6.1 Test Plan Entry/Exit Criteria

**Entry criteria (when testing can begin):**
- Node.js 20 is installed
- `npm install` has been run successfully
- All dependencies from `package.json` are available in `node_modules/`

**Exit criteria (when testing is complete):**
- All 22 unit tests pass with 0 failures
- CI pipeline shows green on the `main` branch

**Suspension criteria:**
- If a dependency fails to install (e.g. jsdom version conflict), testing is suspended until resolved
- If more than 50% of tests fail due to a systemic issue (e.g. broken setup file), the run is suspended

### 6.2 Test Cycle Entry/Exit Criteria

**Entry:** A pull request is opened targeting `main`; GitHub Actions triggers `unit-tests.yml` and `sonarcloud.yml` automatically.

**Exit:** All unit tests pass and both CI workflows complete with status `success`. The PR may then be merged.

**Abnormal termination:** If CI times out or `npm install` fails, the run is marked failed and the PR is blocked from merging.

---

## 7. Deliverables

| Deliverable | Description | Location |
|---|---|---|
| Unit test — error handler | 14 tests for all error handler routes | `src/test/errorHandler.test.js` |
| Unit test — auth store | 8 tests for Zustand auth store | `src/test/authStore.test.js` |
| Test setup file | jest-dom matchers setup | `src/test/setup.js` |
| Vitest config | Test runner configuration | `vite.config.js` (test section) |
| CI workflow — unit tests | Runs `npm test` on every PR | `.github/workflows/unit-tests.yml` |
| CI workflow — SonarCloud | Runs coverage + scan on every push | `.github/workflows/sonarcloud.yml` |
| CI workflow — E2E | Playwright E2E (manual trigger only) | `.github/workflows/e2e.yml` |
| SonarCloud report | Code quality and coverage dashboard | https://sonarcloud.io/project/overview?id=erudite_erudite-react-web-app |
| This test plan | RUP-format test plan document | `TEST_PLAN.md` |

---

## 8. Testing Workflow

1. Developer creates a feature branch and writes code
2. Developer runs tests locally: `npm test` (see `homework.md` for full commands)
3. Developer opens a Pull Request targeting `main`
4. GitHub Actions automatically triggers:
   - **`unit-tests.yml`** — runs `npm test` (Vitest, 22 unit tests)
   - **`sonarcloud.yml`** — runs `npm run test:coverage`, uploads `coverage/lcov.info` to SonarCloud
5. If all steps pass, the PR is eligible for merge
6. If any step fails, the PR is blocked — the developer must fix the failure before merging
7. E2E tests are run manually via GitHub Actions `workflow_dispatch` when a live backend is available

---

## 9. Environmental Needs

### 9.1 Base System Hardware

- Any machine capable of running Node.js 20
- No special hardware requirements — tests run in jsdom (simulated browser), no real browser needed for unit tests
- Playwright E2E tests require a Chromium binary (installed via `npx playwright install --with-deps chromium`)

### 9.2 Base Software Elements in the Test Environment

| Software | Version | Purpose |
|---|---|---|
| Node.js | 20 | Runtime |
| Vitest | ^3.1.1 | Unit test runner |
| jsdom | ^26.1.0 | Simulated browser DOM for unit tests |
| @testing-library/react | ^16.3.0 | React component testing utilities |
| @testing-library/jest-dom | ^6.6.3 | Custom DOM matchers |
| @testing-library/user-event | ^14.5.2 | User interaction simulation |
| @vitest/coverage-v8 | ^3.1.1 | Coverage provider |
| Playwright | (devDependency) | E2E browser automation |

Full dependency list: [`package.json`](https://github.com/coffee3333/erudite-react-web-app/blob/main/package.json)

### 9.3 Productivity and Support Tools

| Tool | Purpose |
|---|---|
| GitHub Actions | CI/CD — runs unit tests and coverage on every PR |
| SonarCloud | Static analysis, coverage tracking, security scan |
| `@vitest/coverage-v8` | Generates `coverage/lcov.info` for SonarCloud upload |

---

## 10. Responsibilities, Staffing, and Training Needs

| Role | Responsibility |
|---|---|
| Developer | Write unit tests alongside feature code |
| Developer | Maintain Playwright E2E specs when UI flows change |
| Developer | Ensure CI pipeline passes before requesting PR review |
| Developer | Monitor SonarCloud results and address flagged issues |

All team members are expected to be familiar with Vitest and React Testing Library basics. The `homework.md` file in the project root provides the exact commands to run tests locally.

---

## 11. Iteration Milestones

| Milestone | Target |
|---|---|
| Unit tests passing locally | ✅ Achieved — 22/22 tests pass |
| CI pipeline green on `main` | ✅ Achieved |
| SonarCloud connected | ✅ Achieved — Security Rating A, 0 security issues |
| Coverage target | Goal: ≥ 50% (current: 3.5% — unit tests cover utils/store only) |
| E2E tests fully automated | Goal: connect to CI when backend is consistently available |

---

## 12. Risks, Dependencies, Assumptions, and Constraints

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| jsdom version incompatibility with React 19 | Low | High | Dependencies are pinned in `package.json`; `npm ci` used in CI |
| E2E tests flaky due to timing/network | Medium | Medium | E2E runs are manual only — not blocking PRs |
| SonarCloud token expires or is revoked | Low | Medium | Token stored as GitHub secret `SONAR_TOKEN`; rotate if CI scan fails |
| Coverage stays below 50% | High | Medium | Current unit tests only cover 2 files; expand to hooks and components next iteration |
| Playwright Chromium binary missing in CI | Low | High | `npx playwright install --with-deps chromium` in E2E workflow step |

---

## 13. Test Execution Screenshots

### 13.1 Unit Tests (Vitest)

Run command:
```bash
npm test
```

<!-- Paste your Vitest terminal screenshot here -->
![vitest test run](docs/screenshots/vitest_run.png)

### 13.2 Coverage Report

Run command:
```bash
npm run test:coverage
```

<!-- Paste your coverage report screenshot here -->
![vitest coverage](docs/screenshots/vitest_coverage.png)
