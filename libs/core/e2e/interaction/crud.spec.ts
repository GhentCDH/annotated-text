import { expect } from '@playwright/test';
import { crudIds } from './testIds';
import { test } from '../fixtures';
import { tableTest, tableTestDescribe } from '../_utils/parse-table';
import { DemoShortText } from '../_demo/data-short';
import { getLog } from '../_utils/log';
import { findAnnotatedTextContainer } from '../_utils/annotation';

const firstAnnotation = DemoShortText.annotations[0];

test.describe('AnnotatedText Core - CRUD interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/interaction/crud.html');
  });

  tableTestDescribe<'id' | 'canEdit' | 'canCreate'>`
          id                        | canCreate | canEdit 
          ${crudIds.default}        | ${false}  | ${false}
          ${crudIds.create}         | ${true}   | ${false}
          ${crudIds.edit}           | ${false}  | ${true}
          ${crudIds['create-edit']} | ${true}   | ${true}
               `('Test functionality: $id', ({ id, canEdit, canCreate }) => {
    test(`Create: ${canCreate}`, async ({ page }) => {
      const container = findAnnotatedTextContainer(page, id);

      await container.scrollTo();
      await container.toBeVisible();

      const mouseMove = container.mouse;
      const y = 50;

      await mouseMove.onMouseDown({ x: 30, y });
      await getLog(page, id).expect(
        canCreate ? 'annotation-create--start: 37-36' : '',
      );

      await mouseMove.onMouseDrag({ x: 80, y });
      await getLog(page, id).expect(
        canCreate ? 'annotation-create--move: 36-43' : '',
      );

      await mouseMove.onMouseEnd();
      await getLog(page, id).expect(
        canCreate ? 'annotation-create--end: 36-43' : '',
      );

      await container.expect.toHaveScreenshot('create.png');
    });
    test(`Edit: ${canEdit}`, async ({ page }) => {
      const container = findAnnotatedTextContainer(page, id);

      await container.scrollTo();
      await container.toBeVisible();

      const mouseMove = container.mouse;
      const x = firstAnnotation.positionScreen.startX;
      const y = firstAnnotation.positionScreen.startY;

      await mouseMove.onMouseDown({ x, y });
      await getLog(page, id).expect(
        canEdit ? 'annotation-edit--start: 4-9' : '',
      );

      await mouseMove.onMouseDrag({ x: x - 20, y });
      await getLog(page, id).expect(
        canEdit ? 'annotation-edit--move: 1-9' : '',
      );

      await mouseMove.onMouseEnd();
      await getLog(page, id).expect(canEdit ? 'annotation-edit--end: 1-9' : '');

      await container.expect.toHaveScreenshot('edit.png');
    });
  });

  test.describe('Edit', () => {
    const id = crudIds.edit;
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

  test.describe('Delete', () => {
    const id = crudIds.actions;
    const annotationId = firstAnnotation.id;
    const deleteId = `${id}-delete-${annotationId}`;
    const annotations = DemoShortText.annotations;
    const annotationIds = annotations.map((a) => a.id);

    test('it should rerender without the deleted annotation', async ({
      page,
    }) => {
      const container = findAnnotatedTextContainer(page, id);

      await container.expect.toHaveScreenshot(
        `delete-${annotationId}--start.png`,
      );
      await container.scrollTo();
      await container.toBeVisible();

      await container.expect.annotationsVisible(...annotationIds);

      const button = page.locator(`#${deleteId}`);
      await expect(button).toBeVisible();

      button.click();
      await page.waitForTimeout(100);

      await container.expect.annotationsVisible(
        ...annotationIds.filter((id) => id !== annotationId),
      );

      await container.expect.annotationsNotVisible(annotationId);
      await container.expect.toHaveScreenshot(
        `delete-${annotationId}--done.png`,
      );
    });
  });

  test.describe('with tags', () => {
    const id = crudIds['create-edit-tags'];
    const { startX, startY, endX, endY } = firstAnnotation.positionScreen;
    tableTest<'description' | 'startX' | 'startY' | 'endX' | 'endY' | 'steps'>`
         startX     | startY    | endX           | endY      | description
          ${startX} | ${startY} | ${startX - 20} | ${startY}  | ${'Edit existing annotation'}
          ${40}|${90}|${80}|${90}|${'Create new annotation'}
    `(
      '$description',
      async ({ page }, { description, startX, startY, endX, endY, steps }) => {
        const container = findAnnotatedTextContainer(page, id);

        await container.scrollTo();
        await container.toBeVisible();

        const mouseMove = container.mouse;

        await mouseMove.onMouseDown({ x: startX, y: startY });
        await container.expect.toHaveScreenshot(`tag-start-${description}`);

        await mouseMove.onMouseDrag({ x: endX, y: endY });
        // During drag the tag should dissapear
        await container.expect.toHaveScreenshot(`tag-move-${description}.png`);

        await mouseMove.onMouseEnd();
        // When released the tag should reappear
        await container.expect.toHaveScreenshot(`tag-end-${description}.png`);

        // Move out of annotation
        await mouseMove.onMouseMoveTo({ x: 0, y: 0 });
      },
    );
  });
});
