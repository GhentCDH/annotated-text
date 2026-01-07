import memoize from 'memoizee';
import { type AnnotationDrawPath } from '../../../../model';

export type PathParams = {
  x: number;
  y: number;
  width: number;
  height: number;
  r: number;
  leftBorder: boolean;
  rightBorder: boolean;
};

export type createAnnotationPathFn = (params: PathParams) => AnnotationDrawPath;
export const createRightBorder = memoize(
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

export const createLeftBorder = memoize(
  (x: number, y: number, bottom: number, r: number) => {
    return [
      `H${x + r}`,
      `A${r},${r} 0 0 1 ${x},${bottom - r}`, // bottom-left corner
      `V${y + r}`,
      `A${r},${r} 0 0 1 ${x + r},${y}`,
    ];
  },
);

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
