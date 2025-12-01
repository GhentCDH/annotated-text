import { RenderInstances } from "../../adapter/annotation/renderer/render-instances";
import { TextAnnotation, TextLine } from "../../model";
import { AnnotationWeight } from "../utils/annotation.weight";

export class TextAnnotationCacheModel {
  public textAnnotations: TextAnnotation[] = [];
  private readonly lineAnnotationMap = new Map<number, TextAnnotation[]>();
  private readonly usedRenders = new Set<string>();

  constructor() {}

  updateTextAnnotations(
    lines: TextLine[],
    annotations: TextAnnotation[],
    renderInstances: RenderInstances<any>,
  ) {
    this.textAnnotations = annotations.filter((a) => !a._render.isGutter);
    this.usedRenders.clear();
    lines.forEach((line) => {
      this.lineAnnotationMap.set(line.lineNumber, []);
    });

    this.textAnnotations.forEach((t) => {
      this.usedRenders.add(t._render.render);
      t._render.lines.forEach((l) =>
        this.lineAnnotationMap.get(l.lineNumber)?.push(t),
      );
    });

    AnnotationWeight.calculate(
      this.textAnnotations,
      renderInstances.getTextRenders(),
    );
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
