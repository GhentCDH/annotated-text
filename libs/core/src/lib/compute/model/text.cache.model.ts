import { TextAnnotation, TextLine } from "@ghentcdh/annotated-text";
import { calculateAnnotationWeights } from "../utils/weights";

export class TextAnnotationCacheModel {
  public textAnnotations: TextAnnotation[] = [];
  private readonly lineAnnotationMap = new Map<number, TextAnnotation[]>();

  constructor() {}

  updateTextAnnotations(lines: TextLine[], annotations: TextAnnotation[]) {
    this.textAnnotations = annotations.filter((a) => !a._render.isGutter);

    lines.forEach((line) => {
      this.lineAnnotationMap.set(line.lineNumber, []);
    });

    this.textAnnotations.forEach((t) => {
      t._render.lines.forEach((l) =>
        this.lineAnnotationMap.get(l.lineNumber)?.push(t),
      );
    });

    calculateAnnotationWeights(lines, this.lineAnnotationMap);
  }

  removeAnnotationFromLine(
    originalLines: TextLine[],
    annotation: TextAnnotation,
  ): void {
    originalLines.forEach((line) => {
      const lineAnnotationMap = this.lineAnnotationMap
        .get(line.lineNumber)!
        .filter((a) => a.id !== annotation.id);
      this.lineAnnotationMap.set(line.lineNumber, lineAnnotationMap);
    });
  }

  clear() {}
}
