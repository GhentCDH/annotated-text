import { expect, test } from '../fixtures';

test.describe('AnnotatedText Core - Limit annotation to show', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/limit/index.html');
  });

  test('visual', async ({ page }) => {
    const container = page.locator('#demo-container');
    await expect(container).toBeVisible();

    await expect(container).toHaveScreenshot('line-height.png');
  });
});
