import { limitIds } from './testIds';
import { expect, test, testVisualIds } from '../fixtures';

test.describe('AnnotatedText Core - Limit annotation to show', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/limit/limit.html');
  });

  test('visual', async ({ page }) => {
    const container = page.locator('#demo-container');
    await expect(container).toBeVisible();

    await expect(container).toHaveScreenshot('limit.png');
  });

  testVisualIds('limit', limitIds);
});
