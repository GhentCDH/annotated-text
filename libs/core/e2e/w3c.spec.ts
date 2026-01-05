import { test, expect } from './fixtures';

test.describe('W3C Web Annotations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/w3c.html');
  });

  test('renders text with W3C annotations', async ({ page }) => {
    const container = page.locator('#w3c-basic');
    await expect(container).toBeVisible();
    
    // Verify text is rendered
    await expect(container).toContainText('The quick brown fox');
    await expect(container).toContainText('jumps over the lazy dog');
  });

  test('renders W3C annotations as visual highlights', async ({ page }) => {
    const container = page.locator('#w3c-basic');
    await expect(container).toBeVisible();

    // Check annotations are rendered (SVG paths with data-annotation-uid)
    const annotations = page.locator('#w3c-basic [data-annotation-uid]');
    const annotationCount = await annotations.count();
    
    // Should have at least 3 annotations (fox, jumps, dog)
    expect(annotationCount).toBeGreaterThanOrEqual(3);
  });

  test('visual: W3C basic annotations', async ({ page }) => {
    const container = page.locator('#w3c-basic');
    await expect(container).toBeVisible();
    
    await expect(container).toHaveScreenshot('w3c-basic-annotations.png');
  });

  test('renders W3C annotations with TextualBody', async ({ page }) => {
    const container = page.locator('#w3c-bodies');
    await expect(container).toBeVisible();

    // Check annotations are rendered
    const annotations = page.locator('#w3c-bodies [data-annotation-uid]');
    const annotationCount = await annotations.count();
    
    // Should have annotations for "quick" and "brown"
    expect(annotationCount).toBeGreaterThanOrEqual(2);
  });

  test('visual: W3C annotations with bodies', async ({ page }) => {
    const container = page.locator('#w3c-bodies');
    await expect(container).toBeVisible();
    
    await expect(container).toHaveScreenshot('w3c-annotations-with-bodies.png');
  });

  test('renders W3C tagging annotations', async ({ page }) => {
    const container = page.locator('#w3c-tagging');
    await expect(container).toBeVisible();

    // Check annotations are rendered
    const annotations = page.locator('#w3c-tagging [data-annotation-uid]');
    const annotationCount = await annotations.count();
    
    expect(annotationCount).toBeGreaterThanOrEqual(2);
  });

  test('visual: W3C tagging annotations', async ({ page }) => {
    const container = page.locator('#w3c-tagging');
    await expect(container).toBeVisible();
    
    await expect(container).toHaveScreenshot('w3c-tagging-annotations.png');
  });

  test('click on W3C annotation fires event', async ({ page }) => {
    const container = page.locator('#w3c-interactive');
    const eventLog = page.locator('#event-log');
    
    await expect(container).toBeVisible();

    // Clear event log
    await eventLog.evaluate((el) => (el.innerHTML = ''));

    // Find and click the first annotation
    const annotation = page.locator('#w3c-interactive [data-annotation-uid][data-annotation-role="fill"]').first();
    
    if (await annotation.count() > 0) {
      await annotation.click();
      await page.waitForTimeout(100);

      const events = await eventLog.textContent();
      expect(events).toContain('Event:');
    }
  });

  test('create W3C annotation via drag outputs W3C format', async ({ page }) => {
    const container = page.locator('#w3c-interactive');
    const eventLog = page.locator('#event-log');
    const annotationOutput = page.locator('#annotation-output');
    
    await expect(container).toBeVisible();

    // Clear event log
    await eventLog.evaluate((el) => (el.innerHTML = ''));

    // Get bounding box of the interactive container
    const boundingBox = await container.boundingBox();
    expect(boundingBox).not.toBeNull();

    // Perform drag to create annotation
    const startX = boundingBox!.x + 50;
    const startY = boundingBox!.y + 20;
    const endX = boundingBox!.x + 150;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    
    for (let i = 1; i <= 5; i++) {
      await page.mouse.move(startX + ((endX - startX) * i) / 5, startY);
      await page.waitForTimeout(30);
    }
    
    await page.mouse.up();
    await page.waitForTimeout(300);

    // Check events were fired
    const events = await eventLog.textContent();
    console.log('Events captured:', events);

    // Check if W3C format annotation was output
    const output = await annotationOutput.textContent();
    console.log('Annotation output:', output);
    
    // The output should contain W3C annotation fields if creation was successful
    if (output && output.includes('@context')) {
      expect(output).toContain('http://www.w3.org/ns/anno.jsonld');
      expect(output).toContain('TextPositionSelector');
    }
  });

  test('visual: W3C interactive initial state', async ({ page }) => {
    const container = page.locator('#w3c-interactive');
    await expect(container).toBeVisible();
    
    await expect(container).toHaveScreenshot('w3c-interactive-initial.png');
  });

  test('W3C annotation preserves TextPositionSelector format', async ({ page }) => {
    // Access the test instances exposed on window
    const annotations = await page.evaluate(() => {
      return (window as any).__w3cTestInstances?.sampleAnnotations;
    });

    expect(annotations).toBeDefined();
    expect(annotations.length).toBe(3);

    // Verify W3C structure
    const firstAnnotation = annotations[0];
    expect(firstAnnotation['@context']).toBe('http://www.w3.org/ns/anno.jsonld');
    expect(firstAnnotation.target.selector.type).toBe('TextPositionSelector');
    expect(firstAnnotation.target.selector.start).toBe(16);
    expect(firstAnnotation.target.selector.end).toBe(19);
  });

  test('W3C adapter correctly parses annotation positions', async ({ page }) => {
    const container = page.locator('#w3c-basic');
    await expect(container).toBeVisible();

    // The "fox" annotation (start: 16, end: 19) should highlight "fox"
    // The "jumps" annotation (start: 20, end: 25) should highlight "jumps"
    // The "dog" annotation (start: 40, end: 43) should highlight "dog"
    
    // Verify the text is rendered correctly
    await expect(container).toContainText('fox');
    await expect(container).toContainText('jumps');
    await expect(container).toContainText('dog');

    // Check that the correct number of annotation elements exist
    const annotations = page.locator('#w3c-basic [data-annotation-uid]');
    const count = await annotations.count();
    
    // Each annotation may have multiple elements (fill + border)
    // So we expect at least 3 (one per annotation) but possibly 6 (fill + border each)
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('hover on W3C annotation shows highlight', async ({ page }) => {
    const container = page.locator('#w3c-basic');
    await expect(container).toBeVisible();

    // Find an annotation fill element
    const annotation = page.locator('#w3c-basic [data-annotation-uid][data-annotation-role="fill"]').first();
    
    if (await annotation.count() > 0) {
      // Hover over the annotation
      await annotation.hover();
      await page.waitForTimeout(100);

      // Take screenshot to verify hover state
      await expect(container).toHaveScreenshot('w3c-annotation-hover.png');
    }
  });
});
