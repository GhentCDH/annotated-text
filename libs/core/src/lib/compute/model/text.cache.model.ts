import { maxBy } from "lodash-es";
import { calculateAnnotationWeights } from "../utils/weights";
import { RenderInstances } from "../../adapter/annotation/renderer/render-instances";
import { TextAnnotation, TextLine } from "../../model";
import {
  AnnotationRender,
  TextAnnotationStyle,
} from "../../adapter/annotation/renderer/annotation-render";

export type TextSettings = {
  padding: number;
  lineHeight: number;
};

export class TextAnnotationCacheModel {
  public textAnnotations: TextAnnotation[] = [];
  private readonly lineAnnotationMap = new Map<number, TextAnnotation[]>();
  private readonly usedRenders = new Set<string>();

  constructor() {}

  updateTextAnnotations(lines: TextLine[], annotations: TextAnnotation[]) {
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

  getTextSettings(renderInstances: RenderInstances<any>): TextSettings {
    const renders = Array.from(this.usedRenders).map((r) =>
      renderInstances.getRendererByName(r),
    ) as AnnotationRender<TextAnnotationStyle>[];

    const padding =
      maxBy(renders, (r) => r?.style?.padding ?? 0)?.style?.padding ?? 0;
    const lineHeight =
      maxBy(renders, (r) => r?.style?.lineHeight ?? 0)?.style?.lineHeight ?? 0;
    return { padding, lineHeight };
  }

  clear() {}
}
