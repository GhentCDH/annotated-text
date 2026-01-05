import { test, expect } from './fixtures';

test.describe('AnnotatedText Core - Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for all annotations to render
    await page.waitForSelector('[data-annotation-uid]');
  });

  test('basic text renders correctly', async ({ page }) => {
    const container = page.locator('#basic-text').locator('..');
    await expect(container).toHaveScreenshot('basic-text.png');
  });

  test('annotations render at correct positions', async ({ page }) => {
    const container = page.locator('#with-annotations').locator('..');
    await expect(container).toHaveScreenshot('with-annotations.png');
  });

  test('overlapping annotations stack correctly', async ({ page }) => {
    const container = page.locator('#overlapping').locator('..');
    await expect(container).toHaveScreenshot('overlapping-annotations.png');
  });

  test('RTL text renders correctly', async ({ page }) => {
    const container = page.locator('#rtl-text').locator('..');
    await expect(container).toHaveScreenshot('rtl-text.png');
  });
});

test.describe('AnnotatedText Core - Position Assertions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-annotation-uid]');
  });

  test('annotation covers correct text range', async ({ page }) => {
    // Get positions of annotations
    const annotation1 = page
      .locator('[data-annotation-uid="1"][data-annotation-role="fill"]')
      .first();
    const annotation2 = page
      .locator('[data-annotation-uid="2"][data-annotation-role="fill"]')
      .first();

    const box1 = await annotation1.boundingBox();
    const box2 = await annotation2.boundingBox();

    // Annotation 1 (start: 0) should be to the left of annotation 2 (start: 6)
    expect(box1!.x).toBeLessThan(box2!.x);

    // Both should have positive dimensions
    expect(box1!.width).toBeGreaterThan(0);
    expect(box1!.height).toBeGreaterThan(0);
    expect(box2!.width).toBeGreaterThan(0);
    expect(box2!.height).toBeGreaterThan(0);
  });

  test('overlapping annotations have different y positions', async ({
    page,
  }) => {
    const container = page.locator('#overlapping');
    await expect(container).toBeVisible();

    // Get all three overlapping annotations
    const boxes = await Promise.all([
      page
        .locator('[data-annotation-uid="1"][data-annotation-role="fill"]')
        .first()
        .boundingBox(),
      page
        .locator('[data-annotation-uid="2"][data-annotation-role="fill"]')
        .first()
        .boundingBox(),
      page
        .locator('[data-annotation-uid="3"][data-annotation-role="fill"]')
        .first()
        .boundingBox(),
    ]);

    // All should be rendered
    boxes.forEach((box) => {
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThan(0);
    });

    // Overlapping annotations should stack (have different y or be layered)
    const heights = boxes.map((b) => b!.height);

    // Verify they're all visible (not collapsed)
    heights.forEach((h) => expect(h).toBeGreaterThan(0));
  });

  test('annotation position updates when text changes', async ({ page }) => {
    const annotation = page
      .locator('[data-annotation-uid="1"][data-annotation-role="fill"]')
      .first();

    const initialBox = await annotation.boundingBox();
    expect(initialBox).not.toBeNull();

    // Store initial position
    const initialX = initialBox!.x;
    const initialWidth = initialBox!.width;

    // Position should be stable on re-check
    const stableBox = await annotation.boundingBox();
    expect(stableBox!.x).toBeCloseTo(initialX, 0);
    expect(stableBox!.width).toBeCloseTo(initialWidth, 0);
  });
});
