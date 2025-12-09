import { type Annotation, type TextLine } from '../../../model';
import { Debugger } from '../../../utils/debugger';

export const getTextRange = (annotation: Annotation, line: TextLine) => {
  let start = annotation.start - line.start;
  const end = annotation.end - line.start;

  if (start < 0) {
    start = 0;
  }
  return { start, end };
};

/**
 * Get ranges for an annotation in a line.
 * Works only if the line has text content.
 * @param annotation
 * @param line
 */
export const getRanges = (annotation: Annotation, line: TextLine) => {
  const lineElement = line.element;
  if (!lineElement) {
    Debugger.debug(
      'getRange',
      `No textElement for line ${line.lineNumber} found for annotation ${annotation.id}`,
    );

    return null;
  }

  const { start, end } = getTextRange(annotation, line);

  // End is negative if the annotation is not in the line, but maybe in the gutter
  if (end < 0) {
    return null;
  }

  return alignRects(getRangesRect(lineElement, start, end));
};

const alignRects = (rects: DOMRect[]) => {
  // If multiple rects on the same line, merge them
  return rects.flat();
};

/**
 * @param textNode
 * @param start
 * @param end
 */
export const getRangesRect = (
  textNode: ChildNode | null,
  start: number,
  end: number,
) => {
  if (!textNode) {
    return [];
  }

  // if (!textNode || !textNode.textContent) {
  //   return [];
  // }

  if (textNode.childNodes?.length > 0) {
    let offset = 0;
    const rects: DOMRect[] = [];
    for (const child of textNode.childNodes) {
      if (offset > end) {
        break;
      }

      const childLength = child.textContent!.length;

      const childRects = getRangesRect(child, start - offset, end - offset);
      offset += childLength;

      rects.push(...childRects);
    }
    return rects;
  }

  const length = textNode.textContent!.length;
  if (start < 0) {
    start = 0;
  }
  if (start >= length) {
    return [];
  }

  const newEnd = Math.min(length, end);
  const range = document.createRange();
  range.setStart(textNode, start);
  range.setEnd(textNode, newEnd);

  const rects = range.getClientRects();
  return Array.from(rects).flat();
};
