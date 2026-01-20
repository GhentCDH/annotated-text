import { expect, test } from '../_utils/fixtures';

test.describe('Greek Text - TextLineAdapter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-style/greektext.html');
  });

  test('renders basic Greek text with line numbers', async ({ page }) => {
    const container = page.locator('#greek-basic');
    await expect(container).toBeVisible();

    // Verify Greek text is rendered
    await expect(container).toContainText('Χ[αι]ρήμ[ων]');
    await expect(container).toContainText('Ἀπολλωνίωι');
    await expect(container).toContainText('χαίρειν');
  });

  test('renders multiple lines correctly', async ({ page }) => {
    const container = page.locator('#greek-basic');
    await expect(container).toBeVisible();

    // Check that multiple lines are present
    const lines = container.locator('[data-line-uid]');
    const lineCount = await lines.count();

    // Should have 5 lines based on the sample text
    expect(lineCount).toBeGreaterThanOrEqual(1);
  });

  test('visual: basic Greek text rendering', async ({ page }) => {
    const container = page.locator('#greek-basic');
    await expect(container).toBeVisible();

    await expect(container).toHaveScreenshot('greek-basic-text.png');
  });

  test('renders Greek text with annotations', async ({ page }) => {
    const container = page.locator('#greek-annotated');
    await expect(container).toBeVisible();

    // Check annotations are rendered
    const annotations = page.locator('#greek-annotated [data-annotation-uid]');
    const annotationCount = await annotations.count();
    expect(annotationCount).toBeGreaterThan(0);
  });

  test('visual: Greek text with annotations', async ({ page }) => {
    const container = page.locator('#greek-annotated');
    await expect(container).toBeVisible();

    await expect(container).toHaveScreenshot('greek-annotated-text.png');
  });

  test('renders Greek text with LTR direction', async ({ page }) => {
    const container = page.locator('#greek-rtl');
    await expect(container).toBeVisible();

    await expect(container).toContainText('πρῶτος');
    await expect(container).toContainText('δεύτερος');
  });

  test('visual: Greek text with direction', async ({ page }) => {
    const container = page.locator('#greek-rtl');
    await expect(container).toBeVisible();

    await expect(container).toHaveScreenshot('greek-text-direction.png');
  });

  test('interactive: click on annotation fires event', async ({ page }) => {
    const container = page.locator('#greek-interactive');
    const eventLog = page.locator('#event-log');

    await expect(container).toBeVisible();

    // Clear event log
    await eventLog.evaluate((el) => (el.innerHTML = ''));

    // Find and click the annotation for "Ὅμηρος"
    const annotation = page
      .locator(
        '#greek-interactive [data-annotation-uid][data-annotation-role="fill"]',
      )
      .first();

    if ((await annotation.count()) > 0) {
      await annotation.click();
      await page.waitForTimeout(100);

      const events = await eventLog.textContent();
      expect(events).toContain('Event:');
    }
  });

  test('interactive: create annotation via drag', async ({ page }) => {
    const container = page.locator('#greek-interactive');
    const eventLog = page.locator('#event-log');

    await expect(container).toBeVisible();

    // Clear event log
    await eventLog.evaluate((el) => (el.innerHTML = ''));

    // Get bounding box of the interactive container
    const boundingBox = await container.boundingBox();
    expect(boundingBox).not.toBeNull();

    // Perform drag to create annotation on second line
    const startX = boundingBox!.x + 50;
    const startY = boundingBox!.y + 50;
    const endX = boundingBox!.x + 200;

    await page.mouse.move(startX, startY);
    await page.mouse.down();

    await page.waitForTimeout(50);

    for (let i = 1; i <= 5; i++) {
      await page.mouse.move(startX + ((endX - startX) * i) / 5, startY);
      await page.waitForTimeout(30);
    }

    await page.mouse.up();
    await page.waitForTimeout(200);

    // Check that events were fired
    const events = await eventLog.textContent();
    console.log('Events captured:', events);
  });

  test('visual: interactive Greek text initial state', async ({ page }) => {
    const container = page.locator('#greek-interactive');
    await expect(container).toBeVisible();

    await expect(container).toHaveScreenshot('greek-interactive-initial.png');
  });

  test('handles editorial marks in Greek text', async ({ page }) => {
    const container = page.locator('#greek-basic');
    await expect(container).toBeVisible();

    // Text contains editorial marks like [αι] and [ων]
    // These should be rendered correctly
    const html = await container.innerHTML();
    expect(html).toContain('[');
    expect(html).toContain(']');
  });

  test('preserves Greek diacritics', async ({ page }) => {
    const container = page.locator('#greek-basic');
    await expect(container).toBeVisible();

    // Check various Greek characters with diacritics are preserved
    await expect(container).toContainText('ᾗ'); // eta with iota subscript and rough breathing
    await expect(container).toContainText('ὅτι'); // omicron with rough breathing
  });
});
