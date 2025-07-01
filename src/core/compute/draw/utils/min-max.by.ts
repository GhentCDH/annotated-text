export const getMinMaxBy = <T>(
  elements: T[],
  by: (element: T) => number,
): { min: T; max: T } => {
  if (elements.length === 0) {
    throw new Error("Array must not be empty");
  }

  let min = elements[0];
  let minValue = by(elements[0]);
  let max = elements[0];
  let maxValue = by(elements[0]);

  elements.forEach((element) => {
    const value = by(element);
    if (value < minValue) {
      min = element;
      minValue = value;
    }
    if (value > maxValue) {
      max = element;
      maxValue = value;
    }
  });

  return { min, max };
};
