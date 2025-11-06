import { calculateGutterAnnotationWeightsAndEnrich } from "../utils/weights";
import { TextAnnotation } from "@ghentcdh/annotated-text";
import { TextAnnotationModel } from "../annotation.model";
import { RenderInstances } from "../../adapter/annotation/renderer/render-instances";
import { maxBy } from "lodash-es";

export class GutterCacheModel {
  private maxGutterWeight = 0;
  private gutterAnnotations: TextAnnotation[] = [];

  constructor(private annotationModel: TextAnnotationModel) {}

  updateGutters(annotations: TextAnnotation[]) {
    this.gutterAnnotations = annotations.filter((a) => a._render.isGutter);

    this.maxGutterWeight = calculateGutterAnnotationWeightsAndEnrich(
      this.annotationModel,
      this.gutterAnnotations,
    );

    this.maxGutterWeight =
      maxBy(this.gutterAnnotations, (a) => a._render.weight)?._render.weight ??
      0;
  }

  gutterPaddingLeft(renderInstances: RenderInstances<any>) {
    const gutterInstances = renderInstances.getGutterRenders();

    // For now this is only base on one gutter renderer,
    // It should be tested against multiple if different instances are available

    const maxGutterWidth =
      maxBy(gutterInstances, (r) => r.style?.width ?? 0)?.style?.width ?? 0;
    const maxGutterGap =
      maxBy(gutterInstances, (r) => r.style?.gap ?? 0)?.style?.gap ?? 0;

    const gutterWidth = maxGutterWidth + maxGutterGap;
    return gutterWidth * this.maxGutterWeight;
  }

  clear() {
    this.gutterAnnotations = [];
  }
}
