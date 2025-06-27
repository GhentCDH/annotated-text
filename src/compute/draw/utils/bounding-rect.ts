export const isInsideBoundingRect = (x: number, y: number, rect: DOMRect) => {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
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
