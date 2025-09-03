import { AnnotationId } from "@ghentcdh/annotated-text";
import { SvgModel } from "./svg.types";
import { AnnotationDraw } from "../annotation.model";

export class AnnotationColors {
  private readonly activeIds = new Set<AnnotationId>();
  private readonly highlightedIds = new Set<AnnotationId>();

  constructor() {}

  public highlightAnnotations(ids: AnnotationId[], svgModel: SvgModel) {
    const oldIds = new Set(this.highlightedIds);
    this.highlightedIds.clear();
    ids.forEach((id) => this.highlightedIds.add(id));

    this.color(svgModel);
    this.resetColors(oldIds, svgModel);
    return this;
  }

  public selectAnnotations(ids: AnnotationId[], svgModel: SvgModel) {
    const oldIds = new Set(this.activeIds);
    this.activeIds.clear();
    ids.forEach((id) => this.highlightedIds.delete(id));
    ids.forEach((id) => this.activeIds.add(id));

    this.color(svgModel);
    this.resetColors(oldIds, svgModel);
    // TODO decide which one has more priority?
    return this;
  }

  public resetColors(
    ids: Set<AnnotationId> | AnnotationId[],
    svgModel: SvgModel,
  ) {
    ids.forEach((id) => svgModel.resetAnnotationColor(id));
    return this;
  }

  public color(svgModel: SvgModel) {
    this.resetColors(this.highlightedIds, svgModel).resetColors(
      this.activeIds,
      svgModel,
    );
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
