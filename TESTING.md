# Testing Guide

This document describes the testing setup for the `@ghentcdh/annotated-text` library.

## Overview

The project uses:
- **Vitest** for unit testing with v8 coverage
- **Playwright** for E2E testing with Istanbul coverage
- **Docker** to ensure consistent rendering across environments
- **Shields.io** for dynamic coverage badges (no account needed)

## Prerequisites

- Docker and Docker Compose installed
- Node.js 22+ and pnpm 10+

## Test Structure

```
libs/core/
├── src/
│   └── lib/
│       └── **/__tests__/        # Unit tests alongside source
│           └── *.spec.ts
│
├── e2e/
│   ├── __snapshots__/           # Visual regression baseline images
│   ├── *.html                   # Test pages
│   ├── *.setup.ts               # Test fixtures
│   ├── *.spec.ts                # E2E tests
│   ├── fixtures.ts              # Test fixtures with coverage
│   ├── global-setup.ts          # Global setup
│   └── global-teardown.ts       # Global teardown
│
├── coverage/
│   ├── unit/                    # Unit test coverage
│   │   ├── index.html           # HTML report
│   │   ├── lcov.info            # LCOV format
│   │   └── coverage-summary.json
│   └── e2e/                     # E2E test coverage
│       ├── lcov-report/         # HTML report
│       ├── lcov.info            # LCOV format
│       └── coverage-summary.json
│
├── playwright.config.ts
├── vite.config.ts               # Unit test config
└── vite.e2e.config.ts           # E2E test config
```

## Coverage Badge

![Coverage](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2FGhentCDH%2Fannotated-text%2Fmain%2F.github%2Fbadges%2Fcoverage.json)

The badge is automatically updated on each push to `main`. It uses:
- **shields.io endpoint badge** - reads from `.github/badges/coverage.json`
- No external account required
- Combined coverage from unit + E2E tests

## Commands

### Unit Tests

```bash
# Run unit tests
nx test core

# Run unit tests with coverage
nx test core --coverage

# Run unit tests in watch mode
nx test core --watch
```

### E2E Tests

| Command                      | Environment    | Use Case                                      |
|------------------------------|----------------|-----------------------------------------------|
| `nx e2e core`                | Docker (Linux) | **Recommended** - CI parity                   |
| `nx e2e:local core`          | Local          | Fast iteration                                |
| `nx e2e:ui core`             | Docker         | Debug with CI rendering (http://localhost:8077) |
| `nx e2e:local:ui core`       | Local          | Quick debugging                               |
| `nx e2e:update-snapshots core` | Docker       | Update baseline snapshots                     |

### Coverage

| Command                      | Type    | Output Directory             |
|------------------------------|---------|------------------------------|
| `nx test core --coverage`    | Unit    | `libs/core/coverage/unit/`   |
| `nx e2e:coverage core`       | E2E     | `libs/core/coverage/e2e/`    |
| `nx e2e:coverage:local core` | E2E     | `libs/core/coverage/e2e/`    |

### Viewing Coverage Reports

```bash
# Unit test coverage
open libs/core/coverage/unit/index.html

# E2E coverage
open libs/core/coverage/e2e/lcov-report/index.html
```

## Test Pages

| Page | URL | Description |
|------|-----|-------------|
| Main | `/index.html` | Basic text, annotations, overlapping, RTL |
| Greek Text | `/greektext.html` | TextLineAdapter with Greek papyrus text |
| W3C Annotations | `/w3c.html` | W3CAnnotationAdapter |
| Interactive | `/interactive.html` | Annotation creation workflow |

## Writing Tests

### Unit Tests

Unit tests use Vitest and are located in `__tests__` folders:

```ts
// src/lib/myfeature/__tests__/myfeature.spec.ts
import { describe, it, expect } from 'vitest';
import { myFunction } from '../myfeature';

describe('myFeature', () => {
  it('should work', () => {
    expect(myFunction()).toBe(true);
  });
});
```

### E2E Tests

E2E tests use Playwright. Import from `./fixtures` for coverage support:

```ts
// e2e/myfeature.spec.ts
import { test, expect } from './fixtures';

test.describe('My Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/myfeature.html');
  });

  test('renders correctly', async ({ page }) => {
    await expect(page.locator('#my-element')).toBeVisible();
  });

  test('visual regression', async ({ page }) => {
    await expect(page.locator('#my-element')).toHaveScreenshot('my-feature.png');
  });
});
```

### Adding Visual Tests

1. Write test with `toHaveScreenshot()`:
   ```ts
   await expect(element).toHaveScreenshot('my-feature.png');
   ```

2. Generate baseline:
   ```bash
   nx e2e:update-snapshots core
   ```

3. Commit the `-linux.png` snapshots

## Snapshot Naming

Snapshots include platform in filename:
- `my-feature-linux.png` - CI (commit these)
- `my-feature-darwin.png` - macOS local
- `my-feature-win32.png` - Windows local

## CI Integration

GitHub Actions workflow (`.github/workflows/merge-request.yml`):

1. **test** job:
   - Runs unit tests with coverage
   - Displays coverage in job summary

2. **e2e-core** job:
   - Runs E2E tests with coverage in Docker
   - Displays coverage in job summary
   - Uploads Playwright report as artifact

3. **update-coverage-badge** job (main branch only):
   - Downloads coverage from both jobs
   - Calculates combined coverage
   - Updates `.github/badges/coverage.json`
   - Commits the updated badge

## How Coverage Badge Works

1. Each job generates `coverage-summary.json`
2. The `update-coverage-badge` job reads both summaries
3. Calculates combined coverage (average of unit + E2E)
4. Creates a JSON file for shields.io:
   ```json
   {
     "schemaVersion": 1,
     "label": "coverage",
     "message": "75%",
     "color": "yellow"
   }
   ```
5. Badge colors:
   - 🟢 Green: ≥80%
   - 🟡 Yellow: ≥60%
   - 🟠 Orange: ≥40%
   - 🔴 Red: <40%

## Docker

### Why Docker?

Visual regression tests compare pixels. Font rendering differs between OS:
- macOS and Linux render text differently
- Even 1px differences cause failures

Docker ensures identical rendering everywhere.

### Docker Image

```
mcr.microsoft.com/playwright:v1.56.0-jammy
```

### Cached Dependencies

Docker uses a named volume for `node_modules`. Clear if needed:

```bash
docker volume rm core_playwright_node_modules
```

## Troubleshooting

### Tests pass locally but fail in CI

Use `nx e2e core` (Docker) instead of `nx e2e:local core`. Commit `-linux.png` snapshots.

### Coverage shows 0%

1. E2E tests must import from `./fixtures`:
   ```ts
   import { test, expect } from './fixtures';
   ```

2. Run with coverage enabled:
   ```bash
   nx e2e:coverage:local core
   ```

### Badge not updating

1. Badge only updates on pushes to `main`
2. Check Actions log for the `update-coverage-badge` job
3. Verify `.github/badges/coverage.json` was committed

### Port in use

```bash
lsof -i :4173
kill -9 <PID>
```

### Docker won't start

```bash
docker info  # Check Docker is running
docker compose -f libs/core/docker-compose.playwright.yml down
```
