import { cloneDeep } from 'lodash-es';
import { DefaultAnnotationRenderStyle } from './annotation-render';
import { SvgAnnotationRender } from './SvgAnnotationRender';
import {
  createAnnotationFill,
  type createAnnotationPathFn,
  createLeftBorder,
  createRightBorder,
  type PathParams,
} from './_utils/path';
import { type AnnotationDrawPath } from '../../../model';

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
