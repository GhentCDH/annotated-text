import { AnnotationId } from "@ghentcdh/annotated-text";
import { SvgModel } from "./svg.types";
import { AnnotationDraw } from "../annotation.model";

export class AnnotationColors {
  private readonly activeIds = new Set<AnnotationId>();
  private readonly highlightedIds = new Set<AnnotationId>();

  constructor() {}

  public highlightAnnotations(ids: AnnotationId[], svgModel: SvgModel) {
    this.highlightedIds.clear();
    ids.forEach((id) => this.highlightedIds.add(id));

    this.color(svgModel);
    return this;
  }

  public selectAnnotations(ids: AnnotationId[], svgModel: SvgModel) {
    this.activeIds.clear();
    ids.forEach((id) => this.highlightedIds.delete(id));
    ids.forEach((id) => this.activeIds.add(id));

    this.color(svgModel);
    // TODO decide which one has more priority?
    return this;
  }

  public color(svgModel: SvgModel) {
    this.highlightedIds.forEach((id) => svgModel.resetAnnotationColor(id));
    this.activeIds.forEach((id) => svgModel.resetAnnotationColor(id));
    return this;
  }

  public getAnnotationColor(annotation: AnnotationDraw) {
    if (this.activeIds.has(annotation.annotationUuid))
      return annotation.color.active;
    if (this.highlightedIds.has(annotation.annotationUuid))
      return annotation.color.hover;

    return annotation.color.default;
  }
}
