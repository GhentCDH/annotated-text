import {
  Annotation,
  Debugger,
  TextLine,
} from "@ghentcdh/vue-component-annotated-text";
import {
  getRangesRect,
  getTextRange,
} from "../../../compute/utils/ranges/get-range";

export const markdownRangesRect = (textNode, start, end) => {
  if (textNode.childNodes?.length > 0) {
    return Array.from(textNode.childNodes).flatMap((child) => {
      return markdownRangesRect(child, start, end);
    });
  }

  return getRangesRect(textNode, start, end);
};

export const markdownRanges = (annotation: Annotation, line: TextLine) => {
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

  const rects = markdownRangesRect(textNode, start, end);
  return rects.flat();
};
