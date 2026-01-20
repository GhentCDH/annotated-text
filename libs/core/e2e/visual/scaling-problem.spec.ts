import { expect } from '@playwright/test';
import { renderProblemIds } from './testIds';
import { test } from '../_utils/fixtures';
import { MouseMove } from '../_utils/mouse';
import { tableTest } from '../_utils/parse-table';

test.describe('AnnotatedText Core - Scaling problem', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/visual/scaling-problem.html');
  });

  // Select the word "second"
  tableTest<'id' | 'startX' | 'startY' | 'endX' | 'endY'>`
          id                            | startX | startY | endX | endY
          ${renderProblemIds.default}   | 50     | 75     | 100   | 75
          ${renderProblemIds.scaled_1_5}| 100    | 175    | 190   | 175
          ${renderProblemIds.scaled_0_75}| 40     | 65    | 75    | 65
        `(
    'CREATE: $id',
    async ({ page }, { id, startX, startY, endX, endY }) => {
      const container = page.locator(`#${id}`);
      await expect(container).toBeVisible();

      const mouse = new MouseMove(page, container);

      // Step 1: Click on position (mousedown)
      await mouse.onMouseDown({ x: startX, y: startY });
      await expect(container).toHaveScreenshot(
        `${id}-annotation-creation-started.png`,
      );

      // Step2: Select the word "second"
      await mouse.onMouseDrag({ x: endX, y: endY });
      await expect(container).toHaveScreenshot(
        `${id}-annotation-creation-in-progress.png`,
      );

      // Step 3: End click (mouseup)
      await mouse.onMouseEnd();
      await expect(container).toHaveScreenshot(
        `${id}-annotation-creation-complete.png`,
      );
    },
  );

  // Edit fox to Fox Jumps
  tableTest<'id' | 'startX' | 'startY' | 'endX' | 'endY'>`
          id                              | startX | startY | endX | endY
          ${renderProblemIds.default}     | 165     | 15     | 210   | 15
          ${renderProblemIds.scaled_1_5}  | 330     | 20     | 420   | 20
          ${renderProblemIds.scaled_0_75} | 125     | 10     | 160   | 15
        `('EDIT: $id', async ({ page }, { id, startX, startY, endX, endY }) => {
    const container = page.locator(`#${id}`);
    await expect(container).toBeVisible();

    const mouse = new MouseMove(page, container);

    // Step 1: Click on position (mousedown)
    // appears in hover color
    await mouse.onMouseDown({ x: startX, y: startY });
    await expect(container).toHaveScreenshot(
      `${id}-annotation-edit-started.png`,
    );

    // Step2: Change selection to Fox Jumps
    // See the original one and edited one
    await mouse.onMouseDrag({ x: endX, y: endY });
    await expect(container).toHaveScreenshot(
      `${id}-annotation-edit-in-progress.png`,
    );

    // Step 3: End click (mouseup)
    await mouse.onMouseEnd();
    // dummy annotation is removed
    await expect(container).toHaveScreenshot(
      `${id}-annotation-edit-complete.png`,
    );
  });

  // Move brown selection to second line select "secon" - same length different word
  tableTest<'id' | 'startX' | 'startY' | 'endX' | 'endY'>`
          id                            | startX | startY | endX | endY
          ${renderProblemIds.default}   | 100     | 15    | 55 | 75
          ${renderProblemIds.scaled_1_5}   | 250     | 15  | 155 | 175
          ${renderProblemIds.scaled_0_75}   | 80     | 10    | 40 | 60
        `('MOVE: $id', async ({ page }, { id, startX, startY, endY, endX }) => {
    const container = page.locator(`#${id}`);
    await expect(container).toBeVisible();

    const mouse = new MouseMove(page, container);

    // Step 1: Click on position (mousedown)
    // appears in hover color
    await mouse.onMouseDown({ x: startX, y: startY });
    await expect(container).toHaveScreenshot(
      `${id}-annotation-move-started.png`,
    );

    // Step2: Change selection to Fox Jumps
    // See the original one and edited one
    await mouse.onMouseDrag({ x: endX, y: endY });
    await expect(container).toHaveScreenshot(
      `${id}-annotation-move-in-progress.png`,
    );

    // Step 3: End click (mouseup)
    await mouse.onMouseEnd();
    // dummy annotation is removed
    await expect(container).toHaveScreenshot(
      `${id}-annotation-move-complete.png`,
    );
  });

  // Hover over brown
  tableTest<'id' | 'startX' | 'startY'>`
          id                            | startX | startY  | 200   | 15
          ${renderProblemIds.default}   | 100     | 15    
          ${renderProblemIds.scaled_1_5}   | 250     | 15  
          ${renderProblemIds.scaled_0_75}   | 90     | 10    
        `('HOVER: $id', async ({ page }, { id, startX, startY }) => {
    const container = page.locator(`#${id}`);
    await expect(container).toBeVisible();

    const mouse = new MouseMove(page, container);

    // Step 1: Hover over brown
    await mouse.onMouseMoveTo({ x: startX, y: startY });
    await expect(container).toHaveScreenshot(`${id}-annotation-hover.png`);

    // Step 2: Hover to corner
    await mouse.onMouseMoveTo({ x: 0, y: 0 });
    await expect(container).toHaveScreenshot(`${id}-annotation-hover-out.png`);
  });
});
