# Testing Guide

This document describes the end-to-end (E2E) testing setup for the `@ghentcdh/annotated-text` library using Playwright.

## Overview

The project uses Playwright for E2E testing with Docker to ensure consistent rendering across different development
machines and CI. This guarantees that visual regression tests produce identical results locally and in GitHub Actions.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 22+ and pnpm 10+

## Test Structure

```
libs/core/
├── e2e/
│   ├── __snapshots__/           # Visual regression baseline images
│   │   ├── visual.spec.ts/
│   │   ├── greektext.spec.ts/
│   │   └── w3c.spec.ts/
│   │
│   ├── index.html               # Main test page
│   ├── setup.ts                 # Main fixture initialization
│   │
│   ├── greektext.html           # Greek text test page
│   ├── greektext.setup.ts       # Greek text fixtures
│   ├── greektext.spec.ts        # Greek text tests
│   │
│   ├── w3c.html                 # W3C annotations test page
│   ├── w3c.setup.ts             # W3C annotation fixtures
│   ├── w3c.spec.ts              # W3C annotation tests
│   │
│   ├── basic.spec.ts            # Basic rendering tests
│   ├── visual.spec.ts           # Visual regression tests
│   └── annotation-creation.spec.ts  # Annotation workflow tests
│
├── playwright.config.ts         # Playwright configuration
├── vite.e2e.config.ts           # Vite config for test server
└── docker-compose.playwright.yml
```

## Test Pages

The E2E tests use multiple HTML pages to test different features:

| Page | URL | Description |
|------|-----|-------------|
| Main | `/` or `/index.html` | Basic text, annotations, overlapping, RTL, interactive |
| Greek Text | `/greektext.html` | TextLineAdapter with Greek papyrus text |
| W3C Annotations | `/w3c.html` | W3CAnnotationAdapter with Web Annotation format |
| Interactive | `/interactive.html` | Focused interactive annotation testing |

### Greek Text Tests (`greektext.spec.ts`)

Tests for the `TextLineAdapter` with ancient Greek text:
- Line number parsing (e.g., `1.Χαίρημων Ἀπολλωνίωι`)
- Greek diacritics preservation
- Editorial marks (`[αι]`, `[ων]`)
- Multi-line rendering with gutter

### W3C Annotation Tests (`w3c.spec.ts`)

Tests for the `W3CAnnotationAdapter`:
- TextPositionSelector parsing
- W3C annotation format compliance
- TextualBody content handling
- Tagging motivation annotations
- Round-trip annotation creation (internal → W3C format)

## Snapshot Naming

Snapshots include the platform in their filename:

```
{snapshotDir}/{testFilePath}/{arg}-{platform}{ext}
```

Examples:

- `basic-text-linux.png` - Generated in Docker/CI
- `basic-text-darwin.png` - Generated on macOS locally

> ⚠️ **Important**: CI uses Linux. Always commit the `-linux.png` snapshots generated via Docker.

## Commands

### Running Tests

| Command             | Environment           | Use Case                                                                 |
|---------------------|-----------------------|--------------------------------------------------------------------------|
| `nx e2e core`       | Docker (Linux)        | **Recommended for CI parity** - runs tests in the same environment as CI |
| `nx e2e:local core` | Local (macOS/Windows) | Fast iteration during development (uses local platform snapshots)        |

### Running Specific Test Files

```bash
# Run only Greek text tests
nx e2e:local core -- --grep "Greek Text"

# Run only W3C tests
nx e2e:local core -- --grep "W3C"

# Run a specific test file
nx e2e:local core -- libs/core/e2e/greektext.spec.ts
```

### Interactive UI Mode

| Command                | Environment    | Use Case                                   |
|------------------------|----------------|--------------------------------------------|
| `nx e2e:ui core`       | Docker (Linux) | Debug tests with identical rendering to CI |
| `nx e2e:local:ui core` | Local          | Quick debugging (faster startup)           |

After running `nx e2e:ui core`, open http://localhost:8077 in your browser.

### Updating Snapshots

| Command                                | Environment    | Snapshots Created                                    |
|----------------------------------------|----------------|------------------------------------------------------|
| `nx e2e:update-snapshots core`         | Docker (Linux) | `*-linux.png` - **Commit these**                     |
| `nx e2e:local core --update-snapshots` | Local          | `*-darwin.png` or `*-win32.png` - For local dev only |

> ⚠️ **Important**: Always update snapshots using Docker (`nx e2e:update-snapshots core`) for CI. The `-linux.png` files
> are the source of truth.

## Workflows

### Daily Development

For quick iteration while writing tests:

```bash
# Fast local execution (uses your platform's snapshots)
nx e2e:local core

# Or with UI for debugging
nx e2e:local:ui core
```

If you don't have local snapshots yet:

```bash
nx e2e:local core --update-snapshots
```

### Before Committing

Always verify tests pass in Docker before pushing:

```bash
nx e2e core
```

### When Visual Tests Fail

1. **Review the diff** in the Playwright report (`libs/core/playwright-report/`)
2. **If the change is intentional**, update snapshots:
   ```bash
   nx e2e:update-snapshots core
   ```
3. **Commit the updated Linux snapshots**:
   ```bash
   git add libs/core/e2e/__snapshots__/*-linux.png
   git commit -m "Update visual regression snapshots"
   ```

