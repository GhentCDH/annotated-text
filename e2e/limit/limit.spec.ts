import { limitIds } from './testIds';
import { test, testVisualIds } from '../_utils/fixtures';

test.describe('AnnotatedText Core - Limit annotation to show', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/limit/limit.html');
  });

  testVisualIds('limit', limitIds);
});
