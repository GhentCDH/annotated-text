import { SnapperIds } from './testIds';
import { test } from '../_utils/fixtures';
import { tableTest } from '../_utils/parse-table';
import { DemoShortText } from '../_demo/data-short';
import { findAnnotatedTextContainer } from '../_utils/annotation';

const firstAnnotation = DemoShortText.annotations[0];

test.describe('AnnotatedText Core - Snapper interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/interaction/snapper.html');
  });

  test.describe('Move', () => {
    const id = SnapperIds.wordSnapper;
    const { startX, startY, endX, endY } = firstAnnotation.positionScreen;
    tableTest<'description' | 'startX' | 'startY' | 'endX' | 'endY' | 'steps'>`
         startX     | startY    | endX           | endY      | steps | description
          ${startX} | ${startY} | ${0}           | ${0}      | ${10} | ${'Start of annotation - move to top left'}
          ${startX} | ${startY} | ${startX - 20} | ${startY} | ${1}  | ${'Start of annotation - move left'}
          ${startX} | ${startY} | ${startX + 20} | ${startY} | ${1}  | ${'Start of annotation - move right'}
          ${startX} | ${startY} | ${endX + 20}   | ${startY} | ${1}  | ${'Start of annotation - move over end'}
          ${startX} | ${startY} | ${endX}        | ${startY} | ${1}  | ${'Start of annotation - move to end'}
          ${endX}   | ${endY}   | ${endX + 20}   | ${endY}   | ${1}  | ${'End of annotation - move right'}
          ${endX}   | ${endY}   | ${endX - 20}   | ${endY}   | ${1}  | ${'End of annotation - move left'}
          ${endX}   | ${endY}   | ${startX - 20} | ${endY}   | ${1}  | ${'End of annotation - move over start'}
          ${endX}   | ${endY}   | ${startX}      | ${endY}   | ${1}  | ${'End of annotation - move to start'}
          ${endX}   | ${endY}   | ${250}         | ${100}    | ${20} | ${'End of annotation - move to bottom right'}
      `(
      '$description',
      async ({ page }, { description, startX, startY, endX, endY, steps }) => {
        const container = findAnnotatedTextContainer(page, id);

        await container.scrollTo();
        await container.toBeVisible();

        const mouseMove = container.mouse;

        await mouseMove.onMouseDown({ x: startX + 30, y: startY });
        await mouseMove.onMouseDrag({ x: endX, y: endY }, steps);
        await mouseMove.onMouseEnd();

        // Move out of annotation
        await mouseMove.onMouseMoveTo({ x: 0, y: 0 });

        await container.expect.toHaveScreenshot(`edit-${description}.png`);
      },
    );
  });
  test('Create', async ({ page }) => {
    const id = SnapperIds.wordSnapper;
    const container = findAnnotatedTextContainer(page, id);

    await container.scrollTo();
    await container.toBeVisible();

    const mouseMove = container.mouse;
    const y = 50;

    await mouseMove.onMouseDown({ x: 30, y });
    await container.expect.toHaveLog('annotation-create--start: 35-39');

    await mouseMove.onMouseDrag({ x: 80, y });
    await container.expect.toHaveLog('annotation-create--move: 35-43');

    await mouseMove.onMouseEnd();
    await container.expect.toHaveLog('annotation-create--end: 35-43');

    await container.expect.toHaveScreenshot('create.png');
  });
  test.describe('Edit', () => {
    const id = SnapperIds.wordSnapper;
    const { startX, startY, endX, endY } = firstAnnotation.positionScreen;

    tableTest<'description' | 'startX' | 'startY' | 'endX' | 'endY' | 'steps'>`
         startX     | startY    | endX           | endY      | steps | description
          ${startX} | ${startY} | ${0}           | ${0}      | ${10} | ${'Start of annotation - move to top left'}
          ${startX} | ${startY} | ${startX - 20} | ${startY} | ${1}  | ${'Start of annotation - move left'}
          ${startX} | ${startY} | ${startX + 20} | ${startY} | ${1}  | ${'Start of annotation - move right'}
          ${startX} | ${startY} | ${endX + 20}   | ${startY} | ${1}  | ${'Start of annotation - move over end'}
          ${startX} | ${startY} | ${endX}        | ${startY} | ${1}  | ${'Start of annotation - move to end'}
          ${endX}   | ${endY}   | ${endX + 20}   | ${endY}   | ${1}  | ${'End of annotation - move right'}
          ${endX}   | ${endY}   | ${endX - 20}   | ${endY}   | ${1}  | ${'End of annotation - move left'}
          ${endX}   | ${endY}   | ${startX - 20} | ${endY}   | ${1}  | ${'End of annotation - move over start'}
          ${endX}   | ${endY}   | ${startX}      | ${endY}   | ${1}  | ${'End of annotation - move to start'}
          ${endX}   | ${endY}   | ${250}         | ${100}    | ${20} | ${'End of annotation - move to bottom right'}
      `(
      '$description',
      async ({ page }, { description, startX, startY, endX, endY, steps }) => {
        const container = findAnnotatedTextContainer(page, id);

        await container.scrollTo();
        await container.toBeVisible();

        const mouseMove = container.mouse;

        await mouseMove.onMouseDown({ x: startX, y: startY });
        await mouseMove.onMouseDrag({ x: endX, y: endY }, steps);
        await mouseMove.onMouseEnd();

        // Move out of annotation
        await mouseMove.onMouseMoveTo({ x: 0, y: 0 });

        await container.expect.toHaveScreenshot(`edit-${description}.png`);
      },
    );
  });
});
