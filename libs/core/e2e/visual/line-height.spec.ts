import { lineHeightIds } from './testIds';
import { test, testVisualIds } from '../fixtures';

test.describe('AnnotatedText Core - Line height Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/visual/line-height.html');
  });

  testVisualIds('Line heights', lineHeightIds);
});
