import { expect, type Page } from '@playwright/test';
import { test } from '../_utils/fixtures';

type Rect = { left: number; top: number; width: number; height: number };

/** Client rect of `word` on text line `line`, and of the annotation's fill path */
const measure = (
  page: Page,
  id: string,
  word: string,
  line: number,
  root = '#zoom',
) =>
  page.evaluate(
    ({ id, word, line, root }) => {
      const toRect = (r: DOMRect) => ({
        left: r.left,
        top: r.top,
        width: r.width,
        height: r.height,
      });
      const lineEl = document
        .querySelector(root)!
        .querySelectorAll('[data-annotation-role="line"]')[line];
      const walker = document.createTreeWalker(lineEl, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const index = node.textContent!.indexOf(word);
        if (index < 0) continue;
        const range = document.createRange();
        range.setStart(node, index);
        range.setEnd(node, index + word.length);
        const fill = document.querySelector(
          `[data-annotation-uid="${id}"][data-annotation-role="fill"]`,
        )!;
        return {
          text: toRect(range.getBoundingClientRect()),
          annotation: toRect(fill.getBoundingClientRect()),
        };
      }
      throw new Error(`${word} not found on line ${line}`);
    },
    { id, word, line, root },
  );

const getZoom = (page: Page) =>
  page.evaluate(() => (window as any).annotatedText.getZoom() as number);

const setZoom = (page: Page, zoom: number) =>
  page.evaluate((z) => (window as any).annotatedText.setZoom(z), zoom);

const box = (page: Page) => page.locator('#zoom-box');

const expectAligned = (text: Rect, annotation: Rect) => {
  // The highlight covers the word horizontally and is centered on it vertically
  expect(Math.abs(annotation.left - text.left)).toBeLessThanOrEqual(1.5);
  expect(Math.abs(annotation.width - text.width)).toBeLessThanOrEqual(1.5);
  expect(
    Math.abs(
      annotation.top + annotation.height / 2 - (text.top + text.height / 2),
    ),
  ).toBeLessThanOrEqual(1.5);
};

/** Text offset of `word` on text line `line` */
const offsetOf = (page: Page, word: string, line: number) =>
  page.evaluate(
    ({ word, line }) => {
      const lines = ((window as any).text as string).split('\n');
      const lineStart = lines
        .slice(0, line)
        .reduce((sum, l) => sum + l.length + 1, 0);
      const start = lineStart + lines[line].indexOf(word);
      return { start, end: start + word.length };
    },
    { word, line },
  );

const lastEvent = (page: Page) =>
  page.evaluate(() => {
    const events = (window as any).events;
    return events[events.length - 1] ?? null;
  });

/** Viewport rect of the start handle (leftmost) of an annotation */
const startHandle = async (page: Page, id: string) => {
  const fill = page.locator(
    `#zoom [data-annotation-uid="${id}"][data-annotation-role="fill"]`,
  );
  await fill.hover();
  const handles = await page
    .locator(
      `#zoom [data-annotation-uid="${id}"][data-annotation-role="handle"]`,
    )
    .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().toJSON()));
  return handles.sort((a, b) => a.x - b.x)[0] as DOMRect;
};

