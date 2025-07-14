import memoize from "memoizee";

export const insideRange = memoize((a: number, b: number, value: number) => {
  return value >= a && value <= b;
});

export const isInsideBoundingRect = (x: number, y: number, rect: DOMRect) => {
  return (
    insideRange(rect.left, rect.right, x) &&
    insideRange(rect.top, rect.bottom, y)
  );
};

const findOffset = (node: HTMLElement, parentNode: HTMLElement, offset = 0) => {
  if (parentNode.contains(node)) {
    let childOffset = 0;
    for (let i = 0; i < parentNode.childNodes.length; i++) {
      const child = parentNode.childNodes[i];
      if (child.contains(node)) {
        if (child === node) {
          return offset + childOffset;
        }
        return findOffset(node, child as HTMLElement, offset + childOffset);
      }

      childOffset += child.textContent.length;
    }
  }
};

export const findLineElement = (node: Node) => {
  const parentNode = node.parentNode as HTMLElement;
  let lineElement = parentNode;
  let lineUid = lineElement.getAttribute("data-line-uid");
  let offset = 0;

  if (!lineUid) {
    // If the parent node is not a line, traverse up the DOM tree
    while (lineElement && !lineUid) {
      lineElement = lineElement.parentNode as HTMLElement;
      if (lineElement) {
        lineUid = lineElement.getAttribute("data-line-uid");
      }
    }
  }
  offset = findOffset(node as HTMLElement, lineElement);
  return { lineElement, lineUid, offset };
};
