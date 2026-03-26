import { renderMarkdownIds } from './testIds';
import { test, testVisualIds } from '../_utils/fixtures';
import { findAnnotatedTextContainer } from '../_utils/annotation';
import { tableTest } from '../_utils/parse-table';

const positionScreen = {
  startX: 170,
  startY: 310,
  endX: 205,
  endY: 340,
};

test.describe('AnnotatedText Core - Markdown ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/render/markdown.html');
  });

  testVisualIds('markdown', renderMarkdownIds);

  test('Create', async ({ page }) => {
    const id = renderMarkdownIds.highlight_wordsnapper;
    const container = findAnnotatedTextContainer(page, id);

    await container.scrollTo();
    await container.toBeVisible();

    const mouseMove = container.mouse;
    const y = 250;

    await mouseMove.onMouseDown({ x: 33, y });
    await container.expect.toHaveLog('annotation-create--start: 209-210');

    await mouseMove.onMouseDrag({ x: 80, y });
    await container.expect.toHaveLog('annotation-create--move: 209-216');

    await mouseMove.onMouseEnd();
    await container.expect.toHaveLog('annotation-create--end: 209-216');

    await container.expect.toHaveScreenshot('create.png');
  });
  test.describe('Move', () => {
    const id = renderMarkdownIds.highlight_wordsnapper;
    const { startX, startY, endX, endY } = positionScreen;
    tableTest<'description' | 'startX' | 'startY' | 'endX' | 'endY' | 'steps'>`
         startX     | startY    | endX           | endY      | steps | description
          ${startX} | ${startY} | ${0}           | ${0}      | ${10} | ${'Start of annotation - move to top left'}
          ${startX} | ${startY} | ${startX - 30} | ${startY} | ${1}  | ${'Start of annotation - move left'}
          ${startX} | ${startY} | ${startX + 30} | ${startY} | ${1}  | ${'Start of annotation - move right'}
          ${startX} | ${startY} | ${endX + 30}   | ${startY} | ${1}  | ${'Start of annotation - move over end'}
          ${startX} | ${startY} | ${endX}        | ${startY} | ${1}  | ${'Start of annotation - move to end'}
          ${endX}   | ${endY}   | ${endX + 30}   | ${endY}   | ${1}  | ${'End of annotation - move right'}
          ${endX}   | ${endY}   | ${endX - 30}   | ${endY}   | ${1}  | ${'End of annotation - move left'}
          ${endX}   | ${endY}   | ${startX - 30} | ${startY}   | ${1}  | ${'End of annotation - move over start'}
          ${endX}   | ${endY}   | ${startX + 30}      | ${startY}   | ${1}  | ${'End of annotation - move to start'}
          ${endX}   | ${endY}   | ${400}         | ${400}    | ${20} | ${'End of annotation - move to bottom right'}
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

        await container.expect.toHaveScreenshot(`move-${description}.png`);
      },
    );
  });

  test.describe('Edit', () => {
    const id = renderMarkdownIds.highlight_wordsnapper;
    const { startX, startY, endX, endY } = positionScreen;

    tableTest<'description' | 'startX' | 'startY' | 'endX' | 'endY' | 'steps'>`
         startX     | startY    | endX           | endY      | steps | description
          ${startX} | ${startY} | ${0}           | ${0}      | ${10} | ${'Start of annotation - move to top left'}
          ${startX} | ${startY} | ${startX - 30} | ${startY} | ${1}  | ${'Start of annotation - move left'}
          ${startX} | ${startY} | ${startX + 30} | ${startY} | ${1}  | ${'Start of annotation - move right'}
          ${startX} | ${startY} | ${endX + 30}   | ${endY} | ${1}  | ${'Start of annotation - move over end'}
          ${startX} | ${startY} | ${endX}        | ${endY} | ${1}  | ${'Start of annotation - move to end'}
          ${endX}   | ${endY}   | ${endX + 30}   | ${endY}   | ${1}  | ${'End of annotation - move right'}
          ${endX}   | ${endY}   | ${endX - 30}   | ${endY}   | ${1}  | ${'End of annotation - move left'}
          ${endX}   | ${endY}   | ${startX - 30} | ${startY}   | ${1}  | ${'End of annotation - move over start'}
          ${endX}   | ${endY}   | ${startX}      | ${startY}   | ${1}  | ${'End of annotation - move to start'}
          ${endX}   | ${endY}   | ${250}         | ${500}    | ${20} | ${'End of annotation - move to bottom right'}
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
