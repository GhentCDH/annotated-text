import { lineHeightIds } from './testIds';
import { expect, test, testVisualIds } from '../fixtures';

test.describe('AnnotatedText Core - Line height Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/visual/line-height.html');
  });

  test('visual', async ({ page }) => {
    const container = page.locator('#demo-container');
    await expect(container).toBeVisible();

    await expect(container).toHaveScreenshot('line-height.png');
  });

  testVisualIds('Line heights', lineHeightIds);
});
