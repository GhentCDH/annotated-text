import memoize from 'memoizee';
import { SVG_ID } from '../../model/svg.types';

export const insideRange = memoize(
  (left: number, right: number, value: number, offset?: number) => {
    if (!offset) offset = 0;
    return value >= left - offset && value <= right + offset;
  },
);

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

      childOffset += child.textContent!.length;
    }
  }

  return 0;
};

export const findLineElement = (node: Node) => {
  const parentNode = node.parentNode as HTMLElement;
  let lineElement = parentNode;
  let lineUid = lineElement.getAttribute(SVG_ID.LINE_UID);
  let offset = 0;

  if (!lineUid) {
    // If the parent node is not a line, traverse up the DOM tree
    while (lineElement && !lineUid) {
      lineElement = lineElement.parentNode as HTMLElement;
      if (lineElement) {
        lineUid = lineElement.getAttribute?.(SVG_ID.LINE_UID);
      }
    }
  }
  if (!lineElement)
    return { lineElement: null, lineUid: null, offset: 0, lineHeight: 0 };

  const _lineHeight = window.getComputedStyle?.(lineElement).lineHeight;
  const lineHeight = parseFloat(_lineHeight);

  offset = findOffset(node as HTMLElement, lineElement);
  return { lineElement, lineUid, offset, lineHeight };
};

export const calculateOffset = memoize((lineHeight: number, height: number) => {
  // Offset should be an integer value
  return (lineHeight - height) / 2; //Math.round((lineHeight - height) / 2);
});
