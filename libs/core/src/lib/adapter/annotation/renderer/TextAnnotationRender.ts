import { cloneDeep } from 'lodash-es';
import memoize from 'memoizee';
import { DefaultAnnotationRenderStyle } from './annotation-render';
import { SvgAnnotationRender } from './SvgAnnotationRender';
import type { createAnnotationPathFn, PathParams } from './_utils/path';
import { type AnnotationDrawPath } from '../../../model';

const createRightBorder = memoize(
  (x: number, y: number, right: number, bottom: number, r: number) => {
    return [
      // move to top-left
      `H${right - r}`, // top edge
      `A${r},${r} 0 0 1 ${right},${y + r}`, // top-right corner
      `V${bottom - r}`, // right edge
      `A${r},${r} 0 0 1 ${right - r},${bottom}`, // bottom-right corner
    ];
  },
);

const createLeftBorder = memoize(
  (x: number, y: number, bottom: number, r: number) => {
    return [
      `H${x + r}`,
      `A${r},${r} 0 0 1 ${x},${bottom - r}`, // bottom-left corner
      `V${y + r}`,
      `A${r},${r} 0 0 1 ${x + r},${y}`,
    ];
  },
);

const createAnnotationBorder = ({
  x,
  y,
  width,
  height,
  r,
  leftBorder,
  rightBorder,
}: PathParams) => {
  const right = x + width;
  const bottom = y + height;

  const path: Array<string | string[]> = [`M${x + (leftBorder ? r : 0)},${y}`];

  const leftOffset = leftBorder ? x + r : x;

  // Right border
  if (rightBorder) {
    path.push(createRightBorder(x, y, right, bottom, r));
    path.push(`H${leftOffset}`); // move to bottom-left
  } else {
    path.push([
      `M${leftOffset},${y}`, // move to top-left
      `H${right}`, // top edge
      `M${right},${bottom}`, //  move to bottom-right
    ]);
  }

  // Left border
  if (leftBorder) {
    path.push(createLeftBorder(x, y, bottom, r));
  } else {
    path.push(`H${x}`);
  }

  return path.flat().join(' ');
};

export const createAnnotationFill = ({
  x,
  y,
  width,
  height,
  r,
  leftBorder,
  rightBorder,
}: PathParams) => {
  const right = x + width;
  const bottom = y + height;

  const path: Array<string | string[]> = [`M${x + (leftBorder ? r : 0)},${y}`];

  // Right border
  if (rightBorder) {
    path.push(createRightBorder(x, y, right, bottom, r));
  } else {
    path.push(createRightBorder(x, y, right, bottom, 0));
  }

  if (leftBorder) {
    path.push(createLeftBorder(x, y, bottom, r));
  } else {
    path.push(createLeftBorder(x, y, bottom, 0));
  }

  return path.flat().join(' ');
};

export const createHighlightPath: createAnnotationPathFn = (
  params: PathParams,
) => {
  const border = createAnnotationBorder(params);
  const fill = createAnnotationFill(params);

  return { border, fill };
};

export const DefaultTextAnnotationRenderStyle = {
  ...cloneDeep(DefaultAnnotationRenderStyle),
  borderWidth: 2,
  borderRadius: 6,
};
export type TextAnnotationRenderStyle = typeof DefaultTextAnnotationRenderStyle;

export class HighlightAnnotationRender extends SvgAnnotationRender<TextAnnotationRenderStyle> {
  readonly weightOrder: number = 1;
  readonly isGutter: boolean = false;

  constructor(name: string, style: Partial<TextAnnotationRenderStyle> = {}) {
    super(name, style, DefaultTextAnnotationRenderStyle);
  }
  override createPath(params: PathParams): AnnotationDrawPath {
    return createHighlightPath(params);
  }
}
