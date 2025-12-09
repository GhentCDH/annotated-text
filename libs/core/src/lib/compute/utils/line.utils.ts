import { isIntersection } from "./intersect";
import type { Annotation, TextLine } from "../../model";

/**
 * Get all lines that intersect with the given annotation.
 * Assuming the lines are sorted by start position and no overlapping lines.
 *
 * @param allLines - All lines in the document, sorted by start position
 * @param annotation
 */
export const getLinesForAnnotation = (
  allLines: TextLine[],
  annotation: Pick<Annotation, "start" | "end">,
): TextLine[] => {
  const lines: TextLine[] = [];

  for (let i = 0; i < allLines.length; i++) {
    const line = allLines[i];

    if (isIntersection(line, annotation)) {
      lines.push(line);
    }

    if (annotation.end <= line.end) {
      i = allLines.length;
      break;
    }
  }

  return lines;
};
