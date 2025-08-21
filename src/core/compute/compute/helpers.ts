export const getX = <E extends { x: number }>(parentElement: E, element: E) => {
  return element.x - parentElement.x;
};

export const getY = <E extends { y: number }>(parentElement: E, element: E) => {
  return element.y - parentElement.y;
};
