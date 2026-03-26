import { gutterHeightIds } from './testIds';
import { test, testVisualIds } from '../_utils/fixtures';

test.describe('AnnotatedText Core - Line height Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/visual/gutter-height.html');
  });

  testVisualIds('Gutter heights', gutterHeightIds);
});
