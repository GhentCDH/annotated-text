import memoizee from 'memoizee';

export const getScale = memoizee((width: number, offsetWidth: number) => {
  return width / offsetWidth || 1;
});

export type Dimensions = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export type DimensionsWithScale = {
  original: Dimensions;
  scaled: Dimensions;
  scale: number;
};

const getScaledRect = memoizee(
  (width: number, height: number, x: number, y: number, scale: number) => {
    return {
      width: getScaled(width, scale),
      height: getScaled(height, scale),
      x: getScaled(x, scale),
      y: getScaled(y, scale),
    };
  },
);

export const getUnscaledRect = (element: HTMLElement): DimensionsWithScale => {
  const rect = getDimensions(element);
  const scale = getScale(rect.width, element.offsetWidth); //rect.width / element.offsetWidth || 1;

  const originalDimensions = {
    width: element.offsetWidth,
    height: element.offsetHeight,
    x: rect.x,
    y: rect.y,
  };

  return {
    original: originalDimensions,
    scaled: getScaledRect(
      originalDimensions.width,
      originalDimensions.height,
      originalDimensions.x,
      originalDimensions.y,
      scale,
    ),
    scale,
  };
};

const getScaled = memoizee((size: number, scale: number) => {
  return size / scale;
});

const getDif = memoizee((parent: number, element: number, scale: number) => {
  return (element - parent) / scale;
});

export const getDimensions = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const computedStyle = getComputedStyle(element);
  const lineHeight = parseFloat(computedStyle.lineHeight);

  // Use computed lineHeight if available, otherwise fall back to rect height
  const normalizedHeight = !isNaN(lineHeight) ? lineHeight : rect.height;

  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: normalizedHeight,
  };
};

export const getScaledDimensions = (
  parentDimensions: DimensionsWithScale,
  element: Pick<DOMRect, 'x' | 'y' | 'width' | 'height'>,
) => {
  const parent = parentDimensions.original;

  return {
    x: getDif(parent.x, element.x, parentDimensions.scale),
    y: getDif(parent.y, element.y, parentDimensions.scale),
    height: getScaled(element.height, parentDimensions.scale),
    width: getScaled(element.width, parentDimensions.scale),
  };
};
