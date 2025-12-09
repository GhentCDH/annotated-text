import memoize from "memoizee";
import type { AnnotationDrawPath } from "../../model";

export type PathParams = {
  x: number;
  y: number;
  width: number;
  height: number;
  r: number;
  leftBorder: boolean;
  rightBorder: boolean;
};

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

  return path.flat().join(" ");
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

  return path.flat().join(" ");
};

export type createAnnotationPathFn = (params: PathParams) => AnnotationDrawPath;

export const createAnnotationPath: createAnnotationPathFn = (
  params: PathParams,
) => {
  const border = createAnnotationBorder(params);
  const fill = createAnnotationFill(params);

  return { border, fill };
};

export const createGutterPath = (
  x: number,
  y: number,
  width: number,
  height: number,
) => {
  return {
    fill: `M${x},${y} 
          H${x + width} 
          V${y + height} 
          H${x} 
          Z`,
  };
};
