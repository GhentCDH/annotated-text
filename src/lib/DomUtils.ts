const caretPositionFromPoint = (
  x: number,
  y: number
): {
  offsetNode: Node;
  offset: number;
  getClientRect(): ClientRect | DOMRect;
} | null => {
  // @ts-ignore
  if (document.caretPositionFromPoint) {
    // @ts-ignore
    let position = document.caretPositionFromPoint(x, y);
    console.log(position);
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
    let range = document.caretRangeFromPoint(x, y);
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
}

export { caretPositionFromPoint };
