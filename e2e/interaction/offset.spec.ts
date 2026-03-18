import { crudIds } from './testIds';
import { test } from '../_utils/fixtures';
import { tableTest } from '../_utils/parse-table';
import { DemoShortText } from '../_demo/data-short';
import { findAnnotatedTextContainer } from '../_utils/annotation';

const firstAnnotation = DemoShortText.annotations[0];

test.describe('AnnotatedText Core - Offset', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/interaction/crud.html');
  });

  // tableTestDescribe<
  //   'id' | 'newStart' | 'newEnd' | 'description' | 'startX' | 'startY' | 'newX'
  // >`
  //         id                        | newStart | newEnd | startX             | newX           | description
  //         ${crudIds['offset-1']}    | ${8}     | ${9}   | ${startX - 7}   | ${startX + 20} | ${'Start - move right'}
  //         ${crudIds['offset-1']}    | ${2}     | ${9}   | ${startX - 7}   | ${startX - 20} | ${'Start - move left'}
  //         ${crudIds['offset-1']}    | ${4}     | ${7}   | ${endX - 7}      | ${endX - 20}   | ${'end - move left'}
  //         ${crudIds['offset-1']}    | ${4}     | ${13}   | ${endX - 7}   | ${endY}   | ${endX + 20}   | ${'end - move right'}
  //         ${crudIds['offset-0']}    | ${7}     | ${9}   | ${startX}      | ${startY} | ${startX + 20} | ${'Start - move right'}
  //         ${crudIds['offset-0']}    | ${1}     | ${9}   | ${startX} | ${startY} | ${startX - 20} | ${'Start - move left'}
  //         ${crudIds['offset-0']}    | ${4}     | ${6}   | ${endX}   | ${endY}   | ${endX - 20}   | ${'end - move left'}
  //         ${crudIds['offset-0']}    | ${4}     | ${12}   | ${endX}   | ${endY}   | ${endX + 20}   | ${'end - move right'}
  //              `(
  //   'Test functionality: $id',
  //   ({ id, newStart, newEnd, newX, description, startX }) => {
  test.describe('EDIT', () => {
    tableTest<
      'id' | 'newStart' | 'newEnd' | 'description' | 'moveBy' | 'startX'
    >`
          id                        | newStart | newEnd | moveBy | startX           | description
          ${crudIds['offset-0']}    | ${7}     | ${9}   |  ${20}  | ${'startX'}     | ${'Start - move right'}
          ${crudIds['offset-0']}    | ${1}     | ${9}   |  ${-20} | ${'startX'}     | ${'Start - move left'}
          ${crudIds['offset-0']}    | ${4}     | ${12}  |  ${20}  | ${'endX'}       | ${'End - move right'}
          ${crudIds['offset-0']}    | ${4}     | ${6}   |  ${-20} | ${'endX'}       | ${'End - move left'}
          ${crudIds['offset-1']}    | ${8}     | ${9}   |  ${20}  | ${'startX'}     | ${'Start - move right'}
          ${crudIds['offset-1']}    | ${2}     | ${9}   |  ${-20} | ${'startX'}     | ${'Start - move left'}
          ${crudIds['offset-1']}    | ${4}     | ${13}  |  ${20}  | ${'endX'}       | ${'End - move right'}
          ${crudIds['offset-1']}    | ${4}     | ${7}   |  ${-20} | ${'endX'}       | ${'End - move left'}
          ${crudIds['offset--10']}  | ${-3}    | ${9}   |  ${20}  | ${'startX'}     | ${'Start - move right'}
          ${crudIds['offset--10']}  | ${-9}    | ${9}   |  ${-20} | ${'startX'}     | ${'Start - move left'}
          ${crudIds['offset--10']}  | ${2}     | ${4}  |  ${20}  | ${'endX'}       | ${'End - move right'}
          ${crudIds['offset--10']}  | ${-4}    | ${4}   |  ${-20} | ${'endX'}       | ${'End - move left'}
               `(
      '$id: $description',
      async (
        { page },
        { id, newStart, newEnd, startX, moveBy, description },
      ) => {
        const container = findAnnotatedTextContainer(page, id);

        await container.scrollTo();
        await container.toBeVisible();

        const mouseMove = container.mouse;

        await container.expect.annotationsVisible(firstAnnotation.id);
        const annotation = container.annotation(firstAnnotation.id);
        const position = await annotation.getPosition();

        const x = position[startX];
        const y = position.middleY;
        const newY = y;

        await mouseMove.onMouseDown({ x, y }, false);

        await container.expect.toHaveLog(
          `annotation-edit--start: ${firstAnnotation.start}-${firstAnnotation.end}`,
        );

        // In this way we ensure we are moving always to the same positon on the screen
        const endX = firstAnnotation.positionScreen[startX] + moveBy;
        await mouseMove.onMouseDrag({ x: endX, y: newY });
        await container.expect.toHaveLog(
          `annotation-edit--move: ${newStart}-${newEnd}`,
        );

        await mouseMove.onMouseEnd();
        await container.expect.toHaveLog(
          `annotation-edit--end: ${newStart}-${newEnd}`,
        );

        await container.expect.toHaveScreenshot(`edit--${description}.png`);
      },
    );
  });

  test.describe('offset of 10', () => {
    test('first annotation is not visible', async ({ page }) => {
      const container = findAnnotatedTextContainer(page, crudIds['offset-10']);
      await container.expect.annotationsNotVisible(firstAnnotation.id);

      await container.expect.annotationsVisible(
        DemoShortText.annotations[1].id,
      );
      await container.expect.annotationsVisible(
        DemoShortText.annotations[2].id,
      );
      await container.expect.annotationsVisible(
        DemoShortText.annotations[3].id,
      );
      await container.expect.toHaveScreenshot('limitted-annotations.png');
    });
  });
});
