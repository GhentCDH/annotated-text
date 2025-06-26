import {
  Annotation,
  Debugger,
  TextLine,
} from "@ghentcdh/vue-component-annotated-text";

export const getTextRange = (
  annotation: Annotation,
  line: TextLine,
  textNode: ChildNode,
) => {
  let start = annotation.start - line.start;
  let end = annotation.end - line.start + 1;

  if (!textNode?.textContent) {
    return { start: -1, end: -1 };
  }

  const textLength = textNode.textContent.length;

  if (start < 0) {
    start = 0;
  } else if (start > textLength) {
    start = textLength;
  }

  if (end > textLength) {
    end = textLength;
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
      "No textelement for line",
      line.lineNumber,
      "found for annotation",
      annotation.id,
    );

    return null;
  }
  const textNode = lineElement.firstChild;

  const { start, end } = getTextRange(annotation, line, textNode);

  // End is negative if the annotation is not in the line, but maybe in the gutter
  if (end < 0) return null;

  const rects = getRangesRect(textNode, start, end);
  return rects.flat();
};

/**
 * This should go in the adapter,
 * for markdown we can calculate the offset of the hidden text that is replaced by a html element
 * @param textNode
 * @param start
 * @param end
 */
export const getRangesRect = (
  textNode: ChildNode | null,
  start: number,
  end: number,
) => {
  if (!textNode || !textNode.textContent) {
    return [];
  }

  const range = document.createRange();
  range.setStart(textNode, start);
  range.setEnd(textNode, end);

  const rects = range.getClientRects();

  return Array.from(rects);
};
