import { expect, test } from '@playwright/test';

test.describe('Annotation Creation Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/interactive.html');
    await page.waitForSelector('#interactive');
  });

  test('complete annotation creation workflow with event tracking', async ({
    page,
  }) => {
    const container = page.locator('#interactive');
    const eventLog = page.locator('#event-log');

    await expect(container).toBeVisible();

    // Clear any existing events
    await eventLog.evaluate((el) => (el.innerHTML = ''));

    const boundingBox = await container.boundingBox();
    expect(boundingBox).not.toBeNull();

    // Calculate positions within the text area
    const startX = boundingBox!.x + 30;
    const startY = boundingBox!.y + 10;
    const endX = boundingBox!.x + 200;
    const endY = startY;

    // ============================================
    // Step 1: Click on position (mousedown)
    // ============================================
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 20, startY);

    // Wait for annotation-create--start event
    await page.waitForTimeout(100);

    // Verify start event was fired
    let events = await eventLog.textContent();
    expect(events).toContain('annotation-create--start');

    // ============================================
    // Step 2 & 3: Move and track events
    // ============================================
    const moveSteps = 5;
    for (let i = 1; i <= moveSteps; i++) {
      const currentX = startX + ((endX - startX) * i) / moveSteps;
      await page.mouse.move(currentX, endY);
      await page.waitForTimeout(50);
    }

    // Verify move events were fired
    events = await eventLog.textContent();
    expect(events).toContain('annotation-create--move');

    // ============================================
    // Step 4: Visual partial selection screenshot
    // ============================================
    await expect(container).toHaveScreenshot(
      'annotation-creation-in-progress.png',
    );

    // ============================================
    // Step 5: End click (mouseup)
    // ============================================
    await page.mouse.up();
    await page.waitForTimeout(100);

    // Verify end event was fired
    events = await eventLog.textContent();
    expect(events).toContain('annotation-create--end');

    // ============================================
    // Step 6: Final selection screenshot
    // ============================================
    await expect(container).toHaveScreenshot(
      'annotation-creation-complete.png',
    );

    // Log all captured events for debugging
    console.log('Captured events:', events);
  });
});
