import { type Annotation, type TextLine } from '../../../model';
import { Debugger } from '../../../utils/debugger';
import {
  type Dimensions,
  type DimensionsWithScale,
  getScaledDimensions,
} from '../../position/unscaled';

export const getTextRange = (annotation: Annotation, line: TextLine) => {
  let start = annotation.start - line.start;
  const end = annotation.end - line.start;

  if (start < 0) {
    start = 0;
  }
  return { start, end };
};

type RangeDimensions = {
  original: Dimensions;
  dimensions: Dimensions;
};

/**
 * Get ranges for an annotation in a line.
 * Works only if the line has text content.
 * @param parentDimensions
 * @param annotation
 * @param line
 */
export const getRanges = (
  parentDimensions: DimensionsWithScale,
  annotation: Annotation,
  line: TextLine,
): RangeDimensions[] | null => {
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

  return getRangesRect(parentDimensions, lineElement, start, end);
};

/**
 * @param parentDimensions
 * @param textNode
 * @param start
 * @param end
 */
const getRangesRect = (
  parentDimensions: DimensionsWithScale,
  textNode: ChildNode | null,
  start: number,
  end: number,
): RangeDimensions[] => {
  if (!textNode) {
    return [];
  }

  // if (!textNode || !textNode.textContent) {
  //   return [];
  // }

  if (textNode.childNodes?.length > 0) {
    let offset = 0;
    const rects: Array<RangeDimensions> = [];

    for (const child of textNode.childNodes) {
      if (offset > end) {
        break;
      }

      const childLength = child.textContent!.length;

      const childRects = getRangesRect(
        parentDimensions,
        child,
        start - offset,
        end - offset,
      );
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

  return Array.from(range.getClientRects())
    .map((r) => ({
      original: { x: r.x, y: r.y, height: r.height, width: r.width },
      dimensions: getScaledDimensions(parentDimensions, r),
    }))
    .flat();
};
