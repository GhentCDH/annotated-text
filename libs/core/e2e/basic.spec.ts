import { test, expect } from '@playwright/test';

test.describe('AnnotatedText Core - Basic Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders basic text', async ({ page }) => {
    const container = page.locator('#basic-text');
    await expect(container).toBeVisible();
    await expect(container).toContainText('Hello world');
  });

  test('renders text with annotations', async ({ page }) => {
    const container = page.locator('#with-annotations');
    await expect(container).toBeVisible();
    await expect(container).toContainText('Hello world');
    
    // Annotations are rendered as SVG paths with data-annotation-uid
    const annotations = page.locator('[data-annotation-uid]');
    const count = await annotations.count();
    expect(count).toBeGreaterThan(0);
  });

  test('renders overlapping annotations', async ({ page }) => {
    const container = page.locator('#overlapping');
    await expect(container).toBeVisible();
    
    // Check that annotation SVG elements exist
    // Each annotation may have multiple paths (fill + border)
    const annotation1 = page.locator('[data-annotation-uid="1"]');
    const annotation2 = page.locator('[data-annotation-uid="2"]');
    const annotation3 = page.locator('[data-annotation-uid="3"]');
    
    await expect(annotation1.first()).toBeVisible();
    await expect(annotation2.first()).toBeVisible();
    await expect(annotation3.first()).toBeVisible();
  });

  test('renders RTL text', async ({ page }) => {
    const container = page.locator('#rtl-text');
    await expect(container).toBeVisible();
    await expect(container).toContainText('مرحبا');
  });
});