### Adding New Test Pages

1. Create the HTML file (`e2e/myfeature.html`):
   ```html
   <!DOCTYPE html>
   <html>
     <head>
       <title>My Feature Tests</title>
     </head>
     <body>
       <div id="my-container"></div>
       <script type="module" src="./myfeature.setup.ts"></script>
     </body>
   </html>
   ```

2. Create the setup file (`e2e/myfeature.setup.ts`):
   ```ts
   import { createAnnotatedText, PlainTextAdapter } from '@ghentcdh/annotated-text';

   const instance = createAnnotatedText('my-container', {
     text: PlainTextAdapter({}),
   });
   instance.setText('My test text');
   ```

3. Create the spec file (`e2e/myfeature.spec.ts`):
   ```ts
   import { test, expect } from '@playwright/test';

   test.describe('My Feature', () => {
     test.beforeEach(async ({ page }) => {
       await page.goto('/myfeature.html');
     });

     test('renders correctly', async ({ page }) => {
       const container = page.locator('#my-container');
       await expect(container).toBeVisible();
     });
   });
   ```

### Adding New Visual Tests

1. Write your test using `toHaveScreenshot()`:
   ```ts
   test('my new feature renders correctly', async ({ page }) => {
     await page.goto('/myfeature.html');
     const element = page.locator('#my-element');
     await expect(element).toHaveScreenshot('my-feature.png');
   });
   ```

   Note: The filename becomes `my-feature-linux.png` automatically.

2. Generate the baseline snapshot:
   ```bash
   nx e2e:update-snapshots core
   ```

3. Verify the snapshot looks correct in `libs/core/e2e/__snapshots__/`

4. Commit both the test and snapshot files:
   ```bash
   git add libs/core/e2e/__snapshots__/*-linux.png
   ```

## Docker Details

### Why Docker?

Visual regression tests compare pixel-by-pixel screenshots. Different operating systems render fonts and anti-aliasing
differently:

- macOS and Linux render text with subtle differences
- Even 1px differences cause test failures

Docker ensures everyone (developers on macOS/Windows/Linux + CI) uses the exact same rendering environment.

### Platform-Specific Snapshots

The `{platform}` in the snapshot path allows you to:

- Keep Linux snapshots for CI (required)
- Optionally keep local platform snapshots for faster local development

```
__snapshots__/
├── visual.spec.ts/
│   ├── basic-text-linux.png       # ✅ Commit (used by CI)
│   └── basic-text-darwin.png      # 📋 Optional (local macOS dev)
├── greektext.spec.ts/
│   ├── greek-basic-text-linux.png
│   └── ...
└── w3c.spec.ts/
    ├── w3c-basic-annotations-linux.png
    └── ...
```

### Docker Image

The project uses the official Playwright Docker image:

```
mcr.microsoft.com/playwright:v1.56.0-jammy
```

### Cached Dependencies

Docker uses a named volume (`playwright_node_modules`) to cache `node_modules` for Linux. This means:

- First run installs dependencies (~1-2 min)
- Subsequent runs reuse cached modules (fast)

To clear the cache if you encounter issues:

```bash
docker volume rm core_playwright_node_modules
```

## Configuration

### Playwright Config (`playwright.config.ts`)

Key settings:

```ts
export default defineConfig({
  // Platform-specific snapshot paths
  snapshotPathTemplate: '{snapshotDir}/{testFilePath}/{arg}-{platform}{ext}',

  // Only run on Chromium for consistent snapshots
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  // Visual comparison tolerance
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01, // Allow 1% pixel difference
    },
  },

  // Auto-start dev server
  webServer: {
    command: 'npx vite --config libs/core/vite.e2e.config.ts --host 0.0.0.0',
    url: 'http://localhost:4173',
  },
});
```

## CI Integration

GitHub Actions runs `nx e2e core` which uses the same Docker image. The workflow:

1. Checks out code
2. Restores `node_modules` cache
3. Runs tests in Docker
4. Uploads Playwright report as artifact on failure

See `.github/workflows/merge-request.yml` for the full configuration.

## Troubleshooting

### Tests pass locally but fail in CI

You're probably running `nx e2e:local core` instead of `nx e2e core`. Always use Docker for final verification.

Also check you've committed the `-linux.png` snapshots, not `-darwin.png`.

### "Cannot find module" errors in Docker

Clear the Docker volume and rebuild:

```bash
docker volume rm core_playwright_node_modules
nx e2e core
```

### Snapshots keep changing

Ensure you're updating snapshots with Docker:

```bash
nx e2e:update-snapshots core
```

Never commit snapshots from `nx e2e:local core --update-snapshots` for CI.

### Port already in use

If port 8077 or 4173 is busy:

```bash
# Find and kill the process
lsof -i :8077
kill -9 <PID>

# Or change ports in docker-compose.playwright.yml
```

### Docker container won't start

Check Docker is running:

```bash
docker info
```

Rebuild if needed:

```bash
docker compose -f libs/core/docker-compose.playwright.yml down
docker compose -f libs/core/docker-compose.playwright.yml build --no-cache
```

### Missing local snapshots

If you want faster local development without Docker:

```bash
nx e2e:local core --update-snapshots
```

This creates `-darwin.png` (macOS) or `-win32.png` (Windows) snapshots for local use.
