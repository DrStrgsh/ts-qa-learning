# QA Automation li'l Resume

Production-style QA Automation framework built with **Playwright + TypeScript (strict) + Zod**.
This repository demonstrates how to design a **maintainable, scalable test architecture** rather than a collection of ad-hoc UI/API tests.

---

## Overview

The goal of this project is to showcase:

* Strong **TypeScript-first automation design**
* Contract-validated API testing
* Stable, deterministic UI testing using Page Object Model
* Clear separation between **test framework code** and **test scenarios**
* CI-ready architecture with reproducible environments
* Scalable structure suitable for large product test suites

This is not a “demo with tests”.
It is a **template for building serious automation systems**.

---

## Tech Stack

| Layer          | Tooling                         |
| -------------- | ------------------------------- |
| Language       | TypeScript (strict mode)        |
| Test Runner    | Playwright Test                 |
| API Validation | Zod v4 (contract assertions)    |
| Architecture   | Domain-oriented test framework  |
| Linting        | ESLint (flat config) + Prettier |
| CI             | GitHub Actions                  |
| Runtime        | Node.js LTS                     |
| Target Apps    | DummyJSON (API), SauceDemo (UI) |

---

## Architecture Principles

### 1. Tests are not the framework

```
tests/        → scenarios
src/          → reusable automation framework
```

Framework logic lives in `src/`, not inside tests.

---

### 2. Contract-driven API testing

Responses are validated against schemas before assertions:

```ts
expect(body).toMatchSchema(UserSchema, 'User')
const user = parseUser(body)
```

This prevents silent API drift and enforces typed guarantees.

---

### 3. Deterministic UI Testing (No Flaky Waits)

Centralized synchronization utilities:

```
src/utils/uiExpect.ts
```

No raw `waitForTimeout`.
No implicit timing assumptions.

---

### 4. Page Object Model Done Correctly

Pages encapsulate:

* locators
* navigation
* UI assertions
* user interactions

Tests describe behavior only:

```ts
await inventory.open()
await inventory.addBackpackToCart()
await cart.assertVisible()
```

---

### 5. Explicit Auth Lifecycle

UI authentication state is generated once:

```
tests/ui/.auth/user.json
```

`ui-setup` project refreshes it only when needed (TTL-based).

---

## Project Structure

```
src/
 ├── clients/            # API clients
 ├── config/             # Environment configuration
 ├── testdata/           # Typed test data (users, payloads)
 ├── utils/              # Framework utilities (UI/API helpers)
 └── validation/         # Zod schemas + parsers

tests/
 ├── api/                # API contract tests
 ├── ui/
 │   ├── authed/         # Authenticated UI scenarios
 │   ├── guest/          # Non-authenticated scenarios
 │   └── pages/          # Page Objects
 └── fixtures/           # Playwright fixtures layer

.github/workflows/
 └── ci.yml              # CI pipeline

playwright.config.ts
eslint.config.mjs
```

---

## Running Locally

Install dependencies:

```bash
npm ci
```

Install browsers:

```bash
npx playwright install --with-deps
```

Run API tests:

```bash
npx playwright test --project=api
```

Run UI tests:

```bash
npx playwright test --project=ui
```

---

## Environment Configuration

Only environment-specific values live in `.env`:

```
API_BASE_URL=https://dummyjson.com
UI_BASE_URL=https://saucedemo.com
```

Test users and credentials are **versioned test data**, not environment secrets.

---

## Linting & Type Safety

Strict type checking:

```bash
npm run typecheck
```

Lint rules enforce:

* no `any`
* no unused imports
* no unstable UI selectors
* consistent import structure

---

## CI Pipeline

CI validates:

1. TypeScript compilation
2. ESLint rules
3. API test suite
4. UI test suite

Artifacts (trace, report) are uploaded only on failure.

---

## Example Test Philosophy

Instead of:

```
click → sleep → assert
```

I enforce:

```
action → contract validation → typed assertions
```

This produces tests that fail for the right reasons.

---

## Author

Built as part of a transition from Full Stack Development to QA Automation Engineering, demonstrating production-level test architecture design.

---

If you're reviewing this repository as a hiring manager or teammate, treat it as a **framework sample**, not just a test collection.
