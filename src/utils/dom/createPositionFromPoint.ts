/**
 * @deprecated
 * @param x
 * @param y
 */
const createPositionFromPoint = (
  x: number,
  y: number,
): {
  offsetNode: Node;
  offset: number;
  getClientRect(): ClientRect | DOMRect;
} | null => {
  const doc = document as unknown as any;

  if (doc.caretPositionFromPoint) {
    const position = doc.caretPositionFromPoint(x, y);
    // console.log(position);
    return position
      ? {
          offsetNode: position.offsetNode,
          offset: position.offset,
          getClientRect() {
            return position.getClientRect();
          },
        }
      : null;
  } else {
    const range = doc.caretRangeFromPoint(x, y);
    return range
      ? {
          offsetNode: range.startContainer,
          offset: range.startOffset,
          getClientRect() {
            return range.getClientRects()[0];
          },
        }
      : null;
  }
};

export { createPositionFromPoint };
