# E2E Tests

End-to-end tests using [Playwright](https://playwright.dev/).

## Commands

All commands are run from the workspace root via NX.

### Docker (recommended for consistent snapshots)

| Command | Description |
|---|---|
| `npx nx e2e e2e` | Run e2e tests |
| `npx nx e2e:ui e2e` | Run e2e tests with Playwright UI |
| `npx nx e2e:update-snapshots e2e` | Update snapshots |
| `npx nx e2e:coverage e2e` | Run e2e tests with coverage |

### Local

| Command | Description |
|---|---|
| `npx nx e2e:local e2e` | Run e2e tests |
| `npx nx e2e:local:ui e2e` | Run e2e tests with Playwright UI |
| `npx nx e2e:coverage:local e2e` | Run e2e tests with coverage |