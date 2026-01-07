import memoizee from 'memoizee';

export const getScale = memoizee((width: number, offsetWidth: number) => {
  return width / offsetWidth || 1;
});

export type DimensionsWithScale = {
  width: number;
  height: number;
  x: number;
  y: number;
  scale: number;
};

export const getUnscaledRect = (element: HTMLElement): DimensionsWithScale => {
  const rect = element.getBoundingClientRect();
  const scale = getScale(rect.width, element.offsetWidth); //rect.width / element.offsetWidth || 1;

  return {
    width: element.offsetWidth,
    height: element.offsetHeight,
    x: rect.x,
    y: rect.y,
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
  return {
    x: getDif(parentDimensions.x, element.x, parentDimensions.scale),
    y: getDif(parentDimensions.y, element.y, parentDimensions.scale),
    height: getScaled(element.height, parentDimensions.scale),
    width: getScaled(element.width, parentDimensions.scale),
  };
};
