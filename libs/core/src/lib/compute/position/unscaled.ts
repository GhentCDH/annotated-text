import memoizee from 'memoizee';

export const getScale = memoizee((width: number, offsetWidth: number) => {
  return width / offsetWidth || 1;
});

type Dimensions = {
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

export const getUnscaledRect = (element: HTMLElement): DimensionsWithScale => {
  const rect = element.getBoundingClientRect();
  const scale = getScale(rect.width, element.offsetWidth); //rect.width / element.offsetWidth || 1;

  const originalDimensions = {
    width: element.offsetWidth,
    height: element.offsetHeight,
    x: rect.x,
    y: rect.y,
  };

  return {
    original: originalDimensions,
    scaled: {
      width: getScaled(originalDimensions.width, scale),
      height: getScaled(originalDimensions.height, scale),
      x: getScaled(rect.x, scale),
      y: getScaled(rect.y, scale),
    },
    scale,
  };
};

const getScaled = memoizee((size: number, scale: number) => {
  return size / scale;
});

const getDif = memoizee((parent: number, element: number, scale: number) => {
  return (element - parent) / scale;
});

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
