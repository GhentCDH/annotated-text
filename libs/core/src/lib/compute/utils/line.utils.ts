import type { Annotation, TextLine } from "../../model";
import { isIntersection } from "./intersect";

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
