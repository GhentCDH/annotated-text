import { expect, type Page } from '@playwright/test';
import { getPositionRelativeTo, scrollTo } from './scroll';
import { MouseMove } from './mouse';
import { getLogDivId } from './render-demo';

export const findAnnotatedTextContainer = (page: Page, id: string) => {
  const container = page.locator(`#${id}`);

  const annotation = (annotationId) => {
    const annotationSvg = container
      .locator(`[data-annotation-uid='${annotationId}']`)
      .first();
    return {
      annotation: annotationSvg,
      getPosition: () => getPositionRelativeTo(container, annotationSvg),
      toBeVisible: () => expect(annotationSvg).toBeVisible(),
      notVisible: () => expect(annotationSvg).not.toBeVisible(),
    };
  };

  const annotations = (ids: string[]) => {
    const annotations = ids.map((id) => annotation(id));
    return {
      annotations: annotations.map((a) => a.annotation),
      toBeVisible: () => Promise.all(annotations.map((a) => a.toBeVisible())),
      notVisible: () => Promise.all(annotations.map((a) => a.notVisible())),
    };
  };

  const mouse = new MouseMove(page, container);
  const log = page.locator(`#${getLogDivId(id)}`);

  return {
    mouse,
    container,
    log,
    toBeVisible: () => expect(container).toBeVisible(),
    scrollTo: async (position = { x: 0, y: 0 }) => {
      await scrollTo(container, position);
      return container;
    },
    annotation: (annotationId: string) => annotation(annotationId),
    annotations: (ids: string[]) => annotations(ids),
    expect: {
      toHaveLog: async (msg: string) =>
        expect(await log.innerText()).toEqual(msg),
      toHaveScreenshot: (name: string) =>
        expect(container).toHaveScreenshot(`${id}-${name}.png`),
      annotationsNotVisible: (...ids: string[]) =>
        annotations(ids).notVisible(),
      annotationsVisible: (...ids: string[]) => annotations(ids).toBeVisible(),
    },
  };
};
