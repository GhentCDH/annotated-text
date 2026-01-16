import { greekIds } from './testIds';
import { test, testVisualIds } from '../_utils/fixtures';

test.describe('AnnotatedText Core - Text styles', () => {
  test.describe('Greek', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/text-style/greek.html');
    });

    testVisualIds('Greek', greekIds);
  });
});