test.describe('AnnotatedText Core - Zoom', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/zoom/zoom.html');
    await page.locator('#zoom svg').waitFor();
  });

  test.describe('annotations follow the text', () => {
    for (const zoom of [0.5, 1, 1.5, 3]) {
      test(`at zoom ${zoom}`, async ({ page }) => {
        const before = await measure(page, 'quick-0', 'quick', 0);

        await setZoom(page, zoom);

        for (const [id, word, line] of [
          ['quick-0', 'quick', 0],
          ['lazy-0', 'lazy', 0],
          ['fox-20', 'fox', 20],
        ] as const) {
          const { text, annotation } = await measure(page, id, word, line);
          expectAligned(text, annotation);
        }

        const after = await measure(page, 'quick-0', 'quick', 0);
        expect(after.text.width / before.text.width).toBeCloseTo(zoom, 1);
      });
    }
  });

  test('reflows the text to the box width without horizontal scroll', async ({
    page,
  }) => {
    await setZoom(page, 3);

    const { scrollWidth, clientWidth } = await box(page).evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('clamps to min and max', async ({ page }) => {
    await setZoom(page, 10);
    expect(await getZoom(page)).toBe(4);

    await setZoom(page, 0.1);
    expect(await getZoom(page)).toBe(0.5);
  });

  test('setZoom keeps the middle of the visible text in place', async ({
    page,
  }) => {
    const boxRect = (await box(page).boundingBox())!;
    const boxCenter = boxRect.y + boxRect.height / 2;

    // Scroll line 20 to the middle of the box
    const start = await measure(page, 'fox-20', 'fox', 20);
    await box(page).evaluate(
      (el, dy) => (el.scrollTop += dy),
      start.text.top + start.text.height / 2 - boxCenter,
    );

    await setZoom(page, 1.5);

    // Without anchoring line 20 would be ~300px further down, out of the box
    const after = await measure(page, 'fox-20', 'fox', 20);
    expect(Math.abs(after.text.top - boxCenter)).toBeLessThan(
      after.text.height,
    );
  });

  test.describe('buttons', () => {
    test('keep the line next to the toolbar in place', async ({ page }) => {
      const toolbar = page
        .locator('#zoom')
        .getByRole('toolbar', { name: 'Zoom' });
      const toolbarTop = (await toolbar.boundingBox())!.y;

      // Scroll line 20 to the top of the box, next to the toolbar
      const start = await measure(page, 'fox-20', 'fox', 20);
      await box(page).evaluate(
        (el, dy) => (el.scrollTop += dy),
        start.text.top - toolbarTop,
      );
      const before = await measure(page, 'fox-20', 'fox', 20);

      await page
        .locator('#zoom')
        .getByRole('button', { name: 'Zoom in' })
        .click();
      await page
        .locator('#zoom')
        .getByRole('button', { name: 'Zoom in' })
        .click();
      expect(await getZoom(page)).toBe(1.5);

      const after = await measure(page, 'fox-20', 'fox', 20);
      expect(Math.abs(after.text.top - before.text.top)).toBeLessThan(
        after.text.height,
      );
      expect((await toolbar.boundingBox())!.y).toBeCloseTo(toolbarTop, 0);
    });

    test('keep the first line in place at the top of the text', async ({
      page,
    }) => {
      const before = await measure(page, 'quick-0', 'quick', 0);

      await page
        .locator('#zoom')
        .getByRole('button', { name: 'Zoom in' })
        .click();
      await page
        .locator('#zoom')
        .getByRole('button', { name: 'Zoom in' })
        .click();

      expect(await box(page).evaluate((el) => el.scrollTop)).toBeLessThan(2);
      const after = await measure(page, 'quick-0', 'quick', 0);
      expect(Math.abs(after.text.top - before.text.top)).toBeLessThan(
        after.text.height,
      );
    });

    test('zoom in, out and reset', async ({ page }) => {
      const zoomIn = page
        .locator('#zoom')
        .getByRole('button', { name: 'Zoom in' });
      const zoomOut = page
        .locator('#zoom')
        .getByRole('button', { name: 'Zoom out' });

      await zoomIn.click();
      await expect(
        page.locator('#zoom').getByRole('button', { name: '125%' }),
      ).toBeVisible();
      expect(await getZoom(page)).toBe(1.25);

      await zoomOut.click();
      await zoomOut.click();
      expect(await getZoom(page)).toBe(0.75);

      await page.locator('#zoom').getByRole('button', { name: '75%' }).click();
      expect(await getZoom(page)).toBe(1);
      await expect(page.locator('body')).toHaveAttribute('data-zoom', '1');
    });

    test('disable zoom in at max', async ({ page }) => {
      await setZoom(page, 4);

      await expect(
        page.locator('#zoom').getByRole('button', { name: 'Zoom in' }),
      ).toBeDisabled();
      await expect(
        page.locator('#zoom').getByRole('button', { name: 'Zoom out' }),
      ).toBeEnabled();
    });

    test('stay visible while scrolling the box', async ({ page }) => {
      await box(page).evaluate((el) => (el.scrollTop = 500));

      await expect(
        page.locator('#zoom').getByRole('button', { name: 'Zoom in' }),
      ).toBeInViewport();
      const toolbar = await page
        .locator('#zoom')
        .getByRole('toolbar')
        .boundingBox();
      const boxRect = await box(page).boundingBox();
      expect(toolbar!.y).toBeGreaterThanOrEqual(boxRect!.y);
      expect(toolbar!.y).toBeLessThan(boxRect!.y + 20);
    });
  });

  test.describe('mouse wheel', () => {
    test('plain wheel scrolls and does not zoom', async ({ page }) => {
      await box(page).hover();
      await page.mouse.wheel(0, 200);

      await expect
        .poll(() => box(page).evaluate((el) => el.scrollTop))
        .toBeGreaterThan(0);
      expect(await getZoom(page)).toBe(1);
    });

    test('ctrl + wheel zooms the text only, around the pointer', async ({
      page,
    }) => {
      const before = await measure(page, 'lazy-0', 'lazy', 0);
      const pointer = {
        x: before.text.left + before.text.width / 2,
        y: before.text.top + before.text.height / 2,
      };
      await page.mouse.move(pointer.x, pointer.y);

      await page.keyboard.down('Control');
      await page.mouse.wheel(0, -100);
      await page.mouse.wheel(0, -100);
      await page.keyboard.up('Control');

      await expect(page.locator('body')).toHaveAttribute('data-zoom', /.+/);
      expect(await getZoom(page)).toBeCloseTo(1.49, 1);

      // the page itself is not zoomed
      expect(await page.evaluate(() => window.visualViewport?.scale)).toBe(1);
      const fontSize = await page.evaluate(
        () => getComputedStyle(document.body).fontSize,
      );
      expect(fontSize).toBe('16px');

      // the word under the pointer is still under the pointer (same row)
      const after = await measure(page, 'lazy-0', 'lazy', 0);
      expect(pointer.y).toBeGreaterThanOrEqual(after.text.top - 2);
      expect(pointer.y).toBeLessThanOrEqual(
        after.text.top + after.text.height + 2,
      );
      expectAligned(after.text, after.annotation);
    });
  });

  test.describe('right-to-left text', () => {
    for (const zoom of [1, 2]) {
      test(`annotations follow the text at zoom ${zoom}`, async ({ page }) => {
        await page.evaluate(
          (z) => (window as any).annotatedTextRtl.setZoom(z),
          zoom,
        );

        const { text, annotation } = await measure(
          page,
          'rtl-3',
          'عربي',
          3,
          '#zoom-rtl',
        );
        expectAligned(text, annotation);
      });
    }

    test('show the toolbar top right, like left-to-right text', async ({
      page,
    }) => {
      const box = (await page.locator('#zoom-rtl-box').boundingBox())!;
      const toolbar = page.locator('#zoom-rtl').getByRole('toolbar');
      await expect(toolbar).toHaveAttribute('dir', 'ltr');
      const zoomIn = (await toolbar
        .getByRole('button', { name: 'Zoom in' })
        .boundingBox())!;
      expect(zoomIn.x + zoomIn.width).toBeGreaterThan(box.x + box.width - 40);
    });
  });

  test.describe('editing after zoom', () => {
    test('create by selection hits the right characters', async ({ page }) => {
      await setZoom(page, 2);
      // Scroll the word to the middle of the box
      const boxRect = (await box(page).boundingBox())!;
      const before = await measure(page, 'fox-20', 'brown', 1);
      await box(page).evaluate(
        (el, dy) => (el.scrollTop += dy),
        before.text.top - boxRect.y - boxRect.height / 2,
      );
      const { text } = await measure(page, 'fox-20', 'brown', 1);
      const y = text.top + text.height / 2;

      await page.mouse.move(text.left + 2, y);
      await page.mouse.down();
      await page.mouse.move(text.left + text.width / 2, y);
      await page.mouse.move(text.left + text.width - 2, y);
      await page.mouse.up();

      await expect
        .poll(() => lastEvent(page))
        .toEqual({
          event: 'annotation-create--end',
          ...(await offsetOf(page, 'brown', 1)),
        });
    });

    test('dragging a handle hits the right character', async ({ page }) => {
      await setZoom(page, 1.5);
      const handle = await startHandle(page, 'quick-0');
      const target = await measure(page, 'quick-0', 'the', 0);
      const y = handle.y + handle.height / 2;

      await page.mouse.move(handle.x + handle.width / 2, y);
      await page.mouse.down();
      await page.mouse.move(target.text.left + 10, y);
      await page.mouse.move(target.text.left + 1, y);
      await page.mouse.up();

      const the = await offsetOf(page, 'the', 0);
      const quick = await offsetOf(page, 'quick', 0);
      await expect
        .poll(() => lastEvent(page))
        .toEqual({
          event: 'annotation-edit--end',
          start: the.start,
          end: quick.end,
        });
    });
  });

  test.describe('no zoom while editing', () => {
    const tryToZoom = async (page: Page) => {
      await setZoom(page, 2);
      await page.keyboard.press('Control+=');
      await page.keyboard.down('Control');
      await page.mouse.wheel(0, -100);
      await page.keyboard.up('Control');
      // the wheel commits after a short idle time
      await page.waitForTimeout(300);
    };

    test('while creating an annotation', async ({ page }) => {
      const { text } = await measure(page, 'fox-20', 'brown', 1);
      const y = text.top + text.height / 2;
      await page.mouse.move(text.left + 2, y);
      await page.mouse.down();
      await page.mouse.move(text.left + text.width - 2, y);

      await tryToZoom(page);
      expect(await getZoom(page)).toBe(1);

      await page.mouse.up();
      await setZoom(page, 2);
      expect(await getZoom(page)).toBe(2);
    });

    test('while dragging a handle', async ({ page }) => {
      const handle = await startHandle(page, 'quick-0');
      const y = handle.y + handle.height / 2;
      await page.mouse.move(handle.x + handle.width / 2, y);
      await page.mouse.down();
      await page.mouse.move(handle.x - 20, y);

      await tryToZoom(page);
      expect(await getZoom(page)).toBe(1);

      await page.mouse.up();
      await setZoom(page, 2);
      expect(await getZoom(page)).toBe(2);
    });
  });

  test('zoom and editing work again after clicking a handle without moving', async ({
    page,
  }) => {
    const handle = await startHandle(page, 'quick-0');
    await page.mouse.click(
      handle.x + handle.width / 2,
      handle.y + handle.height / 2,
    );

    await setZoom(page, 1.5);
    expect(await getZoom(page)).toBe(1.5);

    // editing isn't blocked either
    const moved = await startHandle(page, 'quick-0');
    const target = await measure(page, 'quick-0', 'the', 0);
    const y = moved.y + moved.height / 2;
    await page.mouse.move(moved.x + moved.width / 2, y);
    await page.mouse.down();
    await page.mouse.move(target.text.left + 10, y);
    await page.mouse.move(target.text.left + 1, y);
    await page.mouse.up();
    await expect
      .poll(() => lastEvent(page))
      .toMatchObject({ event: 'annotation-edit--end' });
  });

  test.describe('keyboard', () => {
    test('buttons are reachable with tab and announce the zoom level', async ({
      page,
    }) => {
      const zoom = page.locator('#zoom');
      await zoom.locator('.ghent-cdh-annotation-wrapper').focus();
      await page.keyboard.press('Tab');
      await expect(
        zoom.getByRole('button', { name: 'Zoom out' }),
      ).toBeFocused();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await expect(zoom.getByRole('button', { name: 'Zoom in' })).toBeFocused();

      await page.keyboard.press('Enter');
      expect(await getZoom(page)).toBe(1.25);
      await page.keyboard.press('Space');
      expect(await getZoom(page)).toBe(1.5);

      const reset = zoom.getByTitle('Reset zoom');
      await expect(reset).toHaveText('150%');
      await expect(reset).toHaveAttribute('aria-live', 'polite');
    });

    test('ctrl + / - / 0 while the text has focus', async ({ page }) => {
      await page.locator('#zoom .ghent-cdh-annotation-wrapper').focus();

      await page.keyboard.press('Control+=');
      expect(await getZoom(page)).toBe(1.25);
      await page.keyboard.press('Control+-');
      await page.keyboard.press('Control+-');
      expect(await getZoom(page)).toBe(0.75);
      await page.keyboard.press('Control+0');
      expect(await getZoom(page)).toBe(1);
    });
  });
});
